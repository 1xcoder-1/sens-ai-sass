export async function GET() {
  // Check if DATABASE_URL is available
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  
  // Get database connection details without exposing credentials
  let dbDetails = null;
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      dbDetails = {
        host: url.hostname,
        port: url.port || 'default',
        database: url.pathname.substring(1),
        ssl: url.searchParams.get('sslmode') || 'not specified'
      };
    } catch (error) {
      dbDetails = { error: 'Could not parse DATABASE_URL' };
    }
  }
  
  return Response.json({
    hasDatabaseUrl,
    dbDetails,
    timestamp: new Date().toISOString(),
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.startsWith('NEXT_PUBLIC_') || 
      key === 'DATABASE_URL' ||
      key === 'NODE_ENV' ||
      key === 'GEMINI_API_KEY'
    )
  });
}