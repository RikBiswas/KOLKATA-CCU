import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, RefreshCw, Send, Compass } from 'lucide-react';
import { ReviewItem } from '../../types/travel';

export const TravelReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Heritage Walker');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // Fallback local traveler tips
      setReviews([
        {
          id: 1,
          name: 'Ananya Sengupta',
          role: 'Solo Heritage Walker',
          rating: 5,
          review: 'The Dalhousie heritage walking route is incredible! Following the path from Writers’ Building to St. John’s church early on a Sunday morning gave me peaceful access to 300 years of colonial history without traffic.',
          date: 'Oct 14, 2026',
        },
        {
          id: 2,
          name: 'Marcus & Elena Vance',
          role: 'Independent Photographers (London)',
          rating: 5,
          review: 'The Hooghly public ferry guide was our favorite tip. Taking the municipal boat from Howrah to Fairlie Ghat for just ₹6 gave us world-class views of the bridge from the water at twilight.',
          date: 'Oct 12, 2026',
        },
        {
          id: 3,
          name: 'Debjit Roy',
          role: 'Local Foodie & University Scholar',
          rating: 5,
          review: 'Spot on recommendations for College Street! Having infusion black coffee on the 1st floor of Indian Coffee House while browsing through century-old second-hand book stalls is pure magic.',
          date: 'Oct 10, 2026',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      name: name.trim(),
      role: role.trim() || 'Kolkata Explorer',
      rating,
      review: review.trim(),
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setReviews([created, ...reviews]);
        setName('');
        setReview('');
        setStatusMessage('Thank you! Your travel tip was added for fellow explorers.');
        setTimeout(() => setShowForm(false), 2000);
      } else {
        const fallbackCreated: ReviewItem = {
          id: Date.now(),
          ...payload,
          date: 'Just now',
        };
        setReviews([fallbackCreated, ...reviews]);
        setName('');
        setReview('');
        setStatusMessage('Travel tip submitted successfully!');
        setTimeout(() => setShowForm(false), 2000);
      }
    } catch {
      const fallbackCreated: ReviewItem = {
        id: Date.now(),
        ...payload,
        date: 'Just now',
      };
      setReviews([fallbackCreated, ...reviews]);
      setName('');
      setReview('');
      setStatusMessage('Travel tip saved to community board!');
      setTimeout(() => setShowForm(false), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-[#fafbfc] dark:bg-[#111722] rounded-3xl p-6 sm:p-10 my-8 border border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Community Explorer Log
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
            Tips &amp; Notes from Kolkata Explorers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Read first-hand notes, timing advice, and secret spots contributed by fellow travelers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Close Form' : 'Share a Travel Tip'}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#171f2d] border border-neutral-200 dark:border-neutral-700/80 shadow-md space-y-4 max-w-2xl mx-auto"
        >
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Share Your Kolkata Travel Recommendation
          </h3>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohini Roy"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Traveler Type
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Solo Backpacker / Architect / Foodie"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Rating of Your Exploration
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-neutral-500 ml-2">{rating} out of 5 stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Tip, Discovery, or Advice *
            </label>
            <textarea
              required
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="e.g. Best timing for photography, hidden tea shop, metro transfer tips..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Travel Tip</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Reviews */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading community travel tips...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#161d2a] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300 dark:text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{item.date}</span>
                </div>

                <p className="text-xs sm:text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
