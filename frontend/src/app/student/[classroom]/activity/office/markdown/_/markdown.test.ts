import { findDifference, stripMarkdown } from "./markdown";

describe("office/markdown/markdown", () => {
  describe("findDifference()", () => {
    const equivalents: Array<[string, string]> = [
      ["*italic*", "_italic_"],
      ["**bold**", "__bold__"],
      ["- a\n- b", "* a\n* b"],
      ["- a\n- b", "- a\n\n- b"],
      ["# Title", "Title\n====="],
      ["## Title", "## Title ##"],
      ["---", "***"],
      ["1. a\n2. b", "1. a\n1. b"],
      ["```\ncode\n```", "~~~\ncode   \n~~~\n"],
      ["Hello world", "Hello    world   "],
      ["Hello world", "Hello\nworld"],
      ["Hello\\\nworld", "Hello  \nworld"],
      ["| a | b |\n|---|---|\n| 1 | 2 |", "a|b\n-|-\n1|2"],
      ["a \\* b", "a \\* b"],
      ["[link](https://a.b)", "[link](https://c.d)"],
      ["[link][1]\n\n[1]: https://a.b", "[link][1]\n\n[1]: https://c.d"],
    ];
    for (const [expected, student] of equivalents) {
      it(`should accept ${JSON.stringify(student)} for ${JSON.stringify(expected)}`, () => {
        expect(findDifference(expected, student)).toBeNull();
      });
    }

    const differents: Array<[string, string]> = [
      ["a\n\nb", "a\nb"],
      ["# Title", "## Title"],
      ["*italic*", "**italic**"],
      ["- a\n- b", "1. a\n2. b"],
      ["1. a\n2. b", "3. a\n4. b"],
      ["```js\ncode\n```", "```\ncode\n```"],
      ["[link](https://a.b)", "[link]()"],
      ["[link](https://a.b)", "[other](https://a.b)"],
      ["| a |\n|:-:|\n| 1 |", "| a |\n|---|\n| 1 |"],
      ["- [x] done", "- [ ] done"],
      ["Hello\\\nworld", "Hello\nworld"],
    ];
    for (const [expected, student] of differents) {
      it(`should reject ${JSON.stringify(student)} for ${JSON.stringify(expected)}`, () => {
        expect(findDifference(expected, student)).not.toBeNull();
      });
    }

    it("should locate the first difference", () => {
      expect(findDifference("# A\n\nB *C*", "# A\n\nB **C**")).toEqual({
        expected: [1, 1],
        student: [1, 1],
      });
    });

    it("should locate a missing block", () => {
      expect(findDifference("A\n\nB", "A")).toEqual({ expected: [1], student: [] });
    });
  });

  describe("stripMarkdown()", () => {
    const cases: Array<[string, string]> = [
      ["A\n\nB", "A\nB"],
      ["# Title\n\nText with **bold** and *italic*.", "Title\nText with bold and italic."],
      ["- a\n- b\n  1. c", "a\nb\nc"],
      ["[link](https://a.b) and `code`", "link and code"],
      ["A\n\n---\n\nB", "A\nB"],
      ["```js\nlet x\n```", "let x"],
      ["| a | b |\n|---|---|\n| 1 | 2 |", "a\tb\n1\t2"],
      ["> quote", "quote"],
      ["- [x] done", "done"],
      ["1986\\. A year", "1986. A year"],
      ["Line\\\nbreak", "Line\nbreak"],
    ];
    for (const [source, text] of cases) {
      it(`should strip ${JSON.stringify(source)}`, () => {
        expect(stripMarkdown(source)).toBe(text);
      });
    }
  });
});
