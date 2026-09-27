#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "RL",
  desc: "",
  date: "2026-07-07T23:11:34-04:00",
  tags: ("ml",),
)
#show: note_page

= Classical RL
== Value Iteration
Value Iteration is really about the following recurrence.

$
  "V"(s, t) = max_(a in "actions"(s)) EE_((n, r) ~ T(s, a)) (V(n, t - 1) + r)
$

The setup is you're in an environment with a finite action and state space and you want to get as much aggregate reward as possible. $T(s, a)$ is the probability distribution over the next state and reward given you took action $a$ in state $s$. 

The claim is $V(s, t)$ is the maximum expected reward a policy which ran for $t$ steps could achieve. Since we define $V(s, 0) = 0$ the base case is vacuously true. Suppose it holds up to time $t - 1$. At time $t$, we can take one action, and then we'll have to take $t - 1$ actions from wherever we ended up. The best we can possibly do is choose the action such that _the expected transition reward plus the expected value of the best (t - 1)-step policy_ is as high as possible. The expected value of the best $(t - 1)$ step policy is by induction $V(s, t - 1)$, and so the entire claim goes through.

Furthermore, by the same logic 
$
  argmax_(a in "actions"(s)) EE_((n, r) ~ T(s, a)) (V(n, t - 1) + r)
$

Yields the optimal _action_ we should take at timestep $t$ (in this notation we're counting _down_, so $t = 0$ is the final timestep). The signifigance of this is clear, by applying these update rules until convergence, we can compute the _optimal_ policy for this environment.

As a sidente, if you've taken an algorithms class, you might notice this is almost the same as the Bellman Ford algorithm.
$
  d(u, v, t) = min_(n in "nbrs"(u)) d(n, t - 1) + e(u, n)
$

Where $d(u, v, t)$ is the minimum distance between $u$ and $v$ on a graph considering paths only up to $t$ steps long. Indeed, they're based on the same idea.

== Policy Value Iteration
We share an almost identical setup to Value Iteration, but employ a different strategy.
+ Choose a random policy
+ Compute the expected reward at each state given I take $k$ steps of the current policy and then follow the old policy (the _values_).
+ Using these values, compute a _better_ policy by making the new policy argmax over actions.
+ Go to step 2.

So how can we interpret this algorithm? Well, it's essentially this.
$
  [pi_n, ..., pi_n], [pi_(n - 1), ..., pi_(n - 1)], ..., [pi_1, ..., pi_1]
$

Your values are calibrated such that they're what you expect to earn if you take $k$ steps under the current policy, which is greedy with respect to the old policy, then take $k$ steps with respect to the old policy, so on and so forth until you reach the initial policy.

For $k=1$, you can view the values computed at the $i$th iteration as the expected reward at state $s$ given you take the best $i$ actions and are then given as your reward the values of the original, randomly initialized policy. Now, by itself, this won't converge to anything good because the values at the end are randomly initialized. Thus, we'll change our objective slightly. Instead of maximizing $sum r_i$, we'll maximize $sum r_i lambda^i$, where $lambda in (0, 1)$ controls how much we care about future rewards. Under this lense, the effect the initial values of the policy had will decay exponentially with the iteration count, until eventually we arrive at a set of values equivalent to those value iteration would produce.

For $k > 1$, I think it's a tad more complicated but you'll want to argue that you can't make the policy worse by taking more greedy actions. 

So why would we do this over value iteration? Well, evaluating a policy is much cheaper than improving it. Improving it requires computing an argmax over all actions. Evaluating it requires merely considering the _single_ action the policy takes at each state and performing the same DP as earlier. Note this only applies to deterministic policies. Thus, we've made a more practical algorithm by reducing the cost of the improvement step. 

= Policy Gradients
Policy Gradients provide a way to directly optimize a policy without the expensive "consider all actions and pick the highest value one" step of traditional RL methods. In other words, these are _gradient-based policy improvement methods_.

== Differentiating Expectations
A common objective is to maximize some function of trajectories sampled from your policy.
$
  EE_(t ~ pi_theta) (J(t))
$

For example, $J(t)$ could be the total reward obtained over the trajectory. This is the choice REINFORCE makes.

Now to maximize this, you're probably tempted to use gradient descent, but how do you take the gradient of an expectation? First try expanding the definition of integration...
$
  nabla  EE_(t ~ pi_theta) (J(t)) = nabla integral J(t) p_theta (t) dt = integral J(t) nabla p_theta (t) dt
$

This integral is infeasible to evaluate directly, so it helps to turn things into an expectation...
$
  integral J(t) nabla p_theta (t) dt = integral J(t) (nabla p_theta (t)) / (p_theta (t)) p_theta (t) dt =\
  EE_(t~pi_theta) ((J(t) nabla p_theta (t)))/(p_theta (t)) = EE_(t~pi_theta) (J(t) nabla log(p_theta (t))))
