// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import react from "@astrojs/react";
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import * as cheerio from "cheerio";

import { BASE_PATH } from "./src/site.mjs";

const meta = JSON.parse(fs.readFileSync("./meta.json", "utf8"));
const rawPages = meta
  .filter((v) => v.section !== "local")
  .map((v) => `https://cyrilsharma.github.io${BASE_PATH}/${v.section}/${v.slug}/raw.txt`);

// https://astro.build/config
export default defineConfig({
  // Deploys to GitHub Pages
  site: "https://cyrilsharma.github.io",
  base: BASE_PATH || "/",

  integrations: [
    sitemap({ customPages: rawPages }),
    icon({
      include: ["mdi"],
    }),
    react(),
  ],
  vite: {
    plugins: [
      {
        name: "watch-html-content",
        configureServer(server) {
          const SKIP = new Set(["style", "script"]);
          function parseElements(bodyHtml) {
            const $ = cheerio.load(bodyHtml);
            return $("body").children().toArray()
              .filter(el => !SKIP.has(el.tagName?.toLowerCase()))
              .map(el => $.html(el));
          }

          // Pre-populate cache from all existing html files
          const elementCache = new Map(); // "section/slug" -> string[]
          if (fs.existsSync("./html")) {
            for (const section of fs.readdirSync("./html")) {
              const sectionPath = `html/${section}`;
              if (!fs.statSync(sectionPath).isDirectory()) continue;
              for (const slug of fs.readdirSync(sectionPath)) {
                const f = `${sectionPath}/${slug}/index.html`;
                if (fs.existsSync(f)) {
                  const body = fs.readFileSync(f, "utf8")
                    .match(/<body[^>]*>([\s\S]*?)<\/body>/is)?.[1] ?? "";
                  elementCache.set(`${section}/${slug}`, parseElements(body));
                }
              }
            }
          }

          const TYP_DIRS = {
            "content/blog": "blog",
            "content/notes": "notes",
            "local/article": "local",
          };

          server.watcher.add(`./html/**/*.html`);
          for (const dir of Object.keys(TYP_DIRS)) server.watcher.add(`./${dir}`);

          server.watcher.on("add", (file) => {
            if (!file.endsWith(".typ")) return;
            if (!Object.keys(TYP_DIRS).some(d => file.includes(d))) return;
            console.log(`[make] new file detected: ${file}, running make...`);
            const proc = spawn("make", [], { stdio: "inherit" });
            proc.on("exit", (code) => {
              if (code === 0) console.log("[make] done");
              else console.error(`[make] exited with code ${code}`);
            });
          });
          server.watcher.on("change", (file) => {
            if (!file.endsWith(".typ")) return;
            const dir = Object.keys(TYP_DIRS).find(d => file.includes(d));
            if (!dir) return;
            const prefix = TYP_DIRS[dir];
            const slug = path.basename(file, ".typ");
            server.ws.send({ type: "custom", event: "typst-navigate", data: { prefix, slug } });
          });
          const typstWatchers = new Map();
          server.middlewares.use((req, _res, next) => {
            const match = req.url?.match(/^\/(blog|notes|local)\/([^/?@]+)\//);
            if (!match) return next();
            const [, urlPrefix, slug] = match;
            const watchKey = `${urlPrefix}/${slug}`;
            if (typstWatchers.has(watchKey)) return next();
            const typDirMap = /** @type {Record<string,string>} */({ blog: "content/blog", notes: "content/notes", local: "local/article" });
            const typFile = `${typDirMap[urlPrefix]}/${slug}.typ`;
            if (fs.existsSync(typFile)) {
              fs.mkdirSync(`html/${urlPrefix}/${slug}`, { recursive: true });
              server.watcher.add(`./html/${urlPrefix}/${slug}/index.html`);
              console.log(`[typst] starting watch for ${watchKey}`);
              const proc = spawn(
                "typst",
                ["watch", typFile, `html/${urlPrefix}/${slug}/index.html`,
                 "--format", "html", "--features", "html", "--root", "."],
                { stdio: "inherit" }
              );
              proc.on("exit", (code) => {
                console.log(`[typst] watch for ${watchKey} exited with code ${code}`);
                typstWatchers.delete(watchKey);
              });
              typstWatchers.set(watchKey, proc);
            }
            next();
          });
          const pending = new Map();
          server.watcher.on("change", (file) => {
            if (!file.includes("/html/")) return;
            const slugMatch = file.match(/\/html\/([^/]+)\/([^/]+)\//);
            if (!slugMatch) return;
            const [, section, slug] = slugMatch;
            const cacheKey = `${section}/${slug}`;
            if (pending.has(file)) clearTimeout(pending.get(file));
            pending.set(
              file,
              setTimeout(() => {
                pending.delete(file);
                const full = fs.readFileSync(file, "utf8");
                const body = full.match(/<body[^>]*>([\s\S]*?)<\/body>/is)?.[1] ?? full;
                const newElements = parseElements(body);
                const oldElements = elementCache.get(cacheKey) ?? [];
                elementCache.set(cacheKey, newElements);

                let scrollIndex = -1;
                for (let i = 0; i < Math.max(oldElements.length, newElements.length); i++) {
                  if (oldElements[i] !== newElements[i]) { scrollIndex = i; break; }
                }

                server.ws.send({
                  type: "custom",
                  event: "typst-update",
                  data: { content: body, scrollIndex },
                });
              }, 150)
            );
          });
        },
      },
    ],
  },
});
