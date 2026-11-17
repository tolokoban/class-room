import type { Nodes } from "mdast";

import { EXERCISE_IDS } from "../../exercises";
import { findDifference, parseMarkdown, stripMarkdown } from "../markdown";
import { CONTENT } from ".";

/** Types of the nodes of a tree, without the texts, to compare the translations. */
function shape(node: Nodes): string {
  if (node.type === "text") return "";
  const children = "children" in node ? node.children.map(shape).filter(Boolean) : [];
  return children.length > 0 ? `${node.type}(${children.join(",")})` : node.type;
}

describe("office/markdown/content", () => {
  for (const [lang, content] of Object.entries(CONTENT)) {
    for (const id of EXERCISE_IDS) {
      const expected = content[id];

      it(`[${lang}] ${id} must not be solved from the start`, () => {
        expect(findDifference(expected, stripMarkdown(expected))).not.toBeNull();
      });

      it(`[${lang}] ${id} must be solved by its own code`, () => {
        expect(findDifference(expected, expected)).toBeNull();
      });

      if (lang !== "fr") {
        it(`[${lang}] ${id} must have the same structure as in French`, () => {
          const blocks = (source: string) => parseMarkdown(source).children.map(shape);
          expect(blocks(expected)).toEqual(blocks(CONTENT.fr[id]));
        });
      }
    }
  }
});
