import { applyKey, createEditorState, type EditorState, type KeyStroke } from "./keyboard";
import { parseRichText, richTextEquals } from "./rich-text";

function press(state: EditorState, ...keys: string[]): EditorState {
  return keys.reduce((current, spec) => {
    const parts = spec.split("+");
    const key = parts.pop() ?? "";
    const stroke: KeyStroke = {
      key,
      ctrl: parts.includes("Ctrl"),
      shift: parts.includes("Shift"),
      alt: parts.includes("Alt"),
    };
    const next = applyKey(current, stroke);
    if (!next) throw new Error(`Key not handled: ${spec}`);
    return next;
  }, state);
}

function serialize({ text }: EditorState): string {
  let out = "";
  let bold = false;
  for (const item of text) {
    if (item.bold !== bold) out += item.bold ? "{" : "}";
    bold = item.bold;
    out += item.char;
  }
  return bold ? `${out}}` : out;
}

function editor(source: string) {
  return createEditorState(parseRichText(source));
}

describe("office/selection/keyboard", () => {
  it("should parse bold text", () => {
    expect(serialize(editor("a{bc}d"))).toBe("a{bc}d");
  });

  it("should ignore boldness of spaces when comparing", () => {
    expect(richTextEquals(parseRichText("{a }b"), parseRichText("{a} b"))).toBe(true);
    expect(richTextEquals(parseRichText("{a}b"), parseRichText("ab"))).toBe(false);
  });

  it("should make the selection bold with Ctrl-B", () => {
    const state = press(
      editor("Vive le vent"),
      "Ctrl+ArrowRight",
      "Shift+Ctrl+ArrowRight",
      "Ctrl+B",
    );
    expect(serialize(state)).toBe("Vive {le }vent");
    expect(serialize(press(state, "Ctrl+B"))).toBe("Vive le vent");
  });

  it("should move word by word", () => {
    let state = press(editor("d'hiver qui"), "Ctrl+ArrowRight");
    expect(state.cursor).toBe(1);
    state = press(state, "Ctrl+ArrowRight", "Ctrl+ArrowRight");
    expect(state.cursor).toBe(8);
    state = press(state, "Ctrl+ArrowLeft");
    expect(state.cursor).toBe(2);
  });

  it("should move vertically keeping the column", () => {
    const state = press(editor("abcdef\nab\nabcdef"), "End", "ArrowDown");
    expect(state.cursor).toBe(9);
    expect(press(state, "ArrowDown").cursor).toBe(16);
    expect(press(state, "ArrowUp").cursor).toBe(6);
  });

  it("should cut and paste with boldness", () => {
    const state = press(
      editor("{ab}cd"),
      "Shift+ArrowRight",
      "Shift+ArrowRight",
      "Ctrl+X",
      "End",
      "Ctrl+V",
    );
    expect(serialize(state)).toBe("cd{ab}");
  });

  it("should type, delete and undo", () => {
    let state = press(editor("ab"), "End", "c", "Enter", "Backspace", "Home", "Delete");
    expect(serialize(state)).toBe("bc");
    state = press(state, "Ctrl+Z", "Ctrl+Z");
    expect(serialize(state)).toBe("abc\n");
    expect(serialize(press(state, "Ctrl+Y"))).toBe("abc");
  });

  it("should type bold after Ctrl-B without selection", () => {
    expect(serialize(press(editor("ab"), "End", "Ctrl+B", "c"))).toBe("ab{c}");
  });
});
