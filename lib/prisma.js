import { PrismaClient } from "@prisma/client";

// Add logging to see if environment variables are loaded
console.log("Initializing Prisma client...");
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log("Database configuration:");
    console.log("  Host:", url.hostname);
    console.log("  Port:", url.port || "default");
    console.log("  Database:", url.pathname.substring(1));
    console.log("  SSL Mode:", url.searchParams.get('sslmode') || 'not specified');
  } catch (urlError) {
    console.log("Could not parse DATABASE_URL:", urlError.message);
  }
} else {
  console.log("DATABASE_URL not found in environment variables");
}

// Create Prisma client with additional configuration
const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

// Add event listeners for debugging
prismaClient.$on('query', (e) => {
  console.log('Prisma Query:', e.query);
  console.log('Prisma Params:', e.params);
  console.log('Prisma Duration:', e.duration + 'ms');
});

// Ensure we have a database URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Please check your .env file.");
}

export const db = globalThis.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.