#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "RL",
  desc: "",
  date: "2026-06-30T20:03:40-08:00",
  tags: ("ml",),
)
#show: note_page

= Classical RL
== Known Transition Function
Classical RL is the backbone of the all the modern stuff, but I feel like the way its explained is vastly overcomplicated and the proofs are completely glossed over. The whole field is really about the following recurrence.

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

Where $d(u, v, t)$ is the minimum distance between $u$ and $v$ on a graph considering paths only up to $t$ steps long. Indeed, they were invented by the same person and work for the same reasons.

== Unknown Transition Function
The previous approach works great but you can't always compute the expectation in closed form as you might not know the transition function. The problem with naively just sampling multiple transitions and using that for your expectations is that the above proof relied on $V(s, t-1)$ being _correct_ and now we never have correct value estimates, everything is always noisy.

There are several approaches that work in this regime, but let's talk about Policy Value iteration. It's essentially this:
+ Choose a random policy
+ Treat your policy as your transition function and compute the optimal values
+ Using the optimal values, compute a _better_ policy (softmax over values or similar).
+ Go to step 2.

It's clear the policy will monotonically improve. Under certain conditions (the optimal policy is unique, the policy at each step assigns nonzer probability to each action, ...) you can also show this converges to the optimal policy. As a sidenote, these conditions seem awfully similar to those needed for the convergence of random walks.

= Policy Gradients
== Trajectory Level
This is a totally different approach to maximizing the expected reward. The idea is simply take the gradient of the expected reward with respect to the policy $pi$ and hill-climb. Let $J(t)$ be the reward policy $t$ earned.
$
  EE_(t~ pi) (J(t)) => nabla  EE_(t~pi) (J(t)) = nabla integral J(t) p(t) dt = \
  integral (J(t)p'(t) + J'(t)p(t))dt = integral J(t) nabla (log(p(t)) p(t) dt = \
  EE_(t~pi) J(t) nabla log(p(t))
$

We used the fact that $J'(t) = 0$ as the reward of a trajectory does not depend on the policy that generated it, and everyone's favorite $nabla p(t) = nabla (log(p(t))) p(t)$ trick to turn things into an expectation, which can be efficiently estimated through monte-carlo methods.

Now, a cool extension of this is you can actually subtract any value from $J(t)$ (so long as the value is independent of the policy) and it won't change the expectation. Why?
$
  EE_(t~pi) (J(t) - c) nabla log(p(t)) = EE_(t~pi) J(t) nabla log(p(t)) - c nabla log(p(t)) \
  EE_(t~pi) c nabla log(p(t)) = c integral p(t) nabla log(p(t)) = \
  c integral nabla p(t) = c nabla integral p(t) = c nabla (1) = 0
$

That's pretty neat, but what's the point? Well, monte-carlo returns can be quite noisy. If we can subtract a good _baseline_, we can reduce the variance of the monte-carlo estimator and get a cleaner gradient. Ideally you'd just subtract $EE_(t ~ pi) J(t)$, but you don't really know what that is. Instead, you could train a model to estimate what the value is, or you could just do a couple of rollouts and use that. The latter approach is called GRPO and has seen widespread usage in LLM training.

== Transition Level
Another reasonable policy gradient you could take is with respect to individual transitions. Namely, you define your loss as 
$
  EE_pi sum_t norm((V(s_t) + r) - V(s_(t + 1)))^2_2
$

You can do the same turn a derivative into an expectation trick as before, and once more derive an estimator for your policy. The main difference here is that you'll also have to learn the value function $V$, but the main upside is you get _action-level_ credit assignment which should hopefully improve performance over Trajectory Level strategies. In practice, it is often necessary to ensure the policy post-gradient steps isn't too different then the policy before (to ensure the value estimates actually converge). TRPO solves this with a KL-penalty, PPO solves this with literal gradient clipping.

= Appendix
+ In practice, you'll see a bunch of $gamma$s floating around, that's because some games don't have bounded time horizons or perhaps just really long time horizons, and you want to bias the model towards maximizing rewards over shorter time horizons. This doesn't really change the substance of the algorithms.
+ You'll also see "Temporal Difference" learning almong with a bunch of $lambda$ parameters floating around. Fundamentally those are doing a similar "self-consistency" loss as $norm(V(s_t) - V(s_(t+1)) + r)^2$ but over some more steps and with a special weighting. It's a variance-reduction trick.