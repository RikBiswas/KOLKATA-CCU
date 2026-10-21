import React from 'react';
import { Compass, Footprints, Sparkles, MapPin, Calendar, Clock, Car, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { CalcuttaTimeWatcher } from './CalcuttaTimeWatcher';

interface HeroBannerProps {
  onExploreTrails: () => void;
  onExploreDestinations: () => void;
  onOpenItineraryBuilder?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreTrails,
  onExploreDestinations,
  onOpenItineraryBuilder,
}) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FEF9E2] via-[#FEF9E2] to-[#F7EBDD] text-[#351E1A] scroll-mt-0"
    >
      {/* 1. Full-bleed Edge-to-Edge Illustrated Background with Soft Feathered Bottom */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.3) 93%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.3) 93%, transparent 100%)',
        }}
      >
        <img
          src="/images/kolkata-landmarks-taxi.png"
          alt="Kolkata iconic heritage skyline with Victoria Memorial, Vidyasagar Setu, Shaheed Minar, and classic yellow Ambassador taxi"
          className="w-full h-full object-cover object-left-bottom md:object-bottom lg:object-left-bottom transition-transform duration-1000 ease-out"
          fetchPriority="high"
          onError={(e) => {
            // Fallback in case needed
            const target = e.currentTarget;
            if (!target.src.includes('Kolkata%20Landmarks')) {
              target.src = '/images/trails/Kolkata%20Landmarks%20and%20Vintage%20Taxi.png';
            }
          }}
        />

        {/* Delicate warm atmospheric scrims for crisp legibility across all screen sizes */}
        {/* Mobile / Tablet vertical gradient: keeps text super legible at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FEF9E2]/92 via-[#FEF9E2]/75 to-transparent lg:hidden" />

        {/* Desktop horizontal scrim: softens right-side background so editorial text pops without obscuring the artwork */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-[#FEF9E2]/25 via-48% to-[#FEF9E2]/85" />
      </div>

      {/* Seamless bottom fade: smoothly transitions the road and monuments into the page background with zero harsh lines */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 sm:h-64 bg-gradient-to-t from-[#F7EBDD] via-[#F7EBDD]/90 via-45% to-transparent pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* 2. Main Content Grid (Fills full viewport height) */}
      <div className="relative z-10 w-full max-w-7xl xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 sm:pt-28 lg:pt-32 xl:pt-36 pb-4 sm:pb-6 flex-1 flex flex-col justify-between">

        {/* Creative Archival Dateline Ribbon — Vintage Calcutta Gazette & Ephemeris */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl md:rounded-full bg-[#FFF8EF]/80 backdrop-blur-md border border-[#E8D5C2]/90 shadow-[0_4px_24px_rgba(53,30,26,0.05)] hover:border-[#C5A25A]/60 transition-all duration-300">

            {/* Left: Archival Curatorial Plate Docket */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#351E1A] text-[#FFF8EF] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                  Plate N° 01
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif text-xs sm:text-sm font-bold tracking-wide text-[#351E1A] uppercase">
                  Landmarks of Old Calcutta
                </span>
                <span className="hidden xl:inline text-[11px] font-serif italic text-[#C6532B]">
                  &mdash; Architectural Vignettes &amp; Living Heritage
                </span>
                <span className="hidden sm:inline-block font-bengali text-[11px] text-[#582822]/70">
                  স্মৃতির স্থাপত্য
                </span>
              </div>
            </div>

            {/* Center: Delicate Antique Ornamental Rule (Laptop/Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-[#C5A25A]/60 px-2 shrink-0">
              <span className="h-px w-6 xl:w-10 bg-gradient-to-r from-transparent to-[#C5A25A]/50" />
              <span className="font-serif text-xs text-[#C5A25A] select-none">✦</span>
              <span className="h-px w-6 xl:w-10 bg-gradient-to-l from-transparent to-[#C5A25A]/50" />
            </div>

            {/* Right: Calcutta Ephemeris & Live Observatory (Time, Golden Hour, Breeze) */}
            <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t border-[#E8D5C2]/50 md:border-t-0 shrink-0">
              <CalcuttaTimeWatcher variant="embedded" />
            </div>
          </div>
        </motion.div>

        {/* Middle Two-Column Grid: Left showcases illustration, Right houses editorial copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto">

          {/* Left Column (Desktop): Open artistic showcase with interactive archival badges */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-end h-full pb-8 xl:pb-12 space-y-4">

            {/* Interactive Badge 1: Heritage Skyline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/85 backdrop-blur-sm border border-[#E8D5C2] shadow-sm text-[#351E1A] text-xs font-sans group hover:bg-[#FFF8EF] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C6532B]" />
              <span className="font-medium">Victoria Memorial &bull; Vidyasagar Setu</span>
            </motion.div>

            {/* Interactive Badge 2: Yellow Ambassador Taxi */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-[#351E1A]/90 backdrop-blur-md border border-[#C5A25A]/50 text-[#FFF8EF] shadow-md hover:scale-104 transition-transform group"
            >
              <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center text-[#351E1A]">
                <Car className="w-3 h-3" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-sans font-bold text-[#FFB800] uppercase tracking-wider">
                  Vintage Yellow Taxi
                </span>
                <span className="block text-[10px] text-[#FFF8EF]/80 font-sans">
                  The quintessential pulse of Calcutta roads
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Signature Editorial Headlines, Calligraphy & Action CTAs */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center text-left lg:pl-6 xl:pl-10">

            {/* Bengali Accent Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap items-center gap-2.5 mb-3 sm:mb-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6532B]/10 border border-[#C6532B]/30">
                <Sparkles className="w-3 h-3 text-[#C6532B]" />
                <span className="font-bengali text-xs sm:text-sm font-semibold text-[#C6532B]">
                  কলকাতা — স্মৃতির শহর
                </span>
              </div>

              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF8EF]/80 border border-[#E8D5C2]">
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#582822] uppercase">
                  A Love Letter to Calcutta
                </span>
              </div>
            </motion.div>

            {/* Signature Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[62px] font-medium tracking-tight text-[#351E1A] leading-[1.08]">
                Some cities are visited.{' '}
                <span className="italic block mt-1 text-[#C6532B]">
                  Kolkata is felt.
                </span>
              </h1>

              {/* Overlapping Handwritten Cursive Accent */}
              <div className="mt-1.5 sm:mt-2">
                <span className="font-script text-xl sm:text-2xl md:text-3xl text-[#582822] select-none">
                  ~ where time pauses for a cup of tea ~
                </span>
              </div>
            </motion.div>

            {/* Editorial Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-xs sm:text-sm md:text-base text-[#351E1A]/85 leading-relaxed font-normal mb-4 sm:mb-6 max-w-xl"
            >
              From forgotten colonial lanes and morning wooden trams to riverfront ghat sunsets and legendary earthen-cup tea stalls, discover the city beyond the ordinary. Curated with love by native Calcuttans.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <button
                onClick={onExploreDestinations}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-white text-xs sm:text-sm font-sans font-bold tracking-wide shadow-[0_8px_20px_rgba(198,83,43,0.25)] hover:shadow-[0_12px_28px_rgba(198,83,43,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#FFF8EF]" />
                <span>Explore Kolkata</span>
              </button>

              <button
                onClick={onExploreTrails}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FFF8EF] hover:bg-[#FFFDF9] border border-[#E8D5C2] text-[#351E1A] hover:text-[#582822] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Footprints className="w-4 h-4 text-[#C6532B]" />
                <span>Wander the old lanes</span>
              </button>

              {onOpenItineraryBuilder && (
                <button
                  onClick={onOpenItineraryBuilder}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#FFF8EF]/80 hover:bg-[#FFF8EF] border border-[#C5A25A] text-[#582822] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C5A25A]" />
                  <span>Plan My Day</span>
                </button>
              )}
            </motion.div>

            {/* Quick Archival Tags Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 text-[11px] font-sans text-[#351E1A]/75"
            >
              <span className="font-semibold text-[#582822]">Highlights:</span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFF8EF]/70 border border-[#E8D5C2]/80">
                🚋 1873 Vintage Trams
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFF8EF]/70 border border-[#E8D5C2]/80">
                ☕ Matir Bhar Cha
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFF8EF]/70 border border-[#E8D5C2]/80">
                🌸 Mallick Ghat Dawn
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFF8EF]/70 border border-[#E8D5C2]/80">
                🏛️ Colonial Quarters
              </span>
            </motion.div>
          </div>
        </div>

        {/* 3. Bottom Archival Metadata & Quote Strip (Floating capsules with zero harsh lines) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-sans text-[#351E1A]/75 pr-0 sm:pr-32 md:pr-36 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/80 backdrop-blur-xs border border-[#E8D5C2]/70 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B]" />
            <span className="italic font-serif text-xs sm:text-sm text-[#351E1A]/85">
              &ldquo;A city that refuses to forget its past, where every doorway is a threshold to a story.&rdquo;
            </span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FFF8EF]/70 backdrop-blur-xs border border-[#E8D5C2]/60 font-mono text-[10px] text-[#351E1A]/70 shadow-xs">
            <span>CCU / 22.5726° N, 88.3639° E</span>
            <span className="hidden sm:inline text-[#C6532B]">&bull;</span>
            <span className="hidden sm:inline">Est. 1690</span>
            <span className="hidden md:inline text-[#C6532B]">&bull;</span>
            <span className="hidden md:inline">Gateway to Bengal</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

