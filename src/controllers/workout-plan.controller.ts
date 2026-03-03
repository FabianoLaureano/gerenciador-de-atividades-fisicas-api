import { fromNodeHeaders } from "better-auth/node";
import type { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";
import { makeCreateWorkoutPlan } from "../usecases/factories/make-create-workout-plan.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { CreateWorkoutPlanBody } from "../schemas/workout-plan.schema.js";

export class WorkoutPlanController {
  async handle(
    request: FastifyRequest<{ Body: CreateWorkoutPlanBody }>,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    const result = await makeCreateWorkoutPlan().execute({
      userId: session.user.id,
      name: request.body.name,
      workoutDays: request.body.workoutDays,
    });

    return reply.status(201).send(result);
  }
}
