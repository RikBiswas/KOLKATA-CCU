import React from 'react';
import { ArrowRight, Clock, Star, Check, Sparkles } from 'lucide-react';
import { TourPackage } from '../../types/travel';

interface TourPackagesSectionProps {
  packages: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onBrowseAll?: () => void;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({
  packages,
  onSelectPackage,
  onBrowseAll,
}) => {
  return (
    <section id="packages" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Grey Box with Title & Description & 'Browse all packages' button matching mockup */}
        <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl bg-[#98a8b8] dark:bg-[#1a2533] text-white flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Curated Itineraries</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Tour Packages
            </h2>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Affordable, customizable, and unforgettable adventures across the City of Joy. 
              Led by historians, food journalists, and native Kolkata insiders.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Small groups &amp; personalized attention</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>All museum &amp; ferry pass fees included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Authentic Bengali meals &amp; snacks provided</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={onBrowseAll}
              className="px-6 py-3 rounded-full bg-[#1b2b38] dark:bg-emerald-600 hover:bg-[#111c25] dark:hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Browse all packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Columns: Package Cards (2 or 3 tall image cards matching mockup) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {packages.slice(0, 2).map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="group relative h-[420px] sm:h-[460px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-neutral-900"
            >
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Tag top left */}
              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {pkg.tag}
              </div>

              {/* Price top right */}
              <div className="absolute top-4 right-4 bg-white/90 text-neutral-900 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black shadow-xs">
                ₹{pkg.price.toLocaleString()}
                {pkg.originalPrice && (
                  <span className="text-[10px] font-normal line-through text-neutral-400 ml-1.5">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-3 text-white">
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{pkg.duration}</span>
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{pkg.rating}</span>
                    <span className="text-white/60">({pkg.reviewsCount})</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors leading-snug">
                  {pkg.title}
                </h3>

                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {pkg.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Itinerary &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
