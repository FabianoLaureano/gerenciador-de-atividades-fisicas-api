import { FastifyRequest, FastifyReply } from "fastify";
import { makeRegisterUser } from "../usecases/factories/make-register-user.js";
import { makeAuthenticateUser } from "../usecases/factories/make-authenticate-user.js";
import { RegisterBody, LoginBody } from "../schemas/auth-schema.js";

export class AuthController {
  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply,
  ) {
    const result = await makeRegisterUser().execute(request.body);
    return reply.status(201).send(result);
  }

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) {
    const result = await makeAuthenticateUser().execute({
      email: request.body.email,
      password: request.body.password,
    });
    return reply.status(200).send(result);
  }
}
