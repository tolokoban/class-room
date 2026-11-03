import { SIZE } from "./size";

/**
 * Convert a pointer position into grid coordinates, in cells from the top-left corner.
 * It must match the geometry of the grid painted by the `FILTER_GRID` shader.
 *
 * @param width Width of the canvas in pixels.
 * @param height Height of the canvas in pixels.
 * @param lineWidth Width of the lines between the cells, in pixels.
 */
export function pointerToGrid(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  lineWidth: number,
  clientX: number,
  clientY: number,
): [x: number, y: number] {
  const rect = canvas.getBoundingClientRect();
  const px = ((clientX - rect.left) * width) / rect.width;
  // The shader counts the pixels from the bottom.
  const py = ((rect.bottom - clientY) * height) / rect.height;
  const side = Math.min(width, height);
  const cellSize = Math.max(1, Math.floor((side - (SIZE + 1) * lineWidth) / SIZE));
  const pitch = cellSize + lineWidth;
  const gridSize = SIZE * pitch + lineWidth;
  const offsetX = Math.floor((width - gridSize) / 2);
  const offsetY = Math.floor((height - gridSize) / 2);
  return [(px - offsetX - lineWidth / 2) / pitch, SIZE - (py - offsetY - lineWidth / 2) / pitch];
}

/**
 * Call `onDraw` with the grid coordinates of the pointer, as long as it touches the canvas.
 * The previous coordinates are `undefined` for the first touch.
 *
 * @returns A function that removes the listeners.
 */
export function listenToPointer(
  canvas: HTMLCanvasElement,
  toGrid: (clientX: number, clientY: number) => [number, number],
  onDraw: (current: [number, number], previous?: [number, number]) => void,
): () => void {
  let previous: [number, number] | undefined;
  const handleDown = (evt: PointerEvent) => {
    canvas.setPointerCapture(evt.pointerId);
    previous = toGrid(evt.clientX, evt.clientY);
    onDraw(previous);
  };
  const handleMove = (evt: PointerEvent) => {
    if (!previous) return;

    const current = toGrid(evt.clientX, evt.clientY);
    onDraw(current, previous);
    previous = current;
  };
  const handleUp = () => {
    previous = undefined;
  };
  canvas.addEventListener("pointerdown", handleDown);
  canvas.addEventListener("pointermove", handleMove);
  canvas.addEventListener("pointerup", handleUp);
  canvas.addEventListener("pointercancel", handleUp);
  return () => {
    canvas.removeEventListener("pointerdown", handleDown);
    canvas.removeEventListener("pointermove", handleMove);
    canvas.removeEventListener("pointerup", handleUp);
    canvas.removeEventListener("pointercancel", handleUp);
  };
}
