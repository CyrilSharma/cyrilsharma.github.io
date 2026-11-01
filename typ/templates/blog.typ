#import "@preview/cetz:0.4.2"
#import "@preview/deixis:0.2.0": deixis-setup-notes, deixis-endnote, deixis-print-endnotes, deixis-query-notes
#import "/typ/templates/utils.typ": *
#import "/typ/templates/notes.typ": *

#let sys-is-html-target = ("target" in dictionary(std))

// URL citations are collected automatically in the article's References.
#let urlcite(url, title: auto) = [#deixis-endnote[
  #if title == auto { link(url) } else { link(url, title) }
]<blog-urlcite>]

// Mark a block anywhere in the source; main collects it before References.
#let appendix(title: [Untitled], anchor: none, body) = [
  #metadata((title: title, anchor: anchor, body: body))<blog-appendix>
]

// Separate adjacent URL-citation marks without changing article source text.
// Inspect only ordinary content containers; leave deferred content and note
// internals intact so Deixis retains its counters, styles, and backlinks.
#let separate-urlcites(body) = {
  let is-cite(it) = it.at("label", default: none) == <blog-urlcite>
  let visit(it) = {
    if type(it) != content or is-cite(it) { return (body: it, changed: false) }
    let fields = it.fields()
    let changed = false
    let result = it
    if it.func() == [].func() {
      let parts = ()
      let pending-space = ()
      let previous-cite = false
      for child in it.children {
        if child.func() == [ ].func() {
          pending-space.push(child)
          continue
        }
        let current-cite = is-cite(child)
        if previous-cite and current-cite {
          parts.push([#metadata(none)<blog-urlcite-separator>])
          changed = true
        } else { parts += pending-space }
        pending-space = ()
        let nested = visit(child)
        parts.push(nested.body)
        changed = changed or nested.changed
        previous-cite = current-cite
      }
      if changed { result = (parts + pending-space).join() }
    } else if it.has("child") and it.has("styles") {
      let nested = visit(it.child)
      changed = nested.changed
      if changed { result = (it.func())(nested.body, it.styles) }
    } else if it.has("body") {
      let nested = visit(it.body)
      changed = nested.changed
      if changed {
        let _ = fields.remove("body")
        let _ = fields.remove("label", default: none)
        result = if it.func() == link {
          let dest = fields.remove("dest")
          link(dest, nested.body, ..fields)
        } else { (it.func())(nested.body, ..fields) }
      }
    }
    if changed and it.has("label") { result = [#result#it.label] }
    (body: result, changed: changed)
  }
  visit(body).body
}

#let render-appendices() = context {
  let entries = query(metadata.where(label: <blog-appendix>))
  if entries.len() > 0 {
    body_page[
      #heading(numbering: none)[Appendix]
      #for (i, entry) in entries.enumerate() {
        let data = entry.value
        let title = heading(level: 2, numbering: none)[#numbering("A", i + 1). #data.title]
        if data.anchor == none { title } else { [#title#data.anchor] }
        separate-urlcites(data.body)
      }
    ]
  }
}

#let author = "Cyril Sharma"
#set heading(numbering: "1.1.")

#let main(
  title: "Untitled",
  desc: [This is a blog post.],
  date: "2024-08-15",
  updatedDate: "",
  tags: [],
  body,
) = {
  show: deixis-setup-notes
  show metadata.where(label: <blog-urlcite-separator>): _ => [#sym.wj#super[,]]
  // Deixis removes citation marks from outline entries; remove their commas too.
  show outline: it => {
    show metadata.where(label: <blog-urlcite-separator>): _ => []
    it
  }

  // set basic document metadata
  set document(
    author: (author),
    title: title,
  )

  set terms(separator:"\n")
  show terms: it => {
    block(
      above: 16pt,
      below: 16pt,
      fill: rgb("#eceffe"),
      inset: 4pt,
      stroke: 4pt + rgb(147, 186, 255),
      radius: 4pt,
      it
    )
  }

  if not sys-is-html-target {
    // Mimic a Title.
    align(center, text(18pt, weight: "bold", title))
    align(center, block(above: 8pt)[#date.split("T").at(0)])
    align(center, {
      let colors = (
        rgb("f2d7d9"), // Warm blush pink
        rgb("e0e0e0"), // Light gray
        rgb("c9d6d5"), // Muted teal-gray
        rgb("f6e9d7"), // Soft cream
        rgb("d9cfe6"), // Pastel lavender
        rgb("f2d7d9")  // Warm blush pink
      );

      for (i, tag) in tags.enumerate() [
        #box(tag, fill: colors.at(calc.rem(i, colors.len())), radius: 4pt, outset: 4pt)
        #h(1em)
      ]
    })
  }
  
  [
    #metadata((
      title: title,
      author: author,
      desc: desc,
      date: date,
      updatedDate: updatedDate,
      tags: tags,
    )) <frontmatter>
  ]

  // Main body.
  set par(justify: true)

  html_rules[
    #separate-urlcites(body)
    #render-appendices()
    #context if deixis-query-notes(include-types: "endnote").len() > 0 {
      // Deixis preserves each note's declaration styles. Restore the article
      // body style so notes from headings, bold, or italics match one another.
      let reference-text = (
        size: text.size, font: text.font, fill: text.fill,
        weight: "regular", style: "normal",
      )
      let reference-par = (leading: par.leading, spacing: par.spacing, justify: false)
      heading(numbering: none, outlined: true)[References]
      deixis-print-endnotes(clearance: 1em, gap: 0.75em, body-style: it => {
        set text(..reference-text)
        set par(..reference-par)
        it
      })
    }
  ]
}
