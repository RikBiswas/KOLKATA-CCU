import React, { useState } from 'react';
import { MapPin, Clock, Utensils, Compass, Train, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { Neighborhood } from '../../types/travel';

interface NeighborhoodsSectionProps {
  neighborhoods: Neighborhood[];
  onSelectDistrict: (district: Neighborhood) => void;
  onExploreDistrictLandmarks: (districtName: string) => void;
}

export const NeighborhoodsSection: React.FC<NeighborhoodsSectionProps> = ({
  neighborhoods,
  onSelectDistrict,
  onExploreDistrictLandmarks,
}) => {
  const [activeDistrictId, setActiveDistrictId] = useState<string>(neighborhoods[0]?.id || 'north-kolkata');

  const currentDistrict = neighborhoods.find((n) => n.id === activeDistrictId) || neighborhoods[0];

  if (!currentDistrict) return null;

  return (
    <section id="neighborhoods" className="py-14 sm:py-20 my-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter II &bull; Cultural Districts &amp; Quarters
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              ঐতিহাসিক পাড়া ও রাজবাড়ি
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            The Living Quarters of Old Calcutta
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            In Kolkata, every historic neighborhood (&ldquo;পাড়া&rdquo;) possesses its own distinct heartbeat, 
            architectural dialect, culinary secrets, and literary lore. Switch between districts to understand the city&rsquo;s living layers.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-sans font-semibold text-[#351E1A] shadow-xs">
            <span className="text-[#C6532B] font-bold">5</span> Distinct Heritage Enclaves
          </div>
        </div>
      </div>

      {/* District Pill Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {neighborhoods.map((district) => {
          const isActive = district.id === activeDistrictId;
          return (
            <button
              key={district.id}
              onClick={() => setActiveDistrictId(district.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#351E1A] text-[#FFF8EF] font-bold shadow-md scale-102'
                  : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD] hover:text-[#351E1A]'
              }`}
            >
              <span>{district.name.split('&')[0].trim()}</span>
              <span className="font-bengali text-[11px] opacity-75 hidden sm:inline">
                {district.bengaliName.split('ও')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* District Showcase Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(53,30,26,0.06)] relative overflow-hidden transition-all duration-500">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6532B]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Atmospheric Image with Postcard Vignette */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-[#E8D5C2] shadow-sm bg-[#351E1A] group">
            <img
              src={currentDistrict.coverImage}
              alt={currentDistrict.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/85 via-[#351E1A]/20 to-transparent" />

            {/* Top Badge: Bengali Name */}
            <div className="absolute top-3.5 left-3.5 bg-[#FFF8EF]/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bengali font-bold text-[#582822] shadow-xs border border-[#E8D5C2]">
              {currentDistrict.bengaliName}
            </div>

            {/* Era Tag (Top Right) */}
            <div className="absolute top-3.5 right-3.5 bg-[#351E1A]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#FFF8EF] border border-[#FFF8EF]/20">
              {currentDistrict.era}
            </div>

            {/* Bottom Floating Info */}
            <div className="absolute bottom-4 left-4 right-4 text-[#FFF8EF] space-y-1">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C5A25A]">
                District Character
              </span>
              <p className="text-xs font-sans text-[#FFF8EF]/90 italic leading-relaxed">
                {currentDistrict.vibe}
              </p>
            </div>
          </div>

          {/* Literary Quote Callout Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-2">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-[#C6532B] shrink-0 mt-0.5" />
              <p className="font-serif italic text-xs sm:text-sm text-[#351E1A] leading-relaxed">
                {currentDistrict.quote}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-sans font-bold text-[#582822]">
                &mdash; {currentDistrict.quoteAuthor}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Narrative & Practical Traveler Codex */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-sm bg-[#C6532B]/10 text-[#C6532B] font-mono text-[10px] font-bold uppercase tracking-wider">
                  Enclave Overview
                </span>
                <span className="text-[11px] font-sans text-[#351E1A]/60 font-medium">
                  {currentDistrict.era}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#351E1A] tracking-tight leading-tight">
                {currentDistrict.name}
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#C6532B] font-normal">
                {currentDistrict.tagline}
              </p>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/80 leading-relaxed">
              {currentDistrict.description}
            </p>

            {/* Key Spots Grid */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#582822] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>Anchoring Heritage Landmarks</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {currentDistrict.keySpots.map((spot, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans font-medium text-[#351E1A] shadow-xs"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Practical Specs (Food, Timing, Transit) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-1">
                <div className="flex items-center gap-1.5 text-[#C6532B]">
                  <Utensils className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold uppercase">Signature Taste</span>
                </div>
                <p className="text-xs font-sans text-[#351E1A] font-semibold leading-snug">
                  {currentDistrict.signatureFood}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-1">
                <div className="flex items-center gap-1.5 text-[#C6532B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold uppercase">Best Stroll Window</span>
                </div>
                <p className="text-xs font-sans text-[#351E1A] font-semibold leading-snug">
                  {currentDistrict.bestWalkingTime}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-1">
                <div className="flex items-center gap-1.5 text-[#C6532B]">
                  <Train className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold uppercase">Transit Link</span>
                </div>
                <p className="text-xs font-sans text-[#351E1A] font-semibold leading-snug truncate" title={currentDistrict.transitTip}>
                  {currentDistrict.transitTip.split(',')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => onSelectDistrict(currentDistrict)}
              className="px-5 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explore Detailed District Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onExploreDistrictLandmarks(currentDistrict.name.split('&')[0].trim())}
              className="text-xs font-sans font-bold text-[#C6532B] hover:text-[#B04520] underline transition-colors cursor-pointer text-center sm:text-right"
            >
              View Landmarks in this Quarter &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
