/**
 * Database Type Definitions
 * 
 * TypeScript interfaces for all database tables
 */

// User and Authentication Types

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: Date;
  created_at: Date;
  updated_at: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// User Preferences Types

export interface UserSettings {
  user_id: string;
  notification_enabled: boolean;
  notification_time: string; // HH:MM:SS format
  timezone: string;
  theme_filters: string[] | null;
  streak_visible: boolean;
  created_at: Date;
  updated_at: Date;
}

// Story Engagement Types

export interface SavedStory {
  id: string;
  user_id: string;
  story_id: string;
  saved_at: Date;
}

export interface ReadingStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_read_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface StoryRead {
  id: string;
  user_id: string | null;
  story_id: string;
  read_at: Date;
  read_duration: number | null; // seconds
}

// Community Features Types

export type ReactionType = 'heart' | 'fist' | 'seedling' | 'tear';

export interface Reaction {
  id: string;
  user_id: string;
  story_id: string;
  reaction_type: ReactionType;
  created_at: Date;
}

export type CommentStatus = 'visible' | 'hidden' | 'flagged' | 'deleted';

export interface Comment {
  id: string;
  user_id: string;
  story_id: string;
  parent_id: string | null;
  content: string;
  status: CommentStatus;
  created_at: Date;
  updated_at: Date;
}

export type CommentFlagStatus = 'pending' | 'reviewed' | 'dismissed';

export interface CommentFlag {
  id: string;
  comment_id: string;
  flagged_by: string;
  reason: string;
  status: CommentFlagStatus;
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
}

// Notifications & Payments Types

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  timezone: string;
  preferred_time: string; // HH:MM:SS format
  created_at: Date;
  updated_at: Date;
}

export type DonationFrequency = 'once' | 'monthly';
export type DonationStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Donation {
  id: string;
  user_id: string | null;
  stripe_payment_id: string;
  stripe_customer_id: string | null;
  amount: number; // cents
  currency: string;
  frequency: DonationFrequency;
  status: DonationStatus;
  display_on_wall: boolean;
  display_name: string | null;
  created_at: Date;
  updated_at: Date;
}

// Utility Types for API Responses

export interface ReactionCounts {
  heart: number;
  fist: number;
  seedling: number;
  tear: number;
}

export interface CommentWithUser extends Comment {
  user: Pick<User, 'id' | 'name' | 'image'>;
  replies?: CommentWithUser[];
}

export interface StoryWithEngagement {
  story_id: string;
  reaction_counts: ReactionCounts;
  comment_count: number;
  user_reaction: ReactionType | null;
  user_has_saved: boolean;
}
