import {
  Cons,
  HashTable,
  intern,
  LispFunction,
  LispStruct,
  LispSymbol,
  MultipleValues,
  NIL,
  Value,
} from "./types";

const QUOTE = intern("QUOTE");
const FUNCTION = intern("FUNCTION");

/**
 * @param escape `true` for PRIN1 (strings are quoted),
 * `false` for PRINC.
 */
export function toText(value: Value, escape: boolean): string {
  if (typeof value === "number") return printNumber(value);
  if (typeof value === "string") return escape ? JSON.stringify(value) : value;
  if (value instanceof LispSymbol) return value.name;
  if (value instanceof Cons) return printList(value, escape);
  if (value instanceof LispStruct) {
    const slots = value.type.slots.map(
      (slot, index) => ` :${slot.name} ${toText(value.slots[index], escape)}`,
    );
    return `#S(${value.type.name.name}${slots.join("")})`;
  }
  if (value instanceof LispFunction) return `#<FUNCTION ${value.name}>`;
  if (value instanceof HashTable) return "#<HASH-TABLE>";
  if (value instanceof MultipleValues) {
    return value.values.map((item) => toText(item, escape)).join(" ; ");
  }
  return "#<UNKNOWN>";
}

function printNumber(value: number): string {
  if (Number.isInteger(value)) return `${value}`;
  // Hide floating point noise: 0.27999999999999997 -> 0.28
  return `${Number(value.toPrecision(7))}`;
}

function printList(value: Cons, escape: boolean): string {
  if (value.cdr instanceof Cons && value.cdr.cdr === NIL) {
    if (value.car === QUOTE) return `'${toText(value.cdr.car, escape)}`;
    if (value.car === FUNCTION) return `#'${toText(value.cdr.car, escape)}`;
  }
  const items: string[] = [];
  let cursor: Value = value;
  while (cursor instanceof Cons) {
    items.push(toText(cursor.car, escape));
    cursor = cursor.cdr;
  }
  if (cursor !== NIL) items.push(".", toText(cursor, escape));
  return `(${items.join(" ")})`;
}
