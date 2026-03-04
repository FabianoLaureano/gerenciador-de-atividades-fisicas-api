import { prisma } from "../../lib/db.js";
import { IWorkoutPlanRepository } from "../interfaces/workout-plan-repository-interface.js";
import { WorkoutPlan } from "../../models/workout-plan.model.js";
import { WorkoutDay } from "../../models/workout-day.model.js";
import { WorkoutExercise } from "../../models/workout-exercise.model.js";

export class PrismaWorkoutPlanRepository implements IWorkoutPlanRepository {
  async findWorkoutPlanById(id: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!workoutPlan) return null;

    return WorkoutPlan.restore({
      ...workoutPlan,
      workoutDays: workoutPlan.workoutDays.map((day) =>
        WorkoutDay.restore({
          ...day,
          exercises: day.exercises.map((exercise) =>
            WorkoutExercise.restore(exercise),
          ),
        }),
      ),
    });
  }

  async findWorkoutPlanByUserId(userId: string): Promise<WorkoutPlan | null> {
    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        workoutDays: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!workoutPlan) return null;

    return WorkoutPlan.restore({
      ...workoutPlan,
      workoutDays: workoutPlan.workoutDays.map((day) =>
        WorkoutDay.restore({
          ...day,
          exercises: day.exercises.map((exercise) =>
            WorkoutExercise.restore(exercise),
          ),
        }),
      ),
    });
  }

  async create(workoutPlan: WorkoutPlan): Promise<void> {
    await prisma.workoutPlan.create({
      data: {
        id: workoutPlan.id,
        name: workoutPlan.name,
        userId: workoutPlan.userId,
        isActive: workoutPlan.isActive,
        createdAt: workoutPlan.createdAt,
        updatedAt: workoutPlan.updatedAt,
        workoutDays: {
          create: workoutPlan.workoutDays.map((day) => ({
            id: day.id,
            name: day.name,
            weekDay: day.weekDay,
            isRest: day.isRest,
            estimatedDurationInSeconds: day.estimatedDurationInSeconds,
            coverImageUrl: day.coverImageUrl,
            exercises: {
              create: day.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                order: exercise.order,
                sets: exercise.sets,
                reps: exercise.reps,
                restTimeInSeconds: exercise.restTimeInSeconds,
              })),
            },
          })),
        },
      },
    });
  }

  async save(workoutPlan: WorkoutPlan): Promise<void> {
    await prisma.workoutPlan.update({
      where: { id: workoutPlan.id },
      data: {
        isActive: workoutPlan.isActive,
        updatedAt: new Date(),
      },
    });
  }
}
