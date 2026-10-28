import type { Entity } from "../pii";

/**
 * Minimal subset of the mdast node types we need.
 */
interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  position?: { start: { offset?: number }; end: { offset?: number } };
  data?: { hName?: string; hProperties?: Record<string, string> };
}

/**
 * Remark plugin wrapping the parts of the text nodes that belong to an entity
 * in a `<mark>` element. The entities offsets refer to the Markdown source,
 * and we use the positions of the text nodes in this source to find them.
 *
 * @param decorate Properties of the `<mark>` element for a given category.
 */
export function remarkHighlight(
  source: string,
  entities: Entity[],
  decorate: (category: string) => Record<string, string>,
) {
  const visit = (node: MdNode) => {
    if (!node.children) return;

    node.children = node.children.flatMap((child) => {
      if (child.type === "text" || child.type === "inlineCode") {
        return splitText(child, source, entities, decorate);
      }

      visit(child);
      return [child];
    });
  };
  return () => visit;
}

function splitText(
  node: MdNode,
  source: string,
  entities: Entity[],
  decorate: (category: string) => Record<string, string>,
): MdNode[] {
  const value = node.value ?? "";
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (entities.length === 0 || start === undefined || end === undefined) return [node];

  const offsets = alignOffsets(value, source, start, end);
  const result: MdNode[] = [];
  let runStart = 0;
  let runEntity = findEntity(entities, offsets[0]);
  for (let i = 1; i <= value.length; i++) {
    const entity = i < value.length ? findEntity(entities, offsets[i]) : undefined;
    if (i < value.length && entity === runEntity) continue;

    const text: MdNode = { type: node.type, value: value.slice(runStart, i) };
    result.push(
      runEntity
        ? {
            type: "pii",
            data: { hName: "mark", hProperties: decorate(runEntity.category) },
            children: [text],
          }
        : text,
    );
    runStart = i;
    runEntity = entity;
  }
  return result;
}

/**
 * The value of a text node can differ from its source because of
 * escapes (`\*`) or entities (`&amp;`). So we look for each character
 * of the value in the source, from left to right.
 */
function alignOffsets(value: string, source: string, start: number, end: number): number[] {
  const offsets: number[] = [];
  let cursor = start;
  for (const char of value) {
    const index = source.indexOf(char, cursor);
    const found = index > -1 && index < end;
    // Characters can be made of two UTF-16 code units.
    for (let k = 0; k < char.length; k++) offsets.push(found ? index + k : cursor);
    if (found) cursor = index + char.length;
  }
  return offsets;
}

function findEntity(entities: Entity[], offset: number | undefined): Entity | undefined {
  if (offset === undefined) return undefined;

  return entities.find(({ start, end }) => start <= offset && offset < end);
}
