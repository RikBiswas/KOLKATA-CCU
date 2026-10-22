import { ReviewItem } from '../types/travel';
import { getNeonReviews, insertNeonReview } from './neon';

const BACKEND_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Fetch reviews from the backend API, seamlessly falling back to direct Neon Database queries.
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
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.info('Backend API unavailable, falling back to direct Neon database connection:', err);
  }

  // Direct Neon PostgreSQL fallback
  try {
    const dbReviews = await getNeonReviews();
    if (dbReviews && dbReviews.length > 0) {
      return dbReviews;
    }
  } catch (neonErr) {
    console.warn('Direct Neon fetch error:', neonErr);
  }

  return [];
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
        ...(clientId ? { 'X-Client-Id': clientId } : {}),
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
