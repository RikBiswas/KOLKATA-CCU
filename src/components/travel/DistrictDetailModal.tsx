import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Utensils, Train, Compass, Quote, Bookmark, Check, ExternalLink } from 'lucide-react';
import { Neighborhood } from '../../types/travel';

interface DistrictDetailModalProps {
  district: Neighborhood | null;
  onClose: () => void;
  onBookmarkDistrict?: (district: Neighborhood) => void;
  isBookmarked?: boolean;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  onClose,
  onBookmarkDistrict,
  isBookmarked = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (district) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [district, onClose]);

  if (!district) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="district-modal-title"
    >
      <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-[#FFF8EF] flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg border border-[#FFF8EF]/20"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Hero Image Header with Vignette & Bengali Calligraphy */}
        <div className="relative h-44 sm:h-64 md:h-72 w-full overflow-hidden bg-[#351E1A] rounded-t-3xl">
          <img
            src={district.coverImage}
            alt={district.name}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/images/destinations/bow-barracks.jpg')) {
                target.src = '/images/destinations/bow-barracks.jpg';
              }
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/40 to-transparent pointer-events-none" />

          {/* Bengali Name Callout */}
          <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 bg-[#FFF8EF]/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-bengali font-bold text-[#582822] shadow-xs border border-[#E8D5C2]">
            {district.bengaliName}
          </div>

          <div className="absolute bottom-3 sm:bottom-4 left-3.5 sm:left-5 right-3.5 sm:right-5 text-[#FFF8EF] space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#C5A25A] uppercase tracking-wider">
              {district.era} &bull; Cultural Dossier
            </span>
            <h2 id="district-modal-title" className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              {district.name}
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#D9A38E]">
              {district.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-[#351E1A]">
          {/* Literary Quote */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-2">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-[#C6532B] shrink-0 mt-0.5" />
              <p className="font-serif italic text-xs sm:text-base text-[#351E1A] leading-relaxed">
                {district.quote}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-sans font-bold text-[#582822]">
                &mdash; {district.quoteAuthor}
              </span>
            </div>
          </div>

          {/* Narrative & History */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351E1A]">
              Atmosphere &amp; Living Heritage
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed">
              {district.description}
            </p>
            <div className="p-3 rounded-xl bg-[#F7EBDD]/60 border border-[#E8D5C2] text-xs font-sans text-[#582822]">
              <strong>Atmospheric character:</strong> {district.vibe}
            </div>
          </div>

          {/* Anchoring Landmarks */}
          <div className="space-y-2.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#351E1A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C6532B]" />
              <span>Key Sights &amp; Courtyards</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {district.keySpots.map((spot, idx) => (
                <a
                  key={idx}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot}, ${district.name}, Kolkata`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-xl bg-[#F7EBDD] hover:bg-[#F0DDC8] border border-[#E8D5C2] hover:border-[#C6532B] text-xs font-sans font-semibold text-[#351E1A] flex items-center justify-between gap-2 group transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  title={`View ${spot} on Google Maps`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#C6532B] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{spot}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#351E1A]/40 group-hover:text-[#C6532B] shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Practical Explorer Grid: 2-col on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase">Gastronomy</span>
              </div>
              <p className="text-[11px] sm:text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
                {district.signatureFood}
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase">Optimal Stroll</span>
              </div>
              <p className="text-[11px] sm:text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
                {district.bestWalkingTime}
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase">Public Transit</span>
              </div>
              <p className="text-[11px] sm:text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
                {district.transitTip}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-center justify-between gap-3">
            {onBookmarkDistrict && (
              <button
                onClick={() => onBookmarkDistrict(district)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isBookmarked
                    ? 'bg-[#582822] text-[#FFF8EF] border-[#582822]'
                    : 'bg-[#F7EBDD] text-[#351E1A] border-[#E8D5C2] hover:bg-[#E8D5C2]'
                }`}
              >
                {isBookmarked ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C5A25A]" />
                    <span>Saved in Pocket Diary</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                    <span>Save to Pocket Diary</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
