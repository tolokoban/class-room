import FS from "fs";
import Path from "path";
import { describe, expect, it } from "vitest";

import { Interpreter } from "./interpreter";
import { toText } from "./printer";

function makeInterpreter(answers: string[] = []) {
  let output = "";
  const interp = new Interpreter({
    write(text) {
      output += text;
    },
    async readLine() {
      const answer = answers.shift();
      if (answer === undefined) throw new Error(`No more answers!\n${output}`);
      output += `${answer}\n`;
      return answer;
    },
  });
  return { interp, getOutput: () => output };
}

async function evaluate(code: string) {
  const { interp, getOutput } = makeInterpreter();
  const value = await interp.run(code);
  return { value: toText(value, true), output: getOutput() };
}

describe("Lisp interpreter", () => {
  it("should handle basic forms", async () => {
    expect((await evaluate("(+ 1 2 (* 3 4))")).value).toBe("15");
    expect((await evaluate("(let ((x 2)) (if (> x 1) 'big 'small))")).value).toBe("BIG");
    expect((await evaluate("(defun f (a &optional (b 10)) (+ a b)) (f 1)")).value).toBe("11");
    expect((await evaluate("(loop for x in '(1 2 3) when (> x 1) sum x)")).value).toBe("5");
    expect((await evaluate("(multiple-value-bind (a b) (values 1 2) (list b a))")).value).toBe(
      "(2 1)",
    );
    expect((await evaluate("(let ((x 1)) `(a ,x ,@(list 2 3)))")).value).toBe("(A 1 2 3)");
    expect((await evaluate("(sort (list 3 1 2) #'<)")).value).toBe("(1 2 3)");
    expect((await evaluate("(loop (return 7))")).value).toBe("7");
  });

  it("should handle FORMAT", async () => {
    expect((await evaluate(`(format nil "~a-~d" 'patient 1)`)).value).toBe('"PATIENT-1"');
    expect((await evaluate(`(format t "A~&B~&~&C~%")`)).output).toBe("A\nB\nC\n");
  });

  it("should run MYCIN", async () => {
    const source = FS.readFileSync(Path.resolve(__dirname, "../../mycin.lisp"), "utf-8");
    const { interp, getOutput } = makeInterpreter([
      "Sylvia Fischer",
      "female",
      "27",
      "blood",
      "3",
      "unknown",
      "neg",
      "rod",
      "why",
      "aerobic",
      "yes",
      "serious",
      "no",
      "no",
      "no",
    ]);
    await interp.run(source);
    await interp.run("(mycin)");
    const output = getOutput();
    expect(output).toContain("2) THE MORPHOLOGY OF THE ORGANISM IS ROD");
    expect(output).toContain("Résultats pour ORGANISM-1 :");
    expect(output).toContain("ENTEROBACTERIACEAE (0.8)");
  });

  it("should run the coffee expert", async () => {
    const source = FS.readFileSync(Path.resolve(__dirname, "../../coffee.lisp"), "utf-8");
    const { interp, getOutput } = makeInterpreter(["pas-de-cafe", "bruyant-vibrant", "vide"]);
    await interp.run(source);
    await interp.run("(diagnostiquer-machine-cafe)");
    const output = getOutput();
    expect(output).toContain("Veuillez préciser l'état pour 'son-pompe'");
    expect(output).toContain("Remplissez le réservoir d'eau principal");
  });
  async function runCoffee(answers: string[]) {
    const source = FS.readFileSync(Path.resolve(__dirname, "../../coffee.lisp"), "utf-8");
    const { interp, getOutput } = makeInterpreter(answers);
    await interp.run(source);
    await interp.run("(diagnostiquer-machine-cafe)");
    return getOutput();
  }

  it("should find the Gremlin", async () => {
    const smoke = await runCoffee(["comportement-etrange", "fumee-anormale", "tabac"]);
    expect(smoke).toContain("Quelle odeur a-t-elle ?");
    expect(smoke).toContain("Un Gremlin");
    expect(await runCoffee(["comportement-etrange", "eternue"])).toContain("Un Gremlin");
    const output = await runCoffee(["comportement-etrange", "renifle", "cri-strident"]);
    expect(output).toContain("lampe torche");
    expect(output).toContain("Un Gremlin");
    expect(await runCoffee(["comportement-etrange", "renifle", "aucune"])).toContain("grippage");
  });

  it("should detect overheating", async () => {
    expect(await runCoffee(["comportement-etrange", "fumee-anormale", "brule"])).toContain(
      "Débranchez-la immédiatement",
    );
  });

  it("should handle a clean milk frother", async () => {
    const output = await runCoffee(["probleme-lait", "gicle-sans-mousse", "oui"]);
    expect(output).toContain("joint torique");
    expect(await runCoffee(["probleme-lait", "gicle-sans-mousse", "non"])).toContain(
      "protéines de lait",
    );
  });

  it("should blame Peter", async () => {
    const output = await runCoffee(["fou-rire", "oui"]);
    expect(output).toContain("Y voyez-vous des champignons ?");
    expect(output).toContain("Peter a mis des champignons");
    expect(await runCoffee(["fou-rire", "non"])).toContain("Peter est innocent");
  });
});
