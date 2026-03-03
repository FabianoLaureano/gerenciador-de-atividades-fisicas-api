import { WorkoutPlan } from "../../models/workout-plan.model.js";

export interface IWorkoutPlanRepository {
  findWorkoutPlanByUserId(userId: string): Promise<WorkoutPlan | null>;
  create(workoutPlan: WorkoutPlan): Promise<void>;
  save(workoutPlan: WorkoutPlan): Promise<void>;
}
