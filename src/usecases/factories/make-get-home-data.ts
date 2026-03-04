import { GetHomeData } from "../get-home-data.js";
import { PrismaWorkoutPlanRepository } from "../../repositories/prisma/prisma-workout-plan-repository.js";
import { PrismaWorkoutSessionRepository } from "../../repositories/prisma/prisma-workout-session-repository.js";

export function makeGetHomeData() {
  const workoutPlanRepository = new PrismaWorkoutPlanRepository();
  const workoutSessionRepository = new PrismaWorkoutSessionRepository();
  return new GetHomeData(workoutPlanRepository, workoutSessionRepository);
}
