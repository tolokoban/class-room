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
});
