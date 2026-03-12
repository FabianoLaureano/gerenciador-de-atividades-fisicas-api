import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetHomeData } from "../usecases/factories/make-get-home-data.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { getHomeDataParams } from "../schemas/home.schema.js";

export class HomeController {
  async handle(
    request: FastifyRequest<{ Params: getHomeDataParams }>,
    reply: FastifyReply,
  ) {
    const userId = request.userId;

    const result = await makeGetHomeData().execute({
      userId: userId,
      date: request.params.date,
    });

    return reply.status(200).send(result);
  }
}
