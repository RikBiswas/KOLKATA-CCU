import React from 'react';
import { Sparkles } from 'lucide-react';

interface IntroductoryBannerProps {
  onExploreDestinations?: () => void;
}

export const IntroductoryBanner: React.FC<IntroductoryBannerProps> = () => {
  return (
    <section className="my-5 sm:my-8 relative overflow-hidden">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#351E1A] text-[#FFF8EF] shadow-[0_12px_36px_rgba(53,30,26,0.18)] border-2 sm:border-4 border-[#FFF8EF]">
        {/* Full-width atmospheric background photograph */}
        <div className="relative min-h-[290px] sm:min-h-[380px] md:h-[440px] w-full overflow-hidden flex items-center justify-center">
          <img
            src="/images/destinations/princep-ghat.jpg"
            alt="Wooden country boat floating on the holy Hooghly beneath Vidyasagar Setu at dusk"
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Warm analog dusk vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/60 to-[#582822]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#351E1A]/80 via-transparent to-[#351E1A]/80" />

          {/* Centered Editorial Poetry Overlay */}
          <div className="relative flex flex-col items-center justify-center text-center px-3 sm:px-10 md:px-16 py-6 sm:py-0 z-10 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/25 text-[#D9A38E] text-[9px] sm:text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#C5A25A]" />
              <span>Prologue &bull; An Eternal City</span>
            </div>

            {/* Oversized Bengali Editorial Quote */}
            <div className="space-y-1 sm:space-y-2 max-w-4xl">
              <p className="font-bengali text-base sm:text-2xl md:text-4xl font-semibold text-[#FFF8EF] leading-relaxed drop-shadow-md">
                &ldquo;যদি তুমি ভালোবাসো, তবে এই শহর তোমায় কোনোদিন ভুলবে না&rdquo;
              </p>

              <h3 className="font-serif text-xs sm:text-lg md:text-2xl font-normal italic text-[#D9A38E] leading-snug drop-shadow-sm">
                &ldquo;If you give this city your heart, she will never let you feel alone.&rdquo;
              </h3>
            </div>

            <p className="max-w-xl text-[11px] sm:text-xs font-sans text-[#FFF8EF]/80 leading-relaxed font-light">
              As you prepare to explore the river ghats and follow the gentle clatter of vintage trams, open your heart to Kolkata. 
              Her quiet warmth will linger in your memory forever.
            </p>
          </div>

          {/* Bottom Archival Coordinates */}
          <div className="absolute bottom-3 left-6 right-6 hidden sm:flex items-center justify-between text-[10px] font-sans text-[#FFF8EF]/60 pointer-events-none">
            <span>Strand Road &bull; Hooghly Riverfront Promenade</span>
            <span>WANDER.CCU &bull; A City of Stories, A Lifetime of Memories</span>
          </div>
        </div>
      </div>
    </section>
  );
};
