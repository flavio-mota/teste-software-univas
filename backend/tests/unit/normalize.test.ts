import { describe, it, expect } from "vitest";
import { normalizeName } from "../../src/utils/normalize";

describe("normalizeName", () => {
  it("deve normalizar nomes corretamente", () => {
    expect(normalizeName(" JoHn DoE ")).toBe("john doe");
    expect(normalizeName(" aLiCe ")).toBe("alice");
  });
});
