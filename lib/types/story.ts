/**
 * Story Type Definitions
 * 
 * TypeScript interfaces for Story content from Strapi CMS
 */

// Story Theme Types
export type StoryTheme = 'grit' | 'love' | 'community' | 'environment' | 'balance' | 'care';

// Story Status Types
export type StoryStatus = 'draft' | 'scheduled' | 'published';

// Media/Image Type from Strapi
export interface Media {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Core Story Interface (matches Strapi schema)
export interface Story {
  id: string;
  headline: string; // max 12 words
  narrative: string; // 250-400 words
  subjectName: string;
  subjectIdentifier: string; // e.g., "fisherwoman, Brazil"
  theme: StoryTheme;
  sourceUrl: string;
  sourceAttribution: string;
  publishDate: Date;
  scheduledDate: Date;
  status: StoryStatus;
  featuredImage?: Media;
  commentsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Strapi API Response Wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi Single Item Response
export interface StrapiSingleResponse<T> {
  data: {
    id: number;
    attributes: T;
  };
  meta: Record<string, unknown>;
}

// Strapi Collection Response
export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Story Attributes (as returned by Strapi)
export interface StoryAttributes {
  headline: string;
  narrative: string;
  subjectName: string;
  subjectIdentifier: string;
  theme: StoryTheme;
  sourceUrl: string;
  sourceAttribution: string;
  publishDate: string; // ISO date string from Strapi
  scheduledDate: string; // ISO date string from Strapi
  status: StoryStatus;
  featuredImage?: {
    data: {
      id: number;
      attributes: Media;
    } | null;
  };
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query Filters for Story API
export interface StoryFilters {
  page?: number;
  pageSize?: number;
  theme?: StoryTheme;
  status?: StoryStatus;
  search?: string;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  sort?: 'publishDate:asc' | 'publishDate:desc' | 'createdAt:asc' | 'createdAt:desc';
}

// API Error Response
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Result Type for API Calls
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
