import { IWorkoutPlanRepository } from "../interfaces/workout-plan-repository-interface.js";
import { WorkoutPlan } from "../../models/workout-plan.model.js";

export class InMemoryWorkoutPlanRepository implements IWorkoutPlanRepository {
  public items: WorkoutPlan[] = [];

  async findWorkoutPlanByUserId(userId: string): Promise<WorkoutPlan | null> {
    return (
      this.items.find((plan) => plan.userId === userId && plan.isActive) ?? null
    );
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    this.items.push(workoutPlan);
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    const index = this.items.findIndex((plan) => plan.id === workoutPlan.id);
    if (index >= 0) {
      this.items[index] = workoutPlan;
    }
  }
}
