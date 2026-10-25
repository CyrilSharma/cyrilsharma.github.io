#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "LLMs",
  desc: "",
  date: "2026-07-24T18:13:49-04:00",
  tags: ("ml",),
)


#import "@preview/fletcher:0.5.8" as fletcher: diagram, node, edge
#let rise = 0.55
#let tap(anchor, name) = node(
  (rel: (-0.5, 0), to: anchor), "",
  name: name, shape: circle, radius: 1.1pt, fill: black, stroke: none,
)

#let skip(from, to) = edge(
  from,
  (rel: (0, -rise), to: from),
  (rel: (0, -rise), to: to),
  to, "-|>", dash: "dashed",
  layer: -1
)

= Overview
The architecture of a prototypical LLM is actually remarkably simple.


*Transformer Block*
#let idiomatic_arch = graphic(align(center, diagram(
  spacing: (8mm, 11mm),
  node-fill: white,
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,
  edge-corner-radius: 3pt,
  edge-stroke: 0.55pt,
  mark-scale: 70%,

  node((0,0),        [Hidden],    name: <in>),   edge("-|>"),
  node((rel: (1,0)), [Norm],      name: <norm1>), edge("-|>"),
  node((rel: (1,0)), [Attention], name: <attn>), edge("-|>"),
  node((rel: (1,0)), [Add],       name: <add1>), edge("-|>"),
  node((rel: (1,0)), [Norm],      name: <norm2>), edge("-|>"),
  node((rel: (1,0)), [FFN],       name: <ffn>),  edge("-|>"),
  node((rel: (1,0)), [Add],       name: <add2>), edge("-|>"),
  node((rel: (1,0)), [Hidden],    name: <out>),

  tap(<norm1>, <tap1>),
  tap(<norm2>,  <tap2>),
  skip(<tap1>, <add1>),
  skip(<tap2>, <add2>),
)))

#idiomatic_arch

*Transformer*
#align(center, graphic(diagram(
  spacing: (8mm, 11mm),
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,

  node((1,0), align(center)[Embed]),
  node((2,0), align(center)[$"Layer"_1$]),
  node((3,0), align(center)[...]),
  node((4,0), align(center)[$"Layer"_n$]),
  node((5,0), align(center)[Unembed]),
  node((6,0), align(center)[Softmax]),

  edge((1,0), (2,0), "-|>"),
  edge((2,0), (3,0), "-|>"),
  edge((3,0), (4,0), "-|>"),
  edge((4,0), (5,0), "-|>"),
  edge((5,0), (6,0), "-|>"),
)))

*LLM*
#align(center, graphic(diagram(
  spacing: (8mm, 11mm),
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,

  node((1,0), align(center)[Tokenizer]),
  node((2,0), align(center)[Transformer]),
  node((3,0), align(center)[Sampler]),


  edge((1,0), (2,0), "-|>"),
  edge((2,0), (3,0), "-|>"),
)))

== Tokenization
The first thing that happens when you query an LLM is the text gets split into small pieces of text called tokens. These "pieces" are not _words_, but both words and tokens can be considered groups of bytes.

+ Why are we using words at all, why not just use characters?
  - As we will later see, Attention takes $O(T^2)$ time to process a sequence of length $T$. Thus, reducing the length of the sequence it processes is a useful optimization.
  - There's also this intuition that the _unit_ of attention should be semantically meaningful. If you treat attention as a key-value lookup system, it makes sense that being able to search via a semantically meaningful "word-esque" thing is more powerful then being able to search by character.
+ Why tokens instead of words?
  - We can tightly control the number of unique tokens, whereas the number of words is large and out of our control. This is important, because an essential piece of training LLMs is being able to fully model a distribution over their outputs.
  - Any piece of language (even things like ascii art!) can be split into tokens, whereas only clean, typo-free, language can be split into words.

To decide what your tokens are, you'll typically run an iterative merging algorithm (called Byte Pair Encoding) where you insert every letter as a token. Then, you iteratively merge all instances of the most common token pair into a new token, and you keep going until you reach "enough" tokens. This is very similar to dictionary-based compression methods like Zip. 

Once you've decided what tokens you'll use, you just need to apply the merge rules you obtained in Byte Pair Encoding in the same order for whatever piece of text you want to process. You can do this with a priority-queue. There might be other optimization available. For example, many tokenizers split on whitespace tokens, the initial split-on-whitespace phase is called pretokenization. The "pre-tokens" are often small enough to cache their tokenizations and this is the approach used in fast tokenizers like #link("https://github.com/marcelroed/gigatoken")[GigaToken].

== Embedding and Unembedding
For each unique _token_ we'll associate a random, learnable vector, called the token's _embedding_. This is typically implemented as a lookup table, e.g.
$
  X in "Token Vocabulary" quad "Embed"(X) in R^D \
  "Embed"(X) = "Table"[X]
$

If you write $X$ as one-hot instead of an index (e.g. $0-1$ vector of size $R^(|"Token Vocabulary"|)$), then an equivalent (but more computationally expensive) implementation is
$
  "Embed"(X) = X W_E
$

At the end we of the transformer we do almost the reverse
$
  H in R^D quad "Unembed"(H) in R^(|"Token Vocabulary"|) \ 
  "Uembed"(H) = H W_U
$

Some early Transformer models even took $W_U = W_E^top$ which gives an interesting inductive bias: if you want to output a given token, the best way to do that is to make the hidden state very close to the original embedding. be the opposite of the embedding module.



