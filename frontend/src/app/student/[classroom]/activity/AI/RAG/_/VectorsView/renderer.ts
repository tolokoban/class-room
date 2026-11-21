import {
  type TgdAnimation,
  TgdCameraPerspective,
  TgdContext,
  TgdControllerCameraOrbit,
  TgdPainterClear,
  TgdPainterGroup,
  TgdPainterLogic,
  TgdPainterState,
  TgdTexture2D,
  tgdCanvasCreatePalette,
} from "@tolokoban/tgd";

import type { Point3 } from "../projection";
import { Bloom } from "./bloom";
import { animateCamera, focusOn, OVERVIEW } from "./focus";
import { drawOverlay } from "./overlay";
import {
  type Highlight,
  hoveredSphere,
  makeCubePainter,
  makeGlowPainters,
  makeHighlightPainters,
  makePointsPainter,
  probeHighlight,
} from "./painters";
import { paletteColors } from "./scene";
import type { Palette, Probe, ScenePoint, ScreenPoint } from "./types";

/** Radians per second. */
const AUTO_ROTATION_SPEED = 0.2;
/** Max distance, in CSS pixels, between the pointer and a point to show its text. */
const HOVER_RADIUS = 10;

/**
 * The 3D view, painted with WebGL (`@tolokoban/tgd`).
 * The texts are painted on the `overlay` canvas, see `overlay.ts`.
 */
export class VectorsRenderer {
  private readonly context: TgdContext;
  private readonly orbit: TgdControllerCameraOrbit;
  /** One pixel per color, see `paletteColors()`. */
  private readonly texture: TgdTexture2D;
  private readonly pointsGroup = new TgdPainterGroup();
  private readonly probeGroup = new TgdPainterGroup();
  private readonly bloom: Bloom;
  private scene: ScenePoint[] = [];
  private probe: Probe | null = null;
  private probePoint: Point3 | null = null;
  private hovered = -1;
  /** Auto rotation stops for good as soon as the student moves the view, or types a sentence. */
  private rotationStopped = false;
  private pointerInside = false;
  /** The camera move in progress, if any. */
  private cameraAnimation: TgdAnimation | null = null;
  /** Positions on the canvas of the scene's points, at the last frame. */
  private screen: ScreenPoint[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private readonly overlay: HTMLCanvasElement,
    private readonly palette: Palette,
  ) {
    const camera = new TgdCameraPerspective({ near: 0.1, far: 100, transfo: { distance: 6 } });
    camera.fitSpaceAtTarget(3.2, 3.2);
    camera.transfo.orbitAroundY(0.6).orbitAroundX(-0.35);
    const context = new TgdContext(canvas, { camera, resolution: 0 });
    this.context = context;
    this.texture = new TgdTexture2D(context, {
      params: { minFilter: "NEAREST", magFilter: "NEAREST" },
    }).loadBitmap(tgdCanvasCreatePalette(paletteColors(palette)));
    // The scene is painted in a framebuffer, see `bloom.ts`.
    this.bloom = new Bloom(context, [
      new TgdPainterClear(context, {
        color: [0.0, 0.0, 0.0, 1],
        depth: 1,
      }),
      new TgdPainterState(context, {
        depth: "less",
        children: [makeCubePainter(context, this.texture), this.pointsGroup, this.probeGroup],
      }),
    ]);
    context.add(
      new TgdPainterLogic((_time, delta) => {
        if (this.rotating) camera.transfo.orbitAroundY(AUTO_ROTATION_SPEED * delta);
      }),
      ...this.bloom.painters,
    );
    context.eventPaint.addListener(this.paintOverlay);
    this.orbit = new TgdControllerCameraOrbit(context, { inertiaOrbit: 1000 });
    this.orbit.eventChange.addListener(() => {
      this.stopRotation();
    });
    this.updatePlaying();
  }

  setScene(scene: ScenePoint[]) {
    this.scene = scene;
    this.pointsGroup.removeAll(true);
    if (scene.length > 0) {
      this.pointsGroup.add(makePointsPainter(this.context, this.texture, scene));
    }
    this.setProbe(this.probe, this.probePoint);
  }

