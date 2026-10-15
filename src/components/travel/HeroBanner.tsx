import React from 'react';
import { Compass, Footprints, ArrowDownRight, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroBannerProps {
  onExploreTrails: () => void;
  onExploreDestinations: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreTrails,
  onExploreDestinations,
}) => {
  return (
    <section className="relative w-full pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-20 overflow-hidden bg-[#F7EBDD] text-[#351E1A]">
      {/* Decorative Tram Wire & Bird Flight SVG in delicate low-contrast line art */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Tram overhead electrical wire curves */}
          <path d="M-100,120 Q400,220 900,140 T1600,160" stroke="#D9A38E" strokeWidth="1" strokeDasharray="3 5" />
          <path d="M-100,160 Q450,260 950,170 T1600,200" stroke="#C5A25A" strokeWidth="0.8" opacity="0.6" />
          {/* Tram pole insulator node */}
          <circle cx="480" cy="225" r="3" fill="#C6532B" />
          <circle cx="1020" cy="175" r="3" fill="#C6532B" />

          {/* Birds in flight above Hooghly */}
          <path d="M320,110 Q325,103 330,110 Q335,103 340,110" stroke="#582822" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M345,95 Q350,89 355,95 Q360,89 365,95" stroke="#582822" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M375,105 Q380,100 385,105 Q390,100 395,105" stroke="#582822" strokeWidth="1" strokeLinecap="round" fill="none" />
          
          {/* Archival Postmark Watermark */}
          <g transform="translate(1180, 80) rotate(-12)" stroke="#C5A25A" strokeWidth="1" opacity="0.35">
            <circle cx="60" cy="60" r="50" fill="none" />
            <circle cx="60" cy="60" r="44" fill="none" strokeDasharray="2 2" />
            <text x="60" y="52" textAnchor="middle" fontSize="10" fontFamily="DM Sans" letterSpacing="2" fill="#351E1A">CALCUTTA G.P.O.</text>
            <text x="60" y="70" textAnchor="middle" fontSize="9" fontFamily="DM Sans" fill="#351E1A">1873 &bull; BENGAL</text>
          </g>
        </svg>
      </div>

      {/* Floating Circular Photographs (Asymmetric Vignettes) */}
      
      {/* Vignette 1: Vintage Green Tram (Top Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="hidden md:flex flex-col items-center absolute left-4 lg:left-12 top-32 lg:top-36 z-20 animate-float-slow pointer-events-auto group"
      >
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full p-1 bg-[#FFF8EF] shadow-[0_8px_24px_rgba(53,30,26,0.14)] border border-[#E8D5C2] transition-transform duration-500 group-hover:scale-108">
          <img
            src="/images/stories/heritage-tram.jpg"
            alt="Heritage electric tram in Kolkata"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1.5 -right-1 px-2 py-0.5 rounded-full bg-[#351E1A] text-[#FFF8EF] text-[9px] font-sans font-semibold tracking-wider">
            Tram 24
          </div>
        </div>
        <span className="font-script text-xs text-[#582822] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          rolling through Maidan
        </span>
      </motion.div>

      {/* Vignette 2: Dawn Flower Bazaar at Mallick Ghat (Top Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="hidden md:flex flex-col items-center absolute right-4 lg:right-14 top-28 lg:top-32 z-20 animate-float-reverse pointer-events-auto group"
      >
        <div className="relative w-20 h-20 lg:w-26 lg:h-26 rounded-full p-1 bg-[#FFF8EF] shadow-[0_8px_24px_rgba(53,30,26,0.14)] border border-[#E8D5C2] transition-transform duration-500 group-hover:scale-108">
          <img
            src="/images/trails/mallick-ghat-flowers.jpg"
            alt="Mallick Ghat flower market marigolds"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1.5 -left-1 px-2 py-0.5 rounded-full bg-[#C6532B] text-white text-[9px] font-sans font-semibold tracking-wider">
            Mallick Ghat
          </div>
        </div>
        <span className="font-script text-xs text-[#C6532B] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          dawn marigolds
        </span>
      </motion.div>

      {/* Vignette 3: Sacred Clay Sculpting (Kumartuli) (Mid Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="hidden xl:flex flex-col items-center absolute left-8 bottom-32 z-20 animate-float-reverse pointer-events-auto group"
      >
        <div className="relative w-18 h-18 lg:w-22 lg:h-22 rounded-full p-1 bg-[#FFF8EF] shadow-[0_8px_20px_rgba(53,30,26,0.12)] border border-[#E8D5C2] transition-transform duration-500 group-hover:scale-108">
          <img
            src="/images/stories/kumartuli-sculptors.jpg"
            alt="Kumartuli artisan clay studios"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#582822] text-[#FFF8EF] text-[8px] font-sans font-semibold">
            Kumartuli
          </div>
        </div>
        <span className="font-script text-xs text-[#582822] mt-1 opacity-80">
          clay &amp; river mud
        </span>
      </motion.div>

      {/* Vignette 4: College Street Coffee House Adda (Mid Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="hidden xl:flex flex-col items-center absolute right-8 bottom-28 z-20 animate-float-slow pointer-events-auto group"
      >
        <div className="relative w-18 h-18 lg:w-22 lg:h-22 rounded-full p-1 bg-[#FFF8EF] shadow-[0_8px_20px_rgba(53,30,26,0.12)] border border-[#E8D5C2] transition-transform duration-500 group-hover:scale-108">
          <img
            src="/images/stories/coffee-house.jpg"
            alt="College Street Indian Coffee House"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-[#351E1A] text-[#FFF8EF] text-[8px] font-sans font-semibold">
            Coffee House
          </div>
        </div>
        <span className="font-script text-xs text-[#C6532B] mt-1 opacity-80">
          afternoon adda
        </span>
      </motion.div>

      {/* Main Center Editorial Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
        
        {/* Eyebrow & Bengali Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C6532B]" />
            <span className="text-[11px] font-sans font-bold tracking-widest text-[#582822] uppercase">
              A Love Letter to Calcutta
            </span>
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#C6532B]/10 border border-[#C6532B]/30">
            <span className="font-bengali text-xs sm:text-sm font-semibold text-[#C6532B]">
              কলকাতা — স্মৃতির শহর
            </span>
          </div>
        </motion.div>

        {/* Signature Oversized Editorial Serif Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mb-6 sm:mb-8"
        >
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-medium tracking-tight text-[#351E1A] leading-[1.08] sm:leading-[1.05]">
            Some cities are visited.{' '}
            <span className="italic block mt-1 sm:mt-2 text-[#582822]">
              Kolkata is felt.
            </span>
          </h1>

          {/* Overlapping Handwritten Cursive Accent */}
          <div className="relative mt-2 sm:mt-3 flex justify-center">
            <span className="font-script text-2xl sm:text-3xl md:text-4xl text-[#C6532B] -rotate-2 select-none">
              ~ where time pauses for a cup of tea ~
            </span>
          </div>
        </motion.div>

        {/* Evocative Editorial Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto font-sans text-sm sm:text-base md:text-lg text-[#351E1A]/85 leading-relaxed font-normal mb-8 sm:mb-10"
        >
          From forgotten lanes and morning trams to riverside sunsets and legendary food stalls,
          discover the city beyond the ordinary. An independent travel journal curated by native lovers of old Calcutta.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <button
            onClick={onExploreDestinations}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-white text-xs sm:text-sm font-sans font-bold tracking-wide shadow-[0_8px_20px_rgba(198,83,43,0.25)] hover:shadow-[0_12px_28px_rgba(198,83,43,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#FFF8EF]" />
            <span>Explore Kolkata</span>
          </button>

          <button
            onClick={onExploreTrails}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FFF8EF] hover:bg-[#FFFDF9] border border-[#E8D5C2] text-[#351E1A] hover:text-[#582822] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Footprints className="w-4 h-4 text-[#C6532B]" />
            <span>Wander the old lanes</span>
          </button>
        </motion.div>
      </div>

      {/* Signature Asymmetric Arched Hero Image emerging from bottom edge */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10"
      >
        <div className="relative rounded-t-[80px] sm:rounded-t-[140px] md:rounded-t-[180px] lg:rounded-t-[220px] overflow-hidden border-t-8 border-x-8 border-[#FFF8EF] shadow-[0_20px_60px_-15px_rgba(53,30,26,0.18)] bg-[#351E1A]">
          {/* Main Visual: Victoria Memorial reflection at dusk */}
          <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full overflow-hidden group">
            <img
              src="/images/destinations/victoria-memorial.jpg"
              alt="Victoria Memorial Hall reflection in water at twilight Kolkata"
              className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
            />
            {/* Warm nostalgic analog film tone overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/85 via-transparent to-[#F7EBDD]/15 pointer-events-none" />

            {/* Archival Plate Annotation along the curved bottom edge */}
            <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 text-[#FFF8EF] pointer-events-none">
              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#D9A38E] block">
                  Archival Plate No. 01 &bull; Queens Way
                </span>
                <span className="font-serif text-lg sm:text-2xl font-normal italic drop-shadow-sm">
                  Victoria Memorial Hall at dusk &bull; Makrana Marble &amp; Maidan breeze
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-sans text-[#FFF8EF]/80 bg-[#351E1A]/70 px-3 py-1.5 rounded-full backdrop-blur-xs border border-[#FFF8EF]/20">
                <MapPin className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>Central Maidan &bull; 5:15 PM Golden Hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small editorial caption below arch */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-sans text-[#351E1A]/60 px-4">
          <span className="italic">
            &ldquo;A city that refuses to forget its past, where every doorway is a threshold to a story.&rdquo;
          </span>
          <span className="hidden sm:inline font-mono text-[10px]">CCU / 22.5726° N, 88.3639° E</span>
        </div>
      </motion.div>
    </section>
  );
};
