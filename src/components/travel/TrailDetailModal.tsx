import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Star, MapPin, Footprints, Train, Lightbulb, Compass, Bookmark, ExternalLink } from 'lucide-react';
import { SuggestedTrail } from '../../types/travel';

interface TrailDetailModalProps {
  trail: SuggestedTrail | null;
  onClose: () => void;
  onBookmark?: (trail: SuggestedTrail) => void;
  isBookmarked?: boolean;
}

export const TrailDetailModal: React.FC<TrailDetailModalProps> = ({
  trail,
  onClose,
  onBookmark,
  isBookmarked = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (trail) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [trail, onClose]);

  if (!trail) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-trail-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FFF8EF] rounded-3xl shadow-2xl border border-[#E8D5C2] overflow-hidden max-h-[92vh] flex flex-col text-[#351E1A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-[#FFF8EF] transition-all shadow-lg hover:scale-105 active:scale-95 border border-[#FFF8EF]/20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-[#351E1A]">
          <img
            src={trail.imageUrl}
            alt={trail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/95 via-[#351E1A]/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-6 right-6 text-[#FFF8EF] space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C6532B] text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                {trail.tag} &bull; {trail.difficulty}
              </span>
            </div>

            <h2 id="modal-trail-title" className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {trail.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-sans text-[#FFF8EF]/80">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A25A]" />
                <span>{trail.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                <span className="font-bold text-[#FFF8EF]">{trail.rating}</span>
                <span className="text-[#FFF8EF]/60">({trail.reviewsCount} explorer ratings)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Quick Route Specs */}
          {(trail.distance || trail.bestTimeOfDay || trail.transitCost) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans">
              {trail.distance && (
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#C6532B] shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#351E1A]/60 font-bold">Walking Distance</span>
                    <span className="font-semibold text-[#351E1A]">{trail.distance}</span>
                  </div>
                </div>
              )}
              {trail.bestTimeOfDay && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C6532B] shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#351E1A]/60 font-bold">Optimal Window</span>
                    <span className="font-semibold text-[#351E1A]">{trail.bestTimeOfDay}</span>
                  </div>
                </div>
              )}
              {trail.transitCost && (
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-[#C6532B] shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#351E1A]/60 font-bold">Estimated Cost</span>
                    <span className="font-semibold text-[#351E1A]">{trail.transitCost}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6532B]">
              Trail Overview &amp; Character
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed">
              {trail.description}
            </p>
          </div>

          {/* Step-by-Step Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6532B]">
                Step-by-Step Route &amp; Recommended Timings
              </h3>
              <span className="text-[11px] font-mono text-[#582822]/60 font-semibold">
                {trail.itinerary.length} Milestones
              </span>
            </div>

            <div className="space-y-3">
              {trail.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] flex gap-3 text-xs font-sans"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0 self-start">
                    <span className="px-2.5 py-1 rounded-md bg-[#582822] text-[#FFF8EF] font-mono font-bold text-[11px] whitespace-nowrap">
                      {item.time}
                    </span>
                    {item.duration && (
                      <span className="text-[9.5px] font-mono text-[#C6532B] font-semibold">
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold text-[#351E1A]">{item.title}</h4>
                    <p className="text-[#351E1A]/75 leading-relaxed text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key landmark stops */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6532B]">
              Key Landmarks Along This Route
            </h3>
            <div className="flex flex-wrap gap-2">
              {trail.keyStops.map((stop, idx) => (
                <a
                  key={idx}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop}, Kolkata`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#F7EBDD] hover:bg-[#F0DDC8] text-[#351E1A] text-xs font-sans font-medium border border-[#E8D5C2] hover:border-[#C6532B] flex items-center gap-1.5 group transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  title={`Locate ${stop} on Google Maps`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C6532B] group-hover:scale-110 transition-transform" />
                  <span>{stop}</span>
                  <ExternalLink className="w-3 h-3 text-[#351E1A]/40 group-hover:text-[#C6532B] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {onBookmark ? (
              <button
                onClick={() => onBookmark(trail)}
                className={`px-4 py-2.5 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isBookmarked
                    ? 'bg-[#582822] text-[#FFF8EF] border-[#582822]'
                    : 'bg-[#F7EBDD] text-[#351E1A] border-[#E8D5C2] hover:bg-[#E8D5C2]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>{isBookmarked ? 'Saved in Pocket Diary' : 'Save Route to Diary'}</span>
              </button>
            ) : (
              <span className="text-[11px] font-sans text-[#351E1A]/60">
                Self-Guided Walking Route &bull; 100% Free
              </span>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Close Trail Route
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
