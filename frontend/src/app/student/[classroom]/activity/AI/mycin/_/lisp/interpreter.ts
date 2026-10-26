import { registerBuiltins } from "./builtins";
import { QUASIQUOTE, Reader, UNQUOTE, UNQUOTE_SPLICING } from "./reader";
import { toText } from "./printer";
import {
  bool,
  car,
  Cons,
  eql,
  HashTable,
  intern,
  isTrue,
  LispError,
  LispFunction,
  LispStruct,
  LispSymbol,
  list,
  MultipleValues,
  NIL,
  primary,
  StructType,
  T,
  toArray,
  Value,
} from "./types";

/**
 * How the Lisp program talks to the outside world.
 */
export interface LispIO {
  write(text: string): void;
  /**
   * Wait for the user to type a line.
   * The line must not include the trailing newline.
   */
  readLine(): Promise<string>;
}

export class Env {
  private readonly vars = new Map<LispSymbol, Value>();

  constructor(public readonly parent: Env | null) {}

  define(name: LispSymbol, value: Value) {
    this.vars.set(name, value);
  }

  find(name: LispSymbol): Env | null {
    let env: Env | null = this;
    while (env) {
      if (env.vars.has(name)) return env;
      env = env.parent;
    }
    return null;
  }

  get(name: LispSymbol): Value | undefined {
    return this.vars.get(name);
  }
}

class ReturnSignal {
  constructor(
    public readonly tag: LispSymbol,
    public readonly value: Value,
  ) {}
}

interface LambdaList {
  required: LispSymbol[];
  optional: Array<{ name: LispSymbol; init: Value }>;
  rest: LispSymbol | null;
  key: Array<{ name: LispSymbol; init: Value }>;
}

type SpecialForm = (args: Value[], env: Env) => Promise<Value>;

const LAMBDA = intern("LAMBDA");
const OTHERWISE = intern("OTHERWISE");

export class Interpreter {
  readonly global = new Env(null);
  readonly functions = new Map<LispSymbol, LispFunction>();
  readonly macros = new Map<LispSymbol, LispFunction>();
  readonly plists = new Map<LispSymbol, Map<Value, Value>>();
  /** Types defined by DEFTYPE, with their expansion. */
  private readonly types = new Map<LispSymbol, Value>();
  private readonly structs = new Map<LispSymbol, StructType>();
  /** Structure accessors, used by SETF. */
  private readonly accessors = new Map<LispSymbol, { type: StructType; index: number }>();
  private readonly specialForms = new Map<LispSymbol, SpecialForm>();
  /** Column of the cursor in the output, used by FRESH-LINE and "~&". */
  private column = 0;

  constructor(private readonly io: LispIO) {
    this.global.define(T, T);
    this.global.define(NIL, NIL);
    this.registerSpecialForms();
    registerBuiltins(this);
  }

  /**
   * Evaluate all the expressions of `source`.
   * @returns The value of the last one.
   */
  async run(source: string): Promise<Value> {
    let result: Value = NIL;
    for (const form of new Reader(source).readAll()) {
      result = await this.eval(form, this.global);
    }
    return result;
  }

  write(text: string) {
    if (text.length === 0) return;
    this.io.write(text);
    const lastNewLine = text.lastIndexOf("\n");
    this.column = lastNewLine < 0 ? this.column + text.length : text.length - lastNewLine - 1;
  }

  freshLine() {
    if (this.column === 0) return false;
    this.write("\n");
    return true;
  }

  async readLine(): Promise<string> {
    const line = await this.io.readLine();
    // The user pressed Enter, so we are at the beginning of a line.
    this.column = 0;
    return line;
  }

  isFbound(name: LispSymbol) {
    return this.functions.has(name) || this.macros.has(name) || this.specialForms.has(name);
  }

  getFunction(designator: Value): LispFunction {
    if (designator instanceof LispFunction) return designator;
    if (designator instanceof LispSymbol) {
      const fn = this.functions.get(designator);
      if (fn) return fn;
      throw new LispError(`Undefined function: ${designator.name}`);
    }
    throw new LispError(`Not a function: ${toText(designator, true)}`);
  }

  async callFunction(designator: Value, args: Value[]): Promise<Value> {
    return primary(await this.getFunction(designator).call(args));
  }

