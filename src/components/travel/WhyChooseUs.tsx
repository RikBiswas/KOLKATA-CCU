import React from 'react';
import { Compass, Map, ShieldCheck, Instagram, Twitter, Facebook, Landmark, HeartHandshake, MapPin } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading, Subtext, Social Links, and Stats */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug">
              Why Independent Travelers Trust{' '}
              <span className="text-[#1b3a4b] dark:text-emerald-400">
                WANDER.ccu
              </span>{' '}
              to Explore Kolkata
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We believe the best way to experience Kolkata is independently and authentically. 
              No high-priced tour packages or commercial middlemen—just genuine historical context, 
              local public transit guidance, and hidden gems documented by passionate Calcuttans.
            </p>
          </div>

          {/* Social Icons row */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors flex items-center justify-center text-sm shadow-xs"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors flex items-center justify-center text-sm shadow-xs"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors flex items-center justify-center text-sm shadow-xs"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          {/* Key Metrics / Stats row matching circular icons in mockup */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-left space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                60+
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight">
                Curated Heritage Sites &amp; Temples
              </div>
            </div>

            <div className="text-left space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                100%
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight">
                Free &amp; Completely Independent
              </div>
            </div>

            <div className="text-left space-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                12+
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight">
                Self-Guided Walking Routes
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Guidance Feature Cards matching mockup styling */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#f0f4f8] dark:bg-[#1a222f] border border-neutral-200/60 dark:border-neutral-800 transition-all hover:shadow-md flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#2b4c68] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Compass className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Authentic Bengal Heritage
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                In-depth architectural notes, colonial lore, and local cultural context 
                researched by native historians and university scholars.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#f0f4f8] dark:bg-[#1a222f] border border-neutral-200/60 dark:border-neutral-800 transition-all hover:shadow-md flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#2b4c68] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Map className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                DIY Walking &amp; Transit Routes
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Clear step-by-step itineraries utilizing Kolkata’s iconic public transport: 
                vintage electric trams, Blue Line metro, and ₹6 Hooghly river ferries.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#f0f4f8] dark:bg-[#1a222f] border border-neutral-200/60 dark:border-neutral-800 transition-all hover:shadow-md flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#2b4c68] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Practical Traveler Advisory
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Honest guidance on monument timings, dress etiquette, photography guidelines, 
                clean street food spots, and safe exploration tips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
