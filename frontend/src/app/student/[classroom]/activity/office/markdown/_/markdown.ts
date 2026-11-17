import type { Nodes, Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

/** Same syntax as the `Md` component: CommonMark + Github Flavored Markdown. */
const PROCESSOR = unified().use(remarkParse).use(remarkGfm);

/** Path of a node in a syntax tree: the index of the child at each level. */
export type NodePath = number[];

export interface Difference {
  /** Path of the first different node in the expected tree. */
  expected: NodePath;
  /** Path of the first different node in the student's tree. */
  student: NodePath;
}

export function parseMarkdown(source: string): Root {
  return PROCESSOR.parse(source);
}

/**
 * Compare the syntax trees of two Markdown codes.
 * Differences that are invisible in the preview are ignored: syntax variants
 * (`*` or `_`, `-` or `+`…), extra spaces, blank lines between list items…
 * @returns `null` if both codes are equivalent, otherwise where they differ first.
 */
export function findDifference(expected: string, student: string): Difference | null {
  return diff(parseMarkdown(expected), parseMarkdown(student), []);
}

function diff(expected: Nodes, student: Nodes, path: NodePath): Difference | null {
  if (!sameNode(expected, student)) return { expected: path, student: path };

  const expectedChildren = childrenOf(expected);
  const studentChildren = childrenOf(student);
  const count = Math.min(expectedChildren.length, studentChildren.length);
  for (let index = 0; index < count; index++) {
    const difference = diff(expectedChildren[index], studentChildren[index], [...path, index]);
    if (difference) return difference;
  }
  if (expectedChildren.length === studentChildren.length) return null;

  return {
    expected: expectedChildren.length > count ? [...path, count] : path,
    student: studentChildren.length > count ? [...path, count] : path,
  };
}

/** Attributes that do not change the preview. */
const IGNORED_KEYS = new Set(["type", "children", "position", "data", "spread"]);

function sameNode(expected: Nodes, student: Nodes): boolean {
  if (expected.type !== student.type) return false;

  const a = expected as unknown as Record<string, unknown>;
  const b = student as unknown as Record<string, unknown>;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (IGNORED_KEYS.has(key)) continue;
    // The number of the first item only matters for numbered lists.
    if (key === "start" && a.ordered !== true) continue;
    // Any URL is accepted for a link, as long as there is one.
    if (key === "url" && LINK_TYPES.has(expected.type)) {
      if (hasUrl(a.url) !== hasUrl(b.url)) return false;
      continue;
    }
    if (key === "value") {
      if (normalizeValue(expected.type, a.value) !== normalizeValue(student.type, b.value)) {
        return false;
      }
      continue;
    }
    if (JSON.stringify(a[key] ?? null) !== JSON.stringify(b[key] ?? null)) return false;
  }
  return true;
}

/** Nodes whose URL is not checked: links and the definitions of reference links. */
const LINK_TYPES = new Set<string>(["link", "definition"]);

function hasUrl(url: unknown): boolean {
  return typeof url === "string" && url.trim() !== "";
}

function normalizeValue(type: string, value: unknown): string {
  const text = typeof value === "string" ? value : "";
  switch (type) {
    case "text":
      // Line breaks and consecutive spaces are displayed as a single space.
      return text.replace(/\s+/g, " ");
    case "code":
      return text
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trimEnd();
    case "html":
      return text.trim();
    default:
      return text;
  }
}

function childrenOf(node: Nodes): Nodes[] {
  return "children" in node ? node.children : [];
}

/**
 * @returns The plain text of a Markdown code, without any formatting syntax:
 * one line per block, table cells separated by tabulations, URLs removed…
 * This is the initial code of an exercise.
 */
export function stripMarkdown(source: string): string {
  return blocksToText(parseMarkdown(source).children);
}

function blocksToText(nodes: Nodes[]): string {
  return nodes
    .map(blockToText)
    .filter((text) => text !== null)
    .join("\n");
}

function blockToText(node: Nodes): string | null {
  switch (node.type) {
    case "thematicBreak":
    case "definition":
      return null;
    case "code":
    case "html":
      return node.value;
    case "table":
      return node.children
        .map((row) => row.children.map((cell) => inlineToText(cell.children)).join("\t"))
        .join("\n");
    case "paragraph":
    case "heading":
      return inlineToText(node.children);
    default:
      return "children" in node ? blocksToText(node.children) : inlineToText([node]);
  }
}

function inlineToText(nodes: Nodes[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "break":
          return "\n";
        case "text":
        case "inlineCode":
        case "html":
          return node.value;
        default:
          return "children" in node ? inlineToText(node.children) : "";
      }
    })
    .join("");
}

/**
 * @returns A remark plugin that adds `className` to the node at `path`,
 * or to its nearest ancestor that is displayed as an HTML element.
 */
export function remarkHighlight(path: NodePath | undefined, className: string) {
  return () => (tree: Root) => {
    if (!path) return;

    let node: Nodes = tree;
    let target: Nodes | null = null;
    for (const index of path) {
      const child: Nodes | undefined = childrenOf(node)[index];
      if (!child) break;

      node = child;
      if (child.type !== "text") target = child;
    }
    if (!target) return;

    const data = (target.data ?? {}) as { hProperties?: Record<string, unknown> };
    target.data = { ...data, hProperties: { ...data.hProperties, className: [className] } };
  };
}
