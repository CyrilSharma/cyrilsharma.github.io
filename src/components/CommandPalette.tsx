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

export default function CommandPalette({ posts }: { posts: PalettePost[] }) {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

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
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cp-close" onClick={hide} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <Command>
              <Command.Input placeholder="Where to?" autoFocus />
              <Command.List>
                <Command.Empty>No pages found.</Command.Empty>
                {posts.map((post) => (
                  <Command.Item
                    key={post.id}
                    value={`${post.title} ${post.url}`}
                    onSelect={() => {
                      hide();
                      window.location.href = post.url;
                    }}
                  >
                    <span className="cp-title">{post.title}</span>
                    <span className="cp-badge">{SECTION_LABEL[post.section] ?? post.section}</span>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