== Attention
Let $X$ be a $T times D$ matrix (i.e $\#"tokens" times "token-dim"$). Attention is defined as follows.
$
  Q = "RoPE"(X W_Q) quad K = "RoPE"(X W_K) quad V = X W_V \
  S = (tilde(Q) tilde(K)^top + L)/sqrt(d) quad A = "softmax"(S)  quad Y = A V quad O = Y W_O
$

$Q$, $K$, and $V$ are referred to as Queries, Keys and Values.
$L$ is a $T times T$ matrix called the Attention mask and RoPE is a particular function. I'll discuss both later. Finally, the softmax is applied _rowwise_. 

You can think of Attention as outputting a weighted average of _values_ based on how similar the corresponding _keys_ are to the _queries_. Fundamentally, Attention takes quadratic time because it computes and applies a $T times T$ matrix.

=== Attention Mask
The purpose of $L$ is to constrain which _inputs_ have effects on which _outputs_ of the attention operator. By setting $L_(i j) = -oo$, we zero out $A_(i j)$ which removes the influence of the $j$th input on the $i$th output. 

To see why this is important, consider a typical training objective: predict the next token. Concretely, given a sequence of tokens $S_1, ..., S_t$, you want the model to output $S_2, ..., S_(t + 1)$. Now, the idea of this objective is if you can predict the next token, _without actually being shown the next token_ then you have a pretty good understanding of language. Obviously, the objective is undermined if the model is able to make the $i$th output depend on the $i$th input, so you'll want to choose $L$ accordingly.

Typically, we'll choose the mask to ensure the $i$th output is only a function of the first $< i$ inputs. This enables autoregressive decoding, discussed later.

=== RoPE
RoPE is an operator designed to break the permutation equivariance of attention. To be more concrete, the problem is without RoPE the following is true (ignoring the causal mask).
$
  "Attention"("Permutation"(X)) = "Permutation"("Attention"(X))
$

It's pretty bad if your language model doesn't care about the _order_ it sees words! To see how RoPE helps, let's define it.
$
  "RoPE"(X_t)_(i, i+1) = R_(t, i) vec(X_(t, i), X_(t, i+1)) quad R_t = "Rot"(t theta_i)
$

Now consider $Q K^top = "RoPE"(tilde(Q)) "RoPE"(tilde(K))^top $. 
$
  (Q K^top)_(i j) = Q_i dot K_j = sum_k vec(tilde(Q)_(2k), tilde(Q)_(2k+1))^top "Rot"(theta_k (j - i)) vec(tilde(K)_(2k), tilde(K)_(2k+1))
$

Thus, RoPE adds a _relative-position sensitive_ adjustment to the dot-product breaking the invariance. It's worth noting there are other ways to break permutation-invariance.
- You can associate each sequence-position with a vector and adding that to the keys and queries, but that makes the relative-position and dot product connection more obtuse and potentially harder to learn.
- You can rely on the causal mask to break permutation equivariance, which _can_ work but provides no helpful learning bias to the model (RoPE implicitly upweights attention on nearby words).

=== Attention Heads
People have played around a lot with the Attention operator, and there are many variants. The version described above is known as Single Head Attention. I won't describe every variant, but it is very important to know the concept of an _attention head_. An _attention head_ essentially takes a slice of X across its $D$ dimension, and then process this "lower-dimensional" sequence with Single Head Attention. To combine the results of multiple heads, you combine the head outputs along the $D$ dimension, the reverse of the original split. Empirically, having heads gives a slight expressivity gain with the rough intuition being you can use different attention mixers for different input dimensions, for the same amount of compute.


=== FlashAttention
A naive implementation of Attention computes the $Q K ^T$ matrix upfront and then retrieves it from DRAM when applying it to $V$. This is bad because the memory bandwidth needed scales with the square of the sequence length and on GPUs the memory bandwidth is much lower than the compute bandwidth. Thus, the GPU will spend all its time loading and writing to DRAM instead of doing matrix multiplication.

The idea of FlashAttention is to bring the memory needed at any one time down to
$ O("mem"(Q) + "mem"(K) + "mem"(V)) $

While making good use of the modern GPU's blockwise matrix multiplication primitives.
To understand how, first observe that softmax is
$
  "softmax"(hat(x)) = exp(hat(x))/(sum_i exp(hat(x_i)))
$

Therefore, ignoring the masking and scaling terms...
$
   O = "softmax"(Q K^top) V \
   O_i = sum_j "softmax"(Q K^top)_(i j) quad V_j = sum_j exp(Q_i dot K_j) / (sum_j exp (Q_i dot K_j)) V_j
$

Now assume $j$ ranges from $[0, R)$ and I've computed 
$
   A_"norm" = sum_(j in [0, L)) exp (Q_i dot K_j) quad B_"norm" = sum_(j in [L, R)) exp (Q_i dot K_j) \
   A = sum_(j in [0, L)) exp(Q_i dot K_j)/A_"norm" V_j quad
   B = sum_(j in [L, R)) exp(Q_i dot K_j)) V_j \
$

Then clearly I just need to do a little rescaling to get the output for the entire interval $[0, R)$.
$
  A times (A_"norm")/(A_"norm" + B_"norm") + B/(A_"norm" + B_"norm")
$

Clearly, this trick can be repeated, and so we can effectively decompose the summation into arbitrary chunks and stitch them together. You _could_ compute all chunks in parallel, but then you'd essentially be manifesting the full $Q K^top$ matrix again. Instead, you usually compute a column (or a few columns) of that matrix at a time which keeps your memory usage linear. To make this hardware efficient you'll chunk things such that it looks like a bunch of tiny matmuls, like so
$
  "scale" times exp(mat(
    Q_(i, 0), ..., Q_(i, n); ..., ..., ...; Q_(i + c, 0), ..., Q_(i + c, n)
  )
  mat(
    K_(i, 0), ..., K_(i, n); ..., ..., ...; K_(i + c, 0), ..., K_(i + c, n)
  )^top)
  mat(
    V_(i, 0), ..., V_(i, n); ..., ..., ...; V_(i + c, 0), ..., V_(i + c, n)
  ) 
$

Anyway, this is essentially the algorithm. The full algorithm also accounts for the mask, normalization constant, and does a few tricks to ensure everything remains near the highest precision parts of the floating point representation, but these are relatively small extensions to the above algorithm.

=== Ring Attention
Now, suppose we have a big industry-scale model. At this point even the input tensors $Q, K$ and $V$ are memory bottlenecks. We can avoid holding all of them in memory using a ring-based buffering system. Concretely, give each GPU a chunk of rows to operate on. 
$
  mat(
    exp(Q_0 dot K_0)V_0, ..., ..., ...;
    ..., exp(Q_1 dot K_1)V_1, ..., ...;
    ..., ..., ..., exp(Q_n dot K_n)V_n;
  )
$

Then, let them shuffle the keys and values around in a ring and compute the next chunk.
$
  mat(
    ..., exp(Q_0 dot K_1)V_1, ..., ...;
    ..., .., exp(Q_1 dot K_2)V_2, ...;
    exp(Q_n dot K_0)V_0, ..., ..., ...;
  )
$

Incrementally merge chunks using FlashAttention and boom! You've successfully reduced the memory required per GPU. See #link("https://arxiv.org/pdf/2311.09431")[Striped Attention] for a simple way to save compute on the Causal mask.

=== Attention Backward
I'll slightly rephrase the defintion to make the proof slicker.
$
  Q = X W_Q quad K = X W_K quad V = X W_V \
  tilde(Q) = "RoPE"(Q) quad tilde(V) = "RoPE"(V) \
  S = (tilde(Q) tilde(K)^top + L)/sqrt(d) quad A = "softmax"(S)  quad O = A V
$
Now assume we know $nabla L(O)$. We immediately have
$
  nabla L(A) = nabla L(O) V^top quad  nabla L(V) = A^top nabla L(O) \
  nabla L(W_v) = X^top nabla L(V) quad nabla L(W_k) = X^top nabla L(K) quad nabla L(W_q) = X^top nabla L(Q) \
  nabla L(X) = nabla L(V) W_V^top + nabla L(Q) W_Q^top + nabla L(K) W_K^top 
$

We now need to differentiate through rowwise softmax.
$
  Z = exp[S] 1 quad "softmax"(S) = exp[S - log[Z]1^top] \
  A = "softmax"(S) quad dA = d"softmax"(S)
$
$
  ip(nabla L(S), d S) &= ip(nabla L(A), d A) \
  &= ip(nabla L(A), d"softmax"(S)) \
  &= ip(nabla L(A), A dot.o (d S - d log[Z]1^top)) \
  &= ip(nabla L(A) dot.o A, d S) - ip(nabla L(A) dot.o A, d log[Z]1^top))
$

Compute the inner differential term.
$
  d Z = d(exp[S]) 1 = (exp[S] dot.o d S) 1 \
  d(log[Z]1^top) = ("inv"[Z] dot.o d Z) 1^top = "inv"[Z]1^top dot.o (exp[S] dot.o d S) 1 1^top = (A dot.o d S) 1 1^top
$

Substitute it back in...
$
  => ip(nabla L(A) dot.o A, (A dot.o d S) 1 1^top) = ip((nabla L(A) dot.o A) 1 1^top dot.o A, d S)
$
$
  ip(nabla L(S), d S) = ip(nabla L(A) dot.o A - (nabla L(A) dot.o A) 1 1^top dot.o A, d S) \
  nabla L(S) = nabla L(A) dot.o A - (nabla L(A) dot.o A) 1 1^top dot.o A
$

// $
//   "softmax"(x)_i = exp(x_i) / (sum exp(x_i)) quad log("softmax"(x))_i = x_i - log(sum exp(x_i)) \
//   d/dx_j log("softmax"(x)_i) = (d/dx_j "softmax"(x)_i)/"softmax"(x)_i =  I[i = j] - (exp(x_j))/(sum exp(x_i)) \
//   (d/dx_j "softmax"(x)_i) = (I[i = j] - "softmax"(x)_j)"softmax"(x)_i \
//   (d "softmax"(x))/(d x) = ("diag"("softmax"(x)) - "softmax"(x)^top "softmax"(x))
// $

