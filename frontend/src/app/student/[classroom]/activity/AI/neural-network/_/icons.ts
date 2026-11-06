import { type Item, ITEMS } from "./model";

export const ICONS: Record<Item, string> = {
  spade: "♠️",
  heart: "♥️",
  diamond: "♦️",
  club: "♣️",
};

/**
 * Icon of the item guessed by the network (`-1` means a tie: no guess).
 */
export function guessIcon(guess: number): string {
  const item = ITEMS[guess];
  return item ? ICONS[item] : "?";
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(0);
}

export function formatBinary(index: number): string {
  return index.toString(2).padStart(3, "0");
}