  async eval(form: Value, env: Env): Promise<Value> {
    if (form instanceof LispSymbol) return this.getVariable(form, env);
    if (!(form instanceof Cons)) return form;

    const head = form.car;
    if (head instanceof LispSymbol) {
      const special = this.specialForms.get(head);
      if (special) return special(toArray(form.cdr), env);
      const macro = this.macros.get(head);
      if (macro) {
        const expansion = primary(await macro.call(toArray(form.cdr)));
        return this.eval(expansion, env);
      }
      const fn = this.functions.get(head);
      if (!fn) throw new LispError(`Undefined function: ${head.name}`);
      return fn.call(await this.evalArgs(form.cdr, env));
    }
    if (head instanceof Cons && head.car === LAMBDA) {
      const fn = this.makeLambda(head, env);
      return fn.call(await this.evalArgs(form.cdr, env));
    }
    throw new LispError(`Illegal function call: ${toText(form, true)}`);
  }

  typep(value: Value, spec: Value): boolean {
    if (spec === T) return true;
    if (spec === NIL) return false;
    if (spec instanceof LispSymbol) {
      const expansion = this.types.get(spec);
      if (expansion !== undefined) return this.typep(value, expansion);
      const struct = this.structs.get(spec);
      if (struct) return value instanceof LispStruct && value.type === struct;
      switch (spec.name) {
        case "NUMBER":
        case "REAL":
          return typeof value === "number";
        case "INTEGER":
        case "FIXNUM":
          return typeof value === "number" && Number.isInteger(value);
        case "FLOAT":
          return typeof value === "number" && !Number.isInteger(value);
        case "STRING":
          return typeof value === "string";
        case "SYMBOL":
          return value instanceof LispSymbol;
        case "KEYWORD":
          return value instanceof LispSymbol && value.isKeyword;
        case "LIST":
          return value === NIL || value instanceof Cons;
        case "CONS":
          return value instanceof Cons;
        case "NULL":
          return value === NIL;
        case "ATOM":
          return !(value instanceof Cons);
        case "FUNCTION":
          return value instanceof LispFunction;
        case "HASH-TABLE":
          return value instanceof HashTable;
      }
      throw new LispError(`Unknown type: ${spec.name}`);
    }
    if (spec instanceof Cons && spec.car instanceof LispSymbol) {
      const args = toArray(spec.cdr);
      switch (spec.car.name) {
        case "MEMBER":
          return args.some((item) => eql(item, value));
        case "EQL":
          return eql(args[0], value);
        case "OR":
          return args.some((item) => this.typep(value, item));
        case "AND":
          return args.every((item) => this.typep(value, item));
        case "NOT":
          return !this.typep(value, args[0]);
      }
    }
    throw new LispError(`Unknown type: ${toText(spec, true)}`);
  }

  private getVariable(name: LispSymbol, env: Env): Value {
    if (name.isKeyword) return name;
    const scope = env.find(name);
    if (!scope) throw new LispError(`Unbound variable: ${name.name}`);
    return scope.get(name) ?? NIL;
  }

  private setVariable(name: LispSymbol, value: Value, env: Env) {
    if (name.isKeyword || name === NIL || name === T) {
      throw new LispError(`Cannot change the value of ${name.name}`);
    }
    (env.find(name) ?? this.global).define(name, value);
  }

  private async evalArgs(args: Value, env: Env): Promise<Value[]> {
    const values: Value[] = [];
    for (const arg of toArray(args)) values.push(primary(await this.eval(arg, env)));
    return values;
  }

  private async progn(body: Value[], env: Env): Promise<Value> {
    let result: Value = NIL;
    for (const form of body) result = await this.eval(form, env);
    return result;
  }

  private async block(tag: LispSymbol, action: () => Promise<Value>): Promise<Value> {
    try {
      return await action();
    } catch (ex) {
      if (ex instanceof ReturnSignal && ex.tag === tag) return ex.value;
      throw ex;
    }
  }

  private parseLambdaList(lambdaList: Value): LambdaList {
    const result: LambdaList = { required: [], optional: [], rest: null, key: [] };
    let mode = "required";
    for (const item of toArray(lambdaList)) {
      if (item instanceof LispSymbol && item.name.startsWith("&")) {
        mode = item.name;
        continue;
      }
      const name = item instanceof Cons ? item.car : item;
      if (!(name instanceof LispSymbol)) {
        throw new LispError(`Bad lambda list: ${toText(lambdaList, true)}`);
      }
      const init = item instanceof Cons ? car(item.cdr) : NIL;
      switch (mode) {
        case "required":
          result.required.push(name);
          break;
        case "&OPTIONAL":
          result.optional.push({ name, init });
          break;
        case "&REST":
        case "&BODY":
          result.rest = name;
          break;
        case "&KEY":
          result.key.push({ name, init });
          break;
        default:
          throw new LispError(`Unsupported lambda list keyword: ${mode}`);
      }
    }
    return result;
  }

  private async bindParams(name: string, params: LambdaList, args: Value[], env: Env) {
    if (args.length < params.required.length) {
      throw new LispError(`Too few arguments for ${name}`);
    }
    let index = 0;
    for (const param of params.required) env.define(param, args[index++]);
    for (const param of params.optional) {
      const value =
        index < args.length ? args[index++] : primary(await this.eval(param.init, env));
      env.define(param.name, value);
    }
    const remaining = args.slice(index);
    if (params.rest) env.define(params.rest, list(...remaining));
    if (params.key.length > 0) {
      for (const param of params.key) {
        const position = remaining.findIndex(
          (item, i) => i % 2 === 0 && item instanceof LispSymbol && item.name === `:${param.name.name}`,
        );
        const value =
          position < 0 ? primary(await this.eval(param.init, env)) : remaining[position + 1] ?? NIL;
        env.define(param.name, value);
      }
    } else if (!params.rest && remaining.length > 0) {
      throw new LispError(`Too many arguments for ${name}`);
    }
  }

  private makeClosure(
    name: string,
    lambdaList: Value,
    body: Value[],
    env: Env,
    blockName: LispSymbol | null,
  ): LispFunction {
    const params = this.parseLambdaList(lambdaList);
    return new LispFunction(name, async (args) => {
      const local = new Env(env);
      await this.bindParams(name, params, args, local);
      if (!blockName) return this.progn(body, local);
      return this.block(blockName, () => this.progn(body, local));
    });
  }

  private makeLambda(lambda: Cons, env: Env): LispFunction {
    const [lambdaList, ...body] = toArray(lambda.cdr);
    return this.makeClosure("LAMBDA", lambdaList, body, env, null);
  }

  private async setPlace(place: Value, value: Value, env: Env) {
    if (place instanceof LispSymbol) {
      this.setVariable(place, value, env);
      return;
    }
    if (place instanceof Cons && place.car instanceof LispSymbol) {
      const args = await this.evalArgs(place.cdr, env);
      switch (place.car.name) {
        case "GETHASH": {
          const table = args[1];
          if (!(table instanceof HashTable)) throw new LispError("Not a hash table!");
          table.set(args[0], value);
          return;
        }
        case "GET": {
          const symbol = args[0];
          if (!(symbol instanceof LispSymbol)) throw new LispError("Not a symbol!");
          let plist = this.plists.get(symbol);
          if (!plist) {
            plist = new Map();
            this.plists.set(symbol, plist);
          }
          plist.set(args[1], value);
          return;
        }
        case "CAR":
        case "FIRST":
          if (!(args[0] instanceof Cons)) throw new LispError("Not a cons!");
          args[0].car = value;
          return;
        case "CDR":
        case "REST":
          if (!(args[0] instanceof Cons)) throw new LispError("Not a cons!");
          args[0].cdr = value;
          return;
      }
      const accessor = this.accessors.get(place.car);
      if (accessor) {
        const struct = args[0];
        if (!(struct instanceof LispStruct) || struct.type !== accessor.type) {
          throw new LispError(`Not a ${accessor.type.name.name}!`);
        }
        struct.slots[accessor.index] = value;
        return;
      }
    }
    throw new LispError(`Unsupported SETF place: ${toText(place, true)}`);
  }

  private async quasiquote(template: Value, env: Env): Promise<Value> {
    if (!(template instanceof Cons)) return template;
    if (template.car === UNQUOTE) return primary(await this.eval(car(template.cdr), env));

    const items: Value[] = [];
    let cursor: Value = template;
    let tail: Value = NIL;
    while (cursor instanceof Cons) {
      if (cursor.car === UNQUOTE) {
        // `(a . ,b)
        tail = primary(await this.eval(car(cursor.cdr), env));
        cursor = NIL;
        break;
      }
      const item = cursor.car;
      if (item instanceof Cons && item.car === UNQUOTE_SPLICING) {
        items.push(...toArray(primary(await this.eval(car(item.cdr), env))));
      } else {
        items.push(await this.quasiquote(item, env));
      }
      cursor = cursor.cdr;
    }
    if (cursor !== NIL) tail = cursor;
    let result = tail;
    for (let i = items.length - 1; i >= 0; i--) result = new Cons(items[i], result);
    return result;
  }

