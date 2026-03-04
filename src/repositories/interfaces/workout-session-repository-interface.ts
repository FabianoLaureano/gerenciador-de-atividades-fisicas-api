import { WorkoutSession } from "../../models/workout-session.js";

export interface IWorkoutSessionRepository {
  findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null>;
  create(workoutSession: WorkoutSession): Promise<void>;
  save(workoutSession: WorkoutSession): Promise<void>;
}
