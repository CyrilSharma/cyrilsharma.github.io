#import "/typ/templates/blog.typ": *
#show: main.with(
  title: "Llms",
  desc: "",
  date: "2026-07-24T18:13:49-04:00",
  tags: ("ml",),
)


== Attention
Let $X$ be a sequence of length $T$. Attention is defined as follows.
$
  Q = "RoPE"(W_Q X) quad K = "RoPE"(W_K X) quad V = W_V X \
  O = "softmax"_"rowwise" ("mask"(Q K^top)/"normalization") V
$

You can think of this as just a clever linearly mixing $X$ across its time dimension.
$
  O = (W_"attention" W_"V") X
$

A lot can be said about the biases and weaknesses of this operator but I won't go into that here.

=== Multi-Head Attention (MHA)
If $X$ is $T times D$, then partition X across $D$ into nhead sequences, process each of those with attention, and concatenate them. This gives a slight expressivity gain, as you can use different attention mixers for different input dimensions, for the same amount of compute.


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

=== Inference
Suppose I want to compute Attention over $X'$ where $X' = "cat"(X, X_t)$. This is commonly needed during autoregressive generation where you extend the input sequence by the last token the model outputted. Turns out a lot of the previous computation can be re-used to make this faster then $O(T^2)$. Under causal masking (and ignoring normalization)...
$ O =
  "softmax"(mat(
    Q_0 dot K_0, 0, ...;
    Q_0 dot K_0, Q_1 dot K_1, ...;
    ..., ..., ...;
    Q_i dot K_0, ..., Q_i dot K_i;
   )) V
$

So, we can see there's only one new row in the matrix, and it can be computed in linear time so long as we held onto the keys and values from before. This optimization is called KV-caching.

Thus, we can essentially get away with computing
$
  "softmax"(Q_i dot K_0, ..., Q_i dot K_i) V
$

Once again, we can do the FlashAttention trick of "break the problem up into smaller intervals, then merge them" approach, but since we only have one output to produce, we can go all out with our memory budget and compute all chunks in parallel. 

The main bottleneck here is we don't have nearly as much work to do as we did when we were processing the whole sequence outright. During Training we needed to do $O(T^2)$ work but can get away with $O(T)$ memory. Here, we need to do $O(T)$ work but are still using $O(T)$ memory. Thus, the flops/memory ratio is quite bad and our GPU will be underutilized.

This motivates the following rather obvious optimization: _shrink the memory needed from the KV cache_. There are a lot of different strategies you can use to do this.
- Use a lower-precision KV cache.
- Use GQA. This method groups attention heads and reuses keys and values across groups.
- Drop Keys and Values from the cache based on heuristics.
- Sample Keys and Values from the cache instead of using all of them.
- There's so many of these omg...


=== Distributed Systems
Now, suppose we have a big industry-scale model. At this point even the input tensors $Q, K$ and $V$ are memory bottlenecks. We can avoid holding all of them in memory using a ring-based buffering system. Concretely, give each GPU a row to operate on. 
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

Incrementally merge chunks using FlashAttention and boom! You've successfully reduced the memory required per GPU.

== Scaling
When you start making models bigger, you quickly start running into a lot of performance bottlenecks. Your main avenue for addressing them is to somehow share the load across more and more GPUs which motivates a lot of interesting parallelism strategies. All of these strategies have _limits_ for any given model, so you'll often end up using more then one of them. Libraries like Megatron handle choosing the optimal combination of these strategies for you.

- I have so much training data, iterations take forever!
  - *Data Parallelism (DP)*: Process batches in parallel, then average the gradients.
  - Technically scalable to the whole dataset but more steps trumps more accurate steps at a certain point (a derivation I'll show at some point?)
- My model is too big to fit on a single GPU.
  - *Pipeline Parallelism (PP)*: Host different layers on different GPUs, pass the outputs of one layer to the GPUs hosting the next.
  - Limited by the size of your model.
- My weight tensors are too big, a single GPU can't fit the whole thing in memory.
  - *Tensor Parallelism (TP)*: Divide the operation (typically a matmul) into chunks i.e.
    $
      W X = mat(W_0; ...; W_n) X => "GPU"_i "computes" W_i X
    $
  - Once matrices easily fit into GPU memory, scaling further degrades GPU utilization.
- My prompts/training sequences are too big (by memory or processing time)
  - *Context Parallelism (CP)*: Use the FlashAttention trick to compute and fuse time-based chunks.
  - Obviously limited by the size of contexts you are processing.

// - The cluster setup I have for processing prompts is suboptimal for autoregressive inference.
//   - *PD-Disaggregation (PD)*: Use seperate clusters for Prefill (processing the prompt) and Decode (inference).