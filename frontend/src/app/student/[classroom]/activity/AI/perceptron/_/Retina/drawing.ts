import { frameImage } from "./frame";

/** Number of sub-cells on each side of a cell, to measure how much of a cell is covered by the disks. */
const SUB = 8;

/** Diameter of the disk painted by the pointer, in cells. */
export const BRUSH_DIAMETER = 2.2;

export interface Drawing {
  /** Erase everything. */
  clear(): void;
  /** Start from an image (1 for ink, 0 for background): its ink cells are fully covered. */
  load(image: Uint8Array): void;
  /** Paint a disk centered on `(x, y)`, in cells from the top-left corner of the grid. */
  stamp(x: number, y: number): void;
  /** Paint disks all along the segment from `(x0, y0)` to `(x1, y1)`. */
  stroke(x0: number, y0: number, x1: number, y1: number): void;
  /** Write the cells into `image`: 1 if more than 50% of the cell is covered, 0 otherwise. */
  render(image: Uint8Array): void;
  /**
   * Crop, scale and center the drawing like the webcam image (see `frameImage()`),
   * write it into `image`, and keep drawing on the framed version.
   */
  frame(image: Uint8Array): void;
}

/**
 * The surface on which the user draws with the pointer, as a grid of `size`×`size` cells.
 */
export function createDrawing(size: number): Drawing {
  const side = size * SUB;
  const mask = new Uint8Array(side * side);
  const radius = BRUSH_DIAMETER / 2;
  const stamp = (x: number, y: number) => {
    // Sub-cell (i, j) is covered if its center is in the disk.
    const cx = x * SUB - 0.5;
    const cy = y * SUB - 0.5;
    const r = radius * SUB;
    const r2 = r * r;
    const i0 = Math.max(0, Math.ceil(cx - r));
    const i1 = Math.min(side - 1, Math.floor(cx + r));
    const j0 = Math.max(0, Math.ceil(cy - r));
    const j1 = Math.min(side - 1, Math.floor(cy + r));
    for (let j = j0; j <= j1; j++) {
      const dy = j - cy;
      for (let i = i0; i <= i1; i++) {
        const dx = i - cx;
        if (dx * dx + dy * dy <= r2) mask[j * side + i] = 1;
      }
    }
  };
  return {
    clear() {
      mask.fill(0);
    },
    load(image: Uint8Array) {
      for (let j = 0; j < side; j++) {
        const row = Math.floor(j / SUB) * size;
        for (let i = 0; i < side; i++) mask[j * side + i] = image[row + Math.floor(i / SUB)];
      }
    },
    stamp,
    stroke(x0: number, y0: number, x1: number, y1: number) {
      // A step of a quarter of the radius makes a smooth line.
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (radius / 4)));
      for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        stamp(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
      }
    },
    frame(image: Uint8Array) {
      // Framing the sub-cells is more precise than framing the cells.
      frameImage(mask, size, image);
      this.load(image);
    },
    render(image: Uint8Array) {
      const half = (SUB * SUB) / 2;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let count = 0;
          for (let j = y * SUB; j < (y + 1) * SUB; j++) {
            for (let i = x * SUB; i < (x + 1) * SUB; i++) count += mask[j * side + i];
          }
          image[y * size + x] = count > half ? 1 : 0;
        }
      }
    },
  };
}
