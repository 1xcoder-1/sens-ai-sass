/**
 * Script to clear all data from the database
 * WARNING: This will permanently delete all data!
 * 
 * Usage: node scripts/clear-database.js
 */

// Load environment variables from .env file
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function clearDatabase() {
  try {
    console.log('Starting database connection test...');
    
    // Test the connection first
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    console.log('Starting database clear operation...');
    
    // Delete records in the correct order to avoid foreign key constraint issues
    // Delete in reverse order of dependencies
    
    // Delete Roadmap records
    console.log('Deleting roadmap records...');
    const roadmapCount = await prisma.roadmap.deleteMany();
    console.log(`Deleted ${roadmapCount.count} roadmap records`);
    
    // Delete CoverLetter records
    console.log('Deleting cover letter records...');
    const coverLetterCount = await prisma.coverLetter.deleteMany();
    console.log(`Deleted ${coverLetterCount.count} cover letter records`);
    
    // Delete Resume records
    console.log('Deleting resume records...');
    const resumeCount = await prisma.resume.deleteMany();
    console.log(`Deleted ${resumeCount.count} resume records`);
    
    // Delete Assessment records
    console.log('Deleting assessment records...');
    const assessmentCount = await prisma.assessment.deleteMany();
    console.log(`Deleted ${assessmentCount.count} assessment records`);
    
    // Delete User records (this will also delete related IndustryInsight records if they're not referenced)
    console.log('Deleting user records...');
    const userCount = await prisma.user.deleteMany();
    console.log(`Deleted ${userCount.count} user records`);
    
    // Note: IndustryInsight records will be kept as they may be used by other users
    // If you want to delete them too, uncomment the following lines:
    // console.log('Deleting industry insight records...');
    // const industryInsightCount = await prisma.industryInsight.deleteMany();
    // console.log(`Deleted ${industryInsightCount.count} industry insight records`);
    
    console.log('✅ Database clear operation completed successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    console.error('');
    console.error('This could be due to:');
    console.error('1. Database server is not reachable');
    console.error('2. Incorrect database connection string');
    console.error('3. Network connectivity issues');
    console.error('4. Database authentication issues');
    console.error('');
    console.error('Please check your DATABASE_URL in the .env file and ensure the database server is running.');
    
    // Print the current DATABASE_URL (without credentials for security)
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
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
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if the script is called directly
if (require.main === module) {
  clearDatabase();
}

module.exports = { clearDatabase };