#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "Ml Algo Speedrun",
  desc: "",
  date: "2026-11-23T22:33:46-05:00",
  tags: ("ml",),
)

== KL
#let kl = "KL"
The KL is defined as the following quantity
$
  kl(q, p) = E_(x ~ q) (log(q(x)) - log(p(x)))
$

Or in code...
```python
def kl(
    q_logits: torch.Tensor,  # [B, T, V]
    p_logits: torch.Tensor,  # [B, T, V]
    mask: torch.Tensor | None = None,  # [B, T], bool
) -> torch.Tensor:
    B, T, V = q_logits.shape
    logq = torch.log_softmax(q_logits, dim=-1)
    logp = torch.log_softmax(p_logits, dim=-1)
    diff = ((logq - logp) * torch.exp(logq)).sum(dim=-1)
    valid = B * T
    if mask is not None:
      diff = diff.masked_fill(~mask, 0.0)
      valid = torch.sum(mask.to(torch.int32))
    return diff.sum()/valid
```

The KL is non-negative and convex. We can see this with Lagrange multipliers.

#let dz = $d z$
$
  nabla_(p(x)) integral (log(q(z)) - log(p(z)))q(z)dz + lambda (integral p(z) - 1)dz = \
  nabla_(p(x)) integral (-log(p(z))q(z) + lambda p(z)) dz = \
  (-q(x)/p(x) + lambda) dz \
$

At critical points, the derivative is zero for all x and so...
$
  lambda = q(x) / p(x) => p(x) lambda = q(x) => lambda = 1 \
  p^*(x) = q(x)
$

Thus, if the derivative is zero with respect to all $x$, we must have $p = q$.

We can show the function is convex at this critical point by differentiating again...
$
  q(x) / p(x)^2
$

Both terms are positive and thus the KL must be convex. At the critical point the KL is zero, and so we also have the KL is non-negative with a minimum at $p(x) = q(x).$

Interestingly, the type of KL you use is important. Say we're optimizing $p$, then $kl(p || q)$ is different then $kl(q || p)$. The first is called reverse kl, and its essential property is we can only put mass on places the reference does. The second is forward kl, and its essential property is anywhere the reference puts mass we _must_ put mass. The choice is consequential, and important!

// Let's derive the sup-inf vs. inf-sup equality!
// $
//   sup_y inf_x f(x, y) = inf_x f(x, y^*) <= inf_x sup_y f(x, y) \
// $

== Pretraining
Now, we can think about pretraining. During pretraining we want to minimize the KL between the data distribution and the model's output distribution. Specifically, we sample from the context, next-token distribution, and our goal is to match the data distribution on this. We typically use forward-kl to ensure our model learns to do everything that reference distribution does.
$
  min kl(q, p_theta) = min E_(t, c) (log(q(t | c)) - log(p_theta(t | c)))
$

It suffices to minimize the following quantity
$
  -E_(t, c) (log(p_theta (t | c))) approx -1/(|D|) sum_(t, c in D) (log(p_theta (t | c)))
$

You can do this with any method of your choosing such as SGD, Adam, or Muon. It looks like this!

```python
def pretraining(
    logits: torch.Tensor,   # [B, T, V]
    targets: torch.Tensor,  # [B, T], int64
    mask: torch.Tensor | None = None,  # [B, T], bool
) -> torch.Tensor:
    B, T = targets.shape
    logprobs = torch.log_softmax(logits, dim=-1)
    if mask is not None:
      targets = targets.masked_fill(~mask, 0.0)
    targetprobs = torch.gather(
      logprobs,
      index=targets.unsqueeze(-1),
      dim=-1
    ).squeeze(-1)
    validtokens = B * T
    if mask is not None:
      targetprobs = targetprobs.masked_fill(~mask, 0.0)
      validtokens = torch.sum(mask.to(torch.int32))
    return -torch.sum(targetprobs)/validtokens
```

== RLHF
Now, let's think about RLHF. During RLHF, typically the first step is to train a model which can predict whether or not a particular piece of text will be "highly rated" by a human. This is called a reward model. The most obvious approach is gather a dataset of pieces of text and corresponding human-judged scores. This doesn't work too well because putting many pieces of text on an objective, uniform scale is hard for people. A much less noisy measurement is does a human prefer text $A$ or text $B$. That's not quite the same as a score for $A$ or $B$, but it's nonetheless sufficient to train a reward model!

To see how let's think about Bradley-Terry models! A BT model is defined as follows.
$
  P(x > y) = exp(r(x))/(exp(r(x)) + exp(r(y))) = 1/(1+ exp(r(y) - r(x))) = sigma(r(x) - r(y))
$

Here, $P(x > y)$ is the probability that a person would prefer text $x$ over text $y$. $r(x)$ is said to be the "underlying" quality the user assigns to item $x$. BT models make the connection between the true value of an item and the resulting preferences mathematically concrete which allows us to train a reward model despite not having explicit rewards.

Sidenote, this choice of model might seem arbitrary but it's actually quite grounded. The general function over sum of the same function form is forced if you assume items not in the comparison don't affect the odds, and that each items "intrinsic value" is some function of the item. 

That still leaves a more general preference model like
$
  P(x > y) = f(r(x))/(f(r(x)) + f(r(y)))
$
However, if you also insist adding a constant to all of the rewards shouldn't affect anything, then $f prop exp$ is the only choice. Note that this invariance doesn't restrict the preference distribution, it's just a convenient parameterization.

Anyway, to train this, we'll want to  minimize the KL between the true preference distribution and the one our reward model outputs. This is just like the pretraining loss except the distributions here are conditioned on the prompts we're comparing and only have two outputs for which item wins the comparison.

$
  min kl(q, p_theta) = min E_(w, c_1, c_2) (log(q(w | c_1, c_2)) - log(p(w | c_1, c_2)))
$

This trained model can then be used directly in RL algorithms.

== DPO
Can we ditch having to train an intermediate reward model? Turns out, yes! Consider the RLHF objective...
$
  max_q E_q (r(x)) - beta kl(q, p)
$

The first term is straight-forward, we want to maximize the reward. The second term is a _reverse_ KL-penalty. We use reverse KL because we don't want to force the policy to keep mass everywhere the reference keeps mass. The second term is important because our reward model can be quite noisy, so we can't trust it too much. A good heuristic is stick close to our original policy unless we have a lot of evidence this action leads to a big reward difference, and the KL-penalty encodes it.

We can solve this with the method of Lagrange multipliers again, by trying to find optimality conditions for $q$. This works out as follows.

#let argmax = "argmax"
$
  nabla_q(x)(E_q (r(z)) - beta kl(q, p) + lambda (integral q(z) - 1)) = \
  nabla_q(x) E_q (q(z) - beta (log(q(z)) - log(p(z))) + lambda  ) = \
  nabla_q(x) integral (r(z) - beta (log(q(z)) - log(p(z))) + lambda) q(z) = \
  
  r(x) - beta(1 + log(q(x)) - log(p(x)))) + lambda 
$

We're interested in critical points, where this expression is zero....
$
  r(x) = beta(1 + log(q^*(x)) - log(p(x))) - lambda
$

So at optimality our reward function obeys the above statement. What if $q$ is not optimal? One way to interpret this is that we have maximized the wrong "implicit" reward function $tilde(r)(x)$, rather then arrived at a sub-optimal $q$. 
$
  tilde(r) (x) = beta(1 + log(q(x)) - log(p(x))) - lambda
$

Why is an implicit reward function a natural interpretation of $tilde(r)(x)$? Well, at optimality $q$ should be close to $p$ because of the KL penalty... unless there are changes to $q$ that yield high-reward that compensate for the penalty. The above reward function says whenever the model's probability is much larger then the reference, it's because the difference results in a much higher reward, and similar logic applies when the model's output is _less_ likely then the reference.

Thus, our model can be said to define an implicit reward function. If the model's _implicit_ reward function was equivalent to the true reward function, then this would mean our model's policy was optimal. Thus, we've turned an RL problem back into a reward model training problem which we've already shown an approach to solving. 

Again, let's assume a Bradley-Terry model for preferences. Substituting our implicit reward function...
$
  P(x > y) = sigma(beta(log(q(x)/p(x))-log(q(y)/p(y))))
$
Finally, we train our Bradley-Terry model to match the true preference distribution using cross-entropy.

To recap the trick, we first observed that model's have an implicit reward function, essentially how much more likely they are to output something than the reference distribution. We observed that if this implicit reward function equals the true reward function, then the policy is optimal. We then use the Bradley-Terry trick from the previous section to train our implicit reward model to match the true one we assume underlies the human preference distribution.

== REINFORCE
We'll start with the policy gradient. The goal is to maximize the expected reward as before...
$
  E_(t ~ q_theta) J(t)
$

The gradient of this objective is as follows.
$
  nabla_theta integral J(t) q_theta (t) = integral J(t) nabla_theta  q_theta (t) = E_(t ~ q_theta) (J(t) nabla_theta  log(q_theta (t)))
$

$
  q_theta (t) = p(s_0) product q_theta (a_i | s_i)p(s_(i + 1) | a_i) \
  log(q_theta (t)) = log(p(s_0)) + sum_i log(p(s_(i + 1) | a_i))  + sum log(q_theta (a_i | s_i)) \ 
  nabla_theta log(q_theta (t)) = sum nabla log(q_theta (a_i | s_i))
$

So the overall gradient becomes 
$
  E_(t ~ q_theta) J(t) sum nabla log(q_theta (a_i | s_i))
$

In code, this looks like
```python
def reinforce(
    logprobs: torch.Tensor,  # [B, T]
    rewards: torch.Tensor,   # [B, T]
    dones: torch.Tensor,     # [B, T], bool
    mask: torch.Tensor | None = None,
    gamma: float = 1.0,
) -> torch.Tensor:
    B, T = logprobs.shape
    valid = mask if mask is not None else torch.ones_like(dones)

    reward_sum = torch.zeros_like(rewards[:, 0])
    logprob_sum = torch.zeros_like(logprobs[:, 0])
    loss = logprobs.new_zeros(())

    for t in reversed(range(T)):
        cont = (~dones[:, t]).to(rewards.dtype)

        reward_sum = rewards[:, t] * valid[:, t] + gamma * cont * reward_sum
        logprob_sum = logprobs[:, t] * valid[:, t] + cont * logprob_sum

        # First timestep of an episode
        start = (
            dones[:, t - 1] if t > 0
            else torch.ones_like(dones[:, t])
        ) & valid[:, t]

        loss -= (start * reward_sum.detach() * logprob_sum).sum()

    num_episodes = (dones & valid).sum().clamp_min(1)
    return loss / num_episodes
```

== Approximate Policy Iteration
This time we'll have a new goal! We'll want to maximize the following
$
  E_(bold(s) ~ q_"old") sum E_(a ~ q_"new"(dot | bold(s)_i)) Q (bold(s)_i, a)
$

You can imagine that if we could do unconstrained maximization, the best possible answer would be a policy that simply outputted the argmax $Q$ value, equivalent to classical policy iteration.

This can be viewed as a continuous relaxation. What's the gradient of this thing?
$
  E_(bold(s) ~ q_"old") sum E_(a ~ q_"new"(dot | bold(s)_i)) Q (bold(s)_i, a) nabla_theta log(q_"new" (a | s_i))
$

Now, instead of using $Q(s_i, a_i)$ we can use $A(s_i, a) = Q(s_i, a) - V(s_i)$. The reason for this is pretty simple. Consider the new term that's been injected into our summations. 
$
  E_(a~q_"new"(dot | bold(s)_i)) V(s_i) nabla_theta log(q_"new" (a | s_i))
$

