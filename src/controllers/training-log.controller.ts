import { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { makeCreateTrainingLog } from "../usecases/factories/make-create-training-log.js";
import { makeGetTrainingLogs } from "../usecases/factories/make-get-training-logs.js";
import { CreateTrainingLogBody } from "../schemas/training-log.schema.js";

export class TrainingLogController {
  async create(
    request: FastifyRequest<{ Body: CreateTrainingLogBody }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId;

    const result = await makeCreateTrainingLog().execute({
      userId: userId,
      name: request.body.name,
      description: request.body.description,
      type: request.body.type,
    });

    return reply.status(201).send(result);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;

    const result = await makeGetTrainingLogs().execute({
      userId: userId,
    });

    return reply.status(200).send(result);
  }
}
