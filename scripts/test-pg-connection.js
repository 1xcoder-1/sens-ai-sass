/**
 * Script to test database connection using pg client directly
 * Usage: node scripts/test-pg-connection.js
 */

const { Client } = require('pg');

async function testPgConnection() {
  // Extract database connection details from DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }
  
  try {
    console.log('Testing database connection with pg client...');
    
    const client = new Client({
      connectionString: databaseUrl,
    });
    
    await client.connect();
    console.log('✅ Database connection successful with pg client!');
    
    const result = await client.query('SELECT COUNT(*) as count FROM "User"');
    console.log(`📊 Found ${result.rows[0].count} users in the database`);
    
    await client.end();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed with pg client:', error.message);
    
    // Print the current DATABASE_URL (without credentials for security)
    try {
      const urlParts = new URL(databaseUrl);
      console.error('');
      console.error('Current database configuration:');
      console.error(`  Host: ${urlParts.hostname}`);
      console.error(`  Port: ${urlParts.port || 'default'}`);
      console.error(`  Database: ${urlParts.pathname.substring(1)}`);
      console.error(`  SSL Mode: ${urlParts.searchParams.get('sslmode') || 'not specified'}`);
    } catch (urlError) {
      console.error('Could not parse DATABASE_URL');
    }
  }
}

// Load environment variables
require('dotenv').config();

// Only run if the script is called directly
if (require.main === module) {
  testPgConnection();
}

module.exports = { testPgConnection };