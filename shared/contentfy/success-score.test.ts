import { describe, expect, it } from "vitest";
import { computeSuccessScore } from "./contracts/success-score";
import { CONTENTFY_IDENTITY } from "./identity";

describe("ContentFy Success Score", () => {
  it("returns seed for empty progress", () => {
    const result = computeSuccessScore({
      videoProgress: 0,
      activitiesCompleted: 0,
      quizzesPassed: 0,
      applicationTasks: 0,
      consistencyDays: 0,
      completionRate: 0,
    });
    expect(result.score).toBe(0);
    expect(result.grade).toBe("seed");
  });

  it("rewards multi-signal evolution, not only videos", () => {
    const result = computeSuccessScore({
      videoProgress: 1,
      activitiesCompleted: 10,
      quizzesPassed: 8,
      applicationTasks: 6,
      consistencyDays: 30,
      completionRate: 1,
    });
    expect(result.score).toBe(100);
    expect(result.grade).toBe("master");
  });

  it("keeps ContentFy identity labels", () => {
    expect(CONTENTFY_IDENTITY.paymentLabel).toBe("Pagamento ContentFy");
    expect(CONTENTFY_IDENTITY.guaranteeDays).toBe(30);
    expect(CONTENTFY_IDENTITY.company).toBe("BuilderTudo Technologies");
  });
});
