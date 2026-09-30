import { justify, type JustifyController } from "justif";
import { hyphenateEnUS } from "justif/hyphenate/en-us";

let controller: JustifyController | undefined;
const desktop = window.matchMedia("(min-width: 641px)");

export function resetJustification() {
  controller?.destroy();
  controller = undefined;
}

export function enhanceJustification() {
  resetJustification();
  // A local comparison switch; production always uses the enhancement.
  if (import.meta.env.DEV && new URLSearchParams(location.search).get("justif") === "off") return;
  if (!desktop.matches) return;
  const paragraphs = [...document.querySelectorAll(".prose p, .prose li")]
    .filter((element) => !element.closest('nav, pre, [role="doc-toc"]'))
    .filter((element) => !element.querySelector("p, ul, ol"))
    .filter((element) => getComputedStyle(element).textAlign === "justify");
  controller = justify(paragraphs, { hyphenate: hyphenateEnUS });
}

desktop.addEventListener("change", enhanceJustification);
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    resetJustification();
    desktop.removeEventListener("change", enhanceJustification);
  });
}
