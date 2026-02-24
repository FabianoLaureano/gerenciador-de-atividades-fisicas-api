import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/", async function handler() {
  return { message: "API is running 🚀" };
});

export { app };
