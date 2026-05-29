import { Command } from "cmdk";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface PalettePost {
  id: string;
  title: string;
  section: string;
  url: string;
}

export interface PaletteHeading {
  text: string;
  level: number;
  slug: string;
  postId: string;
  postTitle: string;
  postUrl: string;
}

const SECTION_LABEL: Record<string, string> = {
  article: "Blog",
  notes: "Notes",
  local: "Local",
};

const MAIN_PAGES = [
  { label: "Blog",  url: "/blog"  },
  { label: "Notes", url: "/notes" },
];

const DEV_PAGES = [
  { label: "Local", url: "/local" },
];

interface LocalHeading { text: string; level: number; slug: string }

interface ShownHeading { text: string; level: number; href: string; context?: string }

export default function CommandPalette({
  posts,
  dev,
  postHeadings,
}: {
  posts: PalettePost[];
  dev: boolean;
  postHeadings: PaletteHeading[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pageHeadings, setPageHeadings] = useState<LocalHeading[]>([]);

  const headingMode = query.startsWith("#");
  const headingQuery = headingMode ? query.slice(1).toLowerCase() : "";
  const onContentPage = pageHeadings.length > 0;

  const show = useCallback(() => { setQuery(""); setOpen(true); }, []);
  const hide = useCallback(() => { setOpen(false); setQuery(""); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const hs: LocalHeading[] = [];
      document.querySelectorAll(".prose h2, .prose h3, .prose h4, .prose h5, .prose h6").forEach((el) => {
        if (el.id) hs.push({ text: el.textContent?.trim() ?? "", level: parseInt(el.tagName[1]), slug: el.id });
      });
      setPageHeadings(hs);
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { hide(); return; }
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        show();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [show, hide]);

  const shownHeadings: ShownHeading[] = headingMode
    ? onContentPage
      ? pageHeadings
          .filter((h) => h.text.toLowerCase() !== "outline" && (!headingQuery || h.text.toLowerCase().includes(headingQuery)))
          .map((h) => ({ text: h.text, level: h.level, href: `#${h.slug}` }))
      : headingQuery.length > 0
        ? postHeadings
            .filter((h) =>
              h.text.toLowerCase().includes(headingQuery) ||
              h.postTitle.toLowerCase().includes(headingQuery),
            )
            .map((h) => ({ text: h.text, level: h.level, href: `${h.postUrl}#${h.slug}`, context: h.postTitle }))
        : []
    : [];

  const navigate = useCallback((href: string) => {
    hide();
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        const headerH = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    } else {
      window.location.href = href;
    }
  }, [hide]);

  const emptyMsg = headingMode
    ? (!onContentPage && !headingQuery ? "Type to search headings across posts." : "No headings found.")
    : "No pages found.";

  const groupLabel = headingMode
    ? (onContentPage ? "Headings" : "Headings — all posts")
    : "";

  return (
    <>
      <button onClick={show} className="cp-trigger" aria-label="Search (/)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && createPortal(
        <div className="cp-backdrop" onClick={hide}>
          <div className="cp-modal" onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
            <Command
              shouldFilter={!headingMode}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const ev = new KeyboardEvent("keydown", { key: e.shiftKey ? "ArrowUp" : "ArrowDown", bubbles: true });
                  e.currentTarget.dispatchEvent(ev);
                }
              }}
            >
              <div className="cp-input-row">
                <Command.Input
                  placeholder={headingMode ? "Jump to heading…" : "Where to?"}
                  autoFocus
                  onBlur={hide}
                  value={query}
                  onValueChange={setQuery}
                />
                <button className="cp-close" onClick={hide} aria-label="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Command.List>
                <Command.Empty>{emptyMsg}</Command.Empty>
                {headingMode ? (
                  <Command.Group heading={groupLabel}>
                    {shownHeadings.map((h, i) => (
                      <Command.Item
                        key={i}
                        value={h.text}
                        onSelect={() => navigate(h.href)}
                      >
                        <span
                          className="cp-title cp-title--heading"
                          style={{ paddingLeft: `${(h.level - 2) * 0.9}rem` }}
                        >
                          {h.text}
                        </span>
                        {h.context && <span className="cp-badge">{h.context}</span>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : (
                  <>
                    <Command.Group heading="Pages">
                      {[...MAIN_PAGES, ...(dev ? DEV_PAGES : [])].map((page) => (
                        <Command.Item
                          key={page.url}
                          value={page.label}
                          onSelect={() => navigate(page.url)}
                        >
                          <span className="cp-title cp-title--page">{page.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    <Command.Group heading="Posts">
                      {posts.map((post) => (
                        <Command.Item
                          key={post.id}
                          value={`${post.title} ${post.url}`}
                          onSelect={() => navigate(post.url)}
                        >
                          <span className="cp-title">{post.title}</span>
                          <span className="cp-badge">{SECTION_LABEL[post.section] ?? post.section}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  </>
                )}
              </Command.List>
            </Command>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
