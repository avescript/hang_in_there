module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('POSTGRES_HOST', 'localhost'),
      port: env.int('POSTGRES_PORT', 5432),
      database: env('POSTGRES_DB', 'hang_in_there'),
      user: env('POSTGRES_USER', 'postgres'),
      password: env('POSTGRES_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
    },
    debug: false,
  },
});