// Thus we have,
// $
//   (d L) / (d S) = vec(
//     (d L) slash (d A_1)  ("diag"(A_1) - A_1^top A_1),
//     ...,
//     (d L) slash (d A_n)  ("diag"(A_n) - A_n^top A_n)
//   ) = \
//   vec(
//     (g_1 dot.o A_1) - (g_1 dot A_1) A_1,
//     ...,
//     (g_n dot.o A_n) - (g_n dot A_n) A_n,
//   )  = (g dot.o A) - vec((g_1 dot A_1) A_1, ..., (g_n dot A_n) A_n)
// $
There's one little trick we can use to make this more efficient. Remember that 
$
  nabla L(A) = nabla L(O) V^top
$

Hence, 
$
  (nabla L(A) dot.o A) 1 1^top dot.o A = (nabla L(O)V^top dot.o A) 1 1^top dot.o A = \
  "RowSum"(nabla L(O)_i V^top dot.o A_i) 1^top dot.o A = \
  "RowSum"(nabla L(O)_i V^top A_i^top) 1^top dot.o A = \
  "RowSum"(nabla L(O)_i O_i^top) 1^top dot.o A = \
  (nabla L(O) dot.o O) 1 1^top dot.o A
$
// Then, $
//   g_i dot A_i = ((d L)/(d O)V^top)_i dot A_i = (((d L)/(d O))_i V^top) dot A_i = ((d L)/(d O))_i V^top A_i^top =\
//    ((d L)/(d O))_i O_i^top = ((d L)/(d O))_i dot O_i
// $

So the final gradient can be written as
$
  (nabla L(A) - (nabla L(O) dot.o O)1 1^top) dot.o A
$
// $
//   D_i = ((d L)/(d O))_i dot O_i \
//   (g dot.o A) - ("diag"(D)) A = A dot.o (g - D bold(1)^T)
// $

Why this form instead of the previous one? Well before we had those $1 1^top$ terms applied to $A$ and now they're applied to $O$ instead. Those terms correspond to row summation and broadcasts, so you need to read the whole row to compute them. $A$ is a huge matrix that we prefer to materialize on the fly, so not needing to reduce along its rows is a big win!

The rest is much simpler,
$
  nabla L(K) = (nabla L(S)^top tilde(Q))/sqrt(d) quad nabla L(tilde(Q)) = (nabla L(S) tilde(K))/sqrt(d)
$

And finally, we differentiate through RoPE.
$
     R_(t, i) = "Rot"(t theta_i) quad "RoPE"(X_t)_(i, i+1) = R_(t, i) vec(X_(t, i), X_(t, i+1)) \
$
RoPE is a blocked matrix with 2x2 rotation sub-matrices on the diagonal. The gradient is obtained by applying the transpose of the block matrix, i.e "unrotating" each pair of coordinates. We're done!

Now, FlashAttention makes the following observation: you don't actually have to store $nabla L(A)$ and $nabla L(S)$ to memory! $nabla L(A)$ can be computed on the fly from the derivative we got earlier, $nabla L(S)$ too, and then you can directly use $nabla L(S)$ to compute the gradients with respect to the keys and values. This reduces the memory bandwidth required for an attention backwards to linear in the size of the inputs, just like the forward! The full algorithm is as follows. $log(Z)$ is saved from the forward.
$
  S_(i j) = Q_i K_j^top slash sqrt(d) \
  A_(i j) = exp(S_(i j) - log(Z)_i) \
  nabla L(A)_(i j) = nabla L(O)_i V_j^top \
  nabla L(S)_(i j) = A_(i j) dot.o (nabla L(A)_(i j) - nabla L(O)_i dot O_i) \
  nabla L(tilde(Q))_(i) <- nabla L(tilde(Q))_(i) + nabla L(S)_(i j) K_j slash sqrt(d) \
  nabla L(tilde(K))_(j) <- nabla L(tilde(K))_(j) + nabla L(S)^top_(i j) Q_i slash sqrt(d) \
  nabla L(V)_j <- L(V)_j + A_(i j)^top G_i
$

Where the $nabla L(S)^top_(i j)$ term is the $(i, j)$th sub-block, tranposed, not an index into a tranpose. Interestingly, $nabla L(tilde(Q))$ requires reducing $S$ along a different dimension then $nabla L(tilde(K)), nabla L(tilde(V))$, which either requires two passes or using atomics to reduce along one of the dimensions. This is not a problem you see with the forward.

=== Backwards Ring Attention
This is very similar to before. Look at the above algorithm. Anything with the $i$ index is not rotated, everything with just the $j$ index is. We perform $T$ iterations, and it's easy to see that every combo $(i, j)$ is encountered, so every term gets computed. Notice that we have two new terms to rotate, the $nabla L(tilde(K)_j)$ and $nabla L(tilde(V)_j)$ terms. 

=== Inference
Suppose I want to compute Attention over $X'$ where $X' = "cat"(X, X_t)$. This is commonly needed during autoregressive generation where you extend the input sequence by the last token the model outputted. Turns out a lot of the previous computation can be re-used to make this faster then $O(T^2)$. Under causal masking (e.g. the query at $i$ cannot interact with keys for $j >= i$) and ignoring normalization...
$ O =
  "softmax"(mat(
    Q_0 dot K_0, 0, ...;
    Q_0 dot K_0, Q_1 dot K_1, ...;
    ..., ..., ...;
    Q_i dot K_0, ..., Q_i dot K_i;
   )) V
$

So, we can see there's only one new row in the matrix, and it can be computed in linear time so long as we held onto the keys and values from before. The set of keys and values we've already computed is called the KV-cache. The optimization as a whole is called KV-caching.

Thus, we can essentially get away with computing
$
  "softmax"(Q_i dot K_0, ..., Q_i dot K_i) V
$

Intriguingly, this is invariant to arbitrary permutations of the KV cache. This is handy for implementing Sliding Window Attention efficiently (in fact, it even works with SWA + Speculative Decoding). Or even rearranging the KV cache occasionally for contiguous access.

Once again, we can do the FlashAttention trick of "break the problem up into smaller intervals, then merge them" approach, but since we only have one output to produce, we can go all out with our memory budget and compute all chunks in parallel. 

The main bottleneck here is we don't have nearly as much work to do as we did when we were processing the whole sequence outright. During Training we needed to do $O(T^2)$ work but can get away with $O(T)$ memory. Here, we need to do $O(T)$ work but are still using $O(T)$ memory. Thus, the flops/memory ratio is quite bad and our GPU will be underutilized.

This motivates the following rather obvious optimization: _shrink the memory needed from the KV cache_. There are a lot of different strategies you can use to do this.
- Use a lower-precision KV cache.
- Use GQA. This method groups attention heads and reuses keys and values across groups.
- Drop Keys and Values from the cache based on heuristics.
- Sample Keys and Values from the cache instead of using all of them.
- There's so many of these omg...

== FFN
In Transformers, *FFN* usually refers to a very specific type of feed-forward network. Specifically a 2-layer SWIGLU MLP, defined as follows.
$
  "FFN"(X) = ("swish"(X W_"gate") dot.o X W_"up")W_"down"
$


// #import "@preview/fletcher:0.5.9" as fletcher: diagram, node, edge

#align(center, diagram(
  spacing: (12mm, 12mm),
  node-fill: white,
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,
  edge-corner-radius: 3pt,
  edge-stroke: 0.55pt,
  mark-scale: 70%,

  node((0, 1), [$X$], name: <x>),

  node((1, 0.5), [$W_"gate"$], name: <gate>),
  node((1, 1.5), [$W_"up"$], name: <up>),

  // node((3.5, 0), [SiLU], name: <silu>),
  node((2, 1), [$dot.o$], shape: circle, name: <mul>),

  node((3, 1), [$W_"down"$], name: <down>),
  node((4, 1), [$y$], name: <out>),

  edge(<x>, <gate.west>, "-|>"),
  edge(<x>, <up.west>, "-|>"),
  edge(<gate.east>, <mul>, "-|>", label: "SiLU", label-angle: -30deg),
  edge(<up.east>, <mul>, "-|>"),
  edge(<mul>, <down>, "-|>"),
  edge(<down>, <out>, "-|>"),
))


