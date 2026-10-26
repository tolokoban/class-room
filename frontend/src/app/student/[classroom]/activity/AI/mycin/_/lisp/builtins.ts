import type { Interpreter } from "./interpreter";
import { toText } from "./printer";
import { IncompleteInput, Reader } from "./reader";
import {
  bool,
  car,
  cdr,
  Cons,
  eql,
  equal,
  HashTable,
  intern,
  LispError,
  LispFunction,
  LispSymbol,
  list,
  MultipleValues,
  NIL,
  T,
  toArray,
  Value,
} from "./types";

type Builtin = (args: Value[]) => Value | Promise<Value>;

/**
 * Where FORMAT writes: the console or a string.
 */
interface Sink {
  write(text: string): void;
  freshLine(): void;
}

class StringSink implements Sink {
  text = "";

  write(text: string) {
    this.text += text;
  }

  freshLine() {
    if (this.text.length > 0 && !this.text.endsWith("\n")) this.text += "\n";
  }
}

export function registerBuiltins(interp: Interpreter) {
  const def = (names: string, fn: Builtin) => {
    for (const name of names.split(" ")) {
      interp.functions.set(intern(name), new LispFunction(name, fn));
    }
  };
  const call = (fn: Value, args: Value[]) => interp.callFunction(fn, args);
  const console: Sink = {
    write: (text) => interp.write(text),
    freshLine: () => interp.freshLine(),
  };

  /**
   * Keyword arguments (:key, :test, ...) used by sequence functions.
   */
  const keywords = (args: Value[]) => {
    const options = new Map<string, Value>();
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      if (!(key instanceof LispSymbol) || !key.isKeyword) {
        throw new LispError(`Expected a keyword, got ${toText(key, true)}`);
      }
      options.set(key.name, args[i + 1] ?? NIL);
    }
    const keyFn = options.get(":KEY");
    const testFn = options.get(":TEST");
    return {
      key: async (item: Value) => (keyFn && keyFn !== NIL ? call(keyFn, [item]) : item),
      test: async (a: Value, b: Value) =>
        testFn && testFn !== NIL ? (await call(testFn, [a, b])) !== NIL : eql(a, b),
    };
  };

  // ---------- Lists ----------
  def("CAR FIRST", ([x]) => car(x));
  def("CDR REST", ([x]) => cdr(x));
  def("SECOND", ([x]) => car(cdr(x)));
  def("THIRD", ([x]) => car(cdr(cdr(x))));
  def("FOURTH", ([x]) => car(cdr(cdr(cdr(x)))));
  def("CONS", ([a, b]) => new Cons(a, b));
  def("LIST", (args) => list(...args));
  def("LIST*", (args) => {
    let result = args[args.length - 1] ?? NIL;
    for (let i = args.length - 2; i >= 0; i--) result = new Cons(args[i], result);
    return result;
  });
  def("APPEND", (args) => {
    if (args.length === 0) return NIL;
    let result = args[args.length - 1];
    for (let i = args.length - 2; i >= 0; i--) {
      const items = toArray(args[i]);
      for (let k = items.length - 1; k >= 0; k--) result = new Cons(items[k], result);
    }
    return result;
  });
  def("REVERSE NREVERSE", ([x]) => list(...toArray(x).reverse()));
  def("COPY-LIST", ([x]) => list(...toArray(x)));
  def("LENGTH", ([x]) => (typeof x === "string" ? x.length : toArray(x).length));
  def("NTH", ([n, x]) => toArray(x)[num(n)] ?? NIL);
  def("NTHCDR", ([n, x]) => {
    let cursor = x;
    for (let i = 0; i < num(n); i++) cursor = cdr(cursor);
    return cursor;
  });
  def("LAST", ([x]) => {
    let cursor = x;
    while (cursor instanceof Cons && cursor.cdr instanceof Cons) cursor = cursor.cdr;
    return cursor;
  });
  def("MEMBER", async ([item, x, ...rest]) => {
    const { key, test } = keywords(rest);
    let cursor = x;
    while (cursor instanceof Cons) {
      if (await test(item, await key(cursor.car))) return cursor;
      cursor = cursor.cdr;
    }
    return NIL;
  });
  def("ASSOC", async ([item, alist, ...rest]) => {
    const { key, test } = keywords(rest);
    for (const pair of toArray(alist)) {
      if (pair instanceof Cons && (await test(item, await key(pair.car)))) return pair;
    }
    return NIL;
  });
  def("FIND", async ([item, x, ...rest]) => {
    const { key, test } = keywords(rest);
    for (const elem of toArray(x)) {
      if (await test(item, await key(elem))) return elem;
    }
    return NIL;
  });
  def("REMOVE", async ([item, x, ...rest]) => {
    const { key, test } = keywords(rest);
    const result: Value[] = [];
    for (const elem of toArray(x)) {
      if (!(await test(item, await key(elem)))) result.push(elem);
    }
    return list(...result);
  });
  const removeIf = (keep: boolean): Builtin =>
    async ([pred, x, ...rest]) => {
      const { key } = keywords(rest);
      const result: Value[] = [];
      for (const elem of toArray(x)) {
        if (((await call(pred, [await key(elem)])) !== NIL) === keep) result.push(elem);
      }
      return list(...result);
    };
  def("REMOVE-IF", removeIf(false));
  def("REMOVE-IF-NOT", removeIf(true));
  def("SORT STABLE-SORT", async ([x, pred, ...rest]) => {
    const { key } = keywords(rest);
    const items = toArray(x);
    const keys = new Map<Value, Value>();
    for (const item of items) keys.set(item, await key(item));
    const before = async (a: Value, b: Value) =>
      (await call(pred, [keys.get(a) ?? NIL, keys.get(b) ?? NIL])) !== NIL;
    return list(...(await mergeSort(items, before)));
  });

  // ---------- Mapping ----------
  /** Rows of arguments for MAPCAR & co: stops at the shortest list. */
  const zip = (lists: Value[]): Value[][] => {
    const arrays = lists.map(toArray);
    const length = Math.min(...arrays.map((array) => array.length));
    return Array.from({ length }, (_, i) => arrays.map((array) => array[i]));
  };
  def("MAPCAR", async ([fn, ...lists]) => {
    const result: Value[] = [];
    for (const row of zip(lists)) result.push(await call(fn, row));
    return list(...result);
  });
  def("MAPC", async ([fn, ...lists]) => {
    for (const row of zip(lists)) await call(fn, row);
    return lists[0] ?? NIL;
  });
  def("SOME", async ([fn, ...lists]) => {
    for (const row of zip(lists)) {
      const value = await call(fn, row);
      if (value !== NIL) return value;
    }
    return NIL;
  });
  def("EVERY", async ([fn, ...lists]) => {
    for (const row of zip(lists)) {
      if ((await call(fn, row)) === NIL) return NIL;
    }
    return T;
  });
  def("FUNCALL", ([fn, ...args]) => interp.getFunction(fn).call(args));
  def("APPLY", ([fn, ...args]) => {
    const spread = args.length > 0 ? toArray(args[args.length - 1]) : [];
    return interp.getFunction(fn).call([...args.slice(0, -1), ...spread]);
  });
  def("IDENTITY", ([x]) => x);
  def("EVAL", ([form]) => interp.eval(form, interp.global));

  // ---------- Predicates ----------
  def("NULL NOT", ([x]) => bool(x === NIL));
  def("ATOM", ([x]) => bool(!(x instanceof Cons)));
  def("CONSP", ([x]) => bool(x instanceof Cons));
  def("LISTP", ([x]) => bool(x === NIL || x instanceof Cons));
  def("NUMBERP", ([x]) => bool(typeof x === "number"));
  def("STRINGP", ([x]) => bool(typeof x === "string"));
  def("SYMBOLP", ([x]) => bool(x instanceof LispSymbol));
  def("FUNCTIONP", ([x]) => bool(x instanceof LispFunction));
  def("EQ EQL", ([a, b]) => bool(eql(a, b)));
  def("EQUAL", ([a, b]) => bool(equal(a, b)));
  def("FBOUNDP", ([x]) => bool(x instanceof LispSymbol && interp.isFbound(x)));
  def("BOUNDP", ([x]) => bool(x instanceof LispSymbol && interp.global.find(x) !== null));
  def("TYPEP", ([x, type]) => bool(interp.typep(x, type)));

  // ---------- Numbers ----------
  def("+", (args) => args.reduce<number>((acc, x) => acc + num(x), 0));
  def("*", (args) => args.reduce<number>((acc, x) => acc * num(x), 1));
  def("-", ([first, ...rest]) =>
    rest.length === 0 ? -num(first) : rest.reduce<number>((acc, x) => acc - num(x), num(first)),
  );
  def("/", ([first, ...rest]) => {
    const divide = (a: number, b: number) => {
      if (b === 0) throw new LispError("Division by zero!");
      return a / b;
    };
    return rest.length === 0
      ? divide(1, num(first))
      : rest.reduce<number>((acc, x) => divide(acc, num(x)), num(first));
  });
  const compare = (test: (a: number, b: number) => boolean): Builtin =>
    (args) => {
      for (let i = 0; i < args.length - 1; i++) {
        if (!test(num(args[i]), num(args[i + 1]))) return NIL;
      }
      return T;
    };
  def("=", compare((a, b) => a === b));
  def("/=", compare((a, b) => a !== b));
  def("<", compare((a, b) => a < b));
  def(">", compare((a, b) => a > b));
  def("<=", compare((a, b) => a <= b));
  def(">=", compare((a, b) => a >= b));
  def("MIN", (args) => Math.min(...args.map(num)));
  def("MAX", (args) => Math.max(...args.map(num)));
  def("ABS", ([x]) => Math.abs(num(x)));
  def("1+", ([x]) => num(x) + 1);
  def("1-", ([x]) => num(x) - 1);
  def("MOD", ([a, b]) => {
    const n = num(b);
    return ((num(a) % n) + n) % n;
  });
  def("ZEROP", ([x]) => bool(num(x) === 0));
  def("PLUSP", ([x]) => bool(num(x) > 0));
  def("MINUSP", ([x]) => bool(num(x) < 0));

  // ---------- Strings ----------
  def("STRING", ([x]) => str(x));
  def("STRING-DOWNCASE", ([x]) => str(x).toLowerCase());
  def("STRING-UPCASE", ([x]) => str(x).toUpperCase());
  def("STRING-TRIM", ([bag, x]) => {
    const chars = new Set(str(bag));
    const text = str(x);
    let start = 0;
    let end = text.length;
    while (start < end && chars.has(text.charAt(start))) start++;
    while (end > start && chars.has(text.charAt(end - 1))) end--;
    return text.slice(start, end);
  });
  def("STRING=", ([a, b]) => bool(str(a) === str(b)));
  def("STRING-EQUAL", ([a, b]) => bool(str(a).toLowerCase() === str(b).toLowerCase()));
  def("CONCATENATE", ([, ...parts]) => parts.map(str).join(""));

  // ---------- Symbols and hash tables ----------
  def("SYMBOL-NAME", ([symbol]) => {
    if (!(symbol instanceof LispSymbol)) throw new LispError("SYMBOL-NAME needs a symbol!");
    return symbol.name;
  });
  def("GET", ([symbol, prop, fallback]) => {
    if (!(symbol instanceof LispSymbol)) throw new LispError("GET needs a symbol!");
    return interp.plists.get(symbol)?.get(prop) ?? fallback ?? NIL;
  });
  def("MAKE-HASH-TABLE", (args) => {
    const index = args.findIndex((x) => x instanceof LispSymbol && x.name === ":TEST");
    const test = index < 0 ? NIL : args[index + 1];
    const name = test instanceof LispFunction ? test.name : test instanceof LispSymbol ? test.name : "";
    return new HashTable(name === "EQUAL" || name === "EQUALP" ? "equal" : "eql");
  });
  def("GETHASH", ([key, table, fallback]) => {
    const [value, found] = hashTable(table).get(key);
    return new MultipleValues([found ? value : fallback ?? NIL, bool(found)]);
  });
  def("REMHASH", ([key, table]) => bool(hashTable(table).delete(key)));
  def("CLRHASH", ([table]) => {
    hashTable(table).clear();
    return table;
  });
  def("VALUES", (args) => (args.length === 1 ? args[0] : new MultipleValues(args)));

  // ---------- Input / output ----------
  def("FORMAT", ([destination, control, ...args]) => {
    if (destination === NIL) {
      const sink = new StringSink();
      format(sink, str(control), args);
      return sink.text;
    }
    format(console, str(control), args);
    return NIL;
  });
  def("PRINC", ([x]) => {
    interp.write(toText(x, false));
    return x;
  });
  def("PRIN1", ([x]) => {
    interp.write(toText(x, true));
    return x;
  });
  def("PRINT", ([x]) => {
    interp.write(`\n${toText(x, true)} `);
    return x;
  });
  def("TERPRI", () => {
    interp.write("\n");
    return NIL;
  });
  def("FRESH-LINE", () => bool(interp.freshLine()));
  def("FINISH-OUTPUT FORCE-OUTPUT", () => NIL);
  def("READ-LINE", () => interp.readLine());
  def("READ", async () => {
    let text = "";
    for (;;) {
      text += `${await interp.readLine()}\n`;
      try {
        const value = new Reader(text).readFirst();
        if (value !== undefined) return value;
      } catch (ex) {
        if (!(ex instanceof IncompleteInput)) throw ex;
      }
    }
  });
  def("ERROR", ([control, ...args]) => {
    if (control instanceof LispSymbol) throw new LispError(control.name);
    const sink = new StringSink();
    format(sink, str(control), args);
    throw new LispError(sink.text);
  });
  def("WARN", ([control, ...args]) => {
    interp.freshLine();
    interp.write("WARNING: ");
    format(console, str(control), args);
    interp.write("\n");
    return NIL;
  });
}

function num(x: Value): number {
  if (typeof x !== "number") throw new LispError(`Not a number: ${toText(x, true)}`);
  return x;
}

/** String designator: strings and symbols. */
function str(x: Value): string {
  if (typeof x === "string") return x;
  if (x instanceof LispSymbol) return x.name;
  throw new LispError(`Not a string: ${toText(x, true)}`);
}

function hashTable(x: Value): HashTable {
  if (!(x instanceof HashTable)) throw new LispError(`Not a hash table: ${toText(x, true)}`);
  return x;
}

async function mergeSort(
  items: Value[],
  before: (a: Value, b: Value) => Promise<boolean>,
): Promise<Value[]> {
  if (items.length < 2) return items;
  const middle = Math.floor(items.length / 2);
  const left = await mergeSort(items.slice(0, middle), before);
  const right = await mergeSort(items.slice(middle), before);
  const result: Value[] = [];
  while (left.length > 0 && right.length > 0) {
    // Stable: take from the right only if strictly before.
    result.push((await before(right[0], left[0])) ? right.shift()! : left.shift()!);
  }
  return [...result, ...left, ...right];
}

/**
 * Subset of FORMAT: ~a ~s ~d ~f ~% ~& ~~ ~(...~) and ~<newline>.
 */
function format(sink: Sink, control: string, args: Value[]) {
  let argIndex = 0;
  const next = () => {
    if (argIndex >= args.length) throw new LispError(`Not enough arguments for "${control}"`);
    return args[argIndex++];
  };
  let buffer = "";
  const flush = () => {
    sink.write(buffer);
    buffer = "";
  };
  // Where the pending ~( started in `buffer`, and its modifiers.
  let caseStart = -1;
  let caseParams = "";
  let i = 0;
  while (i < control.length) {
    const c = control.charAt(i++);
    if (c !== "~") {
      buffer += c;
      continue;
    }
    let params = "";
    while (i < control.length && /[0-9,:@]/.test(control.charAt(i))) params += control.charAt(i++);
    const directive = control.charAt(i++);
    const repeat = Number.parseInt(params, 10) || 1;
    switch (directive.toUpperCase()) {
      case "A":
        buffer += toText(next(), false);
        break;
      case "S":
        buffer += toText(next(), true);
        break;
      case "D": {
        const value = next();
        buffer += typeof value === "number" ? Math.round(value).toString() : toText(value, false);
        break;
      }
      case "F": {
        const value = next();
        const digits = Number.parseInt(params.split(",")[1] ?? "", 10);
        buffer +=
          typeof value === "number" && !Number.isNaN(digits)
            ? value.toFixed(digits)
            : toText(value, false);
        break;
      }
      case "%":
        buffer += "\n".repeat(repeat);
        break;
      case "&":
        flush();
        sink.freshLine();
        buffer += "\n".repeat(repeat - 1);
        break;
      case "~":
        buffer += "~".repeat(repeat);
        break;
      case "(":
        caseStart = buffer.length;
        caseParams = params;
        break;
      case ")":
        if (caseStart < 0) throw new LispError(`Unmatched "~)" in "${control}"`);
        buffer = buffer.slice(0, caseStart) + convertCase(buffer.slice(caseStart), caseParams);
        caseStart = -1;
        break;
      case "\n":
        while (i < control.length && /[ \t]/.test(control.charAt(i))) i++;
        break;
      default:
        throw new LispError(`Unsupported FORMAT directive: ~${directive}`);
    }
  }
  flush();
}

/**
 * ~( lowercase, ~:( capitalize every word,
 * ~@( capitalize the first word, ~:@( uppercase.
 */
function convertCase(text: string, params: string): string {
  const colon = params.includes(":");
  const at = params.includes("@");
  const lower = text.toLowerCase();
  if (colon && at) return text.toUpperCase();
  if (colon) return lower.replace(/(^|[^\p{L}\p{N}])(\p{L})/gu, (_, sep, c) => sep + c.toUpperCase());
  if (at) return lower.replace(/\p{L}/u, (c) => c.toUpperCase());
  return lower;
}
