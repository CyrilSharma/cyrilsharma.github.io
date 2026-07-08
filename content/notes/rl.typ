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

So why would we do this over value iteration? Well, evaluating a policy is much cheaper than improving it. Improving it requires computing an argmax over all actions. Evaluating it requires merely considering the _single_ action the policy takes at each state and performing the same DP as earlier. Thus, we've made a more practical algorithm by reducing the cost of the improvement step. This is an idea we'll see repeated many times!

= Policy Gradients
Policy Gradients provide a way to directly optimize a policy without the expensive "consider all actions and pick the highest value one" step of traditional RL methods. In other words, these are _gradient-based policy improvement methods_.

== Maximize Expected Reward
One sensible objective for a policy is maximizing the expected reward. Simply take the gradient of the expected reward with respect to the policy $pi$ and hill-climb. Let $J(t)$ be the reward policy $t$ earned.
$
  EE_(t~ pi) (J(t)) => nabla  EE_(t~pi) (J(t)) = nabla integral J(t) p(t) dt = \
  integral (J(t)p'(t) + J'(t)p(t))dt = integral J(t) nabla (log(p(t)) p(t) dt = \
  EE_(t~pi) J(t) nabla log(p(t))
$

We used the fact that $J'(t) = 0$ as the reward of a trajectory does not depend on the policy that generated it and everyone's favorite $nabla p(t) = nabla (log(p(t))) p(t)$ trick to turn things into an expectation, which can be efficiently estimated through monte-carlo methods.

Now, a cool extension of this is you can actually subtract any value from $J(t)$ (so long as the value is independent of the policy) and it won't change the expectation. Why?
$
  EE_(t~pi) (J(t) - c) nabla log(p(t)) = EE_(t~pi) J(t) nabla log(p(t)) - c nabla log(p(t)) \
  EE_(t~pi) c nabla log(p(t)) = c integral p(t) nabla log(p(t)) = \
  c integral nabla p(t) = c nabla integral p(t) = c nabla (1) = 0
$

That's pretty neat, but what's the point? Well, monte-carlo returns can be quite noisy. If we can subtract a good _baseline_, we can reduce the variance of the monte-carlo estimator and get a cleaner gradient.

$ argmin_c  EE_(t~pi) ((J(t) - c) nabla log(p(t))))^2 - (EE_(t~pi) (J(t) - c) nabla log(p(t)))^2 =\
  argmin_c EE_(t~pi) ((J(t) - c) nabla log(p(t))))^2 - (EE_(t~pi) J(t) nabla log(p(t)))^2 = \
  argmin_c EE_(t~pi) ((J(t) - c) nabla log(p(t))))^2 = \
  argmin_c EE_(t~pi) (-2 c J(t) + c^2) (nabla log(p(t))^2 = \
  => EE_(t~pi) (-2 J(t) + 2 c) (nabla log(p(t))^2 = 0\
  => c = (EE_(t~pi) J(t) (nabla log(p(t))^2))/(EE_(t~pi)(nabla log(p(t))^2))
$

This quantity is a bit complicated. Usually you'll make some simplifying assumptions. For example, you might say the gradients are roughly constant, so the best choice of $c$ is $EE_(t~pi) J(t)$. This approach is called GRPO and has seen widespread usage in LLM training.

== Approximate Policy Iteration
Another reasonable objective is to relax the argmax-based improvement step. Specifically,
$
  J("traj") = sum_t EE_(a ~ pi(s_t)) A_(pi_"old")(s_t, a) \
  "maximize" quad EE_("traj"~pi_"old") J("traj")
$

If your optimizer was perfect and your network infinitely expressive, the optimal choice for $pi$ is 
$
  argmax_a A_(pi_"old")(s_t, a)
$

Which is precisely vanilla policy iteration. Now, you can directly derive an estimator using the above formulation, and you'll get a method which works but requires computing advantages for actions that were never taken during rollouts (e.g. you'll train a model which maps $(s, a) -> "reward"$). This seems like a hard thing to learn, so instead we can use importance sampling to change the expectation to be over the old policy's actions.
$
  EE_(a ~ pi_"old" (s_t)) pi(s_t, a)/(pi_"old" (s_t, a)) A_(pi_"old")(s_t, a)
$

The reason this is useful is we can estimate this expectation with rollouts we have collected. Do notice that it's quite possible for many states to have only received a single action label, making our expectation estimate essentially Monte-Carlo estimates with a single sample. This leads to a potentially high-variance gradient estimator, which means it's often necessary to ensure the policy post-gradient steps isn't too different then the policy before. TRPO solves this with a KL-penalty, PPO solves this by clipping the importance sampling ratio to be within $(1 - epsilon, 1 + epsilon)$.

// = Appendix
// + In practice, you'll see a bunch of $gamma$s floating around, that's because some games don't have bounded time horizons or perhaps just really long time horizons, and you want to bias the model towards maximizing rewards over shorter time horizons. This doesn't really change the substance of the algorithms.
// + You'll also see "Temporal Difference" learning almong with a bunch of $lambda$ parameters floating around. Fundamentally those are doing a similar "self-consistency" loss as $norm(V(s_t) - V(s_(t+1)) + r)^2$ but over some more steps and with a special weighting. It's a variance-reduction trick.