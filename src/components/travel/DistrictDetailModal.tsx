import React from 'react';
import { X, MapPin, Clock, Utensils, Train, Compass, Quote, Bookmark, Check } from 'lucide-react';
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
  if (!district) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-[#FFF8EF] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header with Vignette & Bengali Calligraphy */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#351E1A] rounded-t-3xl">
          <img
            src={district.coverImage}
            alt={district.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/40 to-transparent" />

          {/* Bengali Name Callout */}
          <div className="absolute top-5 left-5 bg-[#FFF8EF]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bengali font-bold text-[#582822] shadow-xs border border-[#E8D5C2]">
            {district.bengaliName}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-[#FFF8EF] space-y-1">
            <span className="text-[11px] font-mono text-[#C5A25A] uppercase tracking-wider">
              {district.era} &bull; Cultural Dossier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {district.name}
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#D9A38E]">
              {district.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#351E1A]">
          {/* Literary Quote */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-2">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-[#C6532B] shrink-0 mt-0.5" />
              <p className="font-serif italic text-sm sm:text-base text-[#351E1A] leading-relaxed">
                {district.quote}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-sans font-bold text-[#582822]">
                &mdash; {district.quoteAuthor}
              </span>
            </div>
          </div>

          {/* Narrative & History */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#351E1A]">
              Atmosphere &amp; Living Heritage
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed">
              {district.description}
            </p>
            <div className="p-3.5 rounded-xl bg-[#F7EBDD]/60 border border-[#E8D5C2] text-xs font-sans text-[#582822]">
              <strong>Atmospheric character:</strong> {district.vibe}
            </div>
          </div>

          {/* Anchoring Landmarks */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#351E1A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C6532B]" />
              <span>Key Sights &amp; Courtyards</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {district.keySpots.map((spot, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans font-semibold text-[#351E1A] flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C6532B] shrink-0" />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Explorer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Utensils className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Gastronomy</span>
              </div>
              <p className="text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
                {district.signatureFood}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Optimal Stroll</span>
              </div>
              <p className="text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
                {district.bestWalkingTime}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Train className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Public Transit</span>
              </div>
              <p className="text-xs font-sans text-[#351E1A] font-semibold leading-relaxed">
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
    </div>
  );
};