  setProbe(probe: Probe | null, probePoint: Point3 | null) {
    // The student must be able to look at the sentence and its neighbours.
    if (probe) this.stopRotation();
    this.probe = probe;
    this.probePoint = probePoint;
    this.probeGroup.removeAll(true);
    if (probe && probePoint && this.scene.length > 0) {
      const { context, texture, scene } = this;
      const highlight = probeHighlight(scene, probe, probePoint);
      this.probeGroup.add(...makeHighlightPainters(context, texture, highlight));
    }
    this.updateGlow();
    this.bloom.setDimmed(probe !== null);
    this.focus();
  }

  /**
   * The highlighted objects glow: the sentence, its closest points,
   * the links between them, and the hovered point.
   * The rest of the scene is dimmed only when there is a sentence,
   * otherwise the whole view would flicker while the pointer moves over the points.
   */
  private updateGlow() {
    const { context, texture, scene, probe, probePoint, hovered } = this;
    const highlight: Highlight =
      probe && probePoint ? probeHighlight(scene, probe, probePoint) : { spheres: [], links: [] };
    if (hovered >= 0 && hovered < scene.length)
      highlight.spheres.push(hoveredSphere(scene[hovered]));
    const empty = highlight.spheres.length === 0;
    this.bloom.setGlowing(empty ? [] : makeGlowPainters(context, texture, highlight));
  }

  /**
   * Center the camera on the student's sentence, and zoom to see its nearest points.
   * Without a sentence, show the whole cloud.
   */
  private focus() {
    const { context, scene, probe, probePoint } = this;
    if (this.cameraAnimation) context.animCancel(this.cameraAnimation);
    const neighbours = (probe?.neighbours ?? [])
      .map(({ offset }) => scene.find((point) => point.offset === offset)?.position)
      .filter((position) => position !== undefined);
    const focus =
      probePoint && neighbours.length > 0 ? focusOn(context, probePoint, neighbours) : OVERVIEW;
    this.cameraAnimation = animateCamera(context, focus);
  }

  /** The auto rotation is paused while the pointer is over the view, to read the texts. */
  setPointerInside(inside: boolean) {
    this.pointerInside = inside;
    if (!inside && this.hovered !== -1) {
      this.hovered = -1;
      this.updateGlow();
    }
    this.updatePlaying();
  }

  /**
   * @param x Position of the pointer relative to the canvas, in CSS pixels.
   */
  hover(x: number, y: number) {
    const dpr = this.overlay.width / Math.max(1, this.overlay.clientWidth);
    let best = -1;
    let bestDistance = HOVER_RADIUS * dpr;
    this.screen.forEach((point, index) => {
      const distance = Math.hypot(point.x - x * dpr, point.y - y * dpr);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    if (best === this.hovered) return;

    this.hovered = best;
    this.updateGlow();
    this.context.paint();
  }

  delete() {
    this.context.eventPaint.removeListener(this.paintOverlay);
    this.orbit.detach();
    this.texture.delete();
    this.context.delete();
  }

  private get rotating() {
    return !this.rotationStopped && !this.pointerInside;
  }

  private stopRotation() {
    this.rotationStopped = true;
    this.updatePlaying();
  }

  private updatePlaying() {
    if (this.rotating) this.context.play();
    else {
      this.context.pause();
      this.context.paint();
    }
  }

  private readonly paintOverlay = () => {
    const { overlay, context, scene, probe, probePoint, hovered, palette } = this;
    const dpr = TgdContext.devicePixelRatio;
    const width = Math.round(overlay.clientWidth * dpr);
    const height = Math.round(overlay.clientHeight * dpr);
    if (overlay.width !== width || overlay.height !== height) {
      overlay.width = width;
      overlay.height = height;
    }
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    const toScreen = (point: Point3): ScreenPoint => {
      const v = context.camera.apply(point);
      return { x: ((1 + v.x / v.w) * width) / 2, y: ((1 - v.y / v.w) * height) / 2 };
    };
    this.screen = scene.map(({ position }) => toScreen(position));
    drawOverlay(ctx, {
      scene,
      screen: this.screen,
      probe,
      probeScreen: probePoint ? toScreen(probePoint) : null,
      hovered,
      background: palette.background,
      text: palette.text,
      dpr,
    });
  };
}
