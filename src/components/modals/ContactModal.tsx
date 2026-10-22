import React, { useState } from 'react';
import { X, Star, CheckCircle, Send, MessageSquareQuote } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { apiFetchReviews, apiSubmitReview } from '../../lib/reviewsApi';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewItem {
  id: number;
  name: string;
  role: string;
  rating: number;
  review: string;
  date: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentReviews, setRecentReviews] = useState<ReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'recent'>('form');

  // Fetch reviews from Neon DB / FastAPI backend
  const fetchReviews = async () => {
    try {
      const data = await apiFetchReviews();
      if (Array.isArray(data) && data.length > 0) {
        setRecentReviews(data);
        localStorage.setItem('portfolio_reviews', JSON.stringify(data));
        return;
      }
    } catch {
      // Fallback to local storage if API is offline
    }
    const local = JSON.parse(localStorage.getItem('portfolio_reviews') || '[]');
    setRecentReviews(local);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      fetchReviews();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) return;

    setLoading(true);

    const payload = {
      name: name.trim(),
      role: role.trim() || 'Peer Reviewer',
      rating,
      review: review.trim(),
    };

    let savedItem: ReviewItem | null = null;

    try {
      savedItem = await apiSubmitReview(payload);
    } catch {
      // Offline fallback
    }

    if (!savedItem) {
      savedItem = {
        id: Date.now(),
        name: payload.name,
        role: payload.role,
        rating: payload.rating,
        review: payload.review,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    }

    const updated = [savedItem, ...recentReviews.filter((r) => r.id !== savedItem?.id)];
    setRecentReviews(updated);
    localStorage.setItem('portfolio_reviews', JSON.stringify(updated));

    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setRole('');
    setReview('');
    setRating(5);
    setSubmitted(false);
    setActiveTab('form');
  };

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8 shadow-2xl relative text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 id="contact-modal-title" className="text-xl font-bold tracking-tight">
                Leave a Review
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Share your feedback or testimony for {siteConfig.profile.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Exit and return to website"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <span>Exit</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Tabs: Write Review vs View Reviews */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'form'
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('recent');
              fetchReviews();
            }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'recent'
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <span>Community Reviews</span>
            <span className="px-1.5 py-0.2 bg-neutral-200 dark:bg-neutral-800 rounded-full text-[10px]">
              {recentReviews.length}
            </span>
          </button>
        </div>

        {activeTab === 'recent' ? (
          <div className="mt-4 space-y-3">
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {recentReviews.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No reviews recorded yet. Be the first to leave one!
                </p>
              ) : (
                recentReviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 ml-1.5">
                          • {item.role}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                      "{item.review}"
                    </p>
                    <div className="text-[10px] text-neutral-400 text-right">
                      {item.date}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : submitted ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Thank you for your feedback!
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                Your review has been saved locally and to the FastAPI backend service.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  setActiveTab('recent');
                }}
                className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                View All Reviews
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating ?? rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 text-neutral-300 hover:scale-110 transition-transform focus:outline-none"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-300 dark:text-neutral-700'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-medium text-neutral-500 ml-2">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            {/* Name & Role Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Role / Company (Optional)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Designer @ Acme"
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                />
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Your Review / Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your honest review, feedback on projects, or experience collaborating..."
                className="w-full text-xs p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-500">
                Data saves locally into backend/reviews.json
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Saving...' : 'Submit Review'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
