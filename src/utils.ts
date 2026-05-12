import { readFileSync } from "fs";
import { join, resolve } from "path";
import * as cheerio from "cheerio";
import { getCollection } from "astro:content";

export const SECTION_URL: Record<string, string> = {
  article: "blog",
  notes: "notes",
  local: "local",
};

export async function getPostStaticPaths(section: string) {
  return (await getCollection("blog"))
    .filter((p) => p.data.section === section)
    .map((p) => ({
      params: { slug: p.id },
      props: { file: join("html", p.id, "index.html"), slug: p.id },
    }));
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const lenTags = ["p", "div", "ul", "ol", "dl", "blockquote", "pre", "table", "button"]; 
const blockTags = [...lenTags, "style", "script"];

export function wrapInlineEquations($: cheerio.CheerioAPI) {
  $(".inline-equation").each((_, el) => {
    const next = el.next;
    if (next?.type === "text" && /^[.,;:!?]/.test(next.data ?? "")) {
      const char = next.data[0];
      next.data = next.data.slice(1);
      $(el).replaceWith(`<span style="white-space: nowrap">${$.html(el)}${char}</span>`);
    }
  });
}

export async function getPostList({ section }: { section?: string } = {}) {
  return (await getCollection("blog"))
    .map((post) => {
      const displayDate = post.data.updatedDate ?? post.data.date;
      const dateMs =
        displayDate instanceof Date
          ? displayDate.valueOf()
          : new Date(displayDate as unknown as string).valueOf();
      return {
        id: post.id,
        title: post.data.title,
        date: displayDate,
        dateMs,
        tags: post.data.tags ?? [],
        section: post.data.section,
        preview: extractPreview(post.id),
      };
    })
    .filter((p) => (section !== undefined ? p.section === section : true))
    .sort((a, b) => b.dateMs - a.dateMs);
}

export function extractPreview(id: string): string {
  try {
    const raw = readFileSync(resolve("html", id, "index.html"), "utf-8");
    const $ = cheerio.load(raw);
    wrapInlineEquations($);
    $("script, nav, img, h1, h2, h3").remove();

    const blocks: string[] = [];
    let textLen = 0;
    for (const el of $("body").children().toArray()) {
      let tagName = el.tagName?.toLowerCase();
      if (!blockTags.includes(tagName)) continue;
      const html = $.html(el);
      blocks.push(html);
      if (!lenTags.includes(tagName)) continue;
      textLen += $(el).text().length;
      if (textLen >= 800) break;
    }

    return `<div class="prose">${blocks.join("\n")}</div>`;
  } catch {
    return "";
  }
}