import {
  TgdContext,
  TgdFilter,
  TgdFilterScale,
  type TgdFilterOptions,
  TgdPainterFilter,
  TgdPainterFramebuffer,
  TgdPainterLogic,
  TgdTexture2D,
} from "@tolokoban/tgd";

import { createDrawing } from "./drawing";
import { frameImage, normalizeInk } from "./frame";
import { listenToPointer, pointerToGrid } from "./pointer";
import { SIZE } from "./size";
import { binarize, computeLuminances, computeThreshold } from "./threshold";

/** Number of pixels on each side of the captured webcam image, before framing. */
const CAPTURE = 80;

/**
 * Paint the webcam on the canvas as a grid of `SIZE`×`SIZE` cells,
 * each of them being ink (#333) or background (#ddd).
 *
 * The webcam is captured in `CAPTURE`×`CAPTURE` pixels, which are turned into light or dark
 * with the threshold computed at each frame by `computeThreshold()`.
 * Then the ink (the color of the minority of the pixels) is framed in the grid by `frameImage()`.
 *
 * @param onFrame Called at each frame with the cells, row by row from the top: 1 for ink, 0 for background.
 * The same array is reused from one frame to the next.
 * The webcam is off at the beginning: call `setLive(true)` to start it.
 * While it is off, the user can draw on the grid with the pointer.
 *
 * @returns An object to switch the webcam on/off, to clear the cells, and to release the webcam and the WebGL resources.
 */
export function createRetina(
  canvas: HTMLCanvasElement,
  onFrame: (image: Uint8Array) => void,
): Retina {
  // One pixel of the canvas is one physical pixel of the screen, to get sharp lines.
  const context = new TgdContext(canvas, { antialias: false, resolution: 0 });
  const lineWidth = Math.max(1, Math.round(TgdContext.devicePixelRatio));
  const capture = new TgdTexture2D(context, {
    storage: { width: CAPTURE, height: CAPTURE },
    params: { minFilter: "LINEAR", magFilter: "LINEAR" },
  });
  const cells = new TgdTexture2D(context, {
    storage: { format: "R8 / RED / UNSIGNED_BYTE" },
    params: { minFilter: "NEAREST", magFilter: "NEAREST" },
  });
  const pixels = new Uint8Array(CAPTURE * CAPTURE * 4);
  const dark = new Uint8Array(CAPTURE * CAPTURE);
  const image = new Uint8Array(SIZE * SIZE);
  const texels = new Uint8Array(SIZE * SIZE);
  const updateCells = () => {
    onFrame(image);
    for (let i = 0; i < image.length; i++) texels[i] = image[i] * 255;
    cells.loadData(texels, { width: SIZE, height: SIZE });
  };
  // Crop the webcam to a square, mirror it, and downscale it to CAPTURE×CAPTURE pixels.
  const downscale = new TgdPainterFramebuffer(context, {
    textureColor0: capture,
    fixedSize: true,
    depthBuffer: false,
    stencilBuffer: false,
    antiAliasing: false,
    children: [
      // The webcam painter is added first by `startWebcam()`.
      // Read back the CAPTURE×CAPTURE pixels while the framebuffer is still bound.
      new TgdPainterLogic(() => {
        const { gl } = context;
        gl.readPixels(0, 0, CAPTURE, CAPTURE, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        const luminances = computeLuminances(pixels);
        binarize(luminances, computeThreshold(luminances), dark);
        frameImage(normalizeInk(dark), SIZE, image);
        updateCells();
      }),
    ],
  });
  const grid = new TgdPainterFilter(context, {
    texture: cells,
    filters: [
      new TgdFilter({
        ...FILTER_GRID,
        setUniforms: ({ program }) => {
          program.uniform1f("uniLineWidth", lineWidth);
          program.uniform2f("uniCanvasSize", context.width, context.height);
        },
      }),
    ],
  });
  context.add(downscale, grid);
  let webcam: Webcam | null = null;
  // Declared before its use in `stopWebcam()`.
  const drawing = createDrawing(SIZE);
  const startWebcam = () => {
    if (webcam) return;

    // The smallest resolution is enough, since we only keep CAPTURE×CAPTURE pixels.
    const texture = new TgdTexture2D(context).loadWebcam({
      facingMode: "user",
      width: { ideal: 160 },
      height: { ideal: 120 },
    });
    const painter = new TgdPainterFilter(context, {
      texture,
      filters: [new TgdFilterScale({ mode: "cover", scale: [-1, 1] })],
    });
    downscale.addFirst(painter);
    downscale.active = true;
    webcam = { texture, painter };
  };
  // The grid keeps painting the last cells, but the camera is released.
  const stopWebcam = () => {
    if (!webcam) return;

    downscale.active = false;
    downscale.remove(webcam.painter);
    webcam.texture.delete();
    webcam = null;
    // The user can draw over the last frame of the webcam.
    drawing.load(image);
  };
  // When the webcam is off, the user can draw on the grid with the pointer.
  const stopListening = listenToPointer(
    canvas,
    (clientX, clientY) =>
      pointerToGrid(canvas, context.width, context.height, lineWidth, clientX, clientY),
    ([x, y], previous) => {
      if (webcam) return;

      if (previous) drawing.stroke(previous[0], previous[1], x, y);
      else drawing.stamp(x, y);
      drawing.render(image);
      updateCells();
    },
  );
  // The webcam is off until `setLive(true)` is called.
  downscale.active = false;
  updateCells();
  context.play();
  return {
    setLive(live: boolean) {
      if (live) startWebcam();
      else stopWebcam();
    },
    clear() {
      image.fill(0);
      drawing.clear();
      updateCells();
    },
    frame() {
      // The image of the webcam is already framed.
      if (webcam) return;

      drawing.frame(image);
      updateCells();
    },
    destroy() {
      stopListening();
      stopWebcam();
      context.delete();
    },
  };
}

interface Webcam {
  texture: TgdTexture2D;
  painter: TgdPainterFilter;
}

export interface Retina {
  /** Read the webcam (`true`) or keep displaying the last frame (`false`). */
  setLive(live: boolean): void;
  /** Turn all the cells into background. */
  clear(): void;
  /** Frame the drawing like the webcam image, and display it. Nothing happens if the webcam is on. */
  frame(): void;
  /** Stop the webcam and release the WebGL resources. */
  destroy(): void;
}

/**
 * All the cells have the same integer size in pixels, and are separated by `SIZE + 1` lines
 * of `uniLineWidth` pixels. The grid is centered in the canvas, and the remaining pixels are transparent.
 *
 * The first row of the texture of the cells is the top of the grid,
 * but `gl_FragCoord` starts from the bottom.
 */
const FILTER_GRID: Partial<TgdFilterOptions> = {
  name: "PerceptronGrid",
  uniforms: { uniCanvasSize: "vec2", uniLineWidth: "float" },
  fragmentShaderCode: [
    "float side = min(uniCanvasSize.x, uniCanvasSize.y);",
    `float cellSize = max(1.0, floor((side - ${(SIZE + 1).toFixed(1)} * uniLineWidth) / ${SIZE.toFixed(1)}));`,
    "float pitch = cellSize + uniLineWidth;",
    `float gridSize = ${SIZE.toFixed(1)} * pitch + uniLineWidth;`,
    "vec2 offset = floor((uniCanvasSize - vec2(gridSize)) * 0.5);",
    "vec2 pixel = floor(gl_FragCoord.xy) - offset;",
    "if (any(lessThan(pixel, vec2(0.0))) || any(greaterThanEqual(pixel, vec2(gridSize)))) {",
    ["FragColor = vec4(0.0);", "return;"],
    "}",
    "if (any(lessThan(mod(pixel, pitch), vec2(uniLineWidth)))) {",
    ["FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "return;"],
    "}",
    `ivec2 cell = clamp(ivec2(floor(pixel / pitch)), ivec2(0), ivec2(${SIZE - 1}));`,
    `cell.y = ${SIZE - 1} - cell.y;`,
    "float ink = texelFetch(uniTexture, cell, 0).r;",
    "FragColor = vec4(vec3(ink > 0.5 ? 0.2 : 0.867), 1.0);",
  ],
};
