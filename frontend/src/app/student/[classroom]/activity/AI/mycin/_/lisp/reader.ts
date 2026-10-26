import { Cons, intern, LispError, list, NIL, Value } from "./types";

/**
 * Thrown when the text ends before the expression is complete.
 * READ uses it to know that it must wait for another line.
 */
export class IncompleteInput extends LispError {}

const QUOTE = intern("QUOTE");
const FUNCTION = intern("FUNCTION");
export const QUASIQUOTE = intern("QUASIQUOTE");
export const UNQUOTE = intern("UNQUOTE");
export const UNQUOTE_SPLICING = intern("UNQUOTE-SPLICING");

const DELIMITERS = new Set(["(", ")", "'", "`", ",", '"', ";"]);
const RX_NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const DOT = Symbol("dot");

export class Reader {
  private pos = 0;

  constructor(private readonly text: string) {}

  /**
   * @returns All the expressions of the text.
   */
  readAll(): Value[] {
    const forms: Value[] = [];
    for (;;) {
      this.skipBlanks();
      if (this.eof()) return forms;
      if (this.peek() === ")") {
        // Stray closing parenthesis: ignore it like most REPLs do.
        this.pos++;
        continue;
      }
      forms.push(this.read());
    }
  }

  /**
   * @returns The first expression of the text, or `undefined` if there is none.
   */
  readFirst(): Value | undefined {
    return this.readAll()[0];
  }

  private read(): Value {
    const item = this.readItem();
    if (item === DOT) throw new LispError("Unexpected dot!");
    return item;
  }

  private readItem(): Value | typeof DOT {
    this.skipBlanks();
    if (this.eof()) throw new IncompleteInput("Unexpected end of input!");
    const c = this.next();
    switch (c) {
      case "(":
        return this.readList();
      case ")":
        throw new LispError("Unexpected closing parenthesis!");
      case "'":
        return list(QUOTE, this.read());
      case "`":
        return list(QUASIQUOTE, this.read());
      case ",":
        if (this.peek() === "@") {
          this.pos++;
          return list(UNQUOTE_SPLICING, this.read());
        }
        return list(UNQUOTE, this.read());
      case '"':
        return this.readString();
      case "#":
        return this.readDispatch();
      default:
        this.pos--;
        return this.readAtom();
    }
  }

  private readList(): Value {
    const items: Value[] = [];
    let tail: Value = NIL;
    for (;;) {
      this.skipBlanks();
      if (this.eof()) throw new IncompleteInput("Missing closing parenthesis!");
      if (this.peek() === ")") {
        this.pos++;
        break;
      }
      const item = this.readItem();
      if (item === DOT) {
        tail = this.read();
        this.skipBlanks();
        if (this.eof()) throw new IncompleteInput("Missing closing parenthesis!");
        if (this.next() !== ")") throw new LispError("Bad dotted list!");
        break;
      }
      items.push(item);
    }
    let result = tail;
    for (let i = items.length - 1; i >= 0; i--) result = new Cons(items[i], result);
    return result;
  }

  private readString(): string {
    let s = "";
    for (;;) {
      if (this.eof()) throw new IncompleteInput("Missing closing double quote!");
      const c = this.next();
      if (c === '"') return s;
      if (c === "\\") {
        if (this.eof()) throw new IncompleteInput("Missing closing double quote!");
        s += this.next();
      } else {
        s += c;
      }
    }
  }

  private readDispatch(): Value {
    const c = this.next();
    if (c === "'") return list(FUNCTION, this.read());
    if (c === "|") {
      const end = this.text.indexOf("|#", this.pos);
      if (end < 0) throw new IncompleteInput("Unterminated comment!");
      this.pos = end + 2;
      return this.read();
    }
    throw new LispError(`Unsupported reader macro: #${c}`);
  }

  private readAtom(): Value | typeof DOT {
    const start = this.pos;
    while (!this.eof() && !this.isDelimiter(this.peek())) this.pos++;
    const token = this.text.slice(start, this.pos);
    if (token === ".") return DOT;
    if (RX_NUMBER.test(token)) return Number(token);
    return intern(token);
  }

  private skipBlanks() {
    while (!this.eof()) {
      const c = this.peek();
      if (c === ";") {
        while (!this.eof() && this.peek() !== "\n") this.pos++;
      } else if (c.trim() === "") {
        this.pos++;
      } else {
        return;
      }
    }
  }

  private isDelimiter(c: string) {
    return c.trim() === "" || DELIMITERS.has(c);
  }

  private eof() {
    return this.pos >= this.text.length;
  }

  private peek() {
    return this.text.charAt(this.pos);
  }

  private next() {
    return this.text.charAt(this.pos++);
  }
}
