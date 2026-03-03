import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { WorkoutPlanController } from "../controllers/workout-plan.controller.js";
import {
  createWorkoutPlanBodySchema,
  createWorkoutPlanResponseSchema,
} from "../schemas/workout-plan.schema.js";
import { ErrorSchema } from "../schemas/error-schema.js";

const workoutPlanController = new WorkoutPlanController();

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
};