  private defineStruct(args: Value[], env: Env): LispSymbol {
    const [nameSpec, ...slotSpecs] = args;
    const name = nameSpec instanceof Cons ? nameSpec.car : nameSpec;
    if (!(name instanceof LispSymbol)) throw new LispError("Bad DEFSTRUCT name!");
    const slots: LispSymbol[] = [];
    const defaults: Value[] = [];
    for (const spec of slotSpecs) {
      // Documentation string.
      if (typeof spec === "string") continue;
      const slot = spec instanceof Cons ? spec.car : spec;
      if (!(slot instanceof LispSymbol)) throw new LispError("Bad DEFSTRUCT slot!");
      slots.push(slot);
      defaults.push(spec instanceof Cons ? car(spec.cdr) : NIL);
    }
    const type: StructType = { name, slots };
    this.structs.set(name, type);

    const prefix = name.name;
    const constructor = intern(`MAKE-${prefix}`);
    this.functions.set(
      constructor,
      new LispFunction(constructor.name, async (initArgs) => {
        const values: Value[] = [];
        for (let index = 0; index < slots.length; index++) {
          const keyword = `:${slots[index].name}`;
          const position = initArgs.findIndex(
            (item, i) => i % 2 === 0 && item instanceof LispSymbol && item.name === keyword,
          );
          values.push(
            position < 0
              ? primary(await this.eval(defaults[index], env))
              : initArgs[position + 1] ?? NIL,
          );
        }
        return new LispStruct(type, values);
      }),
    );
    const predicate = intern(`${prefix}-P`);
    this.functions.set(
      predicate,
      new LispFunction(predicate.name, ([value]) =>
        bool(value instanceof LispStruct && value.type === type),
      ),
    );
    const copier = intern(`COPY-${prefix}`);
    this.functions.set(
      copier,
      new LispFunction(copier.name, ([value]) => {
        if (!(value instanceof LispStruct)) throw new LispError(`Not a ${prefix}!`);
        return new LispStruct(type, [...value.slots]);
      }),
    );
    slots.forEach((slot, index) => {
      const accessor = intern(`${prefix}-${slot.name}`);
      this.accessors.set(accessor, { type, index });
      this.functions.set(
        accessor,
        new LispFunction(accessor.name, ([value]) => {
          if (!(value instanceof LispStruct) || value.type !== type) {
            throw new LispError(`${accessor.name}: ${toText(value, true)} is not a ${prefix}!`);
          }
          return value.slots[index];
        }),
      );
    });
    return name;
  }

  /**
   * Supports only a small subset of the extended LOOP macro:
   * `(loop for x in list [when test] sum|collect|count|append|do expr ...)`
   */
  private async extendedLoop(args: Value[], env: Env): Promise<Value> {
    const keyword = (index: number) => {
      const item = args[index];
      return item instanceof LispSymbol ? item.name : "";
    };
    let variable: LispSymbol | null = null;
    let listForm: Value = NIL;
    const clauses: Array<{ test: Value | null; action: string; form: Value }> = [];
    let test: Value | null = null;
    let index = 0;
    while (index < args.length) {
      const kw = keyword(index);
      if (kw === "FOR") {
        const name = args[index + 1];
        if (!(name instanceof LispSymbol) || keyword(index + 2) !== "IN") {
          throw new LispError("Only `LOOP FOR x IN list` is supported.");
        }
        variable = name;
        listForm = args[index + 3];
        index += 4;
      } else if (kw === "WHEN" || kw === "IF") {
        test = args[index + 1];
        index += 2;
      } else if (["SUM", "COLLECT", "COUNT", "APPEND", "DO"].includes(kw)) {
        clauses.push({ test, action: kw, form: args[index + 1] });
        test = null;
        index += 2;
      } else {
        throw new LispError(`Unsupported LOOP clause: ${toText(args[index], true)}`);
      }
    }
    if (!variable) throw new LispError("LOOP needs a FOR clause.");

    const items = toArray(primary(await this.eval(listForm, env)));
    let sum = 0;
    const collected: Value[] = [];
    const loopVariable = variable;
    await this.block(NIL, async () => {
      for (const item of items) {
        const local = new Env(env);
        local.define(loopVariable, item);
        for (const clause of clauses) {
          if (clause.test && !isTrue(await this.eval(clause.test, local))) continue;
          const value = primary(await this.eval(clause.form, local));
          switch (clause.action) {
            case "SUM":
              if (typeof value !== "number") throw new LispError("LOOP SUM needs numbers.");
              sum += value;
              break;
            case "COUNT":
              if (value !== NIL) sum++;
              break;
            case "COLLECT":
              collected.push(value);
              break;
            case "APPEND":
              collected.push(...toArray(value));
              break;
          }
        }
      }
      return NIL;
    });
    const accumulates = (action: string) => clauses.some((clause) => clause.action === action);
    if (accumulates("SUM") || accumulates("COUNT")) return sum;
    if (accumulates("COLLECT") || accumulates("APPEND")) return list(...collected);
    return NIL;
  }