swish is an elementwise function that looks almost like a ReLU but is differentiable everywhere and tends to be a little bit easier to optimize. Conceptually, the swish function _gates_ how much of each input we should keep, hence the naming. $W_"up"$ has that name because it typically projects the input up from dimension $D$ to dimension $F$, where typically $F approx 4 D$, and $W_"down"$ similarly maps from a larger inner dimension back down.

Intriguingly, because we map up to $F approx 4 D$, this layer is often _most of the work in a transformer_! For some quick napkin math...
$
  "ATTN FLOPs" approx "FLOP"s(Q, K, V, O) + "FLOP"s((Q K^top) V) = 8B S D^2 + 0.5(4 B S^2 D) \ 
  "FFN FLOPs" approx 3 (2 B D F) = 6 B S D F approx 24 B S D^2 \ 
  "FFN FLOPs" - "ATTN FLOPs" = 16 B S D^2 - 2 B S^2 D
$

So $S > 8 D$ in order for attention to dominate. This is interesting. For larger models, which typically have higher $D$, let's $D approx 10k$, this corresponds to pretty large sequences on the  order of $80k$ elements. During Pre-Training you usually use much smaller sequences, during Inference at long contexts such lengths are more likely. However, if you are serving a smaller model, or a model with a more expensive attention mechanism, the tipping point can come way earlier, 

=== MOEs
With LLMs, one of the easiest ways to improve performance is scaling the number of parameters. However, increasing the number of parameters often correspondingly increases the amount of compute you end up doing! MOEs can be thought of as work-around. In a nutshell, they let you train a large number of FFNs (defined the same way as above) called _experts_. During training and inference, only a subset of these experts fire, decoupling compute from parameters. A _router_ is used to choose which experts to send the token too, it's usually something like a linear mapping following by Top-K.


#align(center, diagram(
  spacing: (10mm, 12mm),
  node-fill: white,
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,
  edge-corner-radius: 3pt,
  edge-stroke: 0.55pt,
  mark-scale: 70%,

  node((0, 1), [$X$], name: <x>),

  node((1, 1), [Router], name: <router>),

  node((2, 0.5), [Expert $1$], name: <e1>),
  node((2, 1), [$dots.v$], stroke: none, fill: none),
  node((2, 1.5), [Expert $n$], name: <en>),

  node((3, 1), [$sum$], shape: circle, name: <sum>),
  node((4, 1), [$Y$], name: <out>),

  edge(<x>, <router>, "-|>"),

  edge(<router>, <e1.west>, "-|>"),
  edge(<router>, <en.west>, "-|>"),

  edge(<e1.east>, <sum>, "-|>", label: [$p_1$]),
  edge(<en.east>, <sum>, "-|>", label: [$p_n$], label-side: right),

  edge(<sum>, <out>, "-|>"),
))

You can also make experts which all tokens are routed too, called _shared_ experts, with the thinking being it avoids redundant computation across experts.

= Scaling  (Credits: #link("https://jax-ml.github.io/scaling-book/")[The Jax Scaling Book])
When you start making models bigger, you quickly start running into a lot of performance bottlenecks. Your main avenue for addressing them is to somehow share the load across more and more GPUs, but this is non-trivial as naive approaches will bottleneck the model computation on communicating between GPUs. This motivates a lot of interesting parallelism strategies.

- *Data Parallelism (DP)*
  - Process batches in parallel, then average the gradients.
- *Pipeline Parallelism (PP)*:
  - Host different layers on different GPUs, pass the outputs of one layer to the GPUs hosting the next.
- *Tensor Parallelism (TP)*:
  - Divide the operation (typically a matmul) into chunks i.e.
    $
      W X = mat(W_0; ...; W_n) X => "GPU"_i "computes" W_i X
    $
- *Expert Parallelism (EP)*:
  - Divide MOE experts across GPUs. Send tokens to-and-from their relevant experts for processing.
- *Context Parallelism (CP)*:
  - Use the FlashAttention trick to process an entire sequence in parallel. Unique to Attention.
- *Data Parallelism Attention (DPA)*
  - Run Attention on seperate _sequences_ per GPU. Essentially DP for Attention.
- *Head Parallelism (HP)*
  - Run each Attention KV-Head on a different GPU. Sort of like TP, can also implement it like EP.

You can memorize all these, but it's much more powerful to see these as particularly implementations forced by _sharded matrix multiplication_. 

== Sharded Matmuls
We are going to organize our GPUs into a _mesh_. A mesh is a conceptual organization of GPUs into a lattice (e.g. a line, a square, a cube), the physically network topology can look very different. Concretely, we will assign to each GPU a tuple of coordinates, which we can use to refer to it. GPUs which share a coordinate are said to live on the same _axis_. 


#align(center, diagram(
  spacing: (16mm, 14mm),
  node-fill: white,
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,
  edge-corner-radius: 3pt,
  edge-stroke: 0.55pt,
  mark-scale: 70%,

  node((0, 0), [GPU $(0,0)$], name: <g00>),
  node((1, 0), [GPU $(1,0)$], name: <g10>),
  node((2, 0), [GPU $(2,0)$], name: <g20>),

  node((0, 1), [GPU $(0,1)$], name: <g01>),
  node((1, 1), [GPU $(1,1)$], name: <g11>),
  node((2, 1), [GPU $(2,1)$], name: <g21>),

  node((0, 2), [GPU $(0,2)$], name: <g02>),
  node((1, 2), [GPU $(1,2)$], name: <g12>),
  node((2, 2), [GPU $(2,2)$], name: <g22>),

  // Mesh axes
  edge((0, -0.8), (2, -0.8), "-|>", label: [$X$]),
  edge((-0.8, 0), (-0.8, 2), "-|>", label: [$Y$]),

  // X-axis group: Y is fixed
  node(
    enclose: (<g01>, <g11>, <g21>),
    stroke: (thickness: 0.7pt, dash: "dashed"),
    fill: none,
    inset: 4pt,
    snap: false,
  ),

  // Y-axis group: X is fixed
  node(
    enclose: (<g10>, <g11>, <g12>),
    stroke: (thickness: 0.7pt, dash: "dashed"),
    fill: none,
    inset: 4pt,
    snap: false,
  ),

  node((2.75, 1), [$X$-axis group], stroke: none, fill: none),
  node((1, 2.75), [$Y$-axis group], stroke: none, fill: none),
))

Now we can define our notation. We'll define $A[B, C, ...]$ to define the tensor $A$ which has the logical dimensions, $B$, $C$, and anything else I've listed. If we write a subscript underneath a dimension, e.g. $B_X$ this means we are partitioning that dimension across the axis indicated by the subscript. If we add multiple subscripts, we partition across multiple axes, if we add no subscripts, we don't partition, we replicate. See #link("https://jax-ml.github.io/scaling-book/")[The Jax Scaling Book] for more illustrations.

Anyway, it's easy to define an algebra using these. Let $A B = C$.
$ A[B_X, D] times_D B[D, F_Y] = C[B_X, F_Y] $
The letter under the $times$ symbol indicates the reduction dimensions.

To see this, first subdivide A and B along their reduction dimension.
$
  A = vec(A_1, ..., A_(|X|)) quad B = mat(B_1, ..., B_(|Y|))
$

$"GPU"(x, y)$ holds the $x$th entry of the blocked $A$ matrix, and the $y$th entry of the blocked $B$ matrix.
Blocked Matrix Multiplication tells us 
$
  C = A B = mat(A_1 B_1, ..., A_1B_(|X|); ..., ..., ...; A_(|X|) B_1, ...,  A_(|X|) B_(|X|))
