# Story Content Type Reference

Quick reference for the Story content type in Strapi CMS.

## Field Specifications

### headline
- **Type**: String
- **Required**: Yes
- **Max Length**: 255 characters
- **Editorial Guideline**: 1-12 words
- **Purpose**: Compelling, non-sensationalized story title
- **Example**: "Against All Odds: The Fisherwoman Who Saved Her Village"

### narrative
- **Type**: Text (long text)
- **Required**: Yes
- **Editorial Guideline**: 250-400 words
- **Purpose**: The main story content, written or adapted by editors
- **Tone**: Warm, grounded, human - never saccharine or preachy
- **Example**: "Maria Santos spent 30 years fishing the same waters off the coast of Brazil..."

### subjectName
- **Type**: String
- **Required**: Yes
- **Max Length**: 255 characters
- **Purpose**: Full name of the story subject
- **Example**: "Maria Santos"

### subjectIdentifier
- **Type**: String
- **Required**: Yes
- **Max Length**: 255 characters
- **Purpose**: Brief contextual identifier
- **Format**: "[occupation/role], [location]"
- **Example**: "fisherwoman, Brazil"

### theme
- **Type**: Enumeration
- **Required**: Yes
- **Options**:
  - `grit` - Grit & Tenacity: overcoming sustained adversity through persistence
  - `love` - Universal Love & Grace: acts of radical kindness, forgiveness, or compassion
  - `community` - Community & Mutual Support: people building something together
  - `environment` - Environmental Stewardship & Sustainability: protecting the natural world
  - `balance` - Work/Life Balance & Rest: honoring rest, play, and human wholeness
  - `care` - Care for All Living Beings: stories involving animals, ecosystems, interspecies connection
- **Purpose**: Primary theme classification for filtering and discovery

### sourceUrl
- **Type**: String (URL)
- **Required**: Yes
- **Purpose**: Link to the original publicly available source
- **Validation**: Must be a valid, publicly accessible URL
- **Example**: "https://www.theguardian.com/world/2025/story-example"

### sourceAttribution
- **Type**: String
- **Required**: Yes
- **Purpose**: Attribution text for the source
- **Format**: Publication name or "Original reporting by [outlet]"
- **Example**: "The Guardian" or "Original reporting by NPR"

### publishDate
- **Type**: DateTime
- **Required**: No (auto-set by cron job)
- **Purpose**: Timestamp when the story was actually published
- **Note**: Set automatically when status changes to "published"

### scheduledDate
- **Type**: DateTime
- **Required**: Yes
- **Purpose**: When the story should be published
- **Editorial Guideline**: At least 2 weeks in advance
- **Format**: ISO 8601 datetime
- **Example**: "2026-03-15T08:00:00.000Z"

### status
- **Type**: Enumeration
- **Required**: Yes
- **Default**: "draft"
- **Options**:
  - `draft` - Story is being written/edited, not ready for publication
  - `scheduled` - Story is ready and queued for publication at scheduledDate
  - `published` - Story has been published and is live
- **Workflow**: draft → scheduled → published (automated by cron)

### featuredImage
- **Type**: Media (single image)
- **Required**: No
- **Allowed Types**: Images only (JPEG, PNG, WebP)
- **Recommended Size**: 1200x630px (2:1 aspect ratio)
- **Max File Size**: 2MB
- **Purpose**: Visual accompaniment to the story
- **Accessibility**: Must include descriptive alt text

### commentsEnabled
- **Type**: Boolean
- **Required**: Yes
- **Default**: true
- **Purpose**: Whether readers can comment on this story
- **Use Case**: Disable for politically sensitive topics or organization stories

## Editorial Workflow States

### Draft
- Story is being created or edited
- Not visible to the public
- Can be edited freely
- No scheduled publication

### Scheduled
- Story is complete and approved
- Queued for publication at scheduledDate
- Should not be edited after scheduling (maintain editorial integrity)
- Will be automatically published by cron job

### Published
- Story is live and visible to readers
- Has a publishDate timestamp
- Appears in the story feed and archive
- Can still be edited if corrections are needed (with caution)

## Content Guidelines

### Headline Writing
- Maximum 12 words
- Clear and descriptive
- Avoid clickbait or sensationalism
- Use active voice
- Focus on the human element
- Examples:
  - ✅ "The Teacher Who Built a School from Recycled Materials"
  - ✅ "How One Grandmother Saved Her Town's Water Supply"
  - ❌ "You Won't Believe What This Teacher Did!" (clickbait)
  - ❌ "This Grandmother's Incredible Story Will Make You Cry" (sensationalized)

### Narrative Writing
- 250-400 words (strict)
- Warm, grounded, human tone
- First or third person
- Include specific details and context
- Avoid:
  - Saccharine or preachy language
  - Toxic positivity
  - Oversimplification of complex issues
  - Glorification of self-destruction
- Structure:
  1. Opening: Set the scene and introduce the subject
  2. Challenge: Describe the adversity or situation
  3. Action: What the subject did
  4. Impact: The result or ongoing effect
  5. Closing: Reflection or forward-looking statement

