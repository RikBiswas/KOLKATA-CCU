import React from 'react';
import { Compass, Map, Heart, Footprints, Train, Navigation, Info } from 'lucide-react';

interface HowToExploreSectionProps {
  onExploreTrails: () => void;
}

export const HowToExploreSection: React.FC<HowToExploreSectionProps> = ({ onExploreTrails }) => {
  return (
    <section id="how-to-explore" className="py-8 sm:py-12 lg:py-14 border-t border-[#E8D5C2]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[10px] font-mono font-bold uppercase tracking-widest text-[#C6532B]">
          <span>Chapter IX &bull; The Slow Explorer&apos;s Guide</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#351E1A] tracking-tight">
          How to Navigate Kolkata in Three Steps
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
          Practical transit wisdom, etiquette notes, and timing secrets to wander the City of Joy independently and safely.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 items-stretch">
        {/* Step 1 */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.05)] hover:shadow-md transition-all text-center space-y-2.5 sm:space-y-3 group flex flex-col justify-start h-full">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#582822] text-[#FFF8EF] mx-auto flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#D9A38E]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#C6532B] uppercase tracking-widest block">
            Step 01
          </span>
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A] min-h-[28px] sm:min-h-[40px] flex items-center justify-center">
            Select Your Corridor
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Pick between 18th-century North Calcutta mansions, neoclassical British Raj administrative palaces, sacred river ghats, or College Street book stalls.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.05)] hover:shadow-md transition-all text-center space-y-2.5 sm:space-y-3 group flex flex-col justify-start h-full">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#C6532B] text-white mx-auto flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
            <Train className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8EF]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#582822] uppercase tracking-widest block">
            Step 02
          </span>
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A] min-h-[28px] sm:min-h-[40px] flex items-center justify-center">
            Board Nostalgic Transit
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Ride Asia&apos;s oldest operating electric tram (Route 24), catch ₹6 public passenger ferries across the river, or take the modern Blue Line &amp; underwater Green Line metro.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.05)] hover:shadow-md transition-all text-center space-y-2.5 sm:space-y-3 group flex flex-col justify-start h-full">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#351E1A] text-[#FFF8EF] mx-auto flex items-center justify-center font-bold text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A25A]" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#C6532B] uppercase tracking-widest block">
            Step 03
          </span>
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A] min-h-[28px] sm:min-h-[40px] flex items-center justify-center">
            Immerse in Slow Adda
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Pause at roadside tea stalls for earthen cup chai (bhar-er cha), respect artisan studios in Kumartuli, and soak in twilight reflections along Princep Ghat.
          </p>
        </div>
      </div>

      {/* Practical Transit Reference Box: 2-column on mobile */}
      <div className="mt-6 sm:mt-10 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#F7EBDD] border border-[#E8D5C2] grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs font-sans">
        <div className="space-y-0.5 sm:space-y-1">
          <span className="font-bold text-[#582822] block font-serif text-xs sm:text-sm">Electric Tramway</span>
          <p className="text-[#351E1A]/70 text-[11px] sm:text-xs">Route 24/25 from Esplanade through the green Maidan. ₹6–₹10 tickets.</p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="font-bold text-[#582822] block font-serif text-xs sm:text-sm">Hooghly Ferries</span>
          <p className="text-[#351E1A]/70 text-[11px] sm:text-xs">Departs every 15 mins between Howrah, Fairlie Ghat &amp; Babu Ghat. ₹6 ticket.</p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="font-bold text-[#582822] block font-serif text-xs sm:text-sm">Metro Railways</span>
          <p className="text-[#351E1A]/70 text-[11px] sm:text-xs">Blue Line &amp; Green Line underwater tunnel. 6:45 AM – 10 PM.</p>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <span className="font-bold text-[#582822] block font-serif text-xs sm:text-sm">Yellow Cabs</span>
          <p className="text-[#351E1A]/70 text-[11px] sm:text-xs">Classic Ambassador taxis with roof racks. Hail anywhere or ask for meter fare.</p>
        </div>
      </div>

      {/* Center CTA */}
      <div className="mt-8 sm:mt-10 text-center">
        <button
          onClick={onExploreTrails}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-sans font-bold text-white bg-[#C6532B] hover:bg-[#B04520] rounded-full transition-all duration-200 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Footprints className="w-4 h-4 text-[#FFF8EF]" />
          <span>Browse Self-Guided Walking Routes</span>
        </button>
      </div>
    </section>
  );
};
