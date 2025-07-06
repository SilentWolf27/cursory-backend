import { PrismaClient } from "@prisma/client";

/**
 * Prisma client instance
 * Uses global instance in development to prevent multiple connections during hot reload
 */
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalThis.prisma = prisma;
}

/**
 * Graceful shutdown function for Prisma client
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Health check function for database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
