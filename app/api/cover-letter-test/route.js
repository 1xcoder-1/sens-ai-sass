import { db } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Testing database connection for cover letter functionality...");
    
    // Check if DATABASE_URL is available
    console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
    
    if (process.env.DATABASE_URL) {
      try {
        const url = new URL(process.env.DATABASE_URL);
        console.log("Database configuration:");
        console.log("  Host:", url.hostname);
        console.log("  Port:", url.port || "default");
        console.log("  Database:", url.pathname.substring(1));
      } catch (urlError) {
        console.log("Could not parse DATABASE_URL");
      }
    }
    
    // Try to connect to the database
    console.log("Attempting to connect to database...");
    await db.$connect();
    console.log("✅ Database connection successful!");
    
    // Try a simple query
    console.log("Executing test query...");
    const coverLetterCount = await db.coverLetter.count();
    console.log(`📊 Found ${coverLetterCount} cover letters in the database`);
    
    return Response.json({
      success: true,
      message: "Database connection successful for cover letters",
      coverLetterCount: coverLetterCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Database connection failed for cover letters:", error);
    return Response.json({
      success: false,
      message: "Database connection failed for cover letters",
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}