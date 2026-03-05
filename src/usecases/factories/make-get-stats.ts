import { GetStats } from "../get-stats.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";

export function makeGetStats() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  return new GetStats(workoutPlanRepository, workoutSessionRepository);
}