$

The $(x, y)$th entry of the above matrix corresponds to the $(x, y)$th entry of the blocked $C$. $"GPU"(x, y)$ holds precisely the right shards of $A$ and $B$ to compute this block.

The second identity is
$ A[B, D_X] times_D B[D_X, F] = C[B, F]{U_X} $

Where ${U_X}$ means we have to sum along the $X$ axis to obtain $C$. The argument is similar, except now it you're taking an inner product instead of an outer product.

Generally, the two equations can be overlayed, but inputs of the form $A[B_X, D_X]$ are not allowed, they don't contain the whole matrix (just a blocked diagonal) so it is not possible to form valid matrix products with them.

If you want to convert your matrix from one form to another, you need communications!
$ 
  "All-To-All"_(B, D) A[B_X, D] => A[B, D_X] \
  "All-Gather"_X (A[B_X, D]) => A[B, D] \
  "All-Reduce"_X (A[B, D]{U_X}) => A[B, D] \
  "Reduce-Scatter"_(B) (A[B, D]{U_X}) => A[B_X, D]
$ 

For intuition and implementation of the above primitives see the scaling book.

== Overlapping Computation and Comms
It's very important to prevent communications from bottlenecking the model's computation. If you must use communications, the best way to avoid a bottleneck is to run communications concurrently with computation to avoid ever being in the situation where you just have to run communications. 

The easiest case is where you gather an existing tensor, say a weight tensor or an activation tensor during the BWD. Since you know the tensor in advance, you can dispatch the communication primitive asynchronously allowing it to overlap with model computation.

Sometimes though, you need to gather a tensor which was just made: an activation tensor during the FWD, a gradient tensor during the BWD. Overlap in this case requires more fine-grained cooperation. The technique needed is called a Collective GEMM. Let's go through some cases.

All-Gather followed by a GEMM.
$
 underline(A[B_X, D] times_D B[D, F_X] => C[B_X, F]) \
 - "AllGather"(B[D, F_X]) \
 - A[B_X, D] times_D B[D, F] = C[B_X, F]
$

To overlap the all-gather with the computation of $C$, observe gathers are often subdivided into iterations due to bandwidth limitations. Each iteration brings each GPU a new slice of $B$ which it can apply $A$ too. The trick is then to apply $A$ immediately to pieces as they arrive.

GEMM followed by Reduce-Scatter / All-Gather.
$
 underline(A[B, D_X] times_D B[D_X, F] => C[B_X, F]) \
 - A[B, D_X] times_D B[D_X, F] = C[B, F]{U_X}\
 - "ReduceScatter"(C[B, F]{U_X}) = C[B_X, F]
$
To allow overlap, you can subdivide the local computation work into smaller tiles, and begin shuffling the small tiles as soon as they're done, either gathering or reducing them depending on the operation. This is essentially a pipelined ring algorithm.

Reduce-Scatter followed by GEMM.
$
  underline(A[B, D]{U_X} times_D B[D, F] => C[B_X, F]) \
  - "ReduceScatter"_B (A[B, D]{U_X}) = A[B_X, D] \
  - A[B_X, D] times_D B[D, F] = A[B_X, F]
$
We again subdivide the computation into tiles. But in this case, you can simply pipeline things such that right before you process your input tile, you've reduced it. 

All-To-All followed by a GEMM.
$
 underline(A[B, S_X, D] times_D B[D, F] => C[B_X, S, F]) \
 - "AllToAll"(A[B, S_X, D]) = A[B_X, S, D] \
 - A[B_X, S, D] times_D B[D, F] = C[B_X, S, F]\
$
To overlap, again just process chunks as soon as they arrive. Cursor's MOE kernel allows the GPUs which are receiving data to pull data, instead of the senders just _pushing_ all their data up-front, which enables fine-grained pipelining (e.g. you can issue a network request as soon as you finish computing a GEMM tile). The reverse (GEMM followed by All-To-All) is similar but is led by the sender.

== Parallelism Schemes
Let's now dig into various operations throughout the Transformer, and see how different choices of sharding and communication force us into different parallelism schemes.

For Attention, ignoring the softmax and normalization, we want to compute
$
  Q[B, G, H, S, D H] times_(D H) K[B, G, L, D H] times_(L)  V[B, G, L, D H] = Y[B, G, H, S, D H]
$

That output will be multiplied by the output matrix...
$
  Y[B, G, H, S, D H] times_(G, H, D H) W_O [G, H, D H, D] = X[B, S, D]
$

Now the FFN. I'll ignore the gate-projection as it should share its parallelism scheme with $W_"up"$. 
$
  X[B, S, D] times_D W_"up" [D, F] times_F W_"down" [F, D] = O[B, S, D]
$

And now, $O$ will be used to make $Q, K, V$. They're all pretty similar, let's just look at $Q$.
$
  O[B, S, D] times_D W_Q [D, G, H, S, D H] = Q[B, G, H, S, D H]
$

The key point is Attention's parallelism should set stuff up for the FFN, which should set stuff up for Attention (since the blocks are stacked). Now, let's figure out how to divide up the work.

=== Data-Parallel Attention
If we split along $B$ we can run attention independently for each batch of sequences
$
  Q[B_X, G, H, S, D H] times_(D H) K[B_X, G, L, D H] times_(L)  V[B_X, G, L, D H] = Y[B_X, G, H, S, D H]
$
The weight matrix doesn't care about our batch sharding, so we end up with $X[B_X, S, D]$. The main disadvantage is during inference, different sequences can have different processing times. It also doesn't work if we have small batch sizes.

=== Head-Parallelism
One way to get even processing times is to split along the group dimension.
$
  Q[B, G_X, H, S, D H] times_(D H) K[B, G_X, L, D H] times_(L)  V[B, G_X, L, D H] = Y[B, G_X, H, S, D H]
$
Now the catch, we have to deal with the output matrix. A reasonable approach is to shard $W_O$ along $G$, and then do a reduce-scatter into whatever logical dimension is ideal.
$
   Y[B, G_X, H, S, D H] times_(G, H, D H) W_O [G_X, H, D H, D] = X[B, S, D]{U_X}
$

Being able to reduce-scatter into whatever dimensions works best makes this pretty flexible. Another way you could do this is to just replicate $W_O$, and use an AllTAll to get rid of the sharding on $B$.

The main drawback with this approach is you might not have that many groups to shard.

=== Context Parallelism
Try sharding $S$ and $L$.
$
  underline(Q[B, G, H, S_X, D H] times_(D H) K[B, G, L_X, D H] times_(L)  V[B, G, L_X, D H] => Y[B, G, H, S_X, D H]) \
  "AllGather"(K[B, G, L_X, D H]) = K[B, G, L, D H] \
  "AllGather"(V[B, G, L_X, D H]) = V[B, G, L, D H] \
  Q[B, G, H, S_X, D H] times_(D H) K[B, G, L, D H] times_(L)  V[B, G, L, D H] => Y[B, G, H, S_X, D H] 
$
You can solve this by all-gathering KV but this requires _communicating_ KV across nodes, potentially expensive! Another pretty big drawback with sharding $S$ is that during inference, $S$ is like 1. Therefore, it cannot be sharded, and instead $Q$ would end up replicated across all shards. Note this is the same as Ring Attention, Ring Attention is how we overlap the AllGathers with the communication.

=== DeepSpeed-Ulysses
Again, try sharding $S$ and $L$, but we'll use a slighlty different communication strategy.
$
  underline(Q[B, G, H, S_X, D H] times_(D H) K[B, G, L_X, D H] times_(L)  V[B, G, L_X, D H] => Y[B, G, H, S_X, D H]) \
  "AllToAll"(Q[B, G, H, S_X, D H]) = Q[B, G_X, L, D H] \
  "AllToAll"(K[B, G, L_X, D H]) = K[B, G_X, L, D H] \
  "AllToAll"(V[B, G, L_X, D H]) = V[B, G_X, L, D H] \
  Q[B, G_X, H, S, D H] times_(D H) K[B, G_X, L, D H] times_(L)  V[B, G_X, L, D H] = Y[B, G_X, H, S, D H]
