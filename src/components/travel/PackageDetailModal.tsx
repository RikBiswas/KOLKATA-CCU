import React from 'react';
import { X, Clock, Star, Check, Calendar, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { TourPackage } from '../../types/travel';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onBookNow: (pkg: TourPackage) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onBookNow,
}) => {
  if (!pkg) return null;

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
            src={pkg.imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">
              {pkg.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">{pkg.title}</h2>
            <div className="flex items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pkg.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{pkg.rating}</span>
                <span>({pkg.reviewsCount} verified reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Tour Overview
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Day / Time Itinerary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Curated Schedule &amp; Itinerary
            </h3>
            <div className="space-y-3">
              {pkg.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#1a2332] border border-neutral-200/80 dark:border-neutral-800 flex gap-3 text-xs"
                >
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold font-mono shrink-0 self-start">
                    {item.day}
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white mb-0.5">{item.title}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included inclusions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              What&apos;s Included In This Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.includes.map((inc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 block">All-inclusive package</span>
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                ₹{pkg.price.toLocaleString()}
              </span>
              {pkg.originalPrice && (
                <span className="text-xs text-neutral-400 line-through ml-2">
                  ₹{pkg.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Close
              </button>
              <button
                onClick={() => onBookNow(pkg)}
                className="px-6 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-neutral-900 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Reserve Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
