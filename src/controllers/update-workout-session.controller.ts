import { FastifyReply, FastifyRequest } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { makeUpdateWorkoutSession } from "../usecases/factories/make-update-workout-session.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import {
  UpdateWorkoutSessionBody,
  UpdateWorkoutSessionParams,
} from "../schemas/update-workout-session.schema.js";

export class UpdateWorkoutSessionController {
  async handle(
    request: FastifyRequest<{
      Params: UpdateWorkoutSessionParams;
      Body: UpdateWorkoutSessionBody;
    }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId;

    const updateWorkoutSession = makeUpdateWorkoutSession();

    const result = await updateWorkoutSession.execute({
      userId: userId,
      workoutPlanId: request.params.workoutPlanId,
      workoutDayId: request.params.workoutDayId,
      sessionId: request.params.sessionId,
      completedAt: request.body.completedAt,
    });

    return reply.status(200).send(result);
  }
}