$
Now, instead of doing TP for $W_O$, we can instead use more AllToAlls!
$
  "AllToAll"(Y[B, G_X, H, S, D H]) = Y[B_X, G, H, S, D H] \
  Y[B_X, G, H, S, D H]  times_(G, H, D H) W_O [G_X, H, D H, D] = X[B_X, S, D]
$

By doing this, we've essentially traded two all-to-alls for one reduce-scatter, which could actually be a good trade depending on how many GPUs are involved. 

=== No Name Scheme?
Try sharding $B$ and $L$.
$
  underline(Q[B_X, G, H, S, D H] times_(D H) K[B, G, L_X, D H] times_(L)  V[B, G, L_X, D H] => Y[B, G, H, S, D H]{U_X}) \
  "AllGather"(Q[B_X, G, H, S, D H]) = Q[B_X, G, H, L, D H] \
  Q[B, G, H, S, D H] times_(D H) K[B, G, L_X, D H] times_(L)  V[B, G, L_X, D H] = Y[B, G, H, S, D H]{U_X} \
  "ReduceScatter"(Y[B, G, H, S, D H]{U_X}) = Y[B_X, G, H, S, D H]
$

This is very strange looking, why would you ever want to do this? Well, what if this is inference and the KVs are _large and uneven_. Sharding by batch dimension as data parallelism does would result in some GPUs absorbing a ton of sequence memory and some GPUs absorbing very little. The same load-imbalance could happen for compute too! Well what about Context Parallelism? Context Parallelism will force replication of the queries because $S = 1$, so that's expensive. You cannot naively ring-reduce by moving $Q$ because that would leave several $K$s unpaired. The insight is what if we kept $K V$ in place and then moved $Q$ around using the batch dimension to introduce parallelism where the sequence dimension is lacking. At the end of this process, the KVs will still be on separate GPUs, but they will have received the right normalizing statistics and will have computed everything needed for that tile, so all that remains is a reduction. The advantage is this works like Context-Parallel except you don't need to replicate $Q$.

Interestingly, I found out Meta also came up with this scheme, calling it Ring Pass-Q.

== FSDP
Let's now think about the FFN portion. What if we shard the weights and activations along $D$?
$
  underline(X[B, S, D] times_D W_"up" [D_X, F] times_F W_"down" [F_X, D] => O[B, S, D]) \
  "AllGather"(W_"up" [D_X, F]) = W_"up" [D, F] \
  "AllGather"(W_"down" [D_X, F]) = W_"down" [D, F] \
  X[B, S, D] times_D W_"up" [D, F] times_F W_"down" [F, D] = O[B, S, D]
$
The cool thing about this scheme is since we are gathering the weights, we can actually do they gathers ahead of time for very little communication overhead. This is an optimization used in ZeRO to reduce Transformer memory usage, they can also perform it on optimizer state and gradients. Not super practical during inference, since loading the weights is a large portion of the bottleneck.

Another approach (not what FSDP does) would be to all-reduce the activations after multiplying with the first matmul. This might be appealing if the activations are much smaller than the weights (a function of your batch size).

== Tensor Parallelism
What if we shard the weights along $F$?
$
  underline(X[B, S, D] times_D W_"up" [D, F_X] times_F W_"down" [F_X, D] => O[B_X, S, D]) \
  X[B, S, D] times_D W_"up" [D, F_X] times_F W_"down" [F_X, D] = O[B, S, D]{U_X} \
  "AllReduce"(O[B, S, D]{U_X}) = O[B, S, D]
$
Unlike the previous scheme, which was mainly there for memory savings, here we've asymptotically reduced the work by splitting it across the GPUs, and wee've switched from doing communication over the weights to doing communication over the activations. 

== 2D Weight Stationary
What if we shard the weights along $F$ and $D$?
$
  underline(X[B, S, D_(X Y)] times_D W_"up" [D_X, F_Y] times_F W_"down" [F_Y, D_X] => O[B, S, D_(X Y)]) \
  "AllGather"_(Y)(X[B, S, D_(X Y)]) = X[B, S, D_X]\
  X[B, S, D_X] times_D W_"up" [D_X, F_Y] = A[B, S, F_Y]{U_X}\
  "AllReduce"_X (A[B, S, F_Y]{U_X}) = A[B, S, F_Y] \
  A[B, S, F_Y] times_F W_"down" [F_Y, D_X] = O[B, S, D_X]{U_Y} \
  "ReduceScatter"_Y (O[B, S, D_X]{U_Y}) = O[B, S, D_(X Y)]
$
Just like the previous scheme, we're moving activations around, hence "Weight Stationary". This requires more communication then TP but less computation, so this can be a dominant scheme for moderate batch sizes. See #link("https://arxiv.org/abs/2211.05102")[this paper] for a more detailed analysis for when it wins.

== Data Parallelism
What if we shard $B$?
$
  X[B_X, S, D] times_D W_"up" [D, F] times_F W_"down" [F, D] = O[B_X, S, D] \
$
The main cost of this scheme is being forced to replicate weights. 

== Expert Parallelism
Reinterpret the $X$ buffer as telling you for each (Sequence, Expert) pair, what token do you send? In reality you use Ragged Buffers, this is just a simplification to make it expressible with our syntax.
$
  underline(X[B, S_X, E, D] times_D W_"up" [E, D, F] times_(F) W_"down" [E, F, D] => O[B, S_X, E, D]) \ 
  "AllToAll"(X[B, S_X, E, D]) = X[B, S, E_X, D] \ 
  X[B, S, E_X, D] times_D W_"up" [E_X, D, F] times_(F) W_"down" [E_X, F, D] = O[B, S, E_X, D] \
  "AllToAll"(X[B, S, E_X, D]) = X[B, S_X, E, D] 
$
The actual output of this layer will also sum along the $E$ dimension at the end. So anyway, what's the point of this scheme? A much simpler strategy is to use Tensor Parallelism, but TP requires expensive AllGathers and Reduces over the activations, instead of AllToAlls. TP also is limited by the size of $F$. Shard $F$ too much, and you have terrible compute efficiency locally. On the other hand, $E P$ does poor when you have small batches, but the larger the batch you have the more efficiently the expert-local GEMMs become.

== DWDP
Use the same reinterpretation as before, but this time we'll solve it differently. 
$
  underline(X[B_X, S, E, D] times_D W_"up" [E_X, D, F] times_(F) W_"down" [E_X, F, D] => O[B_X, S, E, D]) \ 
  "AllGather"(W_"up" [E_X, D, F]) = W_"up" [E, D, F] \ 
  "AllGather"(W_"down" [E_X, D, F]) = W_"down" [E, D, F] \ 
  X[B, S_X, E, D] times_D W_"up" [E, D, F] times_(F) W_"down" [E, F, D] = O[B, S_X, E, D]
$

As usual, you should treat the all-gather followed by the matmul as one fused operation. This will probably be implemented as a ring-reduce of sorts. This is called Distributed Data Weight Parallel, and it becomes appealing when moving the weights has less memory traffic than moving the experts.

It also doesn't require synchronization unlike the Expert Parallelism, e.g. GPU computes its shard independently from the rest. If you pipe this into a scheme like DPA, you actually never need to synchronize between the replicas at all!

== Choosing A Scheme
For fine-grained comparisons of schemes, the math is straightforward.
$
  T_"forward" in [max(T_"comms", T_"compute", T_"memory"), T_"comms" + T_"compute" + T_"memory"]
