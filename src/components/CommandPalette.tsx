import { Command } from "cmdk";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface PaletteItem {
  label: string;
  href: string;
  group: "page" | "post" | "heading" | "command";
  badge?: string;
  indent?: number;
  postId?: string;
  keywords?: string;
}

export default function CommandPalette({
  items,
  currentPostId,
}: {
  items: PaletteItem[];
  currentPostId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const headingMode = query.startsWith("#");
  const commandMode = query.startsWith(">");
  const headingQuery = headingMode ? query.slice(1).toLowerCase() : "";
  const commandQuery = commandMode ? query.slice(1).toLowerCase().trim() : "";
  const onContentPage = items.some(i => i.group === "heading" && i.postId === currentPostId);
  const crossPost = headingMode && !onContentPage;

  const show = useCallback(() => { setQuery(""); setOpen(true); }, []);
  const hide = useCallback(() => { setOpen(false); setQuery(""); }, []);

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

  const visibleItems = headingMode
    ? onContentPage
      ? items.filter(i =>
          i.group === "heading" &&
          i.postId === currentPostId &&
          i.label.toLowerCase() !== "outline" &&
          (!headingQuery || i.label.toLowerCase().includes(headingQuery))
        )
      : headingQuery
        ? items.filter(i =>
            i.group === "heading" &&
            (i.label.toLowerCase().includes(headingQuery) || i.badge?.toLowerCase().includes(headingQuery))
          )
        : []
    : commandMode
      ? items.filter(i =>
          i.group === "command" &&
          (!commandQuery || i.label.toLowerCase().includes(commandQuery))
        )
      : items.filter(i => i.group !== "heading" && i.group !== "command");

  const navigate = useCallback((href: string) => {
    hide();
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    } else {
      window.location.href = href;
    }
  }, [hide]);

  const placeholder = headingMode ? "Jump to heading…" : commandMode ? "Run command…" : "Where to?";

  const emptyMsg = headingMode
    ? (!onContentPage && !headingQuery ? "Type to search headings across posts." : "No headings found.")
    : commandMode
      ? "No commands found."
      : "No pages found.";

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
              loop
              shouldFilter={!headingMode && !commandMode}
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
                  placeholder={placeholder}
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
                  <Command.Group heading={onContentPage ? "Headings" : "Headings — all posts"}>
                    {visibleItems.map((item, i) => (
                      <Command.Item key={i} value={item.label} onSelect={() => navigate(item.href)}>
                        <span
                          className="cp-title cp-title--heading"
                          style={item.indent ? { paddingLeft: `${item.indent}rem` } : undefined}
                        >
                          {item.label}
                        </span>
                        {crossPost && item.badge && <span className="cp-badge">{item.badge}</span>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : commandMode ? (
                  <Command.Group heading="Commands">
                    {visibleItems.map((item) => (
                      <Command.Item key={item.href} value={item.label} onSelect={() => navigate(item.href)}>
                        <span className="cp-title">{item.label}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : (
                  <>
                    <Command.Group heading="Pages">
                      {visibleItems.filter(i => i.group === "page").map((item) => (
                        <Command.Item key={item.href} value={item.label} onSelect={() => navigate(item.href)}>
                          <span className="cp-title cp-title--page">{item.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                    <Command.Group heading="Posts">
                      {visibleItems.filter(i => i.group === "post").map((item) => (
                        <Command.Item key={item.href} value={item.keywords ?? item.label} onSelect={() => navigate(item.href)}>
                          <span className="cp-title">{item.label}</span>
                          {item.badge && <span className="cp-badge">{item.badge}</span>}
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
