import { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeGetWorkoutPlan } from "../usecases/factories/make-get-workout-plan.js";
import { getWorkoutPlanParams } from "../schemas/workout-plan.schema.js";

export class GetWorkoutPlanController {
  async handle(
    request: FastifyRequest<{ Params: getWorkoutPlanParams }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId;

    const workoutPlan = await makeGetWorkoutPlan().execute({
      userId: userId,
      workoutPlanId: request.params.workoutPlanId,
    });

    return reply.status(200).send(workoutPlan);
  }
}
