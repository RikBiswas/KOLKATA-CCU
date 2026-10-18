import fs from 'fs';

// 1. Load files
const travelContent = fs.readFileSync('src/config/travel.config.ts', 'utf-8');
const thingsContent = fs.readFileSync('src/components/travel/ThingsToDoSection.tsx', 'utf-8');
const foodContent = fs.readFileSync('src/components/travel/FoodAndCultureSection.tsx', 'utf-8');

// Helper to extract fields using regex
function getField(chunk, fieldName) {
  const regex = new RegExp(`${fieldName}:\\s*'([^']+)'`);
  const match = chunk.match(regex);
  return match ? match[1] : '';
}

// 1. Destinations (Landmarks)
function extractDestinations() {
  const destBlockMatch = travelContent.match(/destinations:\s*\[([\s\S]*?)\]\s*as\s*Destination\[\]/);
  if (!destBlockMatch) return [];
  const block = destBlockMatch[1];
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    const id = getField(chunk, 'id');
    const name = getField(chunk, 'name');
    const tagline = getField(chunk, 'tagline');
    const region = getField(chunk, 'region');
    const imageUrl = getField(chunk, 'imageUrl');
    const bestTimeToVisit = getField(chunk, 'bestTimeToVisit');
    const insiderTip = getField(chunk, 'insiderTip');

    if (id && name) {
      items.push({
        id,
        title: name,
        category: 'Landmark',
        location: region || 'Kolkata',
        imageUrl: imageUrl || '/images/destinations/victoria-memorial.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${tagline ? tagline + ' • ' : ''}${bestTimeToVisit ? 'Best time: ' + bestTimeToVisit : ''}${insiderTip ? ' • Tip: ' + insiderTip : ''}`,
        visited: false,
      });
    }
  }
  return items;
}

// 2. Suggested Trails (Walking / Ferry Trails)
function extractTrails() {
  const trailBlockMatch = travelContent.match(/suggestedTrails:\s*\[([\s\S]*?)\]\s*as\s*SuggestedTrail\[\]/);
  if (!trailBlockMatch) return [];
  const block = trailBlockMatch[1];
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    const id = getField(chunk, 'id');
    const title = getField(chunk, 'title');
    const subtitle = getField(chunk, 'subtitle');
    const imageUrl = getField(chunk, 'imageUrl');
    const duration = getField(chunk, 'duration');
    const distance = getField(chunk, 'distance');
    const bestTimeOfDay = getField(chunk, 'bestTimeOfDay');

    if (id && title) {
      items.push({
        id,
        title,
        category: 'Trail',
        location: 'Kolkata Heritage Trail',
        imageUrl: imageUrl || '/images/trails/writers-building.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${subtitle ? subtitle + ' • ' : ''}${duration ? duration + ' (' + distance + ')' : ''}${bestTimeOfDay ? ' • ' + bestTimeOfDay : ''}`,
        visited: false,
      });
    }
  }
  return items;
}

// 3. Neighborhoods
function extractNeighborhoods() {
  const neighBlockMatch = travelContent.match(/neighborhoods:\s*\[([\s\S]*?)\]\s*as\s*Neighborhood\[\]/);
  if (!neighBlockMatch) return [];
  const block = neighBlockMatch[1];
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    const id = getField(chunk, 'id');
    const name = getField(chunk, 'name');
    const tagline = getField(chunk, 'tagline');
    const coverImage = getField(chunk, 'coverImage');
    const vibe = getField(chunk, 'vibe');
    const bestWalkingTime = getField(chunk, 'bestWalkingTime');

    if (id && name) {
      items.push({
        id,
        title: name,
        category: 'Neighborhood',
        location: name,
        imageUrl: coverImage || '/images/destinations/college-street.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${tagline ? tagline + ' • ' : ''}${vibe ? 'Vibe: ' + vibe : ''}${bestWalkingTime ? ' • Walk: ' + bestWalkingTime : ''}`,
        visited: false,
      });
    }
  }
  return items;
}

// 4. Guide Stories / Lore
function extractGuideStories() {
  const storyBlockMatch = travelContent.match(/guideStories:\s*\[([\s\S]*?)\]\s*as\s*GuideStory\[\]/);
  if (!storyBlockMatch) return [];
  const block = storyBlockMatch[1];
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    const id = getField(chunk, 'id');
    const title = getField(chunk, 'title');
    const summary = getField(chunk, 'summary');
    const location = getField(chunk, 'location');
    const imageUrl = getField(chunk, 'imageUrl');
    const era = getField(chunk, 'era');

    if (id && title) {
      items.push({
        id,
        title,
        category: 'Story',
        location: location || 'Historic Kolkata',
        imageUrl: imageUrl || '/images/stories/park-street-cemetery.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${era ? era + ' • ' : ''}${summary || ''}`,
        visited: false,
      });
    }
  }
  return items;
}