Rearranging....
$
  V(s_i) E_(a~q_"new"(dot | bold(s)_i)) nabla_theta log(q_"new" (a | s_i)) = \ 
  V(s_i) integral nabla_theta q_"new" (a | s_i) = \
  V(s_i)  nabla_theta integral q_"new" (a | s_i) = \
  V(s_i)  nabla_theta 1 = 0
$

This works because $V(s_i)$ doesn't depend on the action. If it did, we couldn't factor it out and that integral wouldn't be a constant. People do this because the extra parameter can reduce the variance of the expectation estimator. Anywhow, from now on we'll write our policy gradient as
$
  E_(bold(s) ~ q_"old") sum E_(a ~ q_"new"(dot | bold(s)_i)) A (bold(s)_i, a) nabla_theta log(q_"new" (a | s_i))
$


That inner expectation could be a bit problematic. It's often the case that we can only compute the $Q$-value for actions we actually took. This is where importance sampling corrections come in. We can transform that inner expectation into an expectation over the old policy...
$
  E_(bold(s) ~ q_"old") sum E_(a ~ (q_"old" (dot | bold(s)_i))) (q_"new" (a | bold(s)_i))/(q_"old" (a | bold(s)_i)) A (bold(s)_i, a) nabla_theta log(q_"new" (a | s_i))
$

And then, we can just use an unbiased monte-carlo sample of the above... namely, the expectation over just the _action actually taken_. 
$
  E_(bold(s) ~ q_"old") sum (q_"new" (a_i | bold(s)_i))/(q_"old" (a_i | bold(s)_i)) A_i nabla_theta log(q_"new" (a_i | s_i))
$

== PPO

=== GAE
Ok! We've derived a usable estimator. There are a few more things PPO will tweak. The first one is how it computes the advantages. The $Q$ function is defined as reward-to-go if I take action $a$ and then follow the policy. The advantage is defined as that minus the value function...
$
  A_i = Q(s_i, a_i) - V(s_i)
$

To get this $Q$-value you have to compute an expensive expectation. Generally you will either train a model to do this (generally out of fashion) or use some estimate of it. One estimate is the reward remaining in the trajectory after $s_i$, denoted $J(s_i)$ for the first term. This is an unbiased estimate of the true $Q$ value as the true $Q$-value is defined as the expected return over all possible continuations, not just a single one.
$
  A_i = J(s_i) - V(s_i)
$

Ok... but this can be pretty high-variance. So instead of doing this, you can use this thing instead...
$
  A_i = (V(s_(i + 1)) + r_i) - V(s_i)) = delta_i 
$

If $V$ is self-consistent, this is actually the same, but $V$ is something we train so this will actually be biased. Still, it's often much lower-variance then the other estimator so it may be preferred. Another option here is 
$
  A_i = (V(s_(i + 1)) + r_i) - V(s_i) = E(Q(s_(i+1), a)) + r_i - V(s_i)
$

We can estimate this expectation with...
$
  E(Q(s_(i+1), a)) approx V(s_(i + 2)) + r_(i + 1)
$

This is a monte-carlo estimate using the actual trajectory we observed. This gives
$
  A_i approx V(s_(i + 2)) + r_(i + 1) + r_i - V(s_i) = delta_i + delta_(i + 1)
$

And you can keep going, generating different estimates for $A_i$. Denote the $k$-step estimator as $A^k_i$. Now, it's not obvious which one is best. In practice what is done is to blend all these different possible estimators for $A$ together using an exponentially weighted average. This looks like...
$
  hat(A_t) = (1 - lambda) sum_(i = 0)^(T - t - 1) lambda^i A_t^i + lambda^(T - t) A_t^(T - t) = 
$
$
  lambda^(T - t) A_t^(T - t)  + (1 - lambda) (&delta_i + \
        lambda &delta_i + lambda &&delta_(i + 1) + \
        lambda^2 &delta_i + lambda^2 &&delta_(i + 1) + lambda^2 delta_(i + 2)\...) = \