$

That gradient-log quantity is called the score. Even this we cannot evaluate, because we don't have a closed form for the probability of sampling a trajectory, since it can depend on unknown environment dynamics.

To make this usable, we must explicitly consider the probability of sampling a trajectory.
$
  p_theta (t) = p(s_0) product p_theta (a_i | s_i) p(s_(i + 1) | s_i, a_i) \
  nabla log(p_theta (t)) = nabla log(p(s_0)) + nabla sum log(p(s_(i + 1) | s_i, a_i)) + nabla sum log(p_theta (a_i | s_i)) = \
  nabla sum log(p_theta (a_i | s_i)) \ 
$
That final term depends only on the policy, not the environment dynamics, and hence it's fully computable. The resulting expectation can now be estimated by simply taking sample trajectories from our policy (rollouts), computing the quantity in the integrand, and averaging. 

== Baselines

A problem with the above approach to policy gradients is they have high variance empirically. To combat this, imagine we have some function $V$ which takes in a state and outputs a number. It turns out, you can subtract this function from our estimator without changing the expected gradient.

Start with our original estimator...
$
   EE_(t ~ pi) J(t) sum nabla log(p_theta (a_i | s_i)) = 
   EE_(t ~ pi) sum J(t) nabla log(p_theta (a_i | s_i)) \
$

Now consider
$
  EE_(t ~ pi) sum (J(t) - V(s_i)) nabla log(p_theta (a_i | s_i)) \
$

We can analyze the $V(s_i)$ term in isolation.
$
  EE_(t ~ pi) sum V(s_i) nabla log(p_theta (a_i | s_i)) = \
  // sum integral V(s_i) nabla log(p_theta (a_i | s_i)) p(s_0) product p_theta (a_i | s_i) p(s_(i + 1) | s_i, a_i) \
   sum EE_(s_i, a_i ~ pi) V(s_i) nabla log(p_theta (a_i | s_i)) = sum EE_(s_i ~ pi) V(s_i) EE_(a_i ~ pi(dot | s_i)) nabla log(p_theta (a_i | s_i)) \
  EE_(a_i ~ pi(dot | s_i)) nabla log(p_theta (a_i | s_i)) = integral nabla p(a_i | s_i) =  nabla integral p(a_i | s_i) = nabla (1) = 0 \
  => EE_(t ~ pi) sum V(s_i) nabla log(p_theta (a_i | s_i)) =  0
$

The trick works because the expectation under the action distribution of the score is zero, and $V$ is independent of the action distribution. Notice that this does NOT work for $J$. $J$ depends on the action distribution, as it directly controls what the rest of its trajectory will look like.

Now, while the expected gradient is the same, the variance is different! Let's optimize $V(s_i)$ to minimize the variance of the ith term. It suffices to minimize the variance over trajectories which have a matching $s_i$, as we can choose $V(s)$ independently for different states.

$  
  g = (J(t) - V(s_i) nabla log(p_theta (a_i | s_i))) \
  "Var"(g) = EE_(t~pi) [Tr((g - EE g)(g - EE g)^top) | s_i = s] = \
  EE_(t~pi) [norm(g)^2 | s_i = s] - norm(EE_(t~pi) [g | s_i = s])^2 \
