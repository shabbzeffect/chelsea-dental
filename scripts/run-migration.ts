/**
 * Run migration to add scheduled_reports table
 * Run with: npx tsx scripts/run-migration.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

function loadEnvFile() {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const lines = envFile.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          const value = trimmed.substring(equalIndex + 1).trim().replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    console.error('Could not load .env file:', error);
  }
}

async function main() {
  loadEnvFile();
  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = postgres(connectionString);

  try {
    const sqlFile = readFileSync(
      join(__dirname, 'add-scheduled-reports-table.sql'),
      'utf-8'
    );

    console.log('Running migration...');
    await client.unsafe(sqlFile);

    console.log('Migration completed successfully!');
    console.log('scheduled_reports table has been created.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
