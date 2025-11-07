/**
 * Script to test database connection
 * Usage: node scripts/test-database-connection.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query to verify we can read data
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in the database`);
    
    console.log('✅ Database is accessible and ready for operations');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('');
    console.error('Troubleshooting steps:');
    console.error('1. Check your DATABASE_URL in the .env file');
    console.error('2. Verify the database server is running');
    console.error('3. Check your network connection');
    console.error('4. Verify database credentials are correct');
    console.error('5. Check if there are any firewall restrictions');
    
    // Print the current DATABASE_URL (without credentials for security)
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const urlParts = new URL(databaseUrl);
      console.error('');
      console.error('Current database configuration:');
      console.error(`  Host: ${urlParts.hostname}`);
      console.error(`  Port: ${urlParts.port || 'default'}`);
      console.error(`  Database: ${urlParts.pathname.substring(1)}`);
      console.error(`  SSL Mode: ${urlParts.searchParams.get('sslmode') || 'not specified'}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if the script is called directly
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };