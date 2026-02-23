/**
 * Migration: Create users and NextAuth tables
 * 
 * Creates the core authentication tables:
 * - users: User accounts
 * - accounts: NextAuth OAuth accounts
 * - sessions: NextAuth sessions
 * - verification_tokens: NextAuth email verification
 */

exports.up = (pgm) => {
  // Enable UUID extension
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  // Users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    email_verified: {
      type: 'boolean',
      default: false,
    },
    name: {
      type: 'varchar(255)',
    },
    image: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('users', 'email');

  // Accounts table (NextAuth)
  pgm.createTable('accounts', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'varchar(50)',
      notNull: true,
    },
    provider: {
      type: 'varchar(50)',
      notNull: true,
    },
    provider_account_id: {
      type: 'varchar(255)',
      notNull: true,
    },
    refresh_token: {
      type: 'text',
    },
    access_token: {
      type: 'text',
    },
    expires_at: {
      type: 'integer',
    },
    token_type: {
      type: 'varchar(50)',
    },
    scope: {
      type: 'text',
    },
    id_token: {
      type: 'text',
    },
    session_state: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('accounts', 'user_id');
  pgm.addConstraint('accounts', 'accounts_provider_provider_account_id_unique', {
    unique: ['provider', 'provider_account_id'],
  });

  // Sessions table (NextAuth)
  pgm.createTable('sessions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    session_token: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    expires: {
      type: 'timestamp',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('sessions', 'user_id');
  pgm.createIndex('sessions', 'session_token');

  // Verification tokens table (NextAuth)
  pgm.createTable('verification_tokens', {
    identifier: {
      type: 'varchar(255)',
      notNull: true,
    },
    token: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    expires: {
      type: 'timestamp',
      notNull: true,
    },
  });

  pgm.addConstraint('verification_tokens', 'verification_tokens_pkey', {
    primaryKey: ['identifier', 'token'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('verification_tokens');
  pgm.dropTable('sessions');
  pgm.dropTable('accounts');
  pgm.dropTable('users');
  pgm.dropExtension('pgcrypto');
};
