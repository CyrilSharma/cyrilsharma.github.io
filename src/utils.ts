import { readFileSync } from "fs";
import { join, resolve } from "path";
import * as cheerio from "cheerio";
import { getCollection } from "astro:content";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

function addHeadingIds($: cheerio.CheerioAPI): void {
  const counts: Record<string, number> = {};
  $("h2, h3, h4, h5, h6").each((_, el) => {
    if ($(el).attr("id")) return;
    const base = slugify($(el).text().trim());
    const n = counts[base] ?? 0;
    counts[base] = n + 1;
    $(el).attr("id", n === 0 ? base : `${base}-${n}`);
  });
}

function loadAndProcess(filePath: string): cheerio.CheerioAPI {
  const $ = cheerio.load(readFileSync(filePath, "utf-8"));
  wrapInlineEquations($);
  addHeadingIds($);
  return $;
}

export function processPostHtml(file: string): string {
  return loadAndProcess(file).html();
}

export function extractHeadings(
  id: string,
  postTitle: string,
  postUrl: string,
): Array<{ text: string; level: number; slug: string; postId: string; postTitle: string; postUrl: string }> {
  try {
    const $ = loadAndProcess(resolve("html", id, "index.html"));
    const result: ReturnType<typeof extractHeadings> = [];
    $("h2, h3, h4, h5, h6").each((_, el) => {
      result.push({
        text: $(el).text().trim(),
        level: parseInt(el.tagName.slice(1)),
        slug: $(el).attr("id") ?? "",
        postId: id,
        postTitle,
        postUrl,
      });
    });
    return result;
  } catch {
    return [];
  }
}

export const SECTION_URL: Record<string, string> = {
  blog: "blog",
  notes: "notes",
  local: "local",
};

export async function getPostStaticPaths(section: string) {
  return (await getCollection("blog"))
    .filter((p) => p.data.section === section)
    .map((p) => ({
      params: { slug: p.data.slug },
      props: { file: join("html", p.id, "index.html"), slug: p.id },
    }));
}

export const formatDate = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.valueOf()) ? "" : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

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
        slug: post.data.slug,
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
    const $ = loadAndProcess(resolve("html", id, "index.html"));
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