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

export const getWorkoutPlanParamsSchema = z.object({
  workoutPlanId: z.uuid(),
});

export const GetWorkoutPlanResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  workoutDays: z.array(
    z.object({
      id: z.uuid(),
      weekDay: z.enum(WeekDaySchema.options),
      name: z.string(),
      isRest: z.boolean(),
      coverImageUrl: z.string().nullable().optional(),
      estimatedDurationInSeconds: z.number(),
      exercisesCount: z.number(),
    }),
  ),
});

export const getWorkoutDayParamsSchema = z.object({
  workoutPlanId: z.uuid(),
  workoutDayId: z.uuid(),
});

export const getWorkoutDayResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isRest: z.boolean(),
  coverImageUrl: z.url().optional(),
  estimatedDurationInSeconds: z.number(),
  weekDay: z.enum(WeekDaySchema.options),
  exercises: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      order: z.number(),
      workoutDayId: z.uuid(),
      sets: z.number(),
      reps: z.number(),
      restTimeInSeconds: z.number(),
    }),
  ),
  workoutSessions: z.array(
    z.object({
      id: z.uuid(),
      workoutDayId: z.uuid(),
      startedAt: z.iso.date().optional(),
      completedAt: z.iso.date().optional(),
    }),
  ),
});

export type CreateWorkoutPlanBody = z.infer<typeof createWorkoutPlanBodySchema>;
export type getWorkoutPlanParams = z.infer<typeof getWorkoutPlanParamsSchema>;
export type getWorkoutPlanResponse = z.infer<
  typeof GetWorkoutPlanResponseSchema
>;
export type getWorkoutDayParams = z.infer<typeof getWorkoutDayParamsSchema>;
export type getWorkoutDayResponse = z.infer<typeof getWorkoutDayResponseSchema>;
