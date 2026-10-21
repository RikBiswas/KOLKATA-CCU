import React from 'react';
import { MapPin, SlidersHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';
import { travelData } from '../../config/travel.config';

interface BookingStepsSectionProps {
  onStartBooking: () => void;
}

export const BookingStepsSection: React.FC<BookingStepsSectionProps> = ({ onStartBooking }) => {
  return (
    <section className="py-12 sm:py-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Booking made as easy as 1-2-3.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          Plan, personalize, and lock in your Kolkata heritage or culinary adventure in under 2 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
        {/* Step 1 */}
        <div className="relative p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center font-bold text-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Step 01
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Pick Your Destination
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Choose from colonial monuments, sacred Hooghly river ghats, Kumartuli clay quarters, or legendary street food hubs.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center font-bold text-lg">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Step 02
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Customize Your Tour
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Select your preferred travel dates, group size, private vehicle or heritage tram ride, and dietary options.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#151c27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Step 03
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Confirm &amp; Travel
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Instant booking confirmation with direct guide contact and 24/7 on-ground Bengal concierge assistance.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 text-center">
        <button
          onClick={onStartBooking}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] dark:hover:bg-emerald-500 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Get Started &mdash; Book Your Tour</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
