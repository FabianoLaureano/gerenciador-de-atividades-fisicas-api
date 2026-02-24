import { app } from "./app.js";

try {
  await app.listen({ port: 3333 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
