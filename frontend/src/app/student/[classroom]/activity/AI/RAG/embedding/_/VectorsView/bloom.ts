import {
  type TgdAnimation,
  type TgdContext,
  TgdFilter,
  TgdFilterBlur,
  type TgdPainter,
  TgdPainterClear,
  TgdPainterFilter,
  TgdPainterFramebuffer,
  TgdPainterGroup,
  TgdPainterState,
  TgdTexture2D,
} from "@tolokoban/tgd";

/** Resolution of the glow, relative to the view: lower is cheaper and blurrier. */
const SCALE = 0.25;
const BLUR_SIZE = 8;
const BLUR_STRENGTH = 1;
/** The blur spreads the light over many pixels: make it brighter again. */
const INTENSITY = 2;
/** When dimmed, the luminance of the scene is multiplied by this value… */
const DIMMED_LUMINANCE = 0.5;
/** …and its saturation is reduced by this fraction. */
const DIMMED_DESATURATION = 0.7;
/** Duration of the dimming transition, in seconds. */
const DIM_DURATION = 0.2;
/** Pitch black and opaque: only what is painted in the glow framebuffer glows. */
const BLACK: [number, number, number, number] = [0, 0, 0, 1];

/**
 * Bloom effect on the highlighted objects:
 * 1. The scene is painted in a framebuffer.
 * 2. The objects that must glow are painted in another one, at low resolution.
 * 3. This glow is blurred into a third framebuffer.
 * 4. A filter paints the scene on the canvas, dimmed and desaturated if needed,
 *    and adds the blurred glow.
 */
export class Bloom {
  /** To add to the context: they paint the whole frame. */
  readonly painters: TgdPainter[];
  /** 0: the scene as it is. 1: dimmed and desaturated. */
  private dim = 0;
  private dimAnimation: TgdAnimation | null = null;
  private readonly glowing = new TgdPainterGroup();

  /**
   * @param scene The painters of the scene, including the clearing of the background.
   */
  constructor(
    private readonly context: TgdContext,
    scene: TgdPainter[],
  ) {
    const sceneTexture = makeTexture(context);
    const glowTexture = makeTexture(context);
    const blurredTexture = makeTexture(context);
    this.painters = [
      new TgdPainterFramebuffer(context, {
        textureColor0: sceneTexture,
        antiAliasing: true,
        stencilBuffer: false,
        children: scene,
      }),
      makeGlowFramebuffer(context, glowTexture, [
        new TgdPainterState(context, { depth: "less", children: [this.glowing] }),
      ]),
      makeGlowFramebuffer(context, blurredTexture, [
        new TgdPainterFilter(context, {
          texture: glowTexture,
          filters: TgdFilterBlur.createPair({ size: BLUR_SIZE, strength: BLUR_STRENGTH }),
        }),
      ]),
      new TgdPainterState(context, {
        depth: "off",
        blend: "off",
        children: [
          new TgdPainterFilter(context, {
            texture: sceneTexture,
            filters: [this.makeComposeFilter(blurredTexture)],
          }),
        ],
      }),
    ];
  }

  /** The painters of what must glow. */
  setGlowing(painters: TgdPainter[]) {
    this.glowing.removeAll(true);
    this.glowing.add(...painters);
  }

  /** Dim and desaturate the scene, to make the glowing objects stand out. */
  setDimmed(dimmed: boolean) {
    const { context } = this;
    if (this.dimAnimation) context.animCancel(this.dimAnimation);
    const from = this.dim;
    const to = dimmed ? 1 : 0;
    [this.dimAnimation] = context.animSchedule({
      duration: DIM_DURATION,
      action: (alpha) => {
        this.dim = from + (to - from) * alpha;
      },
    });
    context.paint();
  }

  private makeComposeFilter(glow: TgdTexture2D) {
    return new TgdFilter({
      name: "BloomCompose",
      uniforms: { uniDim: "float" },
      textures: { uniGlow: glow },
      fragmentShaderCode: [
        "vec3 scene = texture(uniTexture, varUV).rgb;",
        "vec3 glow = texture(uniGlow, varUV).rgb;",
        "float luminance = dot(scene, vec3(0.2126, 0.7152, 0.0722));",
        `float desaturation = ${DIMMED_DESATURATION.toFixed(3)} * uniDim;`,
        `float factor = mix(1.0, ${DIMMED_LUMINANCE.toFixed(3)}, uniDim);`,
        "scene = mix(scene, vec3(luminance), desaturation) * factor;",
        `FragColor = vec4(scene + glow * ${INTENSITY.toFixed(3)}, 1.0);`,
      ],
      setUniforms: ({ program }) => program.uniform1f("uniDim", this.dim),
    });
  }
}

function makeTexture(context: TgdContext) {
  return new TgdTexture2D(context, {
    params: {
      minFilter: "LINEAR",
      magFilter: "LINEAR",
      wrapS: "CLAMP_TO_EDGE",
      wrapT: "CLAMP_TO_EDGE",
    },
  });
}

function makeGlowFramebuffer(context: TgdContext, texture: TgdTexture2D, children: TgdPainter[]) {
  return new TgdPainterFramebuffer(context, {
    textureColor0: texture,
    viewportMatchingScale: SCALE,
    depthBuffer: true,
    stencilBuffer: false,
    children: [new TgdPainterClear(context, { color: BLACK, depth: 1 }), ...children],
  });
}
