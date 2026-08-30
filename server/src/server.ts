import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./db";

async function main() {
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL");

  app.listen(env.PORT, () => {
    console.log(`🚀 Masar Academy API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
