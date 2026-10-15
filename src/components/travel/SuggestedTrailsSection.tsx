import React, { useState } from 'react';
import { ArrowRight, Clock, Star, Map, Compass, Footprints, Train, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const itemsVisible = 2;
  const maxIndex = Math.max(0, trails.length - itemsVisible);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleTrails = trails.slice(startIndex, startIndex + itemsVisible);

  return (
    <section id="trails" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Grey Box with Title & Description & 'Browse all trails' button matching mockup */}
        <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl bg-[#98a8b8] dark:bg-[#1a2533] text-white flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-white">
              <Compass className="w-3 h-3 text-amber-300" />
              <span>Self-Guided Routes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Curated Walking &amp; Transit Trails
            </h2>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Step-by-step DIY itineraries to explore Kolkata independently. 
              Designed around vintage tramways, heritage river ferries, and walkable architectural corridors.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Footprints className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Pedestrian-friendly paths &amp; scenic shortcuts</span>
              </li>
              <li className="flex items-center gap-2">
                <Train className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Public transit tips (Metro, Trams &amp; ₹6 Ferries)</span>
              </li>
              <li className="flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Historical lore, food stops &amp; photography points</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-4">
            {/* Trail counter & Carousel navigation buttons */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsVisible, trails.length)} of {trails.length} curated trails
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs backdrop-blur-xs"
                  aria-label="Previous trails"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex >= maxIndex}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs backdrop-blur-xs"
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
              className="w-full px-6 py-3 rounded-full bg-[#1b2b38] dark:bg-emerald-600 hover:bg-[#111c25] dark:hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore all {trails.length} curated trails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Columns: Suggested Trail Cards matching UI mockup */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {visibleTrails.map((trail) => (
            <div
              key={trail.id}
              onClick={() => onSelectTrail(trail)}
              className="group relative h-[420px] sm:h-[460px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-neutral-900 flex flex-col justify-end"
            >
              <img
                src={trail.imageUrl}
                alt={trail.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

              {/* Tag top left */}
              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {trail.tag}
              </div>

              {/* Difficulty top right */}
              <div className="absolute top-4 right-4 bg-white/90 text-neutral-900 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                {trail.difficulty}
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 p-6 space-y-3 text-white">
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trail.duration}</span>
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{trail.rating}</span>
                    <span className="text-white/60">({trail.reviewsCount})</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors leading-snug">
                  {trail.title}
                </h3>

                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {trail.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>View Step-by-Step Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
