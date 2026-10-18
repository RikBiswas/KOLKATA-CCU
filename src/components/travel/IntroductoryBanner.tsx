import React from 'react';
import { Sparkles } from 'lucide-react';

interface IntroductoryBannerProps {
  onExploreDestinations?: () => void;
}

export const IntroductoryBanner: React.FC<IntroductoryBannerProps> = () => {
  return (
    <section className="my-8 sm:my-10 relative overflow-hidden">
      <div className="relative rounded-3xl overflow-hidden bg-[#351E1A] text-[#FFF8EF] shadow-[0_20px_50px_rgba(53,30,26,0.2)] border-4 border-[#FFF8EF]">
        {/* Full-width atmospheric background photograph */}
        <div className="relative h-[380px] sm:h-[420px] md:h-[460px] w-full overflow-hidden">
          <img
            src="/images/destinations/princep-ghat.jpg"
            alt="Wooden country boat floating on the holy Hooghly beneath Vidyasagar Setu at dusk"
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Warm analog dusk vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/60 to-[#582822]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#351E1A]/80 via-transparent to-[#351E1A]/80" />

          {/* Centered Editorial Poetry Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/25 text-[#D9A38E] text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#C5A25A]" />
              <span>Prologue &bull; An Eternal City</span>
            </div>

            {/* Oversized Bengali Editorial Quote */}
            <div className="space-y-3 max-w-4xl">
              <p className="font-bengali text-2xl sm:text-4xl md:text-5xl font-semibold text-[#FFF8EF] leading-relaxed drop-shadow-md">
                &ldquo;যদি তুমি ভালোবাসো, তবে এই শহর তোমায় কোনোদিন ভুলবে না&rdquo;
              </p>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal italic text-[#D9A38E] leading-snug drop-shadow-sm">
                &ldquo;If you give this city your heart, she will never let you feel alone.&rdquo;
              </h3>
            </div>

            <p className="max-w-xl text-xs sm:text-sm font-sans text-[#FFF8EF]/80 leading-relaxed font-light">
              As you prepare to explore the river ghats and follow the gentle clatter of vintage trams, open your heart to Kolkata. 
              Her quiet warmth will linger in your memory forever—like the scent of roasted spices and the calm of the river breeze at dusk.
            </p>
          </div>

          {/* Bottom Archival Coordinates */}
          <div className="absolute bottom-4 left-6 right-6 hidden sm:flex items-center justify-between text-[11px] font-sans text-[#FFF8EF]/60 pointer-events-none">
            <span>Strand Road &bull; Hooghly Riverfront Promenade</span>
            <span>WANDER.CCU &bull; A City of Stories, A Lifetime of Memories</span>
          </div>
        </div>
      </div>
    </section>
  );
};
