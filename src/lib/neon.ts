import { neon, NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Neon Postgres Client Module
 * Configured using @neondatabase/serverless for instant pooled queries on Neon.
 */

const FALLBACK_NEON_URL =
  'postgresql://neondb_owner:npg_9tHAB3KvdnWi@ep-aged-truth-b44yx93c-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getNeonSql(): NeonQueryFunction<false, false> {
  if (cachedSql) {
    return cachedSql;
  }

  const databaseUrl =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DATABASE_URL) ||
    (typeof process !== 'undefined' && (process.env?.DATABASE_URL_POOLED || process.env?.DATABASE_URL)) ||
    FALLBACK_NEON_URL;

  cachedSql = neon(databaseUrl);
  return cachedSql;
}

export interface DbReview {
  id: number;
  name: string;
  role: string;
  rating: number;
  review: string;
  date: string;
  created_at?: string;
}

/**
 * Direct Neon query to fetch all reviews from the reviews table.
 */
export async function getNeonReviews(): Promise<DbReview[]> {
  const sql = getNeonSql();
  const rows = await sql`
    SELECT id, name, role, rating, review, date 
    FROM reviews 
    ORDER BY id DESC;
  `;
  return rows.map((r: any) => ({
    id: Number(r.id),
    name: String(r.name || ''),
    role: String(r.role || 'Peer Reviewer'),
    rating: Number(r.rating || 5),
    review: String(r.review || ''),
    date: String(r.date || ''),
  }));
}

/**
 * Direct Neon query to insert a new review into the reviews table.
 */
export async function insertNeonReview(data: {
  name: string;
  role?: string;
  rating: number;
  review: string;
}): Promise<DbReview> {
  const sql = getNeonSql();
  const id = Date.now();
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const roleStr = data.role?.trim() || 'Peer Reviewer';

  await sql`
    INSERT INTO reviews (id, name, role, rating, review, date)
    VALUES (${id}, ${data.name.trim()}, ${roleStr}, ${data.rating}, ${data.review.trim()}, ${dateStr});
  `;

  return {
    id,
    name: data.name.trim(),
    role: roleStr,
    rating: data.rating,
    review: data.review.trim(),
    date: dateStr,
  };
}
