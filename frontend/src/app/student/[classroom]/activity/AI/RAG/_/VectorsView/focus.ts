import type { TgdAnimation, TgdContext } from "@tolokoban/tgd";

import type { Point3 } from "../projection";

/** Duration of the camera move, in seconds. */
const DURATION = 0.2;
/**
 * Room around the nearest points, relative to their distance to the probe.
 * More than 1, because the labels are written beside the points.
 */
const MARGIN = 1.4;
/** Never zoom so much that the neighbours are lost in a tiny region. */
const MIN_RADIUS = 0.15;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 10;

export interface Focus {
  target: Point3;
  zoom: number;
}

/** No probe: the whole cloud, as at the beginning. */
export const OVERVIEW: Focus = { target: [0, 0, 0], zoom: 1 };

/**
 * Center on the probe, and zoom so that all its neighbours are visible
 * whatever the orientation of the camera: they are inside a sphere
 * around the probe, and this sphere must fit the smallest side of the view.
 */
export function focusOn(context: TgdContext, probe: Point3, neighbours: Point3[]): Focus {
  const radius = Math.max(
    MIN_RADIUS,
    ...neighbours.map((point) => Math.hypot(...point.map((value, k) => value - probe[k]))),
  );
  const { camera } = context;
  // Visible height at `zoom === 1`.
  const height = camera.spaceHeightAtTarget;
  const smallestSide = Math.min(height, height * context.aspectRatio);
  const zoom = smallestSide / (2 * radius * MARGIN);
  return { target: probe, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) };
}

/**
 * Move the camera smoothly to `focus`.
 * @returns The animation, to cancel it if another one starts before its end.
 */
export function animateCamera(context: TgdContext, { target, zoom }: Focus): TgdAnimation {
  const { camera } = context;
  const fromTarget = [...camera.transfo.position] as Point3;
  const fromZoom = camera.zoom;
  const [animation] = context.animSchedule({
    duration: DURATION,
    easingFunction: (x) => x * x * (3 - 2 * x),
    action: (alpha) => {
      camera.transfo.position = fromTarget.map(
        (value, k) => value + (target[k] - value) * alpha,
      ) as Point3;
      // Interpolate the zoom geometrically: zooming from 1 to 4 looks as fast as from 4 to 16.
      camera.zoom = fromZoom * (zoom / fromZoom) ** alpha;
    },
  });
  context.paint();
  return animation;
}
