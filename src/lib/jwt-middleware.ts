import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../env/index.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

export async function jwtMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    request.userId = payload.sub;
  } catch {
    throw new UnauthorizedError();
  }
}
