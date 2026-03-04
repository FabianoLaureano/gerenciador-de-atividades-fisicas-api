import { prisma } from "../../lib/db.js";
import { IWorkoutSessionRepository } from "../interfaces/workout-session-repository-interface.js";
import { WorkoutSession } from "../../models/workout-session.js";

export class PrismaWorkoutSessionRepository implements IWorkoutSessionRepository {
  async findWorkoutSessionByWorkoutDayId(
    workoutDayId: string,
  ): Promise<WorkoutSession | null> {
    const workoutSession = await prisma.workoutSession.findFirst({
      where: { workoutDayId },
    });

    if (!workoutSession) return null;

    return WorkoutSession.restore({
      ...workoutSession,
    });
  }

  async create(workoutSession: WorkoutSession): Promise<void> {
    await prisma.workoutSession.create({
      data: {
        workoutDayId: workoutSession.workoutDayId,
        startedAt: workoutSession.startedAt,
      },
    });
  }

  async save(workoutSession: WorkoutSession): Promise<void> {
    await prisma.workoutSession.update({
      where: { id: workoutSession.id },
      data: {
        workoutDayId: workoutSession.workoutDayId,
        startedAt: workoutSession.startedAt,
        completedAt: workoutSession.completedAt,
      },
    });
  }
}
