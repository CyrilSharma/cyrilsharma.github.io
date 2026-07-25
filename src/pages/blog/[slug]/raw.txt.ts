import fs from "node:fs";
import path from "node:path";
import { getPostStaticPaths } from "../../../utils";

export async function getStaticPaths() {
  return getPostStaticPaths("blog");
}

export async function GET({ params }: { params: { slug: string } }) {
  const file = path.join("content/articles", `blog.${params.slug}.typ`);
  const content = fs.readFileSync(file, "utf8");
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
