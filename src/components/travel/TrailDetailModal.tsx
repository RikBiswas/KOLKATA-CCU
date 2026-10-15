import React from 'react';
import { X, Clock, Star, MapPin, Footprints, Train, Lightbulb, Compass } from 'lucide-react';
import { SuggestedTrail } from '../../types/travel';

interface TrailDetailModalProps {
  trail: SuggestedTrail | null;
  onClose: () => void;
}

export const TrailDetailModal: React.FC<TrailDetailModalProps> = ({ trail, onClose }) => {
  if (!trail) return null;

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

        {/* Top Hero Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-neutral-900">
          <img
            src={trail.imageUrl}
            alt={trail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">
              {trail.tag} &bull; {trail.difficulty}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">{trail.title}</h2>
            <div className="flex items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{trail.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{trail.rating}</span>
                <span>({trail.reviewsCount} explorer ratings)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Trail Description
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {trail.description}
            </p>
          </div>

          {/* Step-by-Step Schedule */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Step-by-Step Route &amp; Recommended Timings
            </h3>
            <div className="space-y-3">
              {trail.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#1a2332] border border-neutral-200/80 dark:border-neutral-800 flex gap-3 text-xs"
                >
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold font-mono shrink-0 self-start">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white mb-0.5">{item.title}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key landmark stops */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Key Landmarks Along This Route
            </h3>
            <div className="flex flex-wrap gap-2">
              {trail.keyStops.map((stop, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200 dark:border-neutral-700 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{stop}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Self-Guided Walking Itinerary &bull; Completely Free
            </span>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-neutral-900 shadow-sm transition-all active:scale-95"
            >
              Close Trail Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