$
The lower-bound assumes complete overlap, the upper-bound assumes no overlap. Each of the individual quantities can be calculated by looking at the total amount of data being processed, and dividing by the speed at which it can be processed.

If you want _intuition_ for the best scheme, there are a couple of useful axes...
- How fast is my communication? Data Parallel, DWDP and DPA all have almost no inter-GPU coordination, allowing them to win in regimes where communication is slow.
- Would I rather be moving _weights_, _activations_, or _both_? TP and 2D Weight Stationary lean keep weights stationary, FSDP and DWDP lead keep activations stationary. You can combine the schemes to smooth the transition between the two regimes.
- What's my bottleneck? During decode, _memory loading_ is a huge bottleneck. Attention TP over the query heads replicates the KV cache, Context Parallel and Ring Pass-Q don't do this, and so they win in this regime. If networking is your bottleneck, trading uneven data-parallel schemes for communication might be the move. If latency is the problem, try to use TP!


// - The cluster setup I have for processing prompts is suboptimal for autoregressive inference.
//   - *PD-Disaggregation (PD)*: Use seperate clusters for Prefill (processing the prompt) and Decode (inference).
// 
// 

// === Sharded Mamtuls
// + Every accelerator has the full version of both matrices.
//   $
//     "In"[N, K] times_K W_"in" [K, M] 
//   $
//   Just perform the matmuls locally, no communication needed.
// + One axis is sharded.
//   $
//     "In"[N_X, K] times_K W_"in" [K, M] 
//   $
//   Perform an all-gather and then perform the matmuls locally.
// + The reduction axis is sharded on both. 
//   $
//     "In"[N, K_X] times_K W_"in" [K_X, M] 
//   $
//   Perform local matmuls and then an all-reduce.
// + 

= Theory

== Residual Stream
There's actually a very important decision lurking in how you hook up the residual stream.

Should your model look like this?
#idiomatic_arch

Or this?
#align(center, graphic(diagram(
  spacing: (8mm, 11mm),
  node-fill: white,
  node-stroke: 0.55pt,
  node-corner-radius: 2pt,
  node-shape: rect,
  edge-corner-radius: 3pt,
  edge-stroke: 0.55pt,
  mark-scale: 70%,

  node((0,0),        [Hidden],    name: <in>),    edge("-|>"),
  node((rel: (1,0)), [Norm],      name: <norm2>), edge("-|>"),
  node((rel: (1,0)), [Attention], name: <attn>),  edge("-|>"),
  node((rel: (1,0)), [Add],       name: <add1>),  edge("-|>"),
  node((rel: (1,0)), [Norm],      name: <norm1>), edge("-|>"),
  node((rel: (1,0)), [FFN],       name: <ffn>),   edge("-|>"),
  node((rel: (1,0)), [Add],       name: <add2>), edge("-|>"),
  node((rel: (1,0)), [Hidden],    name: <out>),

  tap(<attn>, <tap1>),
  tap(<ffn>,  <tap2>),
  skip(<tap1>, <add1>),
  skip(<tap2>, <add2>),
)))

Consider the first setup (*Pre-Layer Norm*). The residual stream proceeds through the layers, incrementing its value with the outputs of the FFN and Attention blocks. Over the course of many layers, the residual stream will typically grow larger (this is similar to a random walk setup where you repeatedly add the same increment). This isn't _explosive_ growth (it's linear or sublinear depending on how correlated you think the increments are).

Now, what do the gradients look like? Let $Y_t$ be the residual stream after the $t$th FFN, and $X_t$ be the residual stream just before it. 

$
  Y_t = X_t + "FFN"("LN"(X_t)) &=> d Y_t = d X_t + d"FFN"("LN"(X_t)) \
  ip(nabla L(X_t), d X_t) &= ip(nabla L(Y_t), d Y_t) \
                          &= ip(nabla L(Y_t), d X_t + d"FFN"("LN"(X_t))) \ 
                          &= ip(nabla L(Y_t), d X_t + D"FFN"("LN"(X_t)) D"LN"(X_t) d X_t) \
  nabla L(X_t) &= nabla L(Y_t)(I +  D"FFN"("LN"(X_t)) D"LN"(X_t))^top
$

Now, since $norm(x)$ often grows with depth, the layernorm often needs to scale _down_ by more and more the deeper you go. Thus, as you get deep into the network, the second term often vanishes and your block degenerates to roughly an identity mapping.
$
  nabla L(X_t) approx nabla L(Y_t)
$
This makes deep layers hard to use well. Furthermore, that $(I + ...)$ term can compound as you go back earlier and earlier, leading to exploding or vanishing gradients in early layers.

// Now with Post-LN we have 
// $
//   Y_t = "LN"(X_t + "FFN"(X_t))
// $
// Since the previous output came from a LayerNorm, we know $norm(X) = 1$. If you assume that $X_t$ and $"FFN"(X_t)$ are roughly independent then typically $norm(X_t + "FFN"(X_t)) >= 1$. This means the LayerNorm typically has to _scale down_. Hence, features from earlier layers get extremely suppressed as you descend deep into the network, and that you suffer vanishing gradients with respect to the input layers.

I'll update this section with *Post-Layer Norm* and some other ideas when I understand more about the signal propagation math.

// TODO: These following two sections indicate we don't understand the signal propagation stuff at all.
// What about the second setup (*Post-Layer Norm*)? Let's look at the gradient.
// $
//   Y_t = "LN"(X_t + "FFN"(X_t)) &=> d Y_t = d"LN"(X_t + "FFN"(X_t)) \
//   ip(nabla L(X_t), d X_t) &= ip(nabla L(Y_t), d Y_t) \
//                           &= ip(nabla L(Y_t), d"LN"(X_t + "FFN"(X_t))) \ 
//                           &= ip(nabla L(Y_t), D"LN"(X_t + "FFN"(X_t))(d X_t + D"FFN"(X_t) d X_t)) \
//   nabla L(X_t) &= nabla L(Y_t)(D"LN"(X_t + "FFN"(X_t))(I + D"FFN"(X_t)))^top
// $
// Here, the two terms can balance the norm of the change (LN can't unrotate, but it can unscale), so at least at first glance the FFN is not problematic.

// What about the corresponding attention gradients? We'll use $U_t$ for before the block and $V_t$ for after.
// $
//   nabla L(U_t) &= nabla L(V_t)(D"LN"(U_t + "Attn"(U_t))(I + D"Attn"(U_t)))^top
// $

// This recurrence has a compounding effect. Notice this is a bit different then the previous recurrence, as that one approached 1 as you got deeper in the network, this recurrence has no such property. Thus, it's very easy for gradients to get too large or too small (gradient spikes and/or near-zero gradients), especially the closer we get to the first layer. This is why having a small _warmup_ rate is essentially for this type of architecture, as it keeps the gradients small until you get to a stable optimization region. Still, this isn't enough to completely eliminate the instability, and so despite the growing hidden state activations, *Pre-Layer Norm* is often preferred.

// As you can see, neither *Pre* nor *Post* Layernorm is completely satisfactory, and this has motivated a bunch of interesting approaches. One option is to try fixing the problems of *Pre*-norm by intelligently doing some kind of depth-based learning rate scaling. Alternatively you could try to fix the output scaling problems of *Pre*-norm directly. This is what Attention Residuals by MoonshotAI did. Instead of _adding_ the outputs of your module to the residual stream and then norming, you use Attention (without Value Projection) over the outputs of your modules and plug THAT into the norm.

// #align(center, graphic(diagram(
//   spacing: (8mm, 11mm),
//   node-fill: white,
//   node-stroke: 0.55pt,
//   node-corner-radius: 2pt,
//   node-shape: rect,
//   edge-corner-radius: 3pt,
//   edge-stroke: 0.55pt,
//   mark-scale: 70%,

