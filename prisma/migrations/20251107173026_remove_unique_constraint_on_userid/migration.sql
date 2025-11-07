-- Remove unique constraint on userId column in Roadmap table
DROP INDEX IF EXISTS "Roadmap_userId_key";

-- Create a regular index on userId column to maintain performance
CREATE INDEX IF NOT EXISTS "Roadmap_userId_idx" ON "Roadmap"("userId");