import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Clock, Star, Map, Compass, Footprints, Train, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { SuggestedTrail } from '../../types/travel';

interface SuggestedTrailsSectionProps {
  trails: SuggestedTrail[];
  onSelectTrail: (trail: SuggestedTrail) => void;
  onBrowseAll?: () => void;
}

export const SuggestedTrailsSection: React.FC<SuggestedTrailsSectionProps> = ({
  trails,
  onSelectTrail,
  onBrowseAll,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsVisible = 2;
  const maxIndex = Math.max(0, trails.length - itemsVisible);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      setSlideDirection('right');
      setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setSlideDirection('left');
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleTrails = trails.slice(startIndex, startIndex + itemsVisible);

  return (
    <section 
      id="trails" 
      className="py-8 sm:py-12 lg:py-14 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Eyebrow */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
          Chapter III &bull; Self-Guided Walking &amp; Transit Routes
        </span>
        <span className="text-[#D9A38E]">&bull;</span>
        <span className="font-bengali text-xs text-[#582822] font-semibold">
          পায়ে হেঁটে ও ট্রামে ঘুরে দেখা কলকাতা
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        {/* Left Column: Rich Oxblood/Ink Brown Editorial Feature Box */}
        <div className="lg:col-span-4 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-[#582822] text-[#FFF8EF] flex flex-col justify-between shadow-[0_12px_36px_rgba(88,40,34,0.16)] border border-[#351E1A] relative overflow-hidden">
          {/* Subtle archival watermark pattern */}
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="space-y-3 sm:space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/20 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A38E]">
              <Navigation className="w-3 h-3 text-[#C5A25A]" />
              <span>Independent Itineraries</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-tight text-[#FFF8EF]">
              Curated Walking &amp; Vintage Transit Trails
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#FFF8EF]/80 leading-relaxed">
              Step-by-step DIY itineraries to experience Kolkata at an analog tempo. 
              Built around vintage electric tramways, sacred Hooghly passenger ferries, and walkable architectural corridors.
            </p>

            <ul className="space-y-2 sm:space-y-3 pt-2 text-xs text-[#FFF8EF]/90 font-sans">
              <li className="flex items-center gap-2">
                <Footprints className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A25A] shrink-0" />
                <span>Pedestrian-friendly alleys &amp; shaded courtyards</span>
              </li>
              <li className="flex items-center gap-2">
                <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A25A] shrink-0" />
                <span>Vintage tramways, Metro Blue line &amp; ₹6 river ferries</span>
              </li>
              <li className="flex items-center gap-2">
                <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A25A] shrink-0" />
                <span>Literary tea rooms &amp; vantage points</span>
              </li>
            </ul>
          </div>

          <div className="pt-5 sm:pt-8 space-y-3 sm:space-y-4 relative z-10 border-t border-[#FFF8EF]/15 mt-4 sm:mt-6">
            {/* Trail counter & Carousel navigation buttons */}
            <div className="flex items-center justify-between text-xs text-[#FFF8EF]/80 font-sans">
              <span>
                Trail {startIndex + 1}&ndash;{Math.min(startIndex + itemsVisible, trails.length)} of {trails.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-[#FFF8EF] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Previous trails"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex >= maxIndex}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-[#FFF8EF] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Next trails"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (onBrowseAll) {
                  onBrowseAll();
                } else if (trails.length > 0) {
                  onSelectTrail(trails[0]);
                }
              }}
              className="w-full px-5 py-2.5 sm:py-3 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-white text-xs font-sans font-bold tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explore all {trails.length} Curated Trails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Columns: Suggested Trail Cards with Side Navigation Arrows */}
        <div className="lg:col-span-8 relative group/trailcards">
          {startIndex > 0 && (
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90"
              aria-label="Previous trails"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            className="overflow-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              key={startIndex}
              className={`grid grid-cols-2 gap-2.5 sm:gap-6 transition-all duration-500 ease-out ${
                slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
              }`}
            >
              {visibleTrails.map((trail) => (
                <div
                  key={trail.id}
                  onClick={() => onSelectTrail(trail)}
                  className="archival-tilt-card group relative h-[340px] sm:h-[450px] lg:h-[490px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-[0_6px_20px_rgba(53,30,26,0.08)] bg-[#351E1A] flex flex-col justify-end border border-[#E8D5C2]"
                >
                  {/* Vintage Postmark Stamp Badge Overlay */}
                  <div className="vintage-postmark-stamp scale-75 sm:scale-100 origin-top-right hidden xs:block">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-dashed border-[#FFF8EF]/80 bg-[#351E1A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-0.5 text-center shadow-xs">
                      <span className="text-[5px] sm:text-[6px] font-mono tracking-tighter text-[#FFF8EF] font-bold">ROUTE</span>
                      <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black text-[#C5A25A] leading-none">CCU</span>
                      <span className="text-[4.5px] sm:text-[5.5px] font-mono text-[#D9A38E]">TRAIL</span>
                    </div>
                  </div>

                  <img
                    src={trail.imageUrl}
                    alt={trail.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />

                  {/* Warm analog gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/65 to-transparent pointer-events-none" />

                  {/* Tag (Top Left) */}
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-[#C6532B] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    {trail.tag}
                  </div>

                  {/* Difficulty (Top Right) */}
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-14 bg-[#FFF8EF]/95 text-[#351E1A] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-sans font-semibold shadow-xs border border-[#E8D5C2]">
                    {trail.difficulty}
                  </div>

                  {/* Bottom Content Area */}
                  <div className="relative z-10 p-3 sm:p-6 space-y-1.5 sm:space-y-2.5 text-[#FFF8EF]">
                    <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-sans text-[#D9A38E]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A25A]" />
                        <span>{trail.duration}</span>
                      </span>
                      {trail.distance && (
                        <>
                          <span className="hidden xs:inline">&bull;</span>
                          <span className="hidden xs:flex items-center gap-1">
                            <Footprints className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5A25A]" />
                            <span>{trail.distance}</span>
                          </span>
                        </>
                      )}
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                        <span className="font-bold text-[#FFF8EF]">{trail.rating}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-sm sm:text-2xl font-bold group-hover:text-[#D9A38E] transition-colors leading-snug min-h-[34px] sm:min-h-[56px] flex items-start line-clamp-2">
                      {trail.title}
                    </h3>

                    <p className="font-sans text-[11px] sm:text-xs text-[#FFF8EF]/80 line-clamp-2 leading-relaxed min-h-[28px] sm:min-h-[36px]">
                      {trail.subtitle}
                    </p>

                    {/* Key Stops Chips */}
                    <div className="hidden xs:flex pt-0.5 sm:pt-1 flex-wrap gap-1 sm:gap-1.5">
                      {trail.keyStops.slice(0, 2).map((stop, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] sm:text-[10px] font-sans px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FFF8EF]/15 text-[#FFF8EF] border border-[#FFF8EF]/10 truncate max-w-[90px]"
                        >
                          {stop}
                        </span>
                      ))}
                      {trail.keyStops.length > 2 && (
                        <span className="text-[9px] sm:text-[10px] font-sans px-1 py-0.5 text-[#D9A38E]">
                          +{trail.keyStops.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="pt-1 sm:pt-2">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-sans font-semibold text-[#D9A38E] group-hover:translate-x-1 transition-transform">
                        <span>Route &amp; Times</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {startIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90"
              aria-label="Next trails"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
