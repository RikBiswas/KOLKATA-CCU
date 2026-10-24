import assert from 'node:assert/strict';
import {
  DEFAULT_COMMUNITY_REVIEWS,
  mergeReviewsPreservingDefaults,
  apiFetchReviews,
  apiSubmitReview,
  BACKEND_URL,
} from './reviewsApi';
import { ReviewItem } from '../types/travel';

async function runFrontendApiTests() {
  console.log('Running frontend reviewsApi automated test suite...\n');

  // Test 1: Verify curated default community reviews are preserved
  console.log('Test 1: DEFAULT_COMMUNITY_REVIEWS integrity');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS.length, 5, 'Must contain exactly 5 permanent community reviews');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS[0].name, 'Ananya Sengupta');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS[1].name, 'Marcus & Elena Vance');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS[2].name, 'Debjit Roy');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS[3].name, 'Suhani Mukherjee');
  assert.equal(DEFAULT_COMMUNITY_REVIEWS[4].name, 'Vikramaditya Banerjee');
  console.log('✓ Test 1 Passed: Curated community reviews intact.');

  // Test 2: Test mergeReviewsPreservingDefaults logic
  console.log('\nTest 2: mergeReviewsPreservingDefaults');
  const emptyMerged = mergeReviewsPreservingDefaults([]);
  assert.equal(emptyMerged.length, 5, 'Empty input must return default community reviews');

  const incomingReview: ReviewItem = {
    id: 9999,
    name: 'New Traveler',
    role: 'Heritage Walker',
    rating: 5,
    review: 'Lovely morning walk along Strand Road.',
    date: 'Oct 24, 2026',
  };
  const mergedWithNew = mergeReviewsPreservingDefaults([incomingReview]);
  assert.equal(mergedWithNew.length, 6, 'Should contain 1 new review + 5 default reviews');
  assert.equal(mergedWithNew[0].id, 9999, 'New incoming review must be prepended');

  // Duplicate deduplication
  const duplicateOfDefault: ReviewItem = {
    id: 1,
    name: 'Ananya Sengupta',
    role: 'Heritage Architect & Walker',
    rating: 5,
    review: 'The Dalhousie colonial core trail is extraordinary.',
    date: 'Oct 14, 2026',
  };
  const dedupedMerged = mergeReviewsPreservingDefaults([duplicateOfDefault]);
  assert.equal(dedupedMerged.length, 5, 'Duplicates of default community reviews must be filtered out');
  console.log('✓ Test 2 Passed: Review merging and deduplication logic verified.');

  // Test 3: Backend URL configuration check
  console.log('\nTest 3: BACKEND_URL endpoint resolution');
  assert.ok(typeof BACKEND_URL === 'string', 'BACKEND_URL must be a string');
  assert.ok(!BACKEND_URL.endsWith('/'), 'BACKEND_URL must not contain trailing slash');
  console.log(`✓ Test 3 Passed: BACKEND_URL resolved to "${BACKEND_URL}"`);

  // Test 4: Mocked apiFetchReviews offline fallback resilience
  console.log('\nTest 4: apiFetchReviews resilient fallback');
  const originalFetch = globalThis.fetch;
  try {
    // Simulate network error / offline backend
    globalThis.fetch = async () => {
      throw new Error('Network offline or backend unreachable');
    };
    const fallbackReviews = await apiFetchReviews();
    assert.equal(fallbackReviews.length, 5, 'Network failure must gracefully fall back to 5 community reviews');
    console.log('✓ Test 4 Passed: Graceful fallback works without crashing or querying Neon.');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 5: apiFetchReviews successful response handling
  console.log('\nTest 5: apiFetchReviews HTTP 200 parsing');
  try {
    globalThis.fetch = (async (url: string) => {
      assert.ok(String(url).includes('/api/reviews'));
      return {
        ok: true,
        status: 200,
        json: async () => [
          {
            id: 8888,
            name: 'API User',
            role: 'Tester',
            rating: 5,
            review: 'Fetched successfully from FastAPI.',
            date: 'Oct 24, 2026',
          },
        ],
      } as any;
    }) as any;

    const fetched = await apiFetchReviews();
    assert.equal(fetched.length, 6, 'Fetched reviews merged with 5 default community reviews');
    assert.equal(fetched[0].name, 'API User');
    console.log('✓ Test 5 Passed: Successful HTTP API responses are parsed and merged.');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 6: apiSubmitReview error propagation
  console.log('\nTest 6: apiSubmitReview error handling');
  try {
    globalThis.fetch = (async () => {
      return {
        ok: false,
        status: 429,
        json: async () => ({
          detail: 'Rate limit reached: You can submit at most 1 review every 60 seconds.',
        }),
      } as any;
    }) as any;

    await assert.rejects(
      async () => {
        await apiSubmitReview({
          name: 'Explorer',
          rating: 5,
          review: 'Testing rate limit error.',
        });
      },
      (err: any) => {
        assert.ok(err.message.includes('Rate limit reached'));
        return true;
      }
    );
    console.log('✓ Test 6 Passed: Validation and rate limiting errors from backend are propagated cleanly.');
  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log('\n========================================');
  console.log('ALL FRONTEND API TESTS PASSED SUCCESSFULLY!');
  console.log('========================================\n');
}

runFrontendApiTests().catch((err) => {
  console.error('Frontend test failure:', err);
  process.exit(1);
});
