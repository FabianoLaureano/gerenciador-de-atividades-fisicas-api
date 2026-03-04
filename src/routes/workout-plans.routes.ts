import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { WorkoutPlanController } from "../controllers/workout-plan.controller.js";
import {
  createWorkoutPlanBodySchema,
  createWorkoutPlanResponseSchema,
} from "../schemas/workout-plan.schema.js";
import { ErrorSchema } from "../schemas/error-schema.js";
import {
  startWorkoutSessionParamsSchema,
  startWorkoutSessionResponseSchema,
} from "../schemas/start-workout-session.schema.js";
import { StartWorkoutSessionController } from "../controllers/start-workout-session.controller.js";

const workoutPlanController = new WorkoutPlanController();
const startWorkoutSessionController = new StartWorkoutSessionController();

export const workoutPlanRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      operationId: "createWorkoutPlan",
      tags: ["Workout Plan"],
      summary: "Create a workout plan",
      body: createWorkoutPlanBodySchema,
      response: {
        201: createWorkoutPlanResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: workoutPlanController.handle.bind(workoutPlanController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:workoutPlanId/days/:workoutDayId/sessions",
    schema: {
      operationId: "startWorkoutSession",
      tags: ["Workout Plan"],
      summary: "Start a workout session",
      params: startWorkoutSessionParamsSchema,
      response: {
        201: startWorkoutSessionResponseSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
        422: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: startWorkoutSessionController.handle.bind(
      startWorkoutSessionController,
    ),
  });
};
