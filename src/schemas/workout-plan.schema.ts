// src/schemas/workout-plan.schema.ts
import { z } from "zod";
import { WeekDaySchema } from "../models/workout-day.model.js";

const workoutExerciseSchema = z.object({
  order: z.number().int().min(0),
  name: z.string().trim().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  restTimeInSeconds: z.number().int().min(1),
});

const workoutDaySchema = z.object({
  name: z.string().trim().min(1),
  weekDay: z.enum(WeekDaySchema.options),
  isRest: z.boolean().default(false),
  estimatedDurationInSeconds: z.number().int().min(1),
  coverImageUrl: z.url().optional(),
  exercises: z.array(workoutExerciseSchema),
});

export const createWorkoutPlanBodySchema = z.object({
  name: z.string().trim().min(1),
  workoutDays: z.array(workoutDaySchema),
});

export const createWorkoutPlanResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isActive: z.boolean(),
  workoutDays: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      weekDay: z.enum(WeekDaySchema.options),
      isRest: z.boolean(),
      estimatedDurationInSeconds: z.number(),
      coverImageUrl: z.url().optional(),
      exercises: z.array(
        z.object({
          id: z.uuid(),
          order: z.number(),
          name: z.string(),
          sets: z.number(),
          reps: z.number(),
          restTimeInSeconds: z.number(),
        }),
      ),
    }),
  ),
});

export type CreateWorkoutPlanBody = z.infer<typeof createWorkoutPlanBodySchema>;
