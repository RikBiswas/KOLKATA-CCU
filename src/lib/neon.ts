/**
 * Database client types and compatibility module.
 * Direct database access has been migrated to the secure FastAPI backend.
 * Credentials and client-side Neon pooled queries have been eliminated from browser bundles.
 */

export interface DbReview {
  id: number;
  name: string;
  role: string;
  rating: number;
  review: string;
  date: string;
  created_at?: string;
}

// Deprecated direct Neon client functions are now routed to the secure API client
export { apiFetchReviews as getNeonReviews, apiSubmitReview as insertNeonReview } from './reviewsApi';
