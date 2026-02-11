import { buildApp } from "./app.js";
import { prisma } from "./lib/prisma.js";

async function start() {
  const app = await buildApp();
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    await app.listen({ port, host });
    console.log(`Jaanify API listening on http://${host}:${port}`);
    console.log(`API docs: http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\n${signal} received, shutting down...`);
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  }
}

start();
