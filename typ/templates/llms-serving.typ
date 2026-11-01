// Native Typst diagrams for the serving notes. Kept separate from the prose.
#let ink = rgb("263546")
#let muted = rgb("627083")
#let border = rgb("ccd4de")
#let cache = rgb("dcebf9")
#let compute = rgb("e8e1f6")
#let token = rgb("d9eee7")
#let prompt = rgb("f7e8cd")
#let idle = rgb("f0f2f5")
#let reject = rgb("f6deda")

#let tile(body, fill: cache, width: 24pt, height: 22pt) = rect(
  width: width, height: height, inset: 0pt, radius: 2pt,
  fill: fill, stroke: 0.55pt + border,
  align(center + horizon, body),
)
#let tiles(labels, fill: cache, width: 24pt) = stack(
  dir: ltr, spacing: 3pt,
  ..labels.map(label => tile(label, fill: fill, width: width)),
)
#let arrow-right = text(14pt, fill: muted, sym.arrow.r)
#let down = align(center, text(14pt, fill: muted, sym.arrow.b))
#let panel(title, body, caption: none) = {
  set text(font: ("Arial", "Libertinus Serif"), size: 9pt, fill: ink)
  set par(justify: false, leading: 0.6em)
  block(width: 440pt, inset: 14pt, radius: 5pt, fill: white, stroke: 0.6pt + border)[
    #stack(dir: ttb, spacing: 10pt,
      text(10pt, weight: "semibold", title),
      body,
      if caption != none { text(8.5pt, fill: muted, caption) },
    )
  ]
}

#let decode() = panel([Decode · one new input token per step], {
  let row(step, cached, input, output) = (
    [Step #step], tiles(cached, width: 21pt),
    tile(input, fill: token), arrow-right,
    tile([Model], fill: compute, width: 54pt), arrow-right,
    tile(output, fill: token),
  )
  grid(
    columns: (38pt, 122pt, 24pt, 16pt, 54pt, 16pt, 24pt),
    column-gutter: 5pt, row-gutter: 8pt, align: horizon,
    [], text(8pt, fill: muted)[Cached K/V], text(8pt, fill: muted)[Input], [], [], [], text(8pt, fill: muted)[Output],
    ..row(1, ([$x_1$], [$x_2$], [$x_3$]), [$y_1$], [$y_2$]),
    ..row(2, ([$x_1$], [$x_2$], [$x_3$], [$y_1$]), [$y_2$], [$y_3$]),
    ..row(3, ([$x_1$], [$x_2$], [$x_3$], [$y_1$], [$y_2$]), [$y_3$], [$y_4$]),
  )
}, caption: [Read previous K/V, process the latest token, and append its K/V for the next step.])

#let prefill() = panel([Prefill · process the prompt together], stack(
  dir: ttb, spacing: 8pt,
  grid(columns: (76pt, 1fr), column-gutter: 3pt, align: horizon,
    [Prompt], tiles(([$x_1$], [$x_2$], [$x_3$], [$x_4$], [$x_5$]), fill: prompt, width: 42pt)),
  down,
  tile([Model · causal attention over the whole prompt], fill: compute, width: 400pt, height: 30pt),
  down,
  grid(columns: (76pt, 222pt, 42pt), column-gutter: 3pt, row-gutter: 4pt, align: horizon,
    [], [Stored K/V], [New token],
    [Result], tiles(([$x_1$], [$x_2$], [$x_3$], [$x_4$], [$x_5$]), width: 42pt),
    tile([$y_1$], fill: token, width: 42pt)),
), caption: [Prompt positions run together; the saved K/V can then be reused during decode.])

#let paged-kv() = panel([Paged KV cache · logical order, scattered physical pages], {
  let mapping(logical, physical, fill) = (
    tile(logical, fill: fill, width: 77pt), arrow-right,
    tile(physical, fill: fill, width: 56pt),
  )
  let page(id, contents, fill) = tile(
    stack(dir: ttb, spacing: 5pt, text(8pt, fill: muted)[Page #id], contents),
    fill: fill, width: 65pt, height: 46pt,
  )
  grid(columns: (177pt, 1fr), column-gutter: 19pt, align: top,
    stack(dir: ttb, spacing: 8pt,
      strong([Request page tables]),
      grid(columns: (77pt, 16pt, 56pt), gutter: 5pt, align: horizon,
        ..mapping([A · block 0], [Page 3], cache),
        ..mapping([A · block 1], [Page 0], cache),
        ..mapping([A · block 2], [Page 5], cache),
        ..mapping([B · block 0], [Page 1], token)),
    ),
    stack(dir: ttb, spacing: 8pt,
      strong([Physical GPU memory]),
      grid(columns: (65pt, 65pt, 65pt), gutter: 5pt,
        page(0, [A: 3, 4], cache), page(1, [B: 1, 2], token), page(2, [free], idle),
        page(3, [A: 1, 2], cache), page(4, [free], idle), page(5, [A: 5, —], cache)),
    ),
  )
}, caption: [Toy pages hold two tokens. The final A page has one unused slot; free pages can serve any request.])

#let schedule(title, rows) = stack(dir: ttb, spacing: 6pt,
  strong(title),
  grid(columns: (64pt, ..(46pt,) * 6), column-gutter: 5pt, row-gutter: 5pt, align: horizon,
    text(8pt, fill: muted)[Iteration →], ..range(1, 7).map(n => align(center, str(n))),
    ..rows.enumerate().map(((i, labels)) => (
      [Slot #(i + 1)],
      ..labels.map(label => tile(
        if label == "" { text(fill: muted)[idle] } else { label },
        fill: if label == "" { idle } else if label in ("D", "E") { prompt } else { token },
        width: 46pt,
      )),
    )).flatten(),
  ),
)

