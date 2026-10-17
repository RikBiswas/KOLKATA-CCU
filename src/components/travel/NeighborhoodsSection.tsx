import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Utensils, Compass, Train, ArrowRight, Quote, Sparkles, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
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
  const [direction, setDirection] = useState<number>(1);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const currentIndex = neighborhoods.findIndex((n) => n.id === activeDistrictId);
  const safeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentDistrict = neighborhoods[safeIndex] || neighborhoods[0];

  const handlePrev = () => {
    setDirection(-1);
    const prevIdx = (safeIndex - 1 + neighborhoods.length) % neighborhoods.length;
    setActiveDistrictId(neighborhoods[prevIdx].id);
  };

  const handleNext = () => {
    setDirection(1);
    const nextIdx = (safeIndex + 1) % neighborhoods.length;
    setActiveDistrictId(neighborhoods[nextIdx].id);
  };

  const handleSelectTab = (districtId: string) => {
    const targetIdx = neighborhoods.findIndex((n) => n.id === districtId);
    if (targetIdx !== -1 && targetIdx !== safeIndex) {
      setDirection(targetIdx > safeIndex ? 1 : -1);
      setActiveDistrictId(districtId);
    }
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32, mass: 0.8 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.985,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    }),
  };

  // Keyboard navigation for smooth browsing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.style.overflow === 'hidden') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, neighborhoods.length]);

  // Keep active pill scrolled into center view smoothly
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeBtn = tabsContainerRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeDistrictId]);

  if (!currentDistrict) return null;

  return (
    <section id="neighborhoods" className="py-14 sm:py-20 my-8 scroll-mt-24">
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

        {/* Counter Pill & Step Navigator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-sans font-semibold text-[#351E1A] shadow-xs flex items-center gap-1.5">
            <span className="text-[#C6532B] font-bold">{safeIndex + 1}</span>
            <span className="text-[#351E1A]/50">/</span>
            <span>{neighborhoods.length} Enclaves</span>
          </div>
        </div>
      </div>

      {/* District Pill Navigation Tabs (Scrollbar hidden) */}
      <div
        ref={tabsContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar scroll-smooth"
      >
        {neighborhoods.map((district) => {
          const isActive = district.id === activeDistrictId;
          return (
            <button
              key={district.id}
              data-active={isActive ? "true" : "false"}
              onClick={() => handleSelectTab(district.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
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

      {/* District Showcase Container with Prominent Side Navigation Arrows */}
      <div className="relative">
        {/* Left Side Navigation Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border-2 border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.18)] text-[#351E1A] hover:bg-[#351E1A] hover:text-[#FFF8EF] hover:border-[#351E1A] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/btn"
          title={`Previous: ${neighborhoods[(safeIndex - 1 + neighborhoods.length) % neighborhoods.length].name}`}
          aria-label="Previous district card"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-0.5" />
        </button>

        {/* Right Side Navigation Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border-2 border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.18)] text-[#351E1A] hover:bg-[#351E1A] hover:text-[#FFF8EF] hover:border-[#351E1A] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/btn"
          title={`Next: ${neighborhoods[(safeIndex + 1) % neighborhoods.length].name}`}
          aria-label="Next district card"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-0.5" />
        </button>

        {/* Animated District Card with Sliding Navigation */}
        <div className="overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentDistrict.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(53,30,26,0.06)] relative overflow-hidden"
            >
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
                  <a
                    key={i}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot}, ${currentDistrict.name}, Kolkata`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#F7EBDD] hover:bg-[#F0DDC8] border border-[#E8D5C2] hover:border-[#C6532B] text-xs font-sans font-medium text-[#351E1A] shadow-xs flex items-center gap-1.5 group transition-all cursor-pointer"
                    title={`Locate ${spot} on Google Maps`}
                  >
                    <span>{spot}</span>
                    <ExternalLink className="w-3 h-3 text-[#351E1A]/40 group-hover:text-[#C6532B] transition-colors" />
                  </a>
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
      </motion.div>
    </AnimatePresence>
  </div>
</div>
</section>
  );
};
