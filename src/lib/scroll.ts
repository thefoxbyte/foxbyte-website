import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -60 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop(top = 0) {
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: "smooth" });
}

export async function copyText(text: string, fallbackNode?: Node | null): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    if (!fallbackNode) return;
    const range = document.createRange();
    range.selectNodeContents(fallbackNode);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}
