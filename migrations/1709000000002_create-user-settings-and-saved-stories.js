/**
 * Migration: Create user settings and saved stories tables
 * 
 * Creates tables for user preferences and saved content:
 * - user_settings: User preferences (notifications, theme filters, etc.)
 * - saved_stories: Bookmarked stories
 * - reading_streaks: Reading streak tracking
 * - story_reads: Story read history
 */

exports.up = (pgm) => {
  // User settings table
  pgm.createTable('user_settings', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    notification_enabled: {
      type: 'boolean',
      default: false,
    },
    notification_time: {
      type: 'time',
      default: '08:00:00',
    },
    timezone: {
      type: 'varchar(50)',
      default: 'UTC',
    },
    theme_filters: {
      type: 'text[]',
    },
    streak_visible: {
      type: 'boolean',
      default: true,
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

  // Saved stories table
  pgm.createTable('saved_stories', {
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
    story_id: {
      type: 'varchar(255)',
      notNull: true,
    },
    saved_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('saved_stories', 'user_id');
  pgm.createIndex('saved_stories', 'story_id');
  pgm.addConstraint('saved_stories', 'saved_stories_user_id_story_id_unique', {
    unique: ['user_id', 'story_id'],
  });

  // Reading streaks table
  pgm.createTable('reading_streaks', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    current_streak: {
      type: 'integer',
      default: 0,
    },
    longest_streak: {
      type: 'integer',
      default: 0,
    },
    last_read_date: {
      type: 'date',
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

  // Story reads table
  pgm.createTable('story_reads', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'CASCADE',
    },
    story_id: {
      type: 'varchar(255)',
      notNull: true,
    },
    read_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    read_duration: {
      type: 'integer',
      comment: 'Read duration in seconds',
    },
  });

  pgm.createIndex('story_reads', 'user_id');
  pgm.createIndex('story_reads', 'story_id');
  pgm.createIndex('story_reads', 'read_at');
  pgm.addConstraint('story_reads', 'story_reads_user_id_story_id_date_unique', {
    unique: ['user_id', 'story_id', pgm.func("DATE(read_at)")],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('story_reads');
  pgm.dropTable('reading_streaks');
  pgm.dropTable('saved_stories');
  pgm.dropTable('user_settings');
};
