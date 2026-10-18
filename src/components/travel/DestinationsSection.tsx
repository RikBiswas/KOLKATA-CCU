import React, { useState, useRef, useEffect } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Eye, Clock, ArrowRight, Compass, Dices } from 'lucide-react';
import { Destination } from '../../types/travel';

interface DestinationsSectionProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onViewAll?: () => void;
}

const VIBE_FILTERS = [
  { id: 'all-vibes', label: 'All Sights', icon: '🏛️' },
  { id: 'monsoon', label: 'Monsoon Walks', keyword: 'lake', icon: '🌧️' },
  { id: 'late-night', label: 'Late Night & Sunset', keyword: 'sunset', icon: '🌙' },
  { id: 'colonial', label: 'Colonial Architecture', keyword: 'colonial', icon: '🏛️' },
  { id: 'courtyard', label: 'Quiet Courtyards', keyword: 'garden', icon: '🌿' },
  { id: 'riverfront', label: 'River Breeze', keyword: 'ghat', icon: '⛵' },
];

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations,
  onSelectDestination,
  onViewAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVibe, setSelectedVibe] = useState<string>('all-vibes');
  const [scrollIndex, setScrollIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Slider refs & state for horizontal filter pill sliding
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(false);

  const vibeScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollVibeLeft, setCanScrollVibeLeft] = useState(false);
  const [canScrollVibeRight, setCanScrollVibeRight] = useState(false);

  const checkCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollCatLeft(scrollLeft > 6);
      setCanScrollCatRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  const checkVibeScroll = () => {
    if (vibeScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = vibeScrollRef.current;
      setCanScrollVibeLeft(scrollLeft > 6);
      setCanScrollVibeRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  };

  // Categories extracted from destination items
  const categories = ['All', ...Array.from(new Set(destinations.map((d) => d.category)))];

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCategoryScroll();
      checkVibeScroll();
    }, 100);
    window.addEventListener('resize', checkCategoryScroll);
    window.addEventListener('resize', checkVibeScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkCategoryScroll);
      window.removeEventListener('resize', checkVibeScroll);
    };
  }, [categories]);

  const slideCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkCategoryScroll, 350);
    }
  };

  const slideVibes = (direction: 'left' | 'right') => {
    if (vibeScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      vibeScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkVibeScroll, 350);
    }
  };

  const handleWheelHorizontal = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY * 1.2;
    }
  };

  // Surprise Me / Random Heritage Spot generator
  const handleSurpriseMe = () => {
    if (destinations.length === 0) return;
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const chosen = destinations[randomIndex];
    onSelectDestination(chosen);
  };

  const filtered = destinations.filter((dest) => {
    const matchesCat = selectedCategory === 'All' || dest.category === selectedCategory;
    if (!matchesCat) return false;
    if (selectedVibe === 'all-vibes') return true;

    const vibe = VIBE_FILTERS.find((v) => v.id === selectedVibe);
    if (!vibe || !vibe.keyword) return true;
    const kw = vibe.keyword.toLowerCase();
    const searchable = `${dest.name} ${dest.description} ${dest.tagline} ${dest.category} ${dest.region} ${dest.bestTimeToVisit} ${dest.insiderTip || ''}`.toLowerCase();
    return searchable.includes(kw);
  });

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, filtered.length - itemsPerPage);

  const handlePrev = () => {
    setSlideDirection('left');
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setScrollIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleDestinations = filtered.slice(scrollIndex, scrollIndex + itemsPerPage);

  return (
    <section id="destinations" className="py-10 sm:py-14 scroll-mt-24">
      {/* Section Header with Editorial Framing */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter II &bull; Historic Architectural Landmarks
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              স্থাপত্য ও স্মৃতির পদচিহ্ন
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            Curated Sights &amp; Architectural Marvels
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            From Greco-Roman colonial corridors to sacred Hooghly river ghats and 300-year-old artisan quarters.
            Select any landmark for transport routes, timing windows, and native insider lore.
          </p>
        </div>

        {/* Surprise Me & Landmark Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSurpriseMe}
            className="px-4 py-2 rounded-full bg-[#FFF8EF] border border-[#C5A25A] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-bold flex items-center gap-2 shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
            title="Roll the dice to discover a random Calcutta secret"
          >
            <Dices className="w-4 h-4 text-[#C6532B] group-hover:rotate-180 transition-transform duration-500" />
            <span>Surprise Me</span>
          </button>

          <span className="text-xs font-sans font-medium text-[#351E1A]/70 px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs">
            {filtered.length > 0 ? scrollIndex + 1 : 0}&ndash;{Math.min(scrollIndex + itemsPerPage, filtered.length)} of {filtered.length}
          </span>
        </div>
      </div>

      {/* Vibe Filter Chips with Slider Controls */}
      <div className="relative mb-4">
        {canScrollVibeLeft && (
          <div className="absolute left-0 top-0 bottom-2 z-10 flex items-center pr-3 bg-gradient-to-r from-[#F7EBDD] via-[#F7EBDD]/90 to-transparent pointer-events-auto">
            <button
              onClick={() => slideVibes('left')}
              className="w-6 h-6 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] hover:text-[#C6532B] flex items-center justify-center shadow-xs transition-all active:scale-90 cursor-pointer"
              aria-label="Slide vibes left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div
          ref={vibeScrollRef}
          onScroll={checkVibeScroll}
          onWheel={handleWheelHorizontal}
          className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          <span className="text-[11px] font-mono font-bold text-[#582822] shrink-0 mr-1">
            Filter by Vibe:
          </span>
          {VIBE_FILTERS.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVibe(v.id);
                setScrollIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-sans flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                selectedVibe === v.id
                  ? 'bg-[#C6532B] text-[#FFF8EF] font-bold shadow-xs'
                  : 'bg-[#FFF8EF]/80 text-[#351E1A]/70 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
              }`}
            >
              <span className="text-xs">{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>

        {canScrollVibeRight && (
          <div className="absolute right-0 top-0 bottom-2 z-10 flex items-center pl-3 bg-gradient-to-l from-[#F7EBDD] via-[#F7EBDD]/90 to-transparent pointer-events-auto">
            <button
              onClick={() => slideVibes('right')}
              className="w-6 h-6 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] hover:text-[#C6532B] flex items-center justify-center shadow-xs transition-all active:scale-90 cursor-pointer"
              aria-label="Slide vibes right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Pills Slider with Left/Right Controls */}
      <div className="relative mb-8">
        {canScrollCatLeft && (
          <div className="absolute left-0 top-0 bottom-2 z-10 flex items-center pr-3 bg-gradient-to-r from-[#F7EBDD] via-[#F7EBDD]/90 to-transparent pointer-events-auto">
            <button
              onClick={() => slideCategories('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] hover:text-[#C6532B] flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer"
              aria-label="Slide categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          ref={categoryScrollRef}
          onScroll={checkCategoryScroll}
          onWheel={handleWheelHorizontal}
          className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setScrollIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#351E1A] text-[#FFF8EF] font-semibold shadow-xs'
                  : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {canScrollCatRight && (
          <div className="absolute right-0 top-0 bottom-2 z-10 flex items-center pl-3 bg-gradient-to-l from-[#F7EBDD] via-[#F7EBDD]/90 to-transparent pointer-events-auto">
            <button
              onClick={() => slideCategories('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] hover:text-[#C6532B] flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer"
              aria-label="Slide categories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Asymmetric Editorial Destination Cards with Floating Side Arrows */}
      <div className="relative group/cards">
        {/* Floating Left Side Arrow */}
        {scrollIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-1 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] flex items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90 group/btn"
            aria-label="Previous landmarks"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-0.5" />
          </button>
        )}

        <div className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#FFF8EF] rounded-3xl border border-[#E8D5C2]">
            <p className="font-serif text-lg text-[#351E1A]">No landmarks match this vibe or category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedVibe('all-vibes');
              }}
              className="mt-3 text-xs font-sans font-bold text-[#C6532B] underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            key={`${selectedCategory}-${selectedVibe}-${scrollIndex}`}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-out ${
              slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
          >
            {visibleDestinations.map((dest, idx) => {
              const actualNumber = String(scrollIndex + idx + 1).padStart(2, '0');
              const totalCount = String(destinations.length).padStart(2, '0');

              return (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(dest)}
                  className="archival-tilt-card group relative rounded-3xl overflow-hidden cursor-pointer bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.06)] flex flex-col justify-between"
                >
                  {/* Vintage Postmark Stamp Badge Overlay */}
                  <div className="vintage-postmark-stamp">
                    <div className="w-10 h-10 rounded-full border border-dashed border-[#C5A25A] bg-[#FFF8EF]/90 backdrop-blur-xs flex flex-col items-center justify-center p-0.5 text-center shadow-xs">
                      <span className="text-[6px] font-mono tracking-tighter text-[#351E1A] font-bold">CALCUTTA</span>
                      <span className="text-[7.5px] font-mono font-black text-[#C6532B] leading-none">POST</span>
                      <span className="text-[5.5px] font-mono text-[#582822]">1873</span>
                    </div>
                  </div>

                  {/* Image Container with Editorial Plate Number */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#351E1A]">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                    />

                    {/* Warm paper gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/80 via-transparent to-[#351E1A]/20 pointer-events-none" />

                    {/* Plate Index Badge (Top Left) */}
                    <div className="absolute top-3.5 left-3.5 bg-[#FFF8EF]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#351E1A] shadow-xs border border-[#E8D5C2]">
                      {actualNumber} / {totalCount}
                    </div>

                    {/* Region Pill (Top Right) */}
                    <div className="absolute top-3.5 right-3.5 bg-[#351E1A]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold text-[#FFF8EF] shadow-xs border border-[#FFF8EF]/20 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D9A38E]" />
                      <span>{dest.region}</span>
                    </div>

                    {/* Category Ribbon on Image Bottom */}
                    <div className="absolute bottom-3 left-3.5">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C5A25A] bg-[#351E1A]/90 px-2 py-0.5 rounded-sm">
                        {dest.category}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug min-h-[56px] flex items-start">
                        {dest.name}
                      </h3>

                      <p className="font-sans text-xs text-[#351E1A]/70 line-clamp-2 leading-relaxed min-h-[36px]">
                        {dest.tagline}
                      </p>
                    </div>

                    {/* Footer Info: Rating + Visiting Hours */}
                    <div className="pt-2 border-t border-[#E8D5C2]/70 space-y-2 mt-auto">
                      <div className="flex items-center justify-between text-xs font-sans text-[#351E1A]/80">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                          <span className="font-bold text-[#351E1A]">{dest.rating}</span>
                          <span className="text-[#351E1A]/50 text-[10px]">({dest.reviewsCount})</span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-[#351E1A]/70">
                          <Clock className="w-3 h-3 text-[#C6532B]" />
                          <span className="truncate max-w-[110px]">{dest.bestTimeToVisit.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Guide trigger button */}
                      <div className="pt-1 flex items-center justify-between text-xs font-sans font-semibold text-[#C6532B] group-hover:translate-x-1 transition-transform">
                        <span>Read Full Guide &amp; Transit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Right Side Arrow */}
      {scrollIndex < maxIndex && (
        <button
          onClick={handleNext}
          className="absolute right-1 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#C6532B] hover:text-[#FFF8EF] hover:border-[#C6532B] flex items-center justify-center transition-all duration-300 shadow-[0_6px_20px_rgba(53,30,26,0.18)] cursor-pointer active:scale-90 group/btn"
          aria-label="Next landmarks"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      )}
    </div>

      {/* Bottom Bar: View All button & Counter */}
      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#C6532B]" />
          <span className="font-serif text-sm sm:text-base text-[#351E1A]">
            Want to see all {destinations.length} curated Kolkata landmarks?
          </span>
        </div>

        <button
          onClick={onViewAll}
          className="px-6 py-2.5 text-xs font-sans font-bold tracking-wide text-white bg-[#351E1A] hover:bg-[#582822] rounded-full transition-all duration-200 shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <span>Open Full Landmark Gallery ({destinations.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
