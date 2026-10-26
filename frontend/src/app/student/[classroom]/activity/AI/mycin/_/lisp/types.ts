/**
 * Data types of our tiny Common Lisp interpreter.
 *
 * - Symbols are interned globally and carry no binding:
 *   bindings live in the Interpreter, so that several
 *   interpreters can coexist.
 * - NIL is both the symbol NIL and the empty list.
 * - Numbers are JS numbers and strings are JS strings.
 */

export class LispSymbol {
  constructor(public readonly name: string) {}

  get isKeyword() {
    return this.name.startsWith(":");
  }
}

const symbols = new Map<string, LispSymbol>();

export function intern(name: string): LispSymbol {
  const key = name.toUpperCase();
  let symbol = symbols.get(key);
  if (!symbol) {
    symbol = new LispSymbol(key);
    symbols.set(key, symbol);
  }
  return symbol;
}

export const NIL = intern("NIL");
export const T = intern("T");

export class Cons {
  constructor(
    public car: Value,
    public cdr: Value,
  ) {}
}

export class LispFunction {
  constructor(
    public readonly name: string,
    public readonly call: (args: Value[]) => Value | Promise<Value>,
  ) {}
}

export interface StructType {
  name: LispSymbol;
  slots: LispSymbol[];
}

export class LispStruct {
  constructor(
    public readonly type: StructType,
    public readonly slots: Value[],
  ) {}
}

export class HashTable {
  private readonly map = new Map<unknown, [key: Value, value: Value]>();

  constructor(public readonly test: "eql" | "equal") {}

  private hash(key: Value): unknown {
    return this.test === "equal" ? equalHash(key) : key;
  }

  get(key: Value): [value: Value, found: boolean] {
    const entry = this.map.get(this.hash(key));
    return entry ? [entry[1], true] : [NIL, false];
  }

  set(key: Value, value: Value) {
    this.map.set(this.hash(key), [key, value]);
  }

  delete(key: Value) {
    return this.map.delete(this.hash(key));
  }

  clear() {
    this.map.clear();
  }
}

/**
 * Result of `(values ...)`.
 * Only MULTIPLE-VALUE-BIND looks at all the values,
 * everybody else uses `primary()`.
 */
export class MultipleValues {
  constructor(public readonly values: Value[]) {}
}

export type Value =
  | LispSymbol
  | Cons
  | number
  | string
  | LispFunction
  | LispStruct
  | HashTable
  | MultipleValues;

export class LispError extends Error {}

export function primary(value: Value): Value {
  if (value instanceof MultipleValues) return value.values[0] ?? NIL;
  return value;
}

export function bool(test: boolean): Value {
  return test ? T : NIL;
}

export function isTrue(value: Value): boolean {
  return primary(value) !== NIL;
}

export function list(...items: Value[]): Value {
  let result: Value = NIL;
  for (let i = items.length - 1; i >= 0; i--) result = new Cons(items[i], result);
  return result;
}

export function toArray(value: Value): Value[] {
  const items: Value[] = [];
  let cursor = value;
  while (cursor instanceof Cons) {
    items.push(cursor.car);
    cursor = cursor.cdr;
  }
  if (cursor !== NIL) throw new LispError("Not a proper list!");
  return items;
}

export function car(value: Value): Value {
  if (value === NIL) return NIL;
  if (value instanceof Cons) return value.car;
  throw new LispError("Not a list!");
}

export function cdr(value: Value): Value {
  if (value === NIL) return NIL;
  if (value instanceof Cons) return value.cdr;
  throw new LispError("Not a list!");
}

export function eql(a: Value, b: Value): boolean {
  return a === b;
}

export function equal(a: Value, b: Value): boolean {
  if (a instanceof Cons && b instanceof Cons) {
    return equal(a.car, b.car) && equal(a.cdr, b.cdr);
  }
  return a === b;
}

let nextObjectId = 1;
const objectIds = new WeakMap<object, number>();

function equalHash(value: Value): string {
  if (value instanceof Cons) {
    return `(${equalHash(value.car)} . ${equalHash(value.cdr)})`;
  }
  if (value instanceof LispSymbol) return `S${value.name}`;
  if (typeof value === "string") return `"${JSON.stringify(value)}`;
  if (typeof value === "number") return `N${value}`;
  let id = objectIds.get(value);
  if (!id) {
    id = nextObjectId++;
    objectIds.set(value, id);
  }
  return `#${id}`;
}
