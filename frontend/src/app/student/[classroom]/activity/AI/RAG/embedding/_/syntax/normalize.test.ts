import { describe, expect, it } from "vitest";

import { normalize } from "./normalize";

describe("normalize()", () => {
  it("should remove 'est-ce que'", () => {
    expect(normalize("Est-ce qu'il mange de la viande ?")).toBe("il mange de la viande ?");
    expect(normalize("Est-ce que le lion est nocturne?")).toBe("le lion est nocturne ?");
  });
  it("should turn 'est-ce' into \"c'est\"", () => {
    expect(normalize("Est-ce un animal de nuit ?")).toBe("c'est un animal de nuit ?");
  });
  it("should turn 'qu'est-ce que' into 'quoi'", () => {
    expect(normalize("Qu'est-ce qu'il mange ?")).toBe("quoi il mange ?");
  });
  it("should put the subject before the verb", () => {
    expect(normalize("Mange-t-il de la viande ?")).toBe("il mange de la viande ?");
    expect(normalize("Vit-il la nuit ?")).toBe("il vit la nuit ?");
    expect(normalize("Combien de pattes a-t-elle ?")).toBe("combien de pattes elle a ?");
    expect(normalize("De quelle couleur est-il ?")).toBe("de quelle couleur il est ?");
  });
  it("should keep the clitics with the verb", () => {
    expect(normalize("Se réveille-t-il la nuit ?")).toBe("il se réveille la nuit ?");
    expect(normalize("Y a-t-il des rayures ?")).toBe("il y a des rayures ?");
    expect(normalize("S’envole-t-il ?")).toBe("il s'envole ?");
  });
  it("should not touch other hyphens", () => {
    expect(normalize("Dis-moi s'il vole")).toBe("dis-moi s'il vole");
    expect(normalize("Il vit au Nord-Est ?")).toBe("il vit au nord-est ?");
  });
});