$
As $EE g$ does not depend on $V(s_i)$, it suffices to minimize the first term.
$
  argmin EE_(t~pi) [norm((J(t) - V(s_i)) nabla log(p_theta (a_i | s_i)))^2 | s_i = s] =\
  argmin EE_(t~pi) [(-2 V(s_i) J(t) + V(s_i)^2) norm(nabla log(p_theta (a_i | s_i)))^2 | s_i = s] = \
  => EE_(t~pi) [(-2 J(t) + 2 V(s_i)) norm(nabla log(p_theta (a_i | s_i)))^2 | s_i = s] = 0\
  => V(s_i) = (EE_(t~pi) [J(t) norm(nabla log(p_theta (a_i | s_i))^2) | s_i = s])/(EE_(t~pi) [norm(nabla log(p_theta (a_i | s_i))) | s_i = s]^2)
$

This quantity is a bit complicated. A standard simplifying assumption is to assume $norm(nabla log(p(a_i | s_i)))^2$ is independent of $J(t)$. This isn't generally true, but it simplifies the math (and computation) a bit. The best choice of $V(s)$ is now $EE_(t~pi) [J(t) | s_i = s]$.

Let's now look at the variance. I'm dropping the state dependence for brevity.
$
  "Variance" =  EE_(t~pi) norm((J(t) - EE(J(t))) nabla log(p(a_i | s_i)))^2 - norm(EE_(t~pi) J(t) nabla log(p(a_i | s_i)))^2 =\
  =>_"independence" E((J(t) - E(J(t)))^2 norm(nabla log(p(a_i | s_i)))^2 - (EE_(t~pi) J(t) nabla log(p(a_i | s_i)))^2
$

Without the baseline, you can see the variance would depend on the square of the return instead of the square _deviation_ of the return. Thus, this trick can eliminate quite a bit of noise! 

This might seem a bit magical, but it's actually a pretty general variance reduction trick. Imagine estimating $EE[X]$ where $X = Z + N(c, 0.1)$ and $Z ~ N(0, 1)$. Clearly, if we had access to $Z$ we could derive a much better estimator for $X$, because _$X$ and $Z$ are correlated_; knowing $Z$ gives us information about the noise in $X$ which we can exploit. Similarly, by computing a $V$, we gain information about $J$, which allows us to reduce the variance in its expectation.

In practice, there are two main approaches to computing $V$. Either you take a bunch of rollouts from the state and average them (this is what GRPO does!) or you simply train a model to estimate the $EE[J(t) | s]$ (this is what PPO does)! There are also some papers which attempt to get rid of the independence assumption. The main hiccup with these approaches is performance, as naively you'd need a backward pass per sample.

The above variance formula gives a good intuition for why controlling your reward scale and having an accurate value estimator is crucial to efficiency in many algorithms.

== Approximate Policy Iteration
A specific choice of $J$ worth highlighting is a relaxation of the argmax-based improvement step. Specifically,
$
  J(t) = sum EE_(a ~ pi_"old" (dot, s_i)) Q_(pi_"old")(s_i, a) quad max EE_(t ~ pi_"old") J(t)
$

If your network was sufficiently expressive, the optimal choice for $pi$ is 
$
  argmax_a Q_(pi_"old")(s_i, a)
$

Which is precisely vanilla policy iteration. This gradient-based, relaxed argmax improvement step is sometimes referred to as Approximate Policy Iteration or General Policy Iteration. 

The main drawback with the current scheme is it does not permit data-reuse. We only have samples from the rollout policy, so how can we estimate the expectation for our new, gradient-adjusted policy? Importance Sampling!
$
  EE_(a ~ pi_"old" (s_t)) pi(a | s_t)/(pi_"old" (a | s_t)) Q_(pi_"old")(s_t, a)
$

Another drawback with this approach is importance sampling ratio can introduce a ton of variance. This motivates trying not to change the policy much to reduce variance. TRPO solves this with a KL-penalty, PPO and GRPO solve this by clipping the importance sampling ratio to be within $(1 - epsilon, 1 + epsilon)$.

One final trick is to estimate the expectation with only the single action we _did_ take. This is unbiased, a bit more noisy, but crucially doesn't force us to estimate $Q$-values for actions never taken. 

Its worth noting that in practice, you use baselines to reduce variance, which means you try to estimate $A_(pi_"old")(s_t, a) =  Q_(pi_"old")(s_t, a) - V_(pi_"old")(s_t)$ instead of $Q$.

== Score Centering
One very cool property I did not mention in the above sections is as follows.
$
  "Cov"(J(t), nabla log(p(t))) = EE_(t ~ pi) (J(t) - EE(J(t))) nabla log(p(t)) = nabla EE_(t ~ pi) J(theta)
$

That is, the covariance of the score and the reward is precisely the desired gradient. This gives an interpretation for what the gradient is "doing". Positively correlated features are amplified, negatively correlated features are suppressed, uncorrelated feature are unaffected.

Now, what happens if we break one of the assumptions we've been making. Namely, that the rollouts are generated by the same policy as the model that's training on them? This creates a mismatch!

$
  "Cov"(J(t), nabla log(p(t))) = EE_(t ~ pi) (J(t) - EE(J(t))(nabla log(p(t)) - EE(nabla log(p(t)))) = \
  EE(J(t))EE(nabla log(p(t))) + EE_(t ~ pi) (J(t) nabla log(p(t)) - J(t)EE(nabla log(p(t)) - EE(J(t)) nabla log(p(t)))) = \
  -EE(J(t))EE(nabla log(p(t))) + EE_(t ~ pi) (J(t) nabla log(p(t)))
$

Rearranging, we have
$
  EE_(t ~ pi) (J(t) nabla log(p(t))) = "Cov"_(t ~ pi) (J(t), nabla log(p(t))) + EE_(t ~ pi) (J(t))EE_(t ~ pi) (nabla log(p(t)))
$

That is our policy gradient is the familiar covariance term, plus some constant drift term which doesn't depend on the observed return at all! It is this "drift" term that the author's of the #link("https://arxiv.org/pdf/2609.20807")[Score Matching] paper suggest accounts for off-policy RL instability. The paper goes into a lot more detail, but you can easily observe that the expected score under a distribution $q$ is none other then the gradient of the cross-entropy loss wrt to that distribution. Thus, the drift term is either pulling you towards or away from the rollout policy; depending on the sign of the mean reward intriguingly.

Distillation itself is not unstable, but there are a few things that make this worse than you might expect.
- The distillation could overwhelm the actual signal in the update, leading to suboptimal performance, although not necessarily unstable training.
- The moving distillation target could create feedback loops. Imagine your rollout policy boosted some bad actions logits by a small amount, due to quantization. Now your trained policy will also do this, and your next rollout policy will boost them even more, leading to a ratchet that destabilizes training.

Luckily, correcting for this is relatively easy! Simply compute the drift term and remove it from the gradient update. This also stacks with the importance sampling trick seen earlier, as you have samples from the rollout policy, but really you want your gradient to be with respect to the current training policy, so you can again apply an importance sampling ratio to fix that.

It's worth noting you can also eliminate the drift with pure importance sampling, but this requires _not clipping_ the importance sampling ratio if you don't want to introduce bias. The appeal of score matching is it is an additive correction (so you can always apply it exactly, no need for clipping), and even if you stack clipped importance sampling on top of it, _you are still guaranteed to have eliminated drift_.

// = Appendix
// + In practice, you'll see a bunch of $gamma$s floating around, that's because some games don't have bounded time horizons or perhaps just really long time horizons, and you want to bias the model towards maximizing rewards over shorter time horizons. This doesn't really change the substance of the algorithms.
// + You'll also see "Temporal Difference" learning almong with a bunch of $lambda$ parameters floating around. Fundamentally those are doing a similar "self-consistency" loss as $norm(V(s_t) - V(s_(t+1)) + r)^2$ but over some more steps and with a special weighting. It's a variance-reduction trick.