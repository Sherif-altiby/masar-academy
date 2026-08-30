import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "../config/env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

/**
 * Reuse a single PrismaClient instance across hot-reloads in development to
 * avoid exhausting the Postgres connection pool.
 *
 * Prisma 7 requires an explicit driver adapter (here, @prisma/adapter-pg
 * wrapping node-postgres) — there is no bundled native query-engine binary
 * to fall back to.
 */
export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}
