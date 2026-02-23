/**
 * Migration: Create reactions and comments tables
 * 
 * Creates tables for community engagement:
 * - reactions: Story reactions (heart, fist, seedling, tear)
 * - comments: User comments on stories
 * - comment_flags: Flagged comments for moderation
 */

exports.up = (pgm) => {
  // Reactions table
  pgm.createTable('reactions', {
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
    reaction_type: {
      type: 'varchar(20)',
      notNull: true,
      check: "reaction_type IN ('heart', 'fist', 'seedling', 'tear')",
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('reactions', 'story_id');
  pgm.createIndex('reactions', 'user_id');
  pgm.addConstraint('reactions', 'reactions_user_id_story_id_reaction_type_unique', {
    unique: ['user_id', 'story_id', 'reaction_type'],
  });

  // Comments table
  pgm.createTable('comments', {
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
    parent_id: {
      type: 'uuid',
      references: 'comments',
      onDelete: 'CASCADE',
    },
    content: {
      type: 'text',
      notNull: true,
      check: 'LENGTH(content) <= 500',
    },
    status: {
      type: 'varchar(20)',
      default: 'visible',
      check: "status IN ('visible', 'hidden', 'flagged', 'deleted')",
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

  pgm.createIndex('comments', 'story_id');
  pgm.createIndex('comments', 'user_id');
  pgm.createIndex('comments', 'parent_id');
  pgm.createIndex('comments', 'status');

  // Comment flags table
  pgm.createTable('comment_flags', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    comment_id: {
      type: 'uuid',
      notNull: true,
      references: 'comments',
      onDelete: 'CASCADE',
    },
    flagged_by: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    reason: {
      type: 'text',
      notNull: true,
    },
    status: {
      type: 'varchar(20)',
      default: 'pending',
      check: "status IN ('pending', 'reviewed', 'dismissed')",
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    reviewed_at: {
      type: 'timestamp',
    },
    reviewed_by: {
      type: 'uuid',
      references: 'users',
    },
  });

  pgm.createIndex('comment_flags', 'comment_id');
  pgm.createIndex('comment_flags', 'status');
  pgm.addConstraint('comment_flags', 'comment_flags_comment_id_flagged_by_unique', {
    unique: ['comment_id', 'flagged_by'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_flags');
  pgm.dropTable('comments');
  pgm.dropTable('reactions');
};
