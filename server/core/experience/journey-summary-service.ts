import type { JourneySummaryView, StudentContext } from "@shared/contentfy";
import { experienceFallbackService } from "./experience-fallback-service";

export class JourneySummaryService {
  build(ctx: StudentContext): JourneySummaryView {
    return experienceFallbackService.journeySummary(ctx);
  }
}

export const journeySummaryService = new JourneySummaryService();
