/**
 * Script to reset the database using Prisma CLI
 * WARNING: This will permanently delete all data AND reset the database schema!
 * 
 * Usage: node scripts/reset-database.js
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function resetDatabase() {
  try {
    console.log('⚠️  WARNING: This operation will permanently delete all data!');
    console.log('⚠️  Are you sure you want to continue? (Ctrl+C to cancel)');
    
    // Give user a moment to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Resetting database...');
    
    // Run prisma migrate reset command
    const { stdout, stderr } = await execPromise('npx prisma migrate reset --force', {
      cwd: process.cwd(),
    });
    
    if (stdout) {
      console.log('Output:', stdout);
    }
    
    if (stderr) {
      console.error('Error output:', stderr);
    }
    
    console.log('✅ Database reset completed successfully!');
    console.log('The database has been reset to its initial state.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    
    if (error.stderr) {
      console.error('Command error output:', error.stderr);
    }
    
    console.error('');
    console.error('Troubleshooting steps:');
    console.error('1. Make sure Prisma CLI is installed: npm install prisma --save-dev');
    console.error('2. Check if you have the necessary permissions');
    console.error('3. Verify your database connection in the .env file');
    console.error('4. Try running the command manually: npx prisma migrate reset --force');
  }
}

// Only run if the script is called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };