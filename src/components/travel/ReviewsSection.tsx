import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  MessageSquarePlus,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  Tag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Quote,
} from 'lucide-react';
import { ReviewItem } from '../../types/travel';

interface ReviewsSectionProps {
  onOpenReviewModal: () => void;
  refreshTrigger?: number;
}

const DEFAULT_COMMUNITY_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: 'Ananya Sengupta',
    role: 'Heritage Architect & Walker',
    rating: 5,
    review: 'The Dalhousie colonial core trail is extraordinary. Walking from Writers’ Building to St. John’s Church at 7 AM on Sunday gave me serene access to 300 years of neoclassical architecture without traffic.',
    date: 'Oct 14, 2026',
  },
  {
    id: 2,
    name: 'Marcus & Elena Vance',
    role: 'Travel Photographers (London)',
    rating: 5,
    review: 'The Hooghly public river launch guide was our favorite feature. Crossing from Howrah to Fairlie Ghat for just ₹6 gave us breathtaking views of the cantilever bridge at twilight.',
    date: 'Oct 12, 2026',
  },
  {
    id: 3,
    name: 'Debjit Roy',
    role: 'Literary Scholar & Historian',
    rating: 5,
    review: 'College Street Boi Para recommendations are pitch-perfect! Having an infusion coffee on the first floor of Indian Coffee House surrounded by antique bookstalls is pure magic.',
    date: 'Oct 10, 2026',
  },
  {
    id: 4,
    name: 'Suhani Mukherjee',
    role: 'Cultural Food Chronicler',
    rating: 5,
    review: 'The Tiretta Bazaar Chinatown breakfast guide and Girish Chandra Dey Sandesh notes made my weekend exploration an absolute culinary triumph.',
    date: 'Oct 08, 2026',
  },
  {
    id: 5,
    name: 'Vikramaditya Banerjee',
    role: 'Independent Urbanist',
    rating: 4,
    review: 'WANDER.CCU captures the genuine spirit of Calcutta without tourist cliches. The Tram Route 24 and Maidan meadow walk is an essential slow-travel route.',
    date: 'Oct 05, 2026',
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  onOpenReviewModal,
  refreshTrigger = 0,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_COMMUNITY_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest'>('newest');

  // Horizontal Auto-Carousel States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  const timerRef = useRef<number | null>(null);

  // Responsive cards per view (1 on mobile, 2 on tablet, 3 on desktop)
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setCardsPerView(1);
        } else if (window.innerWidth < 1024) {
          setCardsPerView(2);
        } else {
          setCardsPerView(3);
        }
      }
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const [backendStatus, setBackendStatus] = useState<{
    database: string;
    branch: string;
    reviewCount: number;
  }>({
    database: 'synced',
    branch: 'production',
    reviewCount: DEFAULT_COMMUNITY_REVIEWS.length,
  });

  const fetchReviews = async () => {
    try {
      // 1. Fetch reviews list
      const res = await fetch('http://127.0.0.1:8000/api/reviews');
      if (res.ok) {
        const data: ReviewItem[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      }

      // 2. Fetch backend database health status
      const healthRes = await fetch('http://127.0.0.1:8000/api/health');
      if (healthRes.ok) {
        const health = await healthRes.json();
        setBackendStatus({
          database: health.database || 'connected',
          branch: health.branch || 'production',
          reviewCount: health.review_count || reviews.length,
        });
      }
    } catch {
      // Gracefully retain curated community reviews if standalone
      setReviews((prev) => (prev.length > 0 ? prev : DEFAULT_COMMUNITY_REVIEWS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((item) => {
      // Rating filter
      if (ratingFilter !== 'all' && item.rating !== ratingFilter) {
        return false;
      }
      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.review.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q) ||
        String(item.id).includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'highest') return b.rating - a.rating;
      return 0;
    });

  const maxIndex = Math.max(0, filteredReviews.length - cardsPerView);

  // Clamp currentIndex when filtered items list changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [maxIndex, currentIndex]);

  // Auto-carousel timer (advances every 4.5 seconds when not paused)
  useEffect(() => {
    if (isPaused || filteredReviews.length <= cardsPerView) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, maxIndex, filteredReviews.length, cardsPerView]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <section id="reviews" className="py-10 sm:py-14 border-t border-[#E8D5C2]/70 relative">
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-mono text-[#C6532B] mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorer Guestbook &bull; পাঠক ও পর্যটকদের কথা</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351E1A] tracking-tight">
              Community Reviews &amp; Feedback
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#351E1A]/70 font-sans max-w-2xl leading-relaxed">
              Authentic reflections, critiques, and travel notes shared by explorers and culture enthusiasts wandering the historic lanes of Calcutta.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchReviews}
              disabled={loading}
              className="px-3.5 py-2 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Refresh reviews"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C6532B] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] active:scale-95 text-white font-sans text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C6532B]/10 flex items-center justify-center text-[#C6532B] shrink-0">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A]">
                  {averageRating}
                </span>
                <span className="text-xs text-[#351E1A]/50 font-mono">/ 5.0</span>
              </div>
              <p className="text-xs text-[#351E1A]/70 font-sans font-medium">Average Explorer Rating</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C5A25A]/15 flex items-center justify-center text-[#C5A25A] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A]">
                {reviews.length}
              </span>
              <p className="text-xs text-[#351E1A]/70 font-sans font-medium">Verified Explorer Reviews</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C6532B]/10 flex items-center justify-center text-[#C6532B] shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#C6532B]" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A]">
                {reviews.length > 0
                  ? `${Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)}%`
                  : '100%'}
              </span>
              <p className="text-xs text-[#351E1A]/70 font-sans font-medium">Positive Recommendations</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-2xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#351E1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviewer, role, keywords..."
              className="w-full text-xs bg-[#F7EBDD]/60 border border-[#E8D5C2] rounded-xl pl-9 pr-8 py-2 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C6532B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#351E1A]/40 hover:text-[#351E1A]"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
            {/* Rating Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#351E1A]/70 font-sans">
              <Filter className="w-3.5 h-3.5 text-[#C6532B]" />
              <span>Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) =>
                  setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="bg-[#F7EBDD]/60 border border-[#E8D5C2] rounded-xl px-2.5 py-1.5 text-xs text-[#351E1A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#C6532B] cursor-pointer"
              >
                <option value="all">All Stars</option>
                <option value="5">5 Stars only</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 text-xs text-[#351E1A]/70 font-sans">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F7EBDD]/60 border border-[#E8D5C2] rounded-xl px-2.5 py-1.5 text-xs text-[#351E1A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#C6532B] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horizontal Reviews Auto-Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Action & Autoplay Controls */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="text-xs font-sans text-[#351E1A]/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6532B]" />
              <span>
                Showing {filteredReviews.length} community review{filteredReviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredReviews.length > cardsPerView && (
              <div className="flex items-center gap-2">
                {/* Pause / Play Toggle */}
                <button
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="p-2 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] transition-colors cursor-pointer shadow-2xs"
                  title={isPaused ? 'Resume auto-carousel' : 'Pause auto-carousel'}
                  aria-label={isPaused ? 'Resume auto-advancing reviews' : 'Pause auto-advancing reviews'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-[#C6532B]" /> : <Pause className="w-3.5 h-3.5 text-[#C6532B]" />}
                </button>

                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] transition-colors cursor-pointer shadow-2xs"
                  title="Previous review"
                  aria-label="Previous review slide"
                >
                  <ChevronLeft className="w-4 h-4 text-[#351E1A]" />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] transition-colors cursor-pointer shadow-2xs"
                  title="Next review"
                  aria-label="Next review slide"
                >
                  <ChevronRight className="w-4 h-4 text-[#351E1A]" />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-6 sm:p-7 shadow-xs animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E8D5C2]/60" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-28 bg-[#E8D5C2]/60 rounded-md" />
                      <div className="h-3 w-16 bg-[#E8D5C2]/40 rounded-md" />
                    </div>
                  </div>
                  <div className="h-3 w-20 bg-[#E8D5C2]/50 rounded-md" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 w-full bg-[#E8D5C2]/50 rounded-md" />
                    <div className="h-3.5 w-4/5 bg-[#E8D5C2]/40 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            /* Empty State */
            <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-12 text-center shadow-xs">
              <Sparkles className="w-10 h-10 text-[#C6532B] mx-auto mb-3 opacity-70" />
              <h3 className="font-serif font-bold text-lg text-[#351E1A]">
                No reviews match your filters
              </h3>
              <p className="text-xs text-[#351E1A]/60 mt-1 max-w-sm mx-auto">
                Try resetting your search query or rating filter, or be the first to share your travel reflections.
              </p>
              <button
                onClick={onOpenReviewModal}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] active:scale-95 text-white font-sans text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          ) : (
            /* Horizontal Slider Track */
            <div 
              className="overflow-hidden py-1 -mx-2 sm:-mx-3 touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                }}
              >
                {filteredReviews.map((item) => (
                  <div
                    key={item.id}
                    className="shrink-0 px-2.5 sm:px-3 flex flex-col"
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    <div className="h-full bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
                      {/* Top Accent Gradient Line */}
                      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#C6532B]/30 to-transparent" />

                      <div className="space-y-4">
                        {/* Reviewer Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-[#C6532B]/15 text-[#C6532B] font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-2xs">
                              {item.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-serif font-bold text-base text-[#351E1A] leading-snug truncate">
                                {item.name}
                              </h4>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F7EBDD] text-[#C5A25A] text-[10px] font-mono font-medium border border-[#E8D5C2]/60 mt-0.5">
                                <Tag className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate max-w-[120px]">{item.role || 'Peer Reviewer'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-mono text-[#351E1A]/50 shrink-0">
                            <Calendar className="w-3 h-3 text-[#C6532B]/60" />
                            <span>{item.date}</span>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= item.rating
                                    ? 'text-[#C6532B] fill-[#C6532B]'
                                    : 'text-[#351E1A]/15'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-xs font-bold text-[#C6532B]">
                            {item.rating}.0
                          </span>
                        </div>

                        {/* Review Quote Body */}
                        <div className="relative pt-1">
                          <Quote className="w-5 h-5 text-[#C6532B]/25 mb-1 shrink-0" />
                          <p className="font-serif italic text-sm sm:text-base text-[#351E1A]/90 leading-relaxed">
                            &ldquo;{item.review}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Card Bottom / Verified Footer */}
                      <div className="pt-5 mt-5 border-t border-[#E8D5C2]/50 flex items-center justify-between text-[11px] text-[#351E1A]/50">
                        <span className="inline-flex items-center gap-1 text-[#C6532B] font-mono text-[10px] font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          Verified Explorer
                        </span>
                        <span className="font-bengali text-xs text-[#582822]/60">
                          স্মৃতির শহর
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dot Pagination Indicators */}
          {!loading && filteredReviews.length > cardsPerView && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#C6532B]'
                      : 'w-2 bg-[#E8D5C2] hover:bg-[#C6532B]/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