$
$
   lambda^(T - t) A_t^(T - t)  + (1 - lambda^(T - t)) delta_i + lambda (1 - lambda^(T - t - 1)) delta_(i + 1) + ...\
$
$
  ((1 - lambda^(T - t) +  lambda^(T - t))delta_i + lambda(1 - lambda^(T - t - 1) + lambda^(T - t - 1)) delta_(i + 1) ...) = \
  sum_i lambda^i delta_(t +i)
$

This last expression is extremely simple. The $delta_i$ terms can be computed in parallel, and this final summation can be computed as a suffix sum which can be computed in parallel or as a recurrence. The code looks like this

```python
def gae(
    rewards: torch.Tensor,  # [batch, T]
    values: torch.Tensor,   # [batch, T+1]
    dones: torch.Tensor,    # [batch, T]
    gamma: float = 0.99,
    lam: float = 0.95,
) -> torch.Tensor:
    B, T = rewards.shape
    advantages = torch.empty_like(rewards)
    running = torch.zeros(B)
    
    for t in reversed(range(T)):
      mask = (~dones[:, t]).to(rewards.dtype)
      delta = gamma * values[:, t + 1] * mask + rewards[:, t] - values[:, t]
      running = delta + lam * gamma * mask * running
      advantages[:, t] = running
    
    return advantages
```

You can also do the last part in parallel as mentioned earlier...

```python
def combine(left, right):
    a, b = left
    c, d = right
    return c + d * a, d * b

def gae(
    rewards: torch.Tensor,  # [B, T]
    values: torch.Tensor,   # [B, T+1]
    dones: torch.Tensor,    # [B, T], bool
    gamma: float = 0.99,
    lam: float = 0.95,
) -> torch.Tensor:
    cont = (~dones).to(rewards.dtype)
    deltas = rewards + gamma * cont * values[:, 1:] - values[:, :-1]
    factors = gamma * lam * cont
    advantages, _ = associative_scan(
        combine,
        (deltas, factors),
        dim=-1,
        reverse=True,
        combine_mode="generic",
    )
    return advantages
```

=== Clipping
Ok, next we usually don't even use this advantage. This is because the importance sampling ratio can be really crazy and can destablize training. To deal with that, we usually clip the importance sampling ratio but in a very careful way to avoid clipping the gradient signal when reasonable.


Here's one way to do it. 
$
  w_i = (q_"new" (a_i | bold(s)_i))/(q_"old" (a_i | bold(s)_i)) \
  nabla_theta w_i = (q_"new" (a_i | bold(s)_i))/(q_"old" (a_i | bold(s)_i)) nabla log(q_"new" (a_i | bold(s)_i)) \
  nabla_theta E_(bold(s) ~ q_"old") sum E_(a ~ q_"old" (dot | bold(s)_i)) A_i "Clip"(w_i, 1 - epsilon, 1 + epsilon) = \
  E_(bold(s) ~ q_"old") sum E_(a ~ q_"old" (dot | bold(s)_i)) 1[1 - epsilon <= w_i <= 1 + epsilon] A_i nabla log(q_"new" (a_i | bold(s)_i)) \
  
$

Notice we differentiated through the clip. Other algorithms will choose to clip the gradient but not differentiate it which is actually a bit different. In our case, if the important sampling ratio is outside the clip rage, that token actually doesn't contribute a gradient.

Now, you can do this, it's perfectly valid, but it might suppress desirable behaviors. For example, imagine the importance sampling ratio was above the clipping range and the advantage is negative. Then, you have this action you take which is quite bad and should be suppressed, but you have no gradient signal! Similarly, imagine you have an action with positive action below the clipping range, so it's an underrepresented action and you ought to boost it's probability. Same problem. The other scenarios (e.g. I have an action which I already take more frequently then the reference policy, which has positive advantage) aren't really problems because they'll become more/less likely in successive policy updates making their ratio closer to $1$ on the next iteration and thus allowing them to keep getting amplified or suppressed.

