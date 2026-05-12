import { readFileSync } from "fs";
import { resolve } from "path";
import * as cheerio from "cheerio";
import { getCollection } from "astro:content";

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

export async function getPostList({ tag, excludeTag, local }: { tag?: string; excludeTag?: string; local?: boolean } = {}) {
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
        local: post.data.local ?? false,
        preview: extractPreview(post.id),
      };
    })
    .filter((p) => (local !== undefined ? p.local === local : true))
    .filter((p) => (tag ? p.tags.includes(tag) : true))
    .filter((p) => (excludeTag ? !p.tags.includes(excludeTag) : true))
    .sort((a, b) => b.dateMs - a.dateMs);
}

export function extractPreview(id: string): string {
  try {
    const raw = readFileSync(resolve("html", id, "index.html"), "utf-8");
    const $ = cheerio.load(raw);
    wrapInlineEquations($);
    $("script, nav, img").remove();

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