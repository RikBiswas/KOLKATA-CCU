import React, { useState } from 'react';
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
  const itemsVisible = 2;
  const maxIndex = Math.max(0, trails.length - itemsVisible);

  React.useEffect(() => {
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
      className="py-10 sm:py-14 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Eyebrow */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
          Chapter III &bull; Self-Guided Walking &amp; Transit Routes
        </span>
        <span className="text-[#D9A38E]">&bull;</span>
        <span className="font-bengali text-xs text-[#582822] font-semibold">
          পায়ে হেঁটে ও ট্রামে ঘুরে দেখা কলকাতা
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Rich Oxblood/Ink Brown Editorial Feature Box */}
        <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl bg-[#582822] text-[#FFF8EF] flex flex-col justify-between shadow-[0_16px_40px_rgba(88,40,34,0.18)] border border-[#351E1A] relative overflow-hidden">
          {/* Subtle archival watermark pattern */}
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/20 text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A38E]">
              <Navigation className="w-3 h-3 text-[#C5A25A]" />
              <span>Independent Itineraries</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight leading-tight text-[#FFF8EF]">
              Curated Walking &amp; Vintage Transit Trails
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#FFF8EF]/80 leading-relaxed">
              Step-by-step DIY itineraries to experience Kolkata at an analog tempo. 
              Built around vintage electric tramways, sacred Hooghly passenger ferries, and walkable architectural corridors.
            </p>

            <ul className="space-y-3 pt-3 text-xs text-[#FFF8EF]/90 font-sans">
              <li className="flex items-center gap-2.5">
                <Footprints className="w-4 h-4 text-[#C5A25A] shrink-0" />
                <span>Pedestrian-friendly alleys &amp; shaded courtyards</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Train className="w-4 h-4 text-[#C5A25A] shrink-0" />
                <span>Vintage tramways, Metro Blue line &amp; ₹6 river ferries</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Map className="w-4 h-4 text-[#C5A25A] shrink-0" />
                <span>Literary tea rooms, street food stops &amp; photography vantage points</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-4 relative z-10 border-t border-[#FFF8EF]/15 mt-6">
            {/* Trail counter & Carousel navigation buttons */}
            <div className="flex items-center justify-between text-xs text-[#FFF8EF]/80 font-sans">
              <span>
                Trail {startIndex + 1}&ndash;{Math.min(startIndex + itemsVisible, trails.length)} of {trails.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className="w-8 h-8 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-[#FFF8EF] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  aria-label="Previous trails"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex >= maxIndex}
                  className="w-8 h-8 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-[#FFF8EF] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer active:scale-95"
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
              className="w-full px-6 py-3 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-white text-xs font-sans font-bold tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
              className="absolute left-1 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] flex items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90"
              aria-label="Previous trails"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="overflow-hidden">
            <div
              key={startIndex}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-500 ease-out ${
                slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
              }`}
            >
              {visibleTrails.map((trail) => (
                <div
                  key={trail.id}
                  onClick={() => onSelectTrail(trail)}
                  className="archival-tilt-card group relative h-[450px] sm:h-[490px] rounded-3xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(53,30,26,0.08)] bg-[#351E1A] flex flex-col justify-end border border-[#E8D5C2]"
                >
                  {/* Vintage Postmark Stamp Badge Overlay */}
                  <div className="vintage-postmark-stamp">
                    <div className="w-10 h-10 rounded-full border border-dashed border-[#FFF8EF]/80 bg-[#351E1A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-0.5 text-center shadow-xs">
                      <span className="text-[6px] font-mono tracking-tighter text-[#FFF8EF] font-bold">ROUTE</span>
                      <span className="text-[7.5px] font-mono font-black text-[#C5A25A] leading-none">CCU</span>
                      <span className="text-[5.5px] font-mono text-[#D9A38E]">TRAIL</span>
                    </div>
                  </div>

                  <img
                    src={trail.imageUrl}
                    alt={trail.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />

                  {/* Warm analog gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/60 to-transparent pointer-events-none" />

                  {/* Tag (Top Left) */}
                  <div className="absolute top-4 left-4 bg-[#C6532B] text-white px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    {trail.tag}
                  </div>

                  {/* Difficulty (Top Right) */}
                  <div className="absolute top-4 right-14 bg-[#FFF8EF]/95 text-[#351E1A] px-3 py-1 rounded-full text-xs font-sans font-semibold shadow-xs border border-[#E8D5C2]">
                    {trail.difficulty}
                  </div>

                  {/* Bottom Content Area */}
                  <div className="relative z-10 p-6 space-y-2.5 text-[#FFF8EF]">
                    <div className="flex items-center gap-3 text-xs font-sans text-[#D9A38E]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A25A]" />
                        <span>{trail.duration}</span>
                      </span>
                      {trail.distance && (
                        <>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Footprints className="w-3.5 h-3.5 text-[#C5A25A]" />
                            <span>{trail.distance}</span>
                          </span>
                        </>
                      )}
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                        <span className="font-bold text-[#FFF8EF]">{trail.rating}</span>
                        <span className="text-[#FFF8EF]/60">({trail.reviewsCount})</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold group-hover:text-[#D9A38E] transition-colors leading-snug min-h-[56px] flex items-start">
                      {trail.title}
                    </h3>

                    <p className="font-sans text-xs text-[#FFF8EF]/80 line-clamp-2 leading-relaxed min-h-[36px]">
                      {trail.subtitle}
                    </p>

                    {/* Key Stops Chips */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {trail.keyStops.slice(0, 3).map((stop, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#FFF8EF]/15 text-[#FFF8EF] border border-[#FFF8EF]/10"
                        >
                          {stop}
                        </span>
                      ))}
                      {trail.keyStops.length > 3 && (
                        <span className="text-[10px] font-sans px-1.5 py-0.5 text-[#D9A38E]">
                          +{trail.keyStops.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#D9A38E] group-hover:translate-x-1 transition-transform">
                        <span>Click to view detailed route &amp; time framework</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
              className="absolute right-1 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] flex items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90"
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
