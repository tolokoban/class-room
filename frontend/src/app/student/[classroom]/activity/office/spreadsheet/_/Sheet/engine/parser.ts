import { type ErrorCode } from "./locale";
import { type Ref, type Token } from "./tokenizer";

export type Node =
  | { type: "number"; value: number }
  | { type: "ref"; ref: Ref }
  | { type: "range"; from: Ref; to: Ref }
  | { type: "error"; code: ErrorCode }
  | { type: "name"; text: string }
  | { type: "unary"; op: "+" | "-"; arg: Node }
  | { type: "binary"; op: "+" | "-" | "*" | "/"; left: Node; right: Node }
  | { type: "call"; name: string; args: Node[] };

export class ParseError extends Error {}

/**
 * Build the syntax tree of a formula.
 *
 * ```
 * expr    := term (("+" | "-") term)*
 * term    := unary (("*" | "/") unary)*
 * unary   := ("+" | "-") unary | primary
 * primary := number | ref (":" ref)? | error | name | function "(" args? ")" | "(" expr ")"
 * args    := expr (separator expr)*
 * ```
 * @throws ParseError
 */
export function parse(tokens: Token[]): Node {
  const parser = new Parser(tokens.filter((token) => token.type !== "space"));
  const node = parser.expr();
  if (!parser.done) throw new ParseError("Unexpected token");

  return node;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  get done() {
    return this.index >= this.tokens.length;
  }

  expr(): Node {
    let left = this.term();
    for (;;) {
      const op = this.nextOp("+", "-");
      if (!op) return left;

      left = { type: "binary", op, left, right: this.term() };
    }
  }

  private term(): Node {
    let left = this.unary();
    for (;;) {
      const op = this.nextOp("*", "/");
      if (!op) return left;

      left = { type: "binary", op, left, right: this.unary() };
    }
  }

  private unary(): Node {
    const op = this.nextOp("+", "-");
    if (op) return { type: "unary", op, arg: this.unary() };

    return this.primary();
  }

  private primary(): Node {
    const token = this.next();
    switch (token.type) {
      case "number":
        return { type: "number", value: token.value };
      case "error":
        return { type: "error", code: token.code };
      case "name":
        return { type: "name", text: token.text };
      case "ref":
        return this.refOrRange(token.ref);
      case "function":
        return this.call(token.name);
      case "op":
        if (token.text === "(") {
          const node = this.expr();
          this.expectOp(")");
          return node;
        }
    }
    throw new ParseError("Unexpected token");
  }

  private refOrRange(from: Ref): Node {
    if (!this.nextOp(":")) return { type: "ref", ref: from };

    const to = this.next();
    if (to.type === "ref") return { type: "range", from, to: to.ref };
    // A range with a "#REF!" end (after a fill handle drag, for instance).
    if (to.type === "error") return { type: "error", code: to.code };

    throw new ParseError("Expected a reference");
  }

  private call(name: string): Node {
    this.expectOp("(");
    const args: Node[] = [];
    if (this.nextOp(")")) return { type: "call", name, args };

    for (;;) {
      args.push(this.expr());
      if (this.nextOp(")")) return { type: "call", name, args };

      const token = this.next();
      if (token.type !== "separator") throw new ParseError("Expected a separator");
    }
  }

  private next(): Token {
    const token = this.tokens[this.index];
    if (!token) throw new ParseError("Unexpected end of formula");

    this.index++;
    return token;
  }

  private nextOp<T extends string>(...ops: T[]): T | undefined {
    const token = this.tokens[this.index];
    if (token?.type !== "op" || !ops.includes(token.text as T)) return undefined;

    this.index++;
    return token.text as T;
  }

  private expectOp(op: string) {
    if (!this.nextOp(op)) throw new ParseError(`Expected "${op}"`);
  }
}
