import React from 'react';
import { X, Star, MapPin, Clock, Calendar, Check, Compass, Bus, Info, Lightbulb } from 'lucide-react';
import { Destination } from '../../types/travel';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
}) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151c27] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-neutral-900">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">
              {destination.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">{destination.name}</h2>
            <div className="flex items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{destination.region}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{destination.rating}</span>
                <span>({destination.reviewsCount} visitor ratings)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Overview &amp; Historical Significance
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Key Visitor Timings & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-neutral-100 dark:bg-[#1a2332] text-xs">
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Visiting Hours</span>
              </span>
              <p className="font-bold text-neutral-900 dark:text-white">{destination.timing}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Best Time</span>
              </span>
              <p className="font-bold text-neutral-900 dark:text-white">{destination.bestTimeToVisit}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>Govt Entry Fee</span>
              </span>
              <p className="font-bold text-neutral-900 dark:text-white">{destination.entryFee}</p>
            </div>
          </div>

          {/* How to reach via public transit */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1.5">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>How to Reach via Public Transit</span>
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              {destination.howToReach}
            </p>
          </div>

          {/* Local Insider Tip */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Native Calcuttan Insider Tip</span>
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
              {destination.insiderTip}
            </p>
          </div>

          {/* Key Sights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Key Architectural Sights &amp; Exhibits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destination.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Free Community Guidance &bull; WANDER.CCU
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-neutral-900 shadow-sm transition-all active:scale-95"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
