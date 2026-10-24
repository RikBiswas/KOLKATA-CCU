import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend/.env or root .env
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, 'Backend', '.env') });
dotenv.config({ path: path.join(rootDir, '.env') });

const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL or DATABASE_URL_POOLED environment variable is required.');
  process.exit(1);
}

const sql = neon(connectionString);

async function init() {
  console.log('Connecting to Neon PostgreSQL...');
  try {
    const versionRes = await sql`SELECT version();`;
    console.log('Connected! PostgreSQL version:', versionRes[0].version);

    console.log('Creating table "reviews" if it does not exist...');
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL DEFAULT 'Peer Reviewer',
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table "reviews" created / confirmed!');

    // Check count
    const countResult = await sql`SELECT COUNT(*) as count FROM reviews;`;
    console.log('Current review count in database:', countResult[0].count);

    // Seed reviews from Backend/reviews.json if empty
    const reviewsJsonPath = path.resolve(__dirname, '../Backend/reviews.json');
    if (Number(countResult[0].count) === 0 && fs.existsSync(reviewsJsonPath)) {
      console.log('Seeding initial reviews from Backend/reviews.json...');
      const seedData = JSON.parse(fs.readFileSync(reviewsJsonPath, 'utf8'));
      for (const item of seedData) {
        await sql`
          INSERT INTO reviews (id, name, role, rating, review, date)
          VALUES (${item.id}, ${item.name}, ${item.role || 'Peer Reviewer'}, ${item.rating}, ${item.review}, ${item.date})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      const newCount = await sql`SELECT COUNT(*) as count FROM reviews;`;
      console.log(`Seeded! Total reviews in Neon DB now: ${newCount[0].count}`);
    } else {
      console.log('Table has data or does not need seeding.');
    }

    // Verify retrieval
    const sample = await sql`SELECT id, name, role, rating, review, date FROM reviews ORDER BY id DESC LIMIT 3;`;
    console.log('Sample reviews from Neon DB:', sample);

  } catch (err) {
    console.error('Database setup error:', err);
    process.exit(1);
  }
}

init();