We can write out the desired behavior formally and then simplify it.
$
  cases(
    1 "if" w_i <= 1 + epsilon "and" A_i >= 0,
    1 "if" w_i >= 1 - epsilon "and" A_i <= 0,
    0 "otherwise"
  )
$

We can generate a clip that yields this behavior.

If $A_i$ is positive we want
$
  A_i min(w_i, (1 + epsilon))
$

If $A_i$ is negative we want
$
  A_i max(w_i, (1 - epsilon))
$

The minimum of the two expressions will be the first expression when $A_i$ is positive and the second when $A_i$ is negative, yielding the desired behavior.
$
  min(A_i min(w_i, (1 + epsilon)), A_i max(w_i, (1 - epsilon))) \
$
$
  min(A_i w_i, max(A_i (1 - epsilon), A_i (1 + epsilon))) 
$

This is the clipping behavior PPO uses.

We can now discuss the full PPO algorithm! We'll assume the advantages have already been computed from the rewards and GAE...
```python
def ppo(
    num_episodes: int,
    new_logprobs: torch.Tensor,  # [B, T]
    old_logprobs: torch.Tensor,  # [B, T]
    advantages: torch.Tensor,    # [B, T]
    clip_eps: float = 0.2,
    mask: torch.Tensor | None = None,  # [B, T], bool
) -> torch.Tensor:
    ratios = torch.exp(new_logprobs - old_logprobs)
    # advantages >= 0, then unclipped grad
    lower = advantages * torch.clamp(ratios, max=(1 + clip_eps))
    # advantages <= 0, then unclipped grad
    upper = advantages * torch.clamp(ratios, min=(1 - clip_eps))
    clips = torch.min(lower, upper)
    if mask is not None:
      clips *= mask.to(new_logprobs.dtype)
    return -torch.sum(torch.sum(clips, dim=-1)) / num_episodes
```

== GRPO
Let's go back to Reinforce. The baselining trick for PPO also works here, and you could indeed train a value function to compute a baseline. The "target baseline" is typically $E[J(t) | s_0 = s]$ as it results in reasonable variance reduction under some assumptions and is easy to compute. A different way to estimate this quantity is to do $G$ rollouts from $s_0$, and use their mean to estimate the expectation! That's the choice GRPO makes, and it's advantage is we no longer need to train a value function!

Our gradient (without clipping) will be...
$
  E_(t_1, ..., t_G  ~ q_"old" (dot | s), s ~ D) 1/G sum_k ((J(t_k) - 1/(G - 1) sum_(j != k) J(t_j)) sum_i (q_theta (a_i | s_i)) / (q_"old" (a_i | s_i)) nabla log(q_theta (a_i | s_i)))
$

It's also typical to do PPO-style clipping, where we interpret the above baselined term as our advantage. Unlike PPO, the advantage will be uniform across the entire trajectory. I should mention that vanilla GRPO usually does $1 slash G$ instead of Leaving-One-Out but that technically violates the assumptions we made about baseline independence, so I've left the formula as is for conceptual clarity.

```python 
def grpo(
    new_logprobs: torch.Tensor,  # [B, G, T]
    old_logprobs: torch.Tensor,  # [B, G, T]
    rewards: torch.Tensor,       # [B, G]
    mask: torch.Tensor | None = None,  # [B, G, T], bool
    clip_eps: float = 0.2,
) -> torch.Tensor:
    B, G, T = new_logprobs.shape
    ratios = torch.exp(new_logprobs - old_logprobs)
    means = rewards.sum(-1, keepdim=True) / (G - 1)
    advantages = (G / (G - 1)) * rewards - means
    # advantages >= 0
    positive = advantages.unsqueeze(-1) * torch.clamp(ratios, max=(1 + clip_eps))
    # advantages <= 0
    negative = advantages.unsqueeze(-1) * torch.clamp(ratios, min=(1 - clip_eps))
    # [B, G, T]
    clips = torch.min(positive, negative)
    if mask is not None:
      clips = clips.masked_fill(~mask, 0.0)
    return -torch.mean(torch.sum(clips, dim=-1))
```