#let batching() = panel([Static batching vs. continuous batching], stack(
  dir: ttb, spacing: 16pt,
  schedule([Static · wait for the whole batch], (
    ("A", "A", "", "", "", ""),
    ("B", "B", "B", "B", "", ""),
    ("C", "C", "C", "C", "C", "C"),
  )),
  schedule([Continuous · refill slots as requests finish], (
    ("A", "A", "D", "D", "D", "D"),
    ("B", "B", "B", "B", "E", "E"),
    ("C", "C", "C", "C", "C", "C"),
  )),
), caption: [Letters identify requests. Each filled cell is one decode token; the sketch assumes incoming requests are ready to decode.])

#let padded-prompts() = panel([Padding makes unequal requests rectangular], {
  let lengths = (6, 3, 4)
  stack(dir: ttb, spacing: 10pt,
    grid(columns: (62pt, ..(42pt,) * 6), gutter: 5pt, align: horizon,
      ..lengths.enumerate().map(((i, length)) => (
        [Request #(i + 1)],
        ..range(6).map(j => tile(
          if j < length { [$x_#(j + 1)$] } else { text(8pt, fill: muted)[PAD] },
          fill: if j < length { cache } else { idle }, width: 42pt,
        )),
      )).flatten(),
    ),
    text(8.5pt, fill: muted)[13 real tokens + 5 padding positions],
    strong([Ragged layout · keep only real tokens]),
    grid(columns: (62pt, 1fr), align: horizon,
      [Packed], stack(dir: ltr, spacing: 7pt,
        ..lengths.enumerate().map(((i, length)) => tiles(
          range(length).map(j => [#(i + 1)]),
          fill: if i == 0 { cache } else if i == 1 { token } else { prompt }, width: 19pt,
        )),
      ),
    ),
  )
}, caption: [Numbers in the packed row identify requests. Boundaries and lengths separate their tokens without padding.])

#let prefill-queries() = panel([Prefill as queries over overlapping prefixes], {
  grid(columns: (81pt, ..(66pt,) * 4), gutter: 6pt, align: horizon,
    [Query ↓ / K,V →], ..range(1, 5).map(i => align(center, [$x_#i$])),
    ..range(1, 5).map(i => (
      [$Q_#i$],
      ..range(1, 5).map(j => tile(
        if j <= i { [$K_#j, V_#j$] } else { text(8pt, fill: muted)[masked] },
        fill: if j <= i { cache } else { idle }, width: 66pt,
      )),
    )).flatten(),
  )
}, caption: [Each query reads a growing prefix. Causal masking lets all query rows be evaluated together.])

#let chunked-prefill() = panel([Chunked prefill · bound prompt work per iteration], stack(
  dir: ttb, spacing: 11pt,
  grid(columns: (66pt, 1fr), align: horizon,
    [New prompt], stack(dir: ltr, spacing: 8pt,
      tiles(([$x_1$], [$x_2$], [$x_3$], [$x_4$]), fill: prompt, width: 21pt),
      tiles(([$x_5$], [$x_6$], [$x_7$], [$x_8$]), fill: prompt, width: 21pt),
      tiles(([$x_9$], [$x_10$], [$x_11$], [$x_12$]), fill: prompt, width: 21pt))),
  down,
  grid(columns: (66pt, ..(102pt,) * 3), gutter: 6pt, align: horizon,
    [Iteration →], align(center)[1], align(center)[2], align(center)[3],
    [Prefill], tile([$x_1$–$x_4$], fill: prompt, width: 102pt), tile([$x_5$–$x_8$], fill: prompt, width: 102pt), tile([$x_9$–$x_12$], fill: prompt, width: 102pt),
    [Decode A], tile([$a_1$], fill: token, width: 102pt), tile([$a_2$], fill: token, width: 102pt), tile([$a_3$], fill: token, width: 102pt),
    [Decode B], tile([$b_1$], fill: cache, width: 102pt), tile([$b_2$], fill: cache, width: 102pt), tile([$b_3$], fill: cache, width: 102pt)),
), caption: [Each iteration mixes a prompt chunk with one token from each active decode request. Columns illustrate scheduling, not equal wall-clock durations.])

#let speculative-attempt() = panel([Attempt 1 · verify random proposals], stack(
  dir: ttb, spacing: 10pt,
  grid(columns: (102pt, ..(60pt,) * 4), gutter: 7pt, align: horizon,
    [Position], ..range(1, 5).map(i => align(center, str(i))),
    [Random proposals], ..("a", "b", "c", "d").map(x => tile(x, fill: prompt, width: 60pt)),
    [Target samples], tile([a], fill: token, width: 60pt), tile([b], fill: token, width: 60pt), tile([z], fill: reject, width: 60pt), tile([—], fill: idle, width: 60pt),
    [Compare], align(center)[match], align(center)[match], align(center, text(fill: rgb("9b443c"))[stop]), align(center, text(fill: muted)[discard])),
  grid(columns: (102pt, 1fr), gutter: 7pt, align: horizon,
    [Output], tiles(([a], [b], [z]), fill: token, width: 60pt)),
), caption: [The target evaluates proposed contexts in one pass. Keep the matching prefix and the target's first differing token; discard the remaining proposals.])
