import React, { useState } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Eye, Clock, Compass } from 'lucide-react';
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
  const [scrollIndex, setScrollIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, destinations.length - itemsPerPage);

  const handlePrev = () => {
    setSlideDirection('left');
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setScrollIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleDestinations = destinations.slice(scrollIndex, scrollIndex + itemsPerPage);

  return (
    <section id="destinations" className="py-10 sm:py-14 bg-[#f4f6f8] dark:bg-[#131924] rounded-3xl p-6 sm:p-10 my-8 transition-colors">
      {/* Header matching mockup */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Top Kolkata Destinations &amp; Landmarks
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-lg">
            Essential sights, timings, how to reach via public transit, and insider visitor tips for your journey.
          </p>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Previous destination"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={scrollIndex >= maxIndex}
            className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Next destination"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 4 Destination Cards with smooth slide transition */}
      <div className="overflow-hidden">
        <div
          key={scrollIndex}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 transition-all duration-500 ease-out ${
            slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          {visibleDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 bg-neutral-900"
            >
              {/* Background Image */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Region / Category Pill Tag on Top Right matching UI layout */}
              <div className="absolute top-3.5 right-3.5 bg-white/80 dark:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-900 dark:text-white shadow-xs border border-white/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>{dest.region}</span>
              </div>

              {/* Category badge top left */}
              <div className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-emerald-300 border border-white/10">
                {dest.category}
              </div>

              {/* Bottom Content Container */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2 text-white">
                <h3 className="text-lg font-extrabold tracking-tight group-hover:text-emerald-300 transition-colors leading-snug">
                  {dest.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="truncate">{dest.tagline}</span>
                </div>

                {/* Rating + Timing Info */}
                <div className="pt-1 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{dest.rating}</span>
                    <span className="text-white/60 text-[10px]">({dest.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-white/75 truncate max-w-[120px]">
                    <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{dest.bestTimeToVisit.split('(')[0]}</span>
                  </div>
                </div>

                {/* Guide trigger button */}
                <div className="pt-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <div className="w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 border border-white/20">
                    <Eye className="w-3 h-3" />
                    <span>View Visitor Guide &amp; Tips</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: "View More" Button & pagination indicator */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onViewAll}
          className="px-5 py-2 text-xs font-semibold text-white bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] dark:hover:bg-emerald-500 rounded-full transition-colors shadow-xs"
        >
          View all destinations ({destinations.length})
        </button>

        <span className="text-xs text-neutral-500">
          Showing {scrollIndex + 1}–{Math.min(scrollIndex + itemsPerPage, destinations.length)} of {destinations.length}
        </span>
      </div>
    </section>
  );
};
