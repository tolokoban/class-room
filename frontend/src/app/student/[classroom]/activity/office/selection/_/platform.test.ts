import { macStrokeLabel, toKeyStroke } from "./platform";

function event(
  key: string,
  modifiers: Partial<Record<"ctrl" | "meta" | "shift" | "alt", boolean>> = {},
) {
  return {
    key,
    ctrlKey: modifiers.ctrl ?? false,
    metaKey: modifiers.meta ?? false,
    shiftKey: modifiers.shift ?? false,
    altKey: modifiers.alt ?? false,
  };
}

describe("office/selection/platform", () => {
  it("should convert Mac shortcuts", () => {
    expect(toKeyStroke(event("ArrowLeft", { meta: true, shift: true }), true)).toEqual({
      key: "Home",
      ctrl: false,
      shift: true,
      alt: false,
    });
    expect(toKeyStroke(event("ArrowDown", { meta: true }), true)).toMatchObject({
      key: "End",
      ctrl: true,
    });
    expect(toKeyStroke(event("ArrowRight", { alt: true }), true)).toMatchObject({
      key: "ArrowRight",
      ctrl: true,
      alt: false,
    });
    expect(toKeyStroke(event("b", { meta: true }), true)).toMatchObject({ key: "b", ctrl: true });
    expect(toKeyStroke(event("œ", { alt: true }), true)).toMatchObject({ key: "œ", alt: false });
  });

  it("should not change Windows/Linux shortcuts", () => {
    expect(toKeyStroke(event("ArrowLeft", { ctrl: true }), false)).toMatchObject({
      key: "ArrowLeft",
      ctrl: true,
    });
  });

  it("should name keystrokes the Mac way", () => {
    expect(macStrokeLabel("Ctrl+Shift+ArrowLeft")).toBe("⌥ ⇧ ←");
    expect(macStrokeLabel("Shift+End")).toBe("⇧ ⌘ →");
    expect(macStrokeLabel("Ctrl+Home")).toBe("⌘ ↑");
    expect(macStrokeLabel("Ctrl+B")).toBe("⌘ B");
    expect(macStrokeLabel("Ctrl+Backspace")).toBe("⌥ ⌫");
    expect(macStrokeLabel("ArrowDown")).toBe("↓");
  });
});
