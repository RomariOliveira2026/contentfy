import {
  computeSuccessScore,
  type SuccessScoreInputs,
  type SuccessScoreResult,
} from "@shared/contentfy";

/** ContentFy Success Score — student evolution index. */
export class SuccessScoreEngine {
  compute(input: SuccessScoreInputs): SuccessScoreResult {
    return computeSuccessScore(input);
  }
}

export const successScoreEngine = new SuccessScoreEngine();
