import { neon, NeonQueryFunction } from '@neondatabase/serverless';

/**
 * Neon Postgres Client Module
 * Configured using @neondatabase/serverless for pooled queries on Neon Lakebase.
 */

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getNeonSql(): NeonQueryFunction<false, false> {
  if (cachedSql) {
    return cachedSql;
  }

  const databaseUrl =
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DATABASE_URL) ||
    '';

  if (!databaseUrl) {
    throw new Error(
      'Neon DATABASE_URL environment variable is not defined. Ensure .env.local is loaded.'
    );
  }

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
