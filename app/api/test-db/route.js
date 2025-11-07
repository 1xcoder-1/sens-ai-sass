import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Log environment variables for debugging (without exposing credentials)
    console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
      try {
        const url = new URL(process.env.DATABASE_URL);
        console.log("Database host:", url.hostname);
        console.log("Database port:", url.port || "default");
        console.log("Database name:", url.pathname.substring(1));
      } catch (urlError) {
        console.log("Could not parse DATABASE_URL");
      }
    }
    
    // Try to connect to the database
    await db.$connect();
    
    // Try a simple query
    const userCount = await db.user.count();
    
    return Response.json({
      success: true,
      message: "Database connection successful",
      userCount: userCount,
      DATABASE_URL: process.env.DATABASE_URL ? "Available (hidden for security)" : "Not available"
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}