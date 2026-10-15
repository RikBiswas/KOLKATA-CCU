import React from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';

interface ClosingMonologueSectionProps {
  onExploreDestinations: () => void;
}

export const ClosingMonologueSection: React.FC<ClosingMonologueSectionProps> = ({
  onExploreDestinations,
}) => {
  return (
    <section className="py-16 sm:py-24 my-8 relative overflow-hidden">
      <div className="relative rounded-3xl overflow-hidden bg-[#351E1A] text-[#FFF8EF] shadow-[0_20px_50px_rgba(53,30,26,0.2)] border-4 border-[#FFF8EF]">
        {/* Full-width atmospheric background photograph */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[580px] w-full overflow-hidden">
          <img
            src="/images/destinations/princep-ghat.jpg"
            alt="Wooden country boat floating on the holy Hooghly at sunset"
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Warm analog dusk vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/60 to-[#582822]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#351E1A]/80 via-transparent to-[#351E1A]/80" />

          {/* Centered Editorial Poetry Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 md:px-20 z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/25 text-[#D9A38E] text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-[#C5A25A]" />
              <span>Epilogue &bull; An Eternal City</span>
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
              Long after you leave the river ghats and the clatter of the trams, the gentle warmth of Kolkata 
              lingers in your memory—like the scent of roasted spices and the calm of the river breeze at dusk.
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreDestinations}
                className="px-8 py-3.5 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-white text-xs sm:text-sm font-sans font-bold tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#FFF8EF]" />
                <span>Begin Your Journey Through Kolkata</span>
              </button>
            </div>
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
