import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthController } from "../controllers/auth.controller.js";
import {
  RegisterBodySchema,
  LoginBodySchema,
  AuthResponseSchema,
} from "../schemas/auth-schema.js";

const authController = new AuthController();

export const authRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    schema: {
      operationId: "register",
      tags: ["Auth"],
      summary: "Register a new user",
      body: RegisterBodySchema,
      response: {
        201: z.object({ id: z.string(), name: z.string(), email: z.string() }),
      },
    },
    handler: authController.register.bind(authController),
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      operationId: "login",
      tags: ["Auth"],
      summary: "Authenticate user",
      body: LoginBodySchema,
      response: { 200: AuthResponseSchema },
    },
    handler: authController.login.bind(authController),
  });
};
