import { Command } from "cmdk";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface PalettePost {
  id: string;
  title: string;
  section: string;
  url: string;
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

export default function CommandPalette({ posts, dev }: { posts: PalettePost[]; dev: boolean }) {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
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
            <Command onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const ev = new KeyboardEvent("keydown", { key: e.shiftKey ? "ArrowUp" : "ArrowDown", bubbles: true });
                e.currentTarget.dispatchEvent(ev);
              }
            }}>
              <div className="cp-input-row">
                <Command.Input placeholder="Where to?" autoFocus onBlur={hide} />
                <button className="cp-close" onClick={hide} aria-label="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Command.List>
                <Command.Empty>No pages found.</Command.Empty>
                <Command.Group heading="Pages">
                  {[...MAIN_PAGES, ...(dev ? DEV_PAGES : [])].map((page) => (
                    <Command.Item
                      key={page.url}
                      value={page.label}
                      onSelect={() => { hide(); window.location.href = page.url; }}
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
                      onSelect={() => { hide(); window.location.href = post.url; }}
                    >
                      <span className="cp-title">{post.title}</span>
                      <span className="cp-badge">{SECTION_LABEL[post.section] ?? post.section}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
