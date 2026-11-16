import {
  TgdColor,
  type TgdContext,
  TgdMaterialFlat,
  TgdMaterialSolid,
  TgdPainterLines,
  TgdPainterPointsCloud,
  TgdPainterSegments,
  TgdPainterSegmentsData,
  type TgdTexture2D,
} from "@tolokoban/tgd";

import type { Neighbour } from "../game";
import type { Point3 } from "../projection";
import { CUBE_COLOR_INDEX, CUBE_EDGES, paletteU, PROBE_COLOR_INDEX } from "./scene";
import type { Probe, ScenePoint } from "./types";

/** Radii, in the units of the scene (the questions span [-1, +1]). */
const POINT_RADIUS = 0.03;
const NEIGHBOUR_RADIUS = 0.055;
const PROBE_RADIUS = 0.07;
const LINK_RADIUS = 0.01;
/** For the bloom, the highlighted objects are painted bigger than they are. */
const GLOW_RADIUS = 1.6;
/** Not from the theme: green and red must keep their usual meaning. */
const NEAR_LINK_COLOR = "#3d3";
const FAR_LINK_COLOR = "#e33";

export interface Sphere {
  position: Point3;
  radius: number;
  colorIndex: number;
}

/**
 * @param texture Palette texture, see `paletteColors()`.
 * @param flat Uniform color, without shading (for the bloom).
 */
export function makeSpheres(
  context: TgdContext,
  texture: TgdTexture2D,
  spheres: Sphere[],
  flat = false,
) {
  return new TgdPainterPointsCloud(context, {
    dataPoint: new Float32Array(spheres.flatMap(({ position, radius }) => [...position, radius])),
    dataUV: new Float32Array(spheres.flatMap(({ colorIndex }) => [paletteU(colorIndex), 0.5])),
    texture,
    specularIntensity: 0.5,
    fragCode: flat ? TgdPainterPointsCloud.fragCodeFlat() : undefined,
  });
}

/** The spheres and links to highlight: they are painted with a bloom effect. */
export interface Highlight {
  spheres: Sphere[];
  links: Link[];
}

export interface Link {
  from: Point3;
  to: Point3;
  /** CSS color. */
  color: string;
}

/**
 * The student's sentence, its closest questions and its farthest question,
 * bigger than the other spheres, and the links between them:
 * green to the closest questions, red to the farthest.
 */
export function probeHighlight(scene: ScenePoint[], probe: Probe, probePoint: Point3): Highlight {
  const neighbours = findPoints(scene, probe.neighbours);
  const farthest = findPoints(scene, probe.farthest ? [probe.farthest] : []);
  const toSphere = ({ position, group }: ScenePoint): Sphere => ({
    position,
    radius: NEIGHBOUR_RADIUS,
    colorIndex: group,
  });
  return {
    spheres: [
      { position: probePoint, radius: PROBE_RADIUS, colorIndex: PROBE_COLOR_INDEX },
      ...neighbours.map(toSphere),
      ...farthest.map(toSphere),
    ],
    links: [
      ...neighbours.map(({ position }) => ({
        from: probePoint,
        to: position,
        color: NEAR_LINK_COLOR,
      })),
      ...farthest.map(({ position }) => ({
        from: probePoint,
        to: position,
        color: FAR_LINK_COLOR,
      })),
    ],
  };
}

/** The sphere of a question under the pointer. */
export function hoveredSphere({ position, group }: ScenePoint): Sphere {
  return { position, radius: POINT_RADIUS, colorIndex: group };
}

function findPoints(scene: ScenePoint[], questions: Neighbour[]): ScenePoint[] {
  return questions
    .map(({ offset }) => scene.find((point) => point.offset === offset))
    .filter((point) => point !== undefined);
}

export function makeQuestionsPainter(
  context: TgdContext,
  texture: TgdTexture2D,
  scene: ScenePoint[],
) {
  return makeSpheres(
    context,
    texture,
    scene.map(({ position, group }) => ({ position, radius: POINT_RADIUS, colorIndex: group })),
  );
}

export function makeCubePainter(context: TgdContext, texture: TgdTexture2D) {
  const u = paletteU(CUBE_COLOR_INDEX);
  return new TgdPainterLines(context, {
    dataPoint: new Float32Array(CUBE_EDGES.flatMap(([a, b]) => [...a, u, ...b, u])),
    texture,
  });
}

/** The highlighted spheres and links, as they appear in the scene. */
export function makeHighlightPainters(
  context: TgdContext,
  texture: TgdTexture2D,
  { spheres, links }: Highlight,
) {
  return [...makeLinks(context, links, LINK_RADIUS), makeSpheres(context, texture, spheres)];
}

/**
 * The highlighted spheres and links, for the bloom: bigger, and with uniform colors.
 */
export function makeGlowPainters(
  context: TgdContext,
  texture: TgdTexture2D,
  { spheres, links }: Highlight,
) {
  const glows = spheres.map((sphere) => ({ ...sphere, radius: sphere.radius * GLOW_RADIUS }));
  return [
    ...makeLinks(context, links, LINK_RADIUS * GLOW_RADIUS),
    makeSpheres(context, texture, glows, true),
  ];
}

/** One painter per color, since the material of the segments has a uniform color. */
function makeLinks(context: TgdContext, links: Link[], radius: number) {
  const colors = [...new Set(links.map(({ color }) => color))];
  return colors.map((color) => {
    const data = new TgdPainterSegmentsData();
    for (const { from, to } of links.filter((link) => link.color === color))
      data.add([...from, radius], [...to, radius]);
    return new TgdPainterSegments(context, {
      dataset: data.makeDataset(),
      roundness: 8,
      material: new TgdMaterialFlat({ color: TgdColor.fromString(color).toArrayNumber4() }),
    });
  });
}
