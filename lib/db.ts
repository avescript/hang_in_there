/**
 * Database Connection Utility
 * 
 * Provides a PostgreSQL connection pool for the application.
 * Uses environment variables for configuration.
 */

import { Pool, PoolConfig } from 'pg';

// Database configuration from environment variables
const config: PoolConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'hang_in_there',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
};

// Add SSL configuration for production
if (process.env.NODE_ENV === 'production') {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

// Create a singleton pool instance
let pool: Pool | null = null;

/**
 * Get the database connection pool
 * Creates a new pool if one doesn't exist
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(config);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle database client', err);
      process.exit(-1);
    });

    // Log successful connection in development
    if (process.env.NODE_ENV === 'development') {
      pool.on('connect', () => {
        console.log('✅ Database connected');
      });
    }
  }

  return pool;
}

/**
 * Execute a query with automatic connection management
 * 
 * @param text - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`⚠️ Slow query (${duration}ms):`, text);
    }

    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 */
export async function getClient() {
  const pool = getPool();
  return await pool.connect();
}

/**
 * Close the database pool
 * Should be called when shutting down the application
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
}

// Export the pool for direct access if needed
export { pool };
