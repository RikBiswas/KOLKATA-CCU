import React from 'react';
import { Compass, Map, ShieldCheck, Landmark, HeartHandshake, MapPin, Feather, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="my-6 sm:my-8 bg-[#FFF8EF] rounded-2xl sm:rounded-3xl border border-[#E8D5C2] p-3.5 sm:p-7 lg:p-10 shadow-[0_6px_24px_rgba(53,30,26,0.04)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Left Column: Editorial Manifesto & Trust Stats */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[1px] bg-[#C6532B]" />
              <span className="font-script text-lg sm:text-xl text-[#C6532B]">the art of slow travel</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-[1.15]">
              Why we wander slowly through <span className="italic text-[#582822]">Calcutta</span>
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#351E1A]/80 leading-relaxed pt-1">
              Kolkata is not a city meant to be rushed through in an air-conditioned blur. 
              She reveals her deepest soul in the pauses—the clink of porcelain tea cups at a 
              neighborhood <em>cha-er dokan</em>, the gentle clanging bell of a vintage green tram 
              crossing the Maidan, the fragrance of printing ink along College Street, and the timeless 
              spirit of Bengali <em>Adda</em>.
            </p>

            <p className="font-sans text-[11px] sm:text-xs text-[#351E1A]/70 leading-relaxed italic border-l-2 border-[#C6532B] pl-3 py-0.5">
              &ldquo;No commercial middlemen, no sponsored stops. Just pure architectural reverence, 
              intimate walking routes, and the lived memories of native Calcuttans.&rdquo;
            </p>
          </div>

          {/* Key Metrics / Journal Colophon Stats */}
          <div className="pt-3 sm:pt-5 grid grid-cols-3 gap-2 sm:gap-3.5 border-t border-[#E8D5C2]">
            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#F7EBDD]/60 border border-[#E8D5C2]/80 space-y-1 text-center sm:text-left">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#582822] text-[#FFF8EF] flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A]">
                60+
              </div>
              <div className="text-[9px] sm:text-[10px] font-sans font-medium text-[#351E1A]/70 leading-tight">
                Heritage Sites &amp; Mansions
              </div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#F7EBDD]/60 border border-[#E8D5C2]/80 space-y-1 text-center sm:text-left">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C6532B] text-white flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <HeartHandshake className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A]">
                100%
              </div>
              <div className="text-[9px] sm:text-[10px] font-sans font-medium text-[#351E1A]/70 leading-tight">
                Independent &amp; Pure
              </div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#F7EBDD]/60 border border-[#E8D5C2]/80 space-y-1 text-center sm:text-left">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C5A25A] text-[#351E1A] flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#351E1A]" />
              </div>
              <div className="font-serif text-lg sm:text-2xl font-bold text-[#351E1A]">
                12+
              </div>
              <div className="text-[9px] sm:text-[10px] font-sans font-medium text-[#351E1A]/70 leading-tight">
                Self-Guided Walking Trails
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Editorial Feature Cards */}
        <div className="lg:col-span-6 space-y-2.5 sm:space-y-3.5">
          {/* Feature Card 1 */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] transition-all duration-300 hover:shadow-md hover:border-[#C6532B]/40 flex items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#582822] text-[#FFF8EF] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#D9A38E]" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#C6532B]">
                Archival Research
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#351E1A] group-hover:text-[#582822] transition-colors leading-snug">
                Authentic Bengal Heritage
              </h3>
              <p className="font-sans text-xs text-[#351E1A]/75 leading-relaxed">
                In-depth architectural notes, colonial lore, and local cultural context researched by 
                native historians and literature scholars.
              </p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] transition-all duration-300 hover:shadow-md hover:border-[#C6532B]/40 flex items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#C6532B] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Map className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFF8EF]" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#582822]">
                Vintage Transit
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#351E1A] group-hover:text-[#582822] transition-colors leading-snug">
                DIY Walking &amp; River Trails
              </h3>
              <p className="font-sans text-xs text-[#351E1A]/75 leading-relaxed">
                Step-by-step itineraries utilizing Kolkata’s beloved public transport: vintage electric 
                trams, the underground Metro, and ₹6 river ferries.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] transition-all duration-300 hover:shadow-md hover:border-[#C6532B]/40 flex items-start gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#351E1A] text-[#FFF8EF] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A25A]" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#C6532B]">
                Local Wisdom
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#351E1A] group-hover:text-[#582822] transition-colors leading-snug">
                Practical Traveler Advisory
              </h3>
              <p className="font-sans text-xs text-[#351E1A]/75 leading-relaxed">
                Unvarnished advice on monument hours, photography etiquette in potter quarters, morning flower 
                market navigation, and hygiene-vetted street gastronomy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
