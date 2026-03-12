import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import { auth } from "./lib/auth.js";
import fastifyCors from "@fastify/cors";
import { errorHandler } from "./lib/error-handler.js";
import { workoutPlanRoutes } from "./routes/workout-plans.routes.js";
import { homeRoutes } from "./routes/home.routes.js";
import { statsRoutes } from "./routes/stats.routes.js";
import { aiRoutes } from "./routes/ai.routes.js";
import { meRoutes } from "./routes/me.routes.js";
import { env } from "./env/index.js";
import { trainingLogRoutes } from "./routes/training-logs.routes.js";
import { userGoalRoutes } from "./routes/user-goals.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { jwtMiddleware } from "./lib/jwt-middleware.js";

const envToLogger = {
  dev: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  prod: true,
  test: false,
};

const app = Fastify({
  logger: envToLogger[env.NODE_ENV],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const PUBLIC_ROUTES = [
  "/api/auth",
  "/auth/register",
  "/auth/login",
  "/health",
  "/docs",
  "/swagger.json",
  "/",
];

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API gerenciadora de treinos",
      description: "API para gerenciar treinos e exercícios",
      version: "1.0.0",
    },
    servers: [
      {
        description: "LocalHost",
        url: "http://localhost:3333",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: (data) => {
    const transformed = jsonSchemaTransform(data);

    const isPublic = PUBLIC_ROUTES.some((route) => data.url.startsWith(route));

    if (!isPublic && transformed.schema) {
      (transformed.schema as any).security = [{ bearerAuth: [] }];
    }

    return transformed;
  },
});

await app.register(fastifyCors, {
  origin: [
    "http://localhost:3000",
    "https://gerenciador-de-atividades-fisicas-f.vercel.app",
  ],
  credentials: true,
});

if (env.NODE_ENV !== "prod") {
  await app.register(fastifyApiReference, {
    routePrefix: "/docs",
    configuration: {
      sources: [
        {
          title: "API gerenciadora de treinos",
          slug: "api-gerenciadora-de-treinos",
          url: "/swagger.json",
        },
        {
          title: "Auth API",
          slug: "auth-api",
          url: "/api/auth/open-api/generate-schema",
        },
      ],
    },
  });
}

app.addHook("onRequest", async (request, reply) => {
  // Pega apenas o caminho (path), removendo query strings se houver
  const urlPath = request.url.split("?")[0];

  // Verifica se a rota é exatamente uma das públicas
  // OU se é a raiz EXATA "/" (evita que /me/ seja pública)
  const isPublic =
    PUBLIC_ROUTES.some(
      (route) => urlPath === route || urlPath === `${route}/`,
    ) || urlPath === "/";

  if (!isPublic) {
    await jwtMiddleware(request, reply);
  }
});

await app.register(workoutPlanRoutes, { prefix: "/workout-plans" });
await app.register(homeRoutes, { prefix: "/home" });
await app.register(statsRoutes, { prefix: "/stats" });
await app.register(aiRoutes, { prefix: "/ai" });
await app.register(meRoutes, { prefix: "/me" });
await app.register(trainingLogRoutes, { prefix: "/training-logs" });
await app.register(userGoalRoutes, { prefix: "/user-goals" });
await app.register(authRoutes, { prefix: "/auth" });

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});

app.get("/", async function handler() {
  return { message: "API is running 🚀" };
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/health",
  schema: {
    description: "Health check endpoint",
    response: {
      200: z.object({
        status: z.string(),
      }),
    },
  },
  handler: () => {
    return { status: "API is running 🚀" };
  },
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  schema: {
    hide: true,
  },
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);

      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);

      const setCookieValues: string[] = [];
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          setCookieValues.push(value);
        } else if (!key.toLowerCase().startsWith("access-control")) {
          reply.header(key, value);
        }
      });

      if (setCookieValues.length > 0) {
        reply.header("set-cookie", setCookieValues);
      }

      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error(error);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

app.register(errorHandler);

export { app };
