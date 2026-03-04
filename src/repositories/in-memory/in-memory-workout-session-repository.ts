import { WorkoutSession } from "../../models/workout-session.js";
import { IWorkoutSessionRepository } from "../interfaces/workout-session-repository-interface.js";

export class InMemoryWorkoutSessionRepository implements IWorkoutSessionRepository {
  public items: WorkoutSession[] = [];

  async findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null> {
    return (
      this.items.find((item) => item.workoutDayId === workoutDayId) ?? null
    );
  }

  async create(workoutSession: WorkoutSession): Promise<void> {
    this.items.push(workoutSession);
  }

  async save(workoutSession: WorkoutSession): Promise<void> {
    const index = this.items.findIndex((item) => item.id === workoutSession.id);
    if (index !== -1) {
      this.items[index] = workoutSession;
    }
  }
}
