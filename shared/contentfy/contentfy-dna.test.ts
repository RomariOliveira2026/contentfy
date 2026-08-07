import { describe, expect, it } from "vitest";
import {
  dnaCompetencyLabels,
  formatDnaDuration,
  resolveContentfyDna,
} from "./contentfy-dna";

describe("ContentFy DNA™", () => {
  it("resolves known product DNA", () => {
    const dna = resolveContentfyDna("desacelere");
    expect(dna.transformation.length).toBeGreaterThan(20);
    expect(dna.competencies.some((c) => c.phase === "acquired")).toBe(true);
    expect(dna.objectives.length).toBeGreaterThan(0);
    expect(dnaCompetencyLabels(dna).length).toBeGreaterThan(0);
  });

  it("provides fallback DNA without inventing commerce", () => {
    const dna = resolveContentfyDna("produto-desconhecido", {
      category: "Negócios",
      name: "Produto X",
    });
    expect(dna.productSlug).toBe("produto-desconhecido");
    expect(dna.ecosystem).toContain("Negócios");
  });

  it("formats duration", () => {
    expect(formatDnaDuration(6)).toBe("~6h");
    expect(formatDnaDuration(undefined)).toBeUndefined();
  });
});
