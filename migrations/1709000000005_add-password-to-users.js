/**
 * Migration: Add password field to users table
 * 
 * Adds password field for email/password authentication
 */

exports.up = (pgm) => {
  pgm.addColumn('users', {
    password: {
      type: 'varchar(255)',
      notNull: false, // Nullable because OAuth users won't have passwords
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'password');
};
