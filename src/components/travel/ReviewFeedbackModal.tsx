import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, Send, MessageSquarePlus, CheckCircle, AlertCircle, RefreshCw, User, Briefcase, MessageSquare, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { ReviewItem } from '../../types/travel';
import { apiFetchReviews, apiSubmitReview, DEFAULT_COMMUNITY_REVIEWS } from '../../lib/reviewsApi';

interface ReviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newReview: ReviewItem) => void;
}

const MAX_WORDS = 150;
const RATE_LIMIT_SECONDS = 60;
const STORAGE_KEY_LAST_SUBMIT = 'ccu_review_last_submit_ts';

const getClientId = () => {
  try {
    let id = localStorage.getItem('ccu_reviewer_client_id');
    if (!id) {
      id = 'rev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('ccu_reviewer_client_id', id);
    }
    return id;
  } catch {
    return 'browser_user';
  }
};

export const ReviewFeedbackModal: React.FC<ReviewFeedbackModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  // Form Fields matching Backend API
  const [name, setName] = useState('');
  const [role, setRole] = useState('Peer Reviewer');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  // Status & List state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(DEFAULT_COMMUNITY_REVIEWS);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Helper to count words
  const countWords = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const wordCount = countWords(review);
  const isOverWordLimit = wordCount > MAX_WORDS;

  // Rating labels
  const RATING_LABELS: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good & Promising',
    4: 'Great & Engaging',
    5: 'Exceptional & Masterful',
  };

  // Check rate-limit cooldown on open (only active if this user submitted within the last 60 seconds)
  useEffect(() => {
    if (!isOpen) return;
    try {
      const last = localStorage.getItem(STORAGE_KEY_LAST_SUBMIT);
      if (last) {
        const elapsed = (Date.now() - Number(last)) / 1000;
        if (elapsed < RATE_LIMIT_SECONDS) {
          setCooldownRemaining(Math.ceil(RATE_LIMIT_SECONDS - elapsed));
          return;
        } else {
          localStorage.removeItem(STORAGE_KEY_LAST_SUBMIT);
        }
      }
    } catch {
      // Ignore storage read error
    }
    setCooldownRemaining(0);
  }, [isOpen]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  // Fetch reviews from Neon DB / FastAPI backend
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const data = await apiFetchReviews();
      if (data && data.length > 0) {
        setReviewsList(data);
      }
    } catch (err) {
      console.warn('Reviews offline, using fallback:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      setSuccessMessage(null);
      setErrorMessage(null);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!review.trim()) {
      setErrorMessage('Please write a brief review or feedback.');
      return;
    }
    if (isOverWordLimit) {
      setErrorMessage(`Reviews are strictly limited to ${MAX_WORDS} words. You currently have ${wordCount} words.`);
      return;
    }
    if (cooldownRemaining > 0) {
      setErrorMessage(`Rate limit active: Please wait ${cooldownRemaining}s before submitting another review.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      name: name.trim(),
      role: role.trim() || 'Peer Reviewer',
      rating,
      review: review.trim(),
    };

    try {
      const createdReview = await apiSubmitReview(payload, getClientId());

      setReviewsList((prev) => [createdReview, ...prev]);
      if (onReviewSubmitted) {
        onReviewSubmitted(createdReview);
      }

      // Record successful submission timestamp for 60-second rate limiter
      localStorage.setItem(STORAGE_KEY_LAST_SUBMIT, String(Date.now()));
      setCooldownRemaining(RATE_LIMIT_SECONDS);

      setSuccessMessage('Thank you! Your review has been successfully published.');
      setName('');
      setReview('');
      setRole('Peer Reviewer');
      setRating(5);

      // Automatically switch to list after brief delay
      setTimeout(() => {
        setActiveTab('list');
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit review right now. Please try again shortly.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#351E1A]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl shadow-[0_20px_50px_rgba(53,30,26,0.25)] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-[#F7EBDD] border-b border-[#E8D5C2] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C6532B] text-white flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-current text-[#FFF8EF]" />
            </div>
            <div>
              <h2 id="review-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#351E1A] tracking-tight flex items-center gap-2">
                <span>Feedback & Reviews</span>
              </h2>
              <p className="text-xs text-[#351E1A]/80 font-sans">
                Review this portfolio and share your insights with the author
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#351E1A]/10 hover:bg-[#351E1A]/20 text-[#351E1A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close review modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#F7EBDD]/60 border-b border-[#E8D5C2] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-[#C6532B] text-white shadow-xs'
                  : 'bg-[#FFF8EF] text-[#351E1A]/70 border border-[#E8D5C2] hover:bg-[#FFF8EF]/80'
              }`}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('list');
                fetchReviews();
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-[#C6532B] text-white shadow-xs'
                  : 'bg-[#FFF8EF] text-[#351E1A]/70 border border-[#E8D5C2] hover:bg-[#FFF8EF]/80'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Community Reviews</span>
              {reviewsList.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === 'list' ? 'bg-white/20 text-white' : 'bg-[#C6532B]/15 text-[#C6532B]'
                  }`}
                >
                  {reviewsList.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'list' && (
            <button
              onClick={fetchReviews}
              disabled={isLoadingReviews}
              className="text-xs text-[#351E1A]/60 hover:text-[#C6532B] flex items-center gap-1 cursor-pointer transition-colors"
              title="Refresh reviews from backend"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingReviews ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              {/* Success Notification */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Notification */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-[#351E1A] mb-1.5">
                  Rating & Recommendation
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 bg-[#F7EBDD] p-2 rounded-2xl border border-[#E8D5C2] w-fit">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-[#351E1A] transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                              isFilled
                                ? 'text-[#C6532B] fill-[#C6532B]'
                                : 'text-[#351E1A]/20 hover:text-[#C6532B]/50'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-[#C6532B] font-mono">
                    {RATING_LABELS[hoverRating !== null ? hoverRating : rating]}
                  </span>
                </div>
              </div>

              {/* Name & Role Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351E1A] mb-1">
                    Your Name <span className="text-[#C6532B]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#351E1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohini Sen"
                      maxLength={100}
                      className="w-full text-xs bg-[#F7EBDD]/60 border border-[#E8D5C2] rounded-xl pl-9 pr-3.5 py-2.5 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C6532B] focus:bg-[#FFF8EF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351E1A] mb-1">
                    Role / Affiliation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-[#351E1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Peer Reviewer, Developer, Explorer"
                      maxLength={100}
                      className="w-full text-xs bg-[#F7EBDD]/60 border border-[#E8D5C2] rounded-xl pl-9 pr-3.5 py-2.5 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C6532B] focus:bg-[#FFF8EF]"
                    />
                  </div>
                </div>
              </div>

              {/* Rate Limit Cooldown Notice */}
              {cooldownRemaining > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                    <span>Rate limit active: 1 review per 60 seconds per user.</span>
                  </div>
                  <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
                    Ready in {cooldownRemaining}s
                  </span>
                </div>
              )}

              {/* Review Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#351E1A]">
                    Review &amp; Feedback <span className="text-[#C6532B]">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      isOverWordLimit
                        ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                        : wordCount > 130
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-[#F7EBDD] text-[#351E1A]/60'
                    }`}
                  >
                    {wordCount} / {MAX_WORDS} words
                  </span>
                </div>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 text-[#351E1A]/40 absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea
                    required
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share what you liked, suggestions for new features, design feedback, or travel impressions (max 150 words)..."
                    className={`w-full text-xs bg-[#F7EBDD]/60 border rounded-xl pl-9 pr-3.5 py-2.5 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:bg-[#FFF8EF] resize-none transition-colors ${
                      isOverWordLimit
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-[#E8D5C2] focus:ring-1 focus:ring-[#C6532B]'
                    }`}
                  />
                </div>
                {isOverWordLimit && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1.5 animate-fadeIn">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Word limit exceeded: Please shorten your review by {wordCount - MAX_WORDS} word{wordCount - MAX_WORDS !== 1 ? 's' : ''}. Maximum is {MAX_WORDS} words.</span>
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs text-[#351E1A]/70 hover:text-[#351E1A] hover:bg-[#E8D5C2]/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isOverWordLimit || cooldownRemaining > 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] active:scale-95 text-white font-sans text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing Review...</span>
                    </>
                  ) : cooldownRemaining > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Wait {cooldownRemaining}s</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Reviews Table Tab */
            <div className="space-y-4">
              {isLoadingReviews ? (
                <div className="py-12 text-center text-xs text-[#351E1A]/60 flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#C6532B]" />
                  <span>Loading community reviews...</span>
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="py-12 text-center bg-[#F7EBDD]/40 rounded-2xl border border-[#E8D5C2] p-6">
                  <Sparkles className="w-8 h-8 text-[#C6532B] mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-serif font-bold text-[#351E1A]">No reviews published yet</p>
                  <p className="text-xs text-[#351E1A]/60 mt-1">Be the first to share your thoughts!</p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="mt-4 px-4 py-2 rounded-full bg-[#C6532B] text-white text-xs font-bold cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E8D5C2] overflow-hidden bg-[#FFF8EF] shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F7EBDD] border-b border-[#E8D5C2] text-[10px] font-mono uppercase tracking-wider text-[#351E1A]/70">
                          <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Reviewer</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Role</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Rating</th>
                          <th className="py-2.5 px-3 min-w-[200px]">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8D5C2]/50">
                        {reviewsList.map((item) => (
                          <tr key={item.id} className="hover:bg-[#F7EBDD]/40 transition-colors">
                            <td className="py-3 px-3 text-[10px] font-mono text-[#351E1A]/60 whitespace-nowrap align-top">
                              {item.date}
                            </td>
                            <td className="py-3 px-3 font-bold text-[#351E1A] whitespace-nowrap align-top">
                              {item.name}
                            </td>
                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6532B]/10 text-[#C6532B] font-semibold">
                                {item.role || 'Peer Reviewer'}
                              </span>
                            </td>
                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < item.rating
                                        ? 'text-[#C6532B] fill-[#C6532B]'
                                        : 'text-[#351E1A]/20'
                                    }`}
                                  />
                                ))}
                                <span className="ml-1 text-[10px] font-mono font-bold text-[#C6532B]">
                                  {item.rating}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#351E1A]/90 italic font-serif leading-relaxed align-top">
                              &ldquo;{item.review}&rdquo;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
