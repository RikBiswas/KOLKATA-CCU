import React, { useState } from 'react';
import { ArrowLeft, Search, Star, MapPin, Clock, Eye, Filter, Compass } from 'lucide-react';
import { Destination } from '../../types/travel';

interface AllDestinationsPageProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onBackToHome: () => void;
}

export const AllDestinationsPage: React.FC<AllDestinationsPageProps> = ({
  destinations,
  onSelectDestination,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(destinations.map((d) => d.category)))];
  const regions = ['All', ...Array.from(new Set(destinations.map((d) => d.region)))];

  const filtered = destinations.filter((dest) => {
    const matchesCat = selectedCategory === 'All' || dest.category === selectedCategory;
    const matchesReg = selectedRegion === 'All' || dest.region === selectedRegion;
    const matchesQuery =
      !searchQuery.trim() ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesReg && matchesQuery;
  });

  return (
    <div className="py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="space-y-1">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home Overview</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Explore All Kolkata Destinations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
            Choose from historic colonial monuments, sacred Hooghly river ghats, century-old artisan quarters, and world-class street gastronomy.
          </p>
        </div>

        <div className="text-right sm:self-end">
          <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            {filtered.length} destination{filtered.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#f4f6f8] dark:bg-[#131924] border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by monument name, region, or keywords..."
            className="w-full text-xs sm:text-sm bg-white dark:bg-[#1b2332] border border-neutral-300 dark:border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-neutral-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1a2e3b] dark:bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>Filter by Region:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedRegion === reg
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                    : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of all destination cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Compass className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-300">
            No destinations match your filters
          </h3>
          <p className="text-xs text-neutral-500">
            Try adjusting your search query or selecting &ldquo;All&rdquo; categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedRegion('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-emerald-600 text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 bg-neutral-900 flex flex-col justify-end"
            >
              {/* Background Image */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

              {/* Region Pill on Top Right */}
              <div className="absolute top-3.5 right-3.5 bg-white/80 dark:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-900 dark:text-white shadow-xs border border-white/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>{dest.region}</span>
              </div>

              {/* Category badge top left */}
              <div className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-emerald-300 border border-white/10">
                {dest.category}
              </div>

              {/* Bottom Content Area */}
              <div className="relative p-5 space-y-2 text-white z-10">
                <h3 className="text-lg font-extrabold tracking-tight group-hover:text-emerald-300 transition-colors leading-snug">
                  {dest.name}
                </h3>

                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Rating + Timing */}
                <div className="pt-1 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{dest.rating}</span>
                    <span className="text-white/60 text-[10px]">({dest.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-white/75 truncate max-w-[130px]">
                    <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{dest.bestTimeToVisit.split('(')[0]}</span>
                  </div>
                </div>

                {/* View Details action */}
                <div className="pt-2">
                  <div className="w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 border border-white/20 group-hover:bg-emerald-600 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Visitor Guide &amp; Details</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Back Button */}
      <div className="pt-8 text-center border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] text-white text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Overview</span>
        </button>
      </div>
    </div>
  );
};
