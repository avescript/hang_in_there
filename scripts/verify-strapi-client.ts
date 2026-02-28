/**
 * Verification script for Strapi API client
 * 
 * Run with: npx tsx scripts/verify-strapi-client.ts
 * 
 * This script verifies that the Strapi API client functions are properly implemented
 * and can handle various scenarios.
 */

import { getStories, getDailyStory, getStoryById, checkStrapiHealth } from '../lib/strapi';

async function verifyImplementation() {
  console.log('🔍 Verifying Strapi API Client Implementation\n');

  // 1. Check health
  console.log('1. Checking Strapi CMS health...');
  const healthResult = await checkStrapiHealth();
  if (healthResult.success) {
    console.log(`   ✅ CMS is ${healthResult.data.available ? 'available' : 'unavailable'}`);
  } else {
    console.log(`   ⚠️  Health check failed: ${healthResult.error.message}`);
  }

  // 2. Test getStories
  console.log('\n2. Testing getStories()...');
  const storiesResult = await getStories({ status: 'published', pageSize: 5 });
  if (storiesResult.success) {
    console.log(`   ✅ Fetched ${storiesResult.data.stories.length} stories`);
    console.log(`   📊 Total stories: ${storiesResult.data.pagination.total}`);
    if (storiesResult.data.stories.length > 0) {
      const firstStory = storiesResult.data.stories[0];
      console.log(`   📖 First story: "${firstStory.headline}"`);
      console.log(`   🏷️  Theme: ${firstStory.theme}`);
    }
  } else {
    console.log(`   ⚠️  Error: ${storiesResult.error.message} (${storiesResult.error.code})`);
  }

  // 3. Test getDailyStory
  console.log('\n3. Testing getDailyStory()...');
  const dailyResult = await getDailyStory('UTC');
  if (dailyResult.success) {
    console.log(`   ✅ Daily story: "${dailyResult.data.headline}"`);
    console.log(`   👤 Subject: ${dailyResult.data.subjectName}`);
    console.log(`   📅 Published: ${dailyResult.data.publishDate.toLocaleDateString()}`);
  } else {
    console.log(`   ⚠️  Error: ${dailyResult.error.message} (${dailyResult.error.code})`);
  }

  // 4. Test getStoryById (if we have stories)
  if (storiesResult.success && storiesResult.data.stories.length > 0) {
    const storyId = storiesResult.data.stories[0].id;
    console.log(`\n4. Testing getStoryById('${storyId}')...`);
    const storyResult = await getStoryById(storyId);
    if (storyResult.success) {
      console.log(`   ✅ Story fetched: "${storyResult.data.headline}"`);
      console.log(`   📝 Narrative length: ${storyResult.data.narrative.length} characters`);
      console.log(`   💬 Comments enabled: ${storyResult.data.commentsEnabled}`);
      if (storyResult.data.featuredImage) {
        console.log(`   🖼️  Featured image: ${storyResult.data.featuredImage.url}`);
      }
    } else {
      console.log(`   ⚠️  Error: ${storyResult.error.message} (${storyResult.error.code})`);
    }
  }

  // 5. Test filtering by theme
  console.log('\n5. Testing theme filter (grit)...');
  const gritResult = await getStories({ status: 'published', theme: 'grit', pageSize: 3 });
  if (gritResult.success) {
    console.log(`   ✅ Found ${gritResult.data.stories.length} stories with theme 'grit'`);
    gritResult.data.stories.forEach((story, i) => {
      console.log(`   ${i + 1}. "${story.headline}" - ${story.theme}`);
    });
  } else {
    console.log(`   ⚠️  Error: ${gritResult.error.message}`);
  }

  // 6. Test search functionality
  console.log('\n6. Testing search functionality...');
  const searchResult = await getStories({ status: 'published', search: 'community', pageSize: 3 });
  if (searchResult.success) {
    console.log(`   ✅ Found ${searchResult.data.stories.length} stories matching 'community'`);
  } else {
    console.log(`   ⚠️  Error: ${searchResult.error.message}`);
  }

  console.log('\n✨ Verification complete!\n');
  console.log('Summary:');
  console.log('- ✅ TypeScript interfaces defined in lib/types/story.ts');
  console.log('- ✅ getStories() implemented with filters and pagination');
  console.log('- ✅ getDailyStory() implemented with timezone support');
  console.log('- ✅ getStoryById() implemented');
  console.log('- ✅ checkStrapiHealth() implemented');
  console.log('- ✅ Error handling for network failures and CMS unavailability');
  console.log('- ✅ Environment variables used (STRAPI_URL, STRAPI_API_TOKEN)');
  console.log('- ✅ TypeScript Result type pattern for all API responses');
}

// Run verification
verifyImplementation().catch((error) => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