### Source Verification
- Must be from reputable, publicly accessible outlets
- Acceptable sources:
  - Established newspapers (The Guardian, NYT, Washington Post, etc.)
  - Public broadcasting (NPR, BBC, PBS)
  - Peer-reviewed research summaries
  - Verified nonprofit reports
  - Official government records
  - Recognized documentary sources
- Unacceptable sources:
  - Unverified social media posts
  - Anonymous claims
  - Partisan political outlets
  - Tabloids or gossip sites

### Theme Selection
Choose the PRIMARY theme that best represents the story. If multiple themes apply, select the most prominent one.

**Grit**: Focus on persistence through sustained difficulty
- Example: Someone who overcame years of setbacks to achieve a goal

**Love**: Focus on compassion, kindness, or forgiveness
- Example: Someone who forgave a wrongdoer or showed radical kindness

**Community**: Focus on collective action or mutual support
- Example: A neighborhood that came together to solve a problem

**Environment**: Focus on protecting nature or sustainability
- Example: Someone who restored a damaged ecosystem

**Balance**: Focus on rest, play, or holistic well-being
- Example: Someone who found a healthier way to live or work

**Care**: Focus on animals, ecosystems, or interspecies connection
- Example: Someone who rescued animals or protected wildlife

## API Query Examples

### Get today's published story
```
GET /api/stories?filters[status][$eq]=published&filters[publishDate][$gte]=2026-02-23T00:00:00Z&filters[publishDate][$lte]=2026-02-23T23:59:59Z&sort=publishDate:desc&pagination[limit]=1
```

### Get all scheduled stories
```
GET /api/stories?filters[status][$eq]=scheduled&sort=scheduledDate:asc
```

### Get stories by theme
```
GET /api/stories?filters[theme][$eq]=community&filters[status][$eq]=published
```

### Get stories with images
```
GET /api/stories?filters[featuredImage][$notNull]=true&populate=featuredImage
```

### Count unpublished stories (backlog check)
```
GET /api/stories?filters[status][$in][0]=draft&filters[status][$in][1]=scheduled&pagination[pageSize]=1
```
(Check meta.pagination.total in response)

## Validation Checklist

Before scheduling a story, verify:

- [ ] Headline is 1-12 words
- [ ] Narrative is 250-400 words
- [ ] Subject name is complete and accurate
- [ ] Subject identifier provides context
- [ ] Theme is appropriate and primary
- [ ] Source URL is valid and publicly accessible
- [ ] Source attribution is accurate
- [ ] Scheduled date is at least 2 weeks in advance
- [ ] Featured image has descriptive alt text (if included)
- [ ] Comments enabled setting is appropriate
- [ ] Story meets editorial standards (no harm, inclusive, verified)
- [ ] Tone is warm and grounded, not preachy
- [ ] Facts have been verified against source

## Common Mistakes to Avoid

1. **Headline too long**: Keep it under 12 words
2. **Narrative too short/long**: Must be 250-400 words
3. **Missing source verification**: Always include valid sourceUrl
4. **Wrong theme**: Choose the PRIMARY theme, not all applicable themes
5. **Scheduling too soon**: Maintain 2-week advance buffer
6. **Missing alt text**: Always add descriptive alt text to images
7. **Sensationalized language**: Keep tone grounded and factual
8. **Unverified claims**: Every fact must be traceable to the source
9. **Political content**: Avoid stories that would predictably ignite political debate
10. **Toxic positivity**: Don't oversimplify or glorify harmful behaviors

## Backlog Management

**Target**: Maintain 30+ unpublished stories at all times

**Check backlog count**:
1. Go to Content Manager → Story
2. Filter by status: "draft" OR "scheduled"
3. Count total entries

**If backlog is low (<30)**:
- Prioritize story discovery
- Review editorial calendar
- Adjust scheduling timeline
- Consider republishing evergreen stories (with updates)

**Scheduling strategy**:
- Schedule stories at least 2 weeks in advance
- Distribute themes evenly across the calendar
- Consider seasonal relevance
- Balance subject demographics (gender, ethnicity, location, age)

## Quick Reference Card

| Field | Type | Required | Max Length | Default |
|-------|------|----------|------------|---------|
| headline | String | ✓ | 255 chars | - |
| narrative | Text | ✓ | - | - |
| subjectName | String | ✓ | 255 chars | - |
| subjectIdentifier | String | ✓ | 255 chars | - |
| theme | Enum | ✓ | - | - |
| sourceUrl | String | ✓ | - | - |
| sourceAttribution | String | ✓ | - | - |
| publishDate | DateTime | - | - | null |
| scheduledDate | DateTime | ✓ | - | - |
| status | Enum | ✓ | - | draft |
| featuredImage | Media | - | 2MB | null |
| commentsEnabled | Boolean | ✓ | - | true |

**Themes**: grit, love, community, environment, balance, care  
**Statuses**: draft, scheduled, published  
**Word counts**: Headline 1-12 words, Narrative 250-400 words