// 5. Activities (Things To Do)
function extractActivities() {
  const actBlockMatch = thingsContent.match(/const THINGS_TO_DO:\s*KolkataActivity\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!actBlockMatch) return [];
  const block = actBlockMatch[1];
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    let id = getField(chunk, 'id');
    const title = getField(chunk, 'title');
    const subtitle = getField(chunk, 'subtitle');
    const location = getField(chunk, 'location');
    const bestTime = getField(chunk, 'bestTime');
    const cost = getField(chunk, 'cost');
    const imageUrl = getField(chunk, 'imageUrl');
    const insiderTip = getField(chunk, 'insiderTip');

    // Disambiguate with destinations / food collisions
    if (id === 'south-park-street-cemetery') id = 'activity-south-park-street-cemetery';
    if (id === 'tiretta-bazaar-breakfast') id = 'activity-tiretta-bazaar-breakfast';

    if (id && title) {
      items.push({
        id,
        title,
        category: 'Trail',
        location: location || 'Kolkata',
        imageUrl: imageUrl || '/images/destinations/howrah-bridge.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${subtitle ? subtitle + ' • ' : ''}${bestTime ? bestTime + ' • ' : ''}${cost ? cost + ' • ' : ''}Tip: ${insiderTip}`,
        visited: false,
      });
    }
  }
  return items;
}

// 6. Culinary (Food, Bars, Cafes, Cabins, Bakeries, Sweet Shops)
function extractCulinary() {
  const startIdx = foodContent.indexOf('const culinaryStories: CulinaryItem[] = [');
  const endIdx = foodContent.indexOf('const filterTabs = [');
  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find culinaryStories boundaries', { startIdx, endIdx });
    return [];
  }

  const block = foodContent.slice(startIdx, endIdx);
  const chunks = block.split(/\n\s*\{\s*\n\s*id:\s*'/);
  const items = [];

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];
    if (i > 0) chunk = "id: '" + chunk;

    const id = getField(chunk, 'id');
    const title = getField(chunk, 'title');
    const subtitle = getField(chunk, 'subtitle');
    const location = getField(chunk, 'location');
    const image = getField(chunk, 'image');
    const tag = getField(chunk, 'tag');
    const timing = getField(chunk, 'timing');
    const priceRange = getField(chunk, 'priceRange');

    if (id && title) {
      items.push({
        id,
        title,
        category: 'Food',
        location: location || 'Kolkata',
        imageUrl: image || '/images/stories/puchka.jpg',
        addedAt: 'Oct 18, 2026',
        notes: `${subtitle ? subtitle + ' • ' : ''}${tag ? tag + ' • ' : ''}${timing ? timing + ' • ' : ''}${priceRange ? '(' + priceRange + ')' : ''}`,
        visited: false,
      });
    }
  }
  return items;
}

const destinations = extractDestinations();
const trails = extractTrails();
const neighborhoods = extractNeighborhoods();
const stories = extractGuideStories();
const activities = extractActivities();
const culinary = extractCulinary();

console.log('1. Destinations (Landmarks):', destinations.length);
console.log('2. Suggested Trails (Walking/River):', trails.length);
console.log('3. Neighborhoods:', neighborhoods.length);
console.log('4. Guide Stories / Lore:', stories.length);
console.log('5. Activities (Things To Do):', activities.length);
console.log('6. Culinary (Foods, Bars, Cafes, Cabins):', culinary.length);

const allItems = [];
const seenIds = new Set();

function addItem(item) {
  if (!seenIds.has(item.id)) {
    seenIds.add(item.id);
    allItems.push(item);
  }
}

// Order: Landmarks first, then Neighborhoods, Trails & Activities, Lore Stories, then Culinary
destinations.forEach(addItem);
neighborhoods.forEach(addItem);
trails.forEach(addItem);
activities.forEach(addItem);
stories.forEach(addItem);
culinary.forEach(addItem);

console.log('TOTAL UNIQUE DIARY ITEMS:', allItems.length);

// Write to src/config/diary.config.ts
const code = `import { DiaryItem } from '../types/travel';

/**
 * Complete Curated Diary & Field Codex for Kolkata Travelers.
 * Contains EVERY activity, landmark, neighborhood, walking trail,
 * historic lore, iconic food stall, heritage cabin, cafe, pub, and bar
 * featured on the site (${allItems.length} total curated items).
 */
export const DEFAULT_CURATED_DIARY_ITEMS: DiaryItem[] = ${JSON.stringify(allItems, null, 2)};
`;

fs.writeFileSync('src/config/diary.config.ts', code, 'utf-8');
console.log('Wrote to src/config/diary.config.ts successfully!');
