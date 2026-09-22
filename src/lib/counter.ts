// Tiny external store so scroll-driven sections can update the frame's
// "01 / 06 — Collection" counter without re-rendering the whole page.
let value = "00";
const listeners = new Set<() => void>();

export const counter = {
  get: () => value,
  getServer: () => "00",
  set(next: string) {
    if (next === value) return;
    value = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
