/** ContentFy Success Score — student evolution index. */

export interface SuccessScoreInputs {
  videoProgress: number; // 0–1
  activitiesCompleted: number;
  quizzesPassed: number;
  applicationTasks: number;
  consistencyDays: number;
  completionRate: number; // 0–1
}

export interface SuccessScoreResult {
  score: number; // 0–100
  grade: "seed" | "grow" | "rise" | "master";
  breakdown: Record<keyof SuccessScoreInputs, number>;
}

/** Pure formula — architecture ready; weights tunable later. */
export function computeSuccessScore(input: SuccessScoreInputs): SuccessScoreResult {
  const breakdown = {
    videoProgress: clamp01(input.videoProgress) * 20,
    activitiesCompleted: normalizeCount(input.activitiesCompleted, 10) * 15,
    quizzesPassed: normalizeCount(input.quizzesPassed, 8) * 20,
    applicationTasks: normalizeCount(input.applicationTasks, 6) * 15,
    consistencyDays: normalizeCount(input.consistencyDays, 30) * 15,
    completionRate: clamp01(input.completionRate) * 15,
  };

  const score = Math.round(
    breakdown.videoProgress +
      breakdown.activitiesCompleted +
      breakdown.quizzesPassed +
      breakdown.applicationTasks +
      breakdown.consistencyDays +
      breakdown.completionRate
  );

  return {
    score: Math.min(100, score),
    grade: scoreToGrade(score),
    breakdown,
  };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function normalizeCount(n: number, target: number) {
  return clamp01(n / target);
}

function scoreToGrade(score: number): SuccessScoreResult["grade"] {
  if (score >= 85) return "master";
  if (score >= 65) return "rise";
  if (score >= 40) return "grow";
  return "seed";
}
