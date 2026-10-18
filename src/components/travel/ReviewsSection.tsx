import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, RefreshCw, Search, Filter, Database, CheckCircle2, User, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { ReviewItem } from '../../types/travel';

interface ReviewsSectionProps {
  onOpenReviewModal: () => void;
  refreshTrigger?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  onOpenReviewModal,
  refreshTrigger = 0,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest'>('newest');
  const [backendStatus, setBackendStatus] = useState<{
    database: string;
    branch: string;
    reviewCount: number;
  }>({
    database: 'connecting',
    branch: 'production',
    reviewCount: 0,
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // 1. Fetch reviews list
      const res = await fetch('http://127.0.0.1:8000/api/reviews');
      if (res.ok) {
        const data: ReviewItem[] = await res.json();
        setReviews(data);
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
    } catch (err) {
      console.warn('Backend server not reachable, using cached review items:', err);
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

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <section id="reviews" className="py-20 border-t border-[#E8D5C2]/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-mono text-[#C6532B] mb-3 shadow-2xs">
              <Database className="w-3.5 h-3.5" />
              <span>Neon PostgreSQL Ledger &bull; Branch: {backendStatus.branch}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351E1A] tracking-tight">
              Community Reviews &amp; Feedback
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#351E1A]/70 font-sans max-w-2xl leading-relaxed">
              Persisted in real-time to the cloud with Neon PostgreSQL. Inspect verified community critiques, reviewer affiliations, ratings, and travel feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchReviews}
              disabled={loading}
              className="px-3.5 py-2 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Refresh reviews from Neon PostgreSQL"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C6532B] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync DB</span>
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
              <p className="text-xs text-[#351E1A]/70 font-sans font-medium">Verified Entries in Neon</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif text-base sm:text-lg font-bold text-[#351E1A]">
                  PostgreSQL Active
                </span>
              </div>
              <p className="text-xs text-[#351E1A]/70 font-mono mt-0.5">
                Table: <code className="text-[#C6532B]">reviews</code> (OLTP)
              </p>
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

        {/* Backend Data Table */}
        <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7EBDD] border-b border-[#E8D5C2] text-[11px] font-mono uppercase tracking-wider text-[#351E1A]/80">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">ID &amp; Date</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Reviewer</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Role / Affiliation</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Rating</th>
                  <th scope="col" className="py-3.5 px-4 sm:px-6 min-w-[280px]">Review / Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D5C2]/60 text-xs font-sans text-[#351E1A]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#351E1A]/60">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#C6532B]" />
                        <span>Querying Neon PostgreSQL table...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-[#351E1A]/60">
                      <p className="font-serif font-bold text-sm text-[#351E1A]">No reviews match your filters</p>
                      <p className="text-xs text-[#351E1A]/60 mt-1">Try resetting the search or rating filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F7EBDD]/40 transition-colors group"
                    >
                      {/* ID & Date */}
                      <td className="py-4 px-4 sm:px-6 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] font-semibold text-[#C6532B] bg-[#C6532B]/10 px-2 py-0.5 rounded-md inline-block w-fit">
                            #{item.id}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-[#351E1A]/60 font-mono">
                            <Calendar className="w-3 h-3 text-[#351E1A]/40" />
                            {item.date}
                          </span>
                        </div>
                      </td>

                      {/* Reviewer Name */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#C6532B]/15 text-[#C6532B] font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-[#351E1A]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[11px] font-medium text-[#351E1A]/80 shadow-2xs">
                          <Tag className="w-3 h-3 text-[#C5A25A]" />
                          <span>{item.role || 'Peer Reviewer'}</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4 sm:px-6 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= item.rating
                                    ? 'text-[#C6532B] fill-[#C6532B]'
                                    : 'text-[#351E1A]/20'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-[11px] font-mono font-bold text-[#C6532B]">
                            {item.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Review Content */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <p className="text-xs sm:text-sm leading-relaxed text-[#351E1A]/90 italic font-serif">
                          &ldquo;{item.review}&rdquo;
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3.5 bg-[#F7EBDD]/60 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#351E1A]/60 gap-2">
            <span>
              Showing {filteredReviews.length} of {reviews.length} entries &bull; Synced with Neon Database
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Table: public.reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