//   node((0,-0.5),      [Past Hidden States],    name: <stream>),  edge("-|>"),
//   node((0, 0),        [Norm], name: <norm2>),  edge("-|>"),
//   node((rel: (1,0)),  [Attention], name: <attn>),
//   node((rel: (1,0)),  [ResidualAttn],      name: <r1>), edge("-|>"),
//   node((rel: (1,0)), [Norm],    name: <norm1>),  edge("-|>"),
//   node((rel: (1,0)),  [FFN],       name: <ffn>),
//   node((rel: (1,0)),  [ResidualAttn],      name: <r2>),

//   skip(<attn>, <r2>),
//   skip(<ffn>, <r2>),
//   edge(
//     <stream>,
//     (rel: (0, -.5), to: <r1>),
//     <r1>, "-|>", dash: "dashed",
//     layer: -1
//   ),
//   edge(
//     <stream>,
//     (rel: (0, -.5), to: <r2>),
//     <r2>, "-|>", dash: "dashed",
//     layer: -1
//   ),
// )))

// Because they don't use a value projection, we essentially have $O = W_"Attention" X$ which is a convex linear operation; it's output cannot have a higher norm then all of its inputs. This immediately addresses the growing output norm problems.

// What do the gradients look like? Going back a single hop it looks like...
// $
//   dx_(t+1)/dx_t = (dif "ResA"(h_0, ..., h_(t + 1)))/(dif h_(t + 1)) (dif "Attn"("LN"(x_t)))/(dif "LN"(x_t)) (dif "LN"(x_t))/(dif x_t) = \
//   a_(t -> t+1) J_(t)
// $

// Going back more hops it's going to look like 
// $
//   dx_(i)/dx_j = sum_("p" in "paths from i to j") product_("edge" u,v in "p") a_(u -> v) J_u
// $

// And for the sake of being able to reason about this, if we assume the gradients are roughly the same norm, this is going to look like entries of the matrix
// $
//   (sum_k A^k)_(i j)
// $

// // TODO: THIS IS REALLY NOT CLEAR (but I think a decent way of viewing this)
// Where $A$ is the overall layerwise attention matrix. From this analysis, it becomes clear that the gradient grows exponentially with depth for pre-norm, but only linearly for Residual Attention.

== Critical Batch Size (Credits: #link("https://arxiv.org/pdf/1812.06162")[An Empirical Model of Large-Batch Training])
The goal here is to try and derive from first principles what the optimal batch size should be. Assume that our loss is well-approximated locally by its second order Taylor expansion and let $G$ and $H$ indicate the true values of the gradient and hessian at $theta_0$. With step size $eta$ we have...
$
  L(theta) = L(theta_0) + eta G^top (-G) + eta^2/2 G^top H G + O(eta^3)
$

This isn't a very realistic way to estimate how much we expect our loss to decrease as we typically use minibatch SGD, which means our update-step is a minibatch estimate of the true-gradient, call it $G_"batch"$ instead of $G$. We can still ask how much we expect the expected loss to decrease...

$
  delta L &= -eta E(Tr(G^top G_"batch")) + eta^2 / 2 E(Tr(G_"batch"^top H G_"batch")) \
  &= -eta Tr(G^top E(G_"batch")) + eta^2 / 2 Tr(H E(G_"batch" G_"batch"^top)) \
  &= -eta norm(G)^2 + eta^2 / 2 Tr(H (G G^top + "Cov"(G_"batch"))) \
  &= -eta norm(G)^2 + eta^2 / 2 (G^top H G + Tr(H "Cov"(G_"batch"))) \
  &= -eta norm(G)^2 + eta^2 / 2 (G^top H G + 1/B Tr(H "Cov"(G_"sample"))) \
$

// Accidentally analyzed GD on the minibatch-loss, which is a lot more complicated.
// $
//   E(delta L) &= - eta E(Tr(G_"batch"^top G_"batch")) + eta^2/2 E(Tr((G_"batch")^top H_"batch" (G_"batch"))) \
//    &= - eta Tr(E(G_"batch" G_"batch"^top)) + eta^2/2 Tr(E(H_"batch" (G_"batch") (G_"batch")^top)) \

//   &= - eta (norm(G)^2 + Tr("Cov"(G_"batch"))) + eta^2/2 Tr(H E(G_"batch" G_"batch"^top) + "Cov"(H_"batch", (G_"batch") (G_"batch")^top)) \
//   &= - eta (norm(G)^2 + Tr("Cov"(G_"batch"))) + eta^2/2 Tr(H G G^top + H"Cov"(G_"batch") + "Cov"(H_"batch", (G_"batch") (G_"batch")^top)) \
// $

// For the last term, write $H_i = H + A_i$ and $G_i = G + epsilon_i$. Where $A_i$ and $epsilon_i$ are mean-zero random variables.
// $
//   Tr("Cov"(H_"batch", (G_"batch") (G_"batch")^top)) = \
//   E(Tr(macron(A)(G + macron(epsilon))(G + macron(epsilon))^top)) = \
//   E(Tr(macron(A)(G G + G macron(epsilon)^top + macron(epsilon) G^top + macron(epsilon)macron(epsilon)^top))) = \
//   E(Tr(macron(A)(G macron(epsilon)^top + macron(epsilon) G^top + macron(epsilon)macron(epsilon)^top))) = \
//   Tr(E(macron(epsilon)macron(A))G + E(macron(A)macron(epsilon))G^top + E(macron(epsilon)^top macron(A) macron(epsilon))) = \
//   Tr(1/B E(epsilon_i A_i)G + 1/B E(A_i epsilon_i)G^top + 1/B^2 E(epsilon_i^top A_i epsilon_i))
// $

We solve for the best value of $eta$.
$
  0 = - norm(G)^2 + eta (G^top H G + 1/B Tr(H "Cov"(G_"sample"))) \
  eta = norm(G)^2 / (G^top H G + 1/B Tr(H "Cov"(G_"sample")))
$

And our resulting loss reduction is....
$
  delta L = - norm(G)^4 /  (G^top H G + 1/B Tr(H "Cov"(G_"sample"))) + norm(G)^4 / (2 (G^top H G + 1/B Tr(H "Cov"(G_"sample")))) = \
  - norm(G)^4 / (2(G^top H G + 1/B Tr(H "Cov"(G_"sample"))))
$

Let's think about this $Tr(H "Cov"(G_"sample"))$ term, what does it mean, really? Well, if we write $G_"sample" = G + epsilon$, it's actually equivalent to $E(epsilon^top H epsilon)$, that is, the expected amount you would expect the loss to change if you went in random direction (the linear term in the taylor expansion contributes nothing in expectation). This is of course, highly dependent on the _local geometry_ of the loss function. If there are mainly positive curvature directions, noise hurts, if mainly negative, noise _helps_. This could partly explain the "over-smoothing" phenomenon, where batch sizes that are too large converge to worse optima; with less noise, it's harder to find negative curvature directions.

Now if we write 
$
  B_"noise" = Tr(H "Cov"(G_"sample"))/(G^top H G)
$

We have
$
  eta = (norm(G)^2 slash (G^top H G))/(1 + B_"noise" slash B) quad delta L = - (norm(G)^4 slash (2 G^top H G))/(1 + B_"noise" slash B)
$

Where the quantities in the numerators are what you would get under a pure gradient descent step without noise. So intriguingly, when $B_"noise"$ is high relative to $B$, both the optimal step size and the corresponding loss-decrease scale almost linearly with the batch size, while beyond $B = B_"noise"$ the gains start to rapidly attenuate.

From this, it's clear that there is indeed some sort of "optimal batch size". Suppose I have a training step budget $T$ and some fixed amount of data $D$, such that $B T <= D$.  Large $B$ quickly eats through my dataset while suffering diminishing returns to minibatch size, while small $B$ quickly eats through my step budget. Somewhere in the middle yields efficient training.