  private registerSpecialForms() {
    const def = (name: string, form: SpecialForm) => this.specialForms.set(intern(name), form);

    def("QUOTE", async ([value]) => value);
    def("FUNCTION", async ([designator], env) => {
      if (designator instanceof Cons && designator.car === LAMBDA) {
        return this.makeLambda(designator, env);
      }
      return this.getFunction(designator);
    });
    def("LAMBDA", async (args, env) => this.makeLambda(new Cons(LAMBDA, list(...args)), env));
    def(QUASIQUOTE.name, async ([template], env) => this.quasiquote(template, env));
    def("PROGN", async (body, env) => this.progn(body, env));
    def("IF", async ([test, then, otherwise], env) =>
      isTrue(await this.eval(test, env))
        ? this.eval(then, env)
        : this.eval(otherwise ?? NIL, env),
    );
    def("WHEN", async ([test, ...body], env) =>
      isTrue(await this.eval(test, env)) ? this.progn(body, env) : NIL,
    );
    def("UNLESS", async ([test, ...body], env) =>
      isTrue(await this.eval(test, env)) ? NIL : this.progn(body, env),
    );
    def("COND", async (clauses, env) => {
      for (const clause of clauses) {
        const [test, ...body] = toArray(clause);
        const value = primary(await this.eval(test, env));
        if (value !== NIL) return body.length > 0 ? this.progn(body, env) : value;
      }
      return NIL;
    });
    def("AND", async (forms, env) => {
      let result: Value = T;
      for (let i = 0; i < forms.length; i++) {
        result = await this.eval(forms[i], env);
        if (i < forms.length - 1 && !isTrue(result)) return NIL;
      }
      return result;
    });
    def("OR", async (forms, env) => {
      for (const form of forms) {
        const value = primary(await this.eval(form, env));
        if (value !== NIL) return value;
      }
      return NIL;
    });
    def("CASE", async ([keyForm, ...clauses], env) => {
      const key = primary(await this.eval(keyForm, env));
      for (const clause of clauses) {
        const [keys, ...body] = toArray(clause);
        const match =
          keys === T ||
          keys === OTHERWISE ||
          (keys instanceof Cons ? toArray(keys).some((item) => eql(item, key)) : eql(keys, key));
        if (match) return this.progn(body, env);
      }
      return NIL;
    });

    const let_ = (sequential: boolean): SpecialForm =>
      async ([bindings, ...body], env) => {
        const local = new Env(env);
        for (const binding of toArray(bindings)) {
          const name = binding instanceof Cons ? binding.car : binding;
          if (!(name instanceof LispSymbol)) throw new LispError("Bad LET binding!");
          const init = binding instanceof Cons ? car(binding.cdr) : NIL;
          local.define(name, primary(await this.eval(init, sequential ? local : env)));
        }
        return this.progn(body, local);
      };
    def("LET", let_(false));
    def("LET*", let_(true));
    def("MULTIPLE-VALUE-BIND", async ([names, form, ...body], env) => {
      const result = await this.eval(form, env);
      const values = result instanceof MultipleValues ? result.values : [result];
      const local = new Env(env);
      toArray(names).forEach((name, index) => {
        if (!(name instanceof LispSymbol)) throw new LispError("Bad MULTIPLE-VALUE-BIND!");
        local.define(name, values[index] ?? NIL);
      });
      return this.progn(body, local);
    });

    def("SETQ", async (args, env) => {
      let value: Value = NIL;
      for (let i = 0; i < args.length; i += 2) {
        const name = args[i];
        if (!(name instanceof LispSymbol)) throw new LispError("SETQ needs a symbol!");
        value = primary(await this.eval(args[i + 1], env));
        this.setVariable(name, value, env);
      }
      return value;
    });
    def("SETF", async (args, env) => {
      let value: Value = NIL;
      for (let i = 0; i < args.length; i += 2) {
        value = primary(await this.eval(args[i + 1], env));
        await this.setPlace(args[i], value, env);
      }
      return value;
    });
    def("PUSH", async ([item, place], env) => {
      const value = new Cons(
        primary(await this.eval(item, env)),
        primary(await this.eval(place, env)),
      );
      await this.setPlace(place, value, env);
      return value;
    });
    def("POP", async ([place], env) => {
      const value = primary(await this.eval(place, env));
      if (value === NIL) return NIL;
      if (!(value instanceof Cons)) throw new LispError("POP needs a list!");
      await this.setPlace(place, value.cdr, env);
      return value.car;
    });
    const incf = (sign: number): SpecialForm =>
      async ([place, delta], env) => {
        const current = primary(await this.eval(place, env));
        const step = delta === undefined ? 1 : primary(await this.eval(delta, env));
        if (typeof current !== "number" || typeof step !== "number") {
          throw new LispError("INCF/DECF need numbers!");
        }
        const value = current + sign * step;
        await this.setPlace(place, value, env);
        return value;
      };
    def("INCF", incf(+1));
    def("DECF", incf(-1));

    def("DEFUN", async ([name, lambdaList, ...body], env) => {
      if (!(name instanceof LispSymbol)) throw new LispError("DEFUN needs a symbol!");
      this.functions.set(name, this.makeClosure(name.name, lambdaList, body, env, name));
      return name;
    });
    def("DEFMACRO", async ([name, lambdaList, ...body], env) => {
      if (!(name instanceof LispSymbol)) throw new LispError("DEFMACRO needs a symbol!");
      this.macros.set(name, this.makeClosure(name.name, lambdaList, body, env, name));
      return name;
    });
    const defvar = (overwrite: boolean): SpecialForm =>
      async ([name, init], env) => {
        if (!(name instanceof LispSymbol)) throw new LispError("Variable name must be a symbol!");
        if (overwrite || !this.global.find(name)) {
          this.global.define(name, init === undefined ? NIL : primary(await this.eval(init, env)));
        }
        return name;
      };
    def("DEFCONSTANT", defvar(true));
    def("DEFPARAMETER", defvar(true));
    def("DEFVAR", defvar(false));
    def("DEFSTRUCT", async (args, env) => this.defineStruct(args, env));
    def("DEFTYPE", async ([name, , ...body], env) => {
      if (!(name instanceof LispSymbol)) throw new LispError("DEFTYPE needs a symbol!");
      this.types.set(name, primary(await this.progn(body, env)));
      return name;
    });

    def("BLOCK", async ([name, ...body], env) => {
      if (!(name instanceof LispSymbol)) throw new LispError("BLOCK needs a symbol!");
      return this.block(name, () => this.progn(body, env));
    });
    def("RETURN-FROM", async ([name, value], env) => {
      if (!(name instanceof LispSymbol)) throw new LispError("RETURN-FROM needs a symbol!");
      throw new ReturnSignal(name, value === undefined ? NIL : await this.eval(value, env));
    });
    def("RETURN", async ([value], env) => {
      throw new ReturnSignal(NIL, value === undefined ? NIL : await this.eval(value, env));
    });
    def("LOOP", async (args, env) => {
      if (args.length > 0 && args[0] instanceof LispSymbol && args[0] !== NIL) {
        return this.extendedLoop(args, env);
      }
      return this.block(NIL, async () => {
        for (;;) await this.progn(args, env);
      });
    });
    def("DOLIST", async ([spec, ...body], env) => {
      const [name, listForm, resultForm] = toArray(spec);
      if (!(name instanceof LispSymbol)) throw new LispError("DOLIST needs a symbol!");
      const items = toArray(primary(await this.eval(listForm, env)));
      return this.block(NIL, async () => {
        for (const item of items) {
          const local = new Env(env);
          local.define(name, item);
          await this.progn(body, local);
        }
        const local = new Env(env);
        local.define(name, NIL);
        return this.eval(resultForm ?? NIL, local);
      });
    });
    def("DOTIMES", async ([spec, ...body], env) => {
      const [name, countForm, resultForm] = toArray(spec);
      if (!(name instanceof LispSymbol)) throw new LispError("DOTIMES needs a symbol!");
      const count = primary(await this.eval(countForm, env));
      if (typeof count !== "number") throw new LispError("DOTIMES needs a number!");
      return this.block(NIL, async () => {
        for (let i = 0; i < count; i++) {
          const local = new Env(env);
          local.define(name, i);
          await this.progn(body, local);
        }
        const local = new Env(env);
        local.define(name, count);
        return this.eval(resultForm ?? NIL, local);
      });
    });
  }
}
