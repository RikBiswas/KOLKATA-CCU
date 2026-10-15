import React, { useState } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Eye, Clock, ArrowRight, Compass } from 'lucide-react';
import { Destination } from '../../types/travel';

interface DestinationsSectionProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onViewAll?: () => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations,
  onSelectDestination,
  onViewAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scrollIndex, setScrollIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Categories extracted from destination items
  const categories = ['All', ...Array.from(new Set(destinations.map((d) => d.category)))];

  const filtered = destinations.filter((dest) => {
    if (selectedCategory === 'All') return true;
    return dest.category === selectedCategory;
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
    <section id="destinations" className="py-14 sm:py-20 my-8">
      {/* Section Header with Editorial Framing */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter I &bull; Historic Landmarks
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

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-sans text-[#351E1A]/60">
            {filtered.length > 0 ? scrollIndex + 1 : 0}&ndash;{Math.min(scrollIndex + itemsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous landmarks"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex >= maxIndex}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Next landmarks"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setScrollIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#351E1A] text-[#FFF8EF] font-semibold shadow-xs'
                : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asymmetric Editorial Destination Cards */}
      <div className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#FFF8EF] rounded-3xl border border-[#E8D5C2]">
            <p className="font-serif text-lg text-[#351E1A]">No landmarks found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-xs font-sans font-bold text-[#C6532B] underline"
            >
              Reset to all landmarks
            </button>
          </div>
        ) : (
          <div
            key={`${selectedCategory}-${scrollIndex}`}
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
                  className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.06)] hover:shadow-[0_16px_36px_rgba(53,30,26,0.12)] transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col justify-between"
                >
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
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug">
                        {dest.name}
                      </h3>

                      <p className="font-sans text-xs text-[#351E1A]/70 line-clamp-2 leading-relaxed">
                        {dest.tagline}
                      </p>
                    </div>

                    {/* Footer Info: Rating + Visiting Hours */}
                    <div className="pt-2 border-t border-[#E8D5C2]/70 space-y-2">
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
