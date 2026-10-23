import { ReviewItem } from '../types/travel';
import { getNeonReviews, insertNeonReview } from './neon';

const RAW_BACKEND_URL = (import.meta as any).env?.VITE_API_URL || 'https://kolkata-ccu.onrender.com';
const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');

/**
 * Permanent hardcoded curated community reviews that must never be removed or modified.
 */
export const DEFAULT_COMMUNITY_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: 'Ananya Sengupta',
    role: 'Heritage Architect & Walker',
    rating: 5,
    review:
      'The Dalhousie colonial core trail is extraordinary. Walking from Writers’ Building to St. John’s Church at 7 AM on Sunday gave me serene access to 300 years of neoclassical architecture without traffic.',
    date: 'Oct 14, 2026',
  },
  {
    id: 2,
    name: 'Marcus & Elena Vance',
    role: 'Travel Photographers (London)',
    rating: 5,
    review:
      'The Hooghly public river launch guide was our favorite feature. Crossing from Howrah to Fairlie Ghat for just ₹6 gave us breathtaking views of the cantilever bridge at twilight.',
    date: 'Oct 12, 2026',
  },
  {
    id: 3,
    name: 'Debjit Roy',
    role: 'Literary Scholar & Historian',
    rating: 5,
    review:
      'College Street Boi Para recommendations are pitch-perfect! Having an infusion coffee on the first floor of Indian Coffee House surrounded by antique bookstalls is pure magic.',
    date: 'Oct 10, 2026',
  },
  {
    id: 4,
    name: 'Suhani Mukherjee',
    role: 'Cultural Food Chronicler',
    rating: 5,
    review:
      'The Tiretta Bazaar Chinatown breakfast guide and Girish Chandra Dey Sandesh notes made my weekend exploration an absolute culinary triumph.',
    date: 'Oct 08, 2026',
  },
  {
    id: 5,
    name: 'Vikramaditya Banerjee',
    role: 'Independent Urbanist',
    rating: 4,
    review:
      'WANDER.CCU captures the genuine spirit of Calcutta without tourist cliches. The Tram Route 24 and Maidan meadow walk is an essential slow-travel route.',
    date: 'Oct 05, 2026',
  },
];

/**
 * Permanently preserves all hardcoded community reviews in the slideshow,
 * prepending new reviews submitted by users or loaded from Neon DB.
 */
export function mergeReviewsPreservingDefaults(incomingReviews: ReviewItem[]): ReviewItem[] {
  if (!Array.isArray(incomingReviews) || incomingReviews.length === 0) {
    return DEFAULT_COMMUNITY_REVIEWS;
  }

  const defaultKeys = new Set(
    DEFAULT_COMMUNITY_REVIEWS.map(
      (r) => `${r.name.trim().toLowerCase()}:::${r.review.trim().slice(0, 30).toLowerCase()}`
    )
  );
  const defaultIds = new Set(DEFAULT_COMMUNITY_REVIEWS.map((r) => r.id));

  // Filter out any duplicates of the hardcoded reviews that might exist in DB
  const newIncoming = incomingReviews.filter((item) => {
    const key = `${item.name.trim().toLowerCase()}:::${item.review.trim().slice(0, 30).toLowerCase()}`;
    return !defaultKeys.has(key) && !defaultIds.has(item.id);
  });

  // Return new reviews at the front, while keeping ALL hardcoded reviews permanently present
  return [...newIncoming, ...DEFAULT_COMMUNITY_REVIEWS];
}

/**
 * Fetch reviews from the backend API, seamlessly falling back to direct Neon Database queries,
 * and guaranteed to preserve all hardcoded community reviews.
 */
export async function apiFetchReviews(): Promise<ReviewItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return mergeReviewsPreservingDefaults(data);
      }
    }
  } catch (err) {
    console.info('Backend API unavailable, falling back to direct Neon database connection:', err);
  }

  // Direct Neon PostgreSQL fallback
  try {
    const dbReviews = await getNeonReviews();
    if (dbReviews && dbReviews.length > 0) {
      return mergeReviewsPreservingDefaults(dbReviews);
    }
  } catch (neonErr) {
    console.warn('Direct Neon fetch error:', neonErr);
  }

  return DEFAULT_COMMUNITY_REVIEWS;
}

/**
 * Submit a review to the backend API, seamlessly falling back to direct Neon Database insertion.
 */
export async function apiSubmitReview(
  payload: { name: string; role?: string; rating: number; review: string },
  clientId?: string
): Promise<ReviewItem> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 400 || res.status === 429) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Review submission failed');
    }
  } catch (err: any) {
    // If it was a validation or rate-limit error, rethrow
    if (err?.message && (err.message.includes('Rate limit') || err.message.includes('word'))) {
      throw err;
    }
    console.info('Backend submission failed, saving directly to Neon PostgreSQL:', err);
  }

  // Fallback to direct insertion into Neon PostgreSQL
  return await insertNeonReview(payload);
}
