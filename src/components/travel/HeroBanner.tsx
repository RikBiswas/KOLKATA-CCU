import React from 'react';
import { Compass, Map, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExploreTrails: () => void;
  onExploreDestinations: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreTrails,
  onExploreDestinations,
}) => {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden my-4 sm:my-6 shadow-xl transition-all">
      {/* Background Image Container with Gradient Overlay */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full">
        <img
          src="https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1920&q=85"
          alt="Victoria Memorial Kolkata Panorama"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* Badge in top left corner */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white/90 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>The City of Joy &middot; Cultural Capital &middot; Est. 1690</span>
        </div>

        {/* Content Centered in the Hero with Massive Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 z-10">
          {/* Giant Title matching 'WANDER' with subscript CCU */}
          <div className="relative mb-3 sm:mb-4 select-none">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-widest uppercase drop-shadow-md">
              WANDER
            </h1>
            <span className="absolute -bottom-2 sm:-bottom-3 right-0 sm:right-2 text-xs sm:text-sm md:text-base font-extrabold uppercase text-emerald-400 tracking-wider bg-black/50 px-2.5 py-0.5 rounded-md backdrop-blur-sm border border-emerald-500/30">
              CCU
            </span>
          </div>

          {/* Guidance Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/90 font-medium leading-relaxed drop-shadow mb-8 sm:mb-10">
            Discover Kolkata at your own pace with curated self-guided walking trails, 
            heritage architecture notes, local transit tips, and authentic street gastronomy.
          </p>

          {/* CTA Buttons in Oval Pills matching mockup */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onExploreDestinations}
              className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-bold text-neutral-900 bg-white hover:bg-neutral-100 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-neutral-900" />
              <span>Explore Destinations</span>
            </button>

            <button
              onClick={onExploreTrails}
              className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 rounded-full transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
            >
              <Map className="w-4 h-4 text-emerald-300" />
              <span>Walking &amp; Transit Trails</span>
            </button>
          </div>
        </div>

        {/* Bottom subtle edge */}
        <div className="absolute bottom-4 left-6 right-6 hidden md:flex items-center justify-between text-xs text-white/70">
          <span>Non-Commercial &middot; Community Sourced &middot; Curated by Native Calcuttans</span>
          <span>Best Exploration Window: October &ndash; March</span>
        </div>
      </div>
    </section>
  );
};
