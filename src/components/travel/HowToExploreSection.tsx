import React from 'react';
import { Compass, Map, Heart, Footprints } from 'lucide-react';

interface HowToExploreSectionProps {
  onExploreTrails: () => void;
}

export const HowToExploreSection: React.FC<HowToExploreSectionProps> = ({ onExploreTrails }) => {
  return (
    <section id="how-to-explore" className="py-12 sm:py-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Exploring Kolkata as easy as 1-2-3.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          How to navigate and experience the City of Joy independently, safely, and authentically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Step 1 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center font-bold text-lg">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Step 01
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Pick Your Interest
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Choose colonial architectural monuments, sacred Hooghly river ghats, Kumartuli artisan quarters, or bustling street food corridors.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center font-bold text-lg">
            <Map className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Step 02
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Follow Curated Trails
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Use our DIY walking itineraries with practical transit connections: Blue Line Metro, vintage electric trams, and ₹6 river ferries.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center font-bold text-lg">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Step 03
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Experience Like a Local
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Catch the golden hour light, sit for an afternoon &ldquo;Adda&rdquo; at historic tea rooms, and taste authentic sweets with confidence.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onExploreTrails}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] dark:hover:bg-emerald-500 rounded-full transition-all shadow-md active:scale-95"
        >
          <Footprints className="w-4 h-4 text-emerald-300" />
          <span>Browse Self-Guided Walking Routes</span>
        </button>
      </div>
    </section>
  );
};
