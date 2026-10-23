import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, MapPin, Clock, Calendar, Check, Compass, Bus, Info, Lightbulb, Bookmark, ExternalLink } from 'lucide-react';
import { Destination } from '../../types/travel';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onBookmark?: (destination: Destination) => void;
  isBookmarked?: boolean;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
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
    if (destination) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [destination, onClose]);

  if (!destination) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dest-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FFF8EF] rounded-3xl shadow-2xl border border-[#E8D5C2] overflow-hidden max-h-[92vh] flex flex-col text-[#351E1A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-[#FFF8EF] transition-all shadow-lg hover:scale-105 active:scale-95 border border-[#FFF8EF]/20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Hero Image Banner */}
        <div className="relative h-44 sm:h-64 md:h-72 w-full shrink-0 bg-[#351E1A]">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/95 via-[#351E1A]/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-3 sm:bottom-4 left-3.5 sm:left-6 right-3.5 sm:right-6 text-[#FFF8EF] space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full bg-[#C6532B] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  {destination.category}
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans text-[#D9A38E] flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{destination.region}</span>
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destination.name}, Kolkata`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-[10px] sm:text-[11px] font-sans font-semibold text-[#FFF8EF] border border-white/30 flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-xs"
                title={`Open ${destination.name} on Google Maps`}
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-[#FFF8EF]/80" />
              </a>
            </div>

            <h2 id="modal-dest-title" className="font-serif text-lg sm:text-2xl md:text-3xl font-bold leading-tight">
              {destination.name}
            </h2>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs font-sans text-[#FFF8EF]/80">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                <span className="font-bold text-[#FFF8EF]">{destination.rating}</span>
                <span className="text-[#FFF8EF]/60 text-[10px] sm:text-xs">({destination.reviewsCount} explorer ratings)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-3.5 sm:p-6 md:p-8 overflow-y-auto space-y-4 sm:space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6532B]">
              Historical Significance &amp; Lore
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Key Visitor Timings & Info Grid: 2-col on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[#351E1A]/60 flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
                <Clock className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>Visiting Hours</span>
              </span>
              <p className="font-bold text-[#351E1A] text-[11px] sm:text-xs">{destination.timing}</p>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[#351E1A]/60 flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#582822]" />
                <span>Best Window</span>
              </span>
              <p className="font-bold text-[#351E1A] text-[11px] sm:text-xs">{destination.bestTimeToVisit}</p>
            </div>

            <div className="space-y-0.5 sm:space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[#351E1A]/60 flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
                <Info className="w-3.5 h-3.5 text-[#C5A25A]" />
                <span>Official Entry Fee</span>
              </span>
              <p className="font-bold text-[#351E1A] text-[11px] sm:text-xs">{destination.entryFee}</p>
            </div>
          </div>

          {/* How to reach via public transit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] space-y-1.5">
            <h4 className="text-xs font-mono font-bold text-[#582822] uppercase tracking-wider flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#C6532B]" />
              <span>Public Transit Guidance (Trams, Metro &amp; Ferries)</span>
            </h4>
            <p className="font-sans text-xs text-[#351E1A]/80 leading-relaxed">
              {destination.howToReach}
            </p>
          </div>

          {/* Native Calcuttan Insider Tip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#C6532B]/10 border border-[#C6532B]/30 space-y-1.5">
            <h4 className="text-xs font-mono font-bold text-[#C6532B] uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#C6532B]" />
              <span>Native Calcuttan Insider Tip</span>
            </h4>
            <p className="font-sans text-xs text-[#351E1A]/85 leading-relaxed italic">
              &ldquo;{destination.insiderTip}&rdquo;
            </p>
          </div>

          {/* Key Architectural Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C6532B]">
              Key Architectural Sights &amp; Exhibits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destination.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-sans text-[#351E1A]/85">
                  <Check className="w-3.5 h-3.5 text-[#C6532B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {onBookmark ? (
              <button
                onClick={() => onBookmark(destination)}
                className={`px-4 py-2.5 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isBookmarked
                    ? 'bg-[#582822] text-[#FFF8EF] border-[#582822]'
                    : 'bg-[#F7EBDD] text-[#351E1A] border-[#E8D5C2] hover:bg-[#E8D5C2]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>{isBookmarked ? 'Saved in Pocket Diary' : 'Save to Pocket Diary'}</span>
              </button>
            ) : (
              <span className="text-[11px] font-sans text-[#351E1A]/60">
                Independent Heritage Guidance &bull; WANDER.CCU
              </span>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
