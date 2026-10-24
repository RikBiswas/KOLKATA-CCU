import { ReviewItem } from '../types/travel';

/**
 * Configure API Base URL exclusively via VITE_API_BASE_URL (or VITE_API_URL as fallback).
 * In production, this points to your deployed FastAPI backend.
 */
const RAW_BACKEND_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'https://kolkata-ccu.onrender.com';

export const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');

/**
 * Permanent curated community reviews preserved across frontend states.
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
 * prepending new reviews submitted by users or loaded from the backend API.
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
 * Fetch reviews from the FastAPI backend API via VITE_API_BASE_URL,
 * with graceful retention of curated community reviews on error or timeout.
 */
export async function apiFetchReviews(): Promise<ReviewItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return mergeReviewsPreservingDefaults(data);
      }
    } else {
      console.warn(`Reviews API returned status ${res.status}`);
    }
  } catch (err) {
    console.warn('Backend API unavailable or network timeout, using resilient local defaults:', err);
  }

  return DEFAULT_COMMUNITY_REVIEWS;
}

/**
 * Fetch a single review by ID from the FastAPI backend API.
 */
export async function apiFetchReviewById(id: number): Promise<ReviewItem | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch review with id ${id}:`, err);
    return null;
  }
}

/**
 * Submit a review exclusively to the FastAPI backend API via VITE_API_BASE_URL.
 * Direct database access has been removed from client code.
 */
export async function apiSubmitReview(
  payload: { name: string; role?: string; rating: number; review: string },
  _clientId?: string
): Promise<ReviewItem> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (netErr: any) {
    if (netErr.name === 'AbortError') {
      throw new Error('Review submission timed out. Please check your connection and try again.');
    }
    throw new Error('Review service is currently unreachable. Please try again shortly.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (res.ok) {
    return await res.json();
  }

  const errorData = await res.json().catch(() => ({}));
  let errorMessage = 'Review submission failed.';

  if (typeof errorData.detail === 'string') {
    errorMessage = errorData.detail;
  } else if (Array.isArray(errorData.detail)) {
    errorMessage = errorData.detail
      .map((e: any) => {
        const msg = e.msg || e.message || (typeof e === 'string' ? e : JSON.stringify(e));
        return String(msg).replace(/^Value error,\s*/i, '');
      })
      .join('; ');
  } else if (errorData.message) {
    errorMessage = String(errorData.message);
  }

  throw new Error(errorMessage);
}

/**
 * Protected operation: Update an existing review via the FastAPI backend API.
 */
export async function apiUpdateReview(
  id: number,
  payload: { name?: string; role?: string; rating?: number; review?: string },
  adminKey?: string
): Promise<ReviewItem> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (adminKey) {
    headers['X-Admin-Key'] = adminKey;
  }

  const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return await res.json();
  }

  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.detail || `Failed to update review ${id}`);
}

/**
 * Protected operation: Delete an existing review via the FastAPI backend API.
 */
export async function apiDeleteReview(
  id: number,
  adminKey?: string
): Promise<{ message: string; id: number }> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (adminKey) {
    headers['X-Admin-Key'] = adminKey;
  }

  const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (res.ok) {
    return await res.json();
  }

  const errData = await res.json().catch(() => ({}));
  throw new Error(errData.detail || `Failed to delete review ${id}`);
}

/**
 * Health check helper for backend connectivity diagnostics.
 */
export async function apiCheckHealth(): Promise<{ status: string; database: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
    return { status: 'degraded', database: 'unavailable' };
  } catch {
    return { status: 'offline', database: 'unavailable' };
  }
}
