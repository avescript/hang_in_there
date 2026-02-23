#!/usr/bin/env node

/**
 * Database Health Check Script
 * 
 * Verifies database connection and checks that all tables exist
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'hang_in_there',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
});

const expectedTables = [
  'users',
  'accounts',
  'sessions',
  'verification_tokens',
  'user_settings',
  'saved_stories',
  'reading_streaks',
  'story_reads',
  'reactions',
  'comments',
  'comment_flags',
  'push_subscriptions',
  'donations',
];

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n');

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Get database version
    const versionResult = await client.query('SELECT version()');
    console.log(`📊 PostgreSQL version: ${versionResult.rows[0].version.split(',')[0]}\n`);

    // Check for tables
    console.log('📋 Checking tables...\n');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    let allTablesExist = true;
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} (missing)`);
        allTablesExist = false;
      }
    }

    // Check for unexpected tables
    const unexpectedTables = existingTables.filter(
      table => !expectedTables.includes(table) && !table.startsWith('pgmigrations')
    );
    
    if (unexpectedTables.length > 0) {
      console.log('\n⚠️  Unexpected tables found:');
      unexpectedTables.forEach(table => console.log(`  - ${table}`));
    }

    // Get table row counts
    console.log('\n📊 Table statistics:\n');
    for (const table of existingTables.filter(t => expectedTables.includes(t))) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${countResult.rows[0].count} rows`);
    }

    client.release();

    if (allTablesExist) {
      console.log('\n✅ Database health check passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Database health check failed: Some tables are missing');
      console.log('   Run migrations with: npm run migrate:up');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Database health check failed:', error.message);
    console.error('\nPlease check your database configuration in .env');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkDatabase();
