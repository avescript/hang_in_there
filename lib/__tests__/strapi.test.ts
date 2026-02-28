/**
 * Tests for Strapi API Client
 * 
 * Basic unit tests to verify API client functions work correctly
 */

import { getStories, getDailyStory, getStoryById, checkStrapiHealth } from '../strapi';

// Mock fetch globally
global.fetch = jest.fn();

describe('Strapi API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStories', () => {
    it('should fetch stories successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            attributes: {
              headline: 'Test Story',
              narrative: 'This is a test narrative.',
              subjectName: 'John Doe',
              subjectIdentifier: 'fisherman, Norway',
              theme: 'grit',
              sourceUrl: 'https://example.com',
              sourceAttribution: 'Example News',
              publishDate: '2024-01-01T00:00:00.000Z',
              scheduledDate: '2024-01-01T00:00:00.000Z',
              status: 'published',
              commentsEnabled: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 20,
            pageCount: 1,
            total: 1,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStories({ status: 'published' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stories).toHaveLength(1);
        expect(result.data.stories[0].headline).toBe('Test Story');
        expect(result.data.stories[0].theme).toBe('grit');
      }
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getStories();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NETWORK_ERROR');
      }
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(timeoutError);

      const result = await getStories();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('TIMEOUT_ERROR');
      }
    });
  });

  describe('getDailyStory', () => {
    it('should fetch daily story for timezone', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            attributes: {
              headline: 'Daily Story',
              narrative: 'Today\'s inspiring story.',
              subjectName: 'Jane Smith',
              subjectIdentifier: 'teacher, USA',
              theme: 'community',
              sourceUrl: 'https://example.com',
              sourceAttribution: 'Example News',
              publishDate: new Date().toISOString(),
              scheduledDate: new Date().toISOString(),
              status: 'published',
              commentsEnabled: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 1,
            pageCount: 1,
            total: 1,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getDailyStory('America/New_York');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.headline).toBe('Daily Story');
      }
    });

    it('should return error when no daily story exists', async () => {
      const mockResponse = {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 1,
            pageCount: 0,
            total: 0,
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getDailyStory();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NO_DAILY_STORY');
      }
    });
  });

  describe('getStoryById', () => {
    it('should fetch story by ID', async () => {
      const mockResponse = {
        data: {
          id: 1,
          attributes: {
            headline: 'Specific Story',
            narrative: 'A specific story narrative.',
            subjectName: 'Bob Johnson',
            subjectIdentifier: 'farmer, Kenya',
            theme: 'environment',
            sourceUrl: 'https://example.com',
            sourceAttribution: 'Example News',
            publishDate: '2024-01-01T00:00:00.000Z',
            scheduledDate: '2024-01-01T00:00:00.000Z',
            status: 'published',
            commentsEnabled: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
        meta: {},
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStoryById('1');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('1');
        expect(result.data.headline).toBe('Specific Story');
      }
    });

    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: {
            name: 'NotFoundError',
            message: 'Story not found',
          },
        }),
      });

      const result = await getStoryById('999');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.statusCode).toBe(404);
      }
    });
  });

  describe('checkStrapiHealth', () => {
    it('should return available when CMS is reachable', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await checkStrapiHealth();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.available).toBe(true);
      }
    });

    it('should return error when CMS is unreachable', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection refused'));

      const result = await checkStrapiHealth();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('CMS_UNAVAILABLE');
      }
    });
  });
});
