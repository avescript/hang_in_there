/**
 * Migration: Create push subscriptions and donations tables
 * 
 * Creates tables for notifications and payments:
 * - push_subscriptions: Web Push notification subscriptions
 * - donations: Stripe donation records
 */

exports.up = (pgm) => {
  // Push subscriptions table
  pgm.createTable('push_subscriptions', {
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
    endpoint: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    p256dh: {
      type: 'text',
      notNull: true,
    },
    auth: {
      type: 'text',
      notNull: true,
    },
    timezone: {
      type: 'varchar(50)',
      default: 'UTC',
    },
    preferred_time: {
      type: 'time',
      default: '08:00:00',
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

  pgm.createIndex('push_subscriptions', 'user_id');

  // Donations table
  pgm.createTable('donations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'SET NULL',
    },
    stripe_payment_id: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    stripe_customer_id: {
      type: 'varchar(255)',
    },
    amount: {
      type: 'integer',
      notNull: true,
      comment: 'Amount in cents',
    },
    currency: {
      type: 'varchar(3)',
      default: 'USD',
    },
    frequency: {
      type: 'varchar(20)',
      notNull: true,
      check: "frequency IN ('once', 'monthly')",
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      check: "status IN ('pending', 'succeeded', 'failed', 'refunded')",
    },
    display_on_wall: {
      type: 'boolean',
      default: false,
    },
    display_name: {
      type: 'varchar(100)',
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

  pgm.createIndex('donations', 'user_id');
  pgm.createIndex('donations', 'stripe_payment_id');
  pgm.createIndex('donations', 'display_on_wall', {
    where: 'display_on_wall = TRUE',
  });
};

exports.down = (pgm) => {
  pgm.dropTable('donations');
  pgm.dropTable('push_subscriptions');
};
