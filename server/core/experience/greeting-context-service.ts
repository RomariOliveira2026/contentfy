import type { ExperienceGreeting, StudentContext } from "@shared/contentfy";
import { experienceFallbackService } from "./experience-fallback-service";

export class GreetingContextService {
  build(ctx: StudentContext, now = new Date()): ExperienceGreeting {
    return experienceFallbackService.greetingForState(
      ctx.studentState,
      ctx.firstName,
      now.getHours()
    );
  }
}

export const greetingContextService = new GreetingContextService();
