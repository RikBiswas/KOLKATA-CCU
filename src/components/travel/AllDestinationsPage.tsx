import React, { useState } from 'react';
import { ArrowLeft, Search, Star, MapPin, Clock, Eye, Filter, Compass, ArrowRight } from 'lucide-react';
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
    <div className="pt-4 sm:pt-6 pb-16 sm:pb-24 space-y-8 animate-fade-in text-[#351E1A]">
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E8D5C2] pb-6 sm:pb-8">
        <div className="space-y-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#C6532B] hover:text-[#B04520] transition-colors mb-1 cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Journal Home</span>
          </button>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight leading-tight">
            The Complete Calcutta Landmark Archive
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 max-w-2xl leading-relaxed">
            Browse all curated heritage sites, sacred Hooghly river ghats, century-old artisan quarters, 
            and literary tea houses across North, Central, and South Kolkata.
          </p>
        </div>

        <div className="text-right sm:self-end shrink-0">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-sans font-bold text-[#351E1A] shadow-xs">
            {filtered.length} landmark{filtered.length !== 1 ? 's' : ''} cataloged
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_30px_rgba(53,30,26,0.05)] space-y-4 sm:space-y-5">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by landmark name, region, or keywords (e.g. marble, ghat, books)..."
            aria-label="Search all landmarks archive"
            className="w-full text-xs sm:text-sm bg-[#F7EBDD] border border-[#E8D5C2] rounded-2xl pl-10 pr-10 py-3 text-[#351E1A] placeholder-[#351E1A]/60 focus:outline-none focus:ring-2 focus:ring-[#C6532B] focus:border-[#C6532B]"
          />
          <Search className="w-4 h-4 text-[#351E1A]/60 absolute left-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-[#351E1A]/70 hover:text-[#351E1A] font-bold cursor-pointer"
              aria-label="Clear landmark search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C6532B] flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            <span>Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#351E1A] text-[#FFF8EF] font-bold shadow-xs'
                    : 'bg-[#F7EBDD] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#E8D5C2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-[#E8D5C2]/80">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#582822] flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>Filter by Region:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-[#582822] text-[#FFF8EF] font-bold shadow-xs'
                    : 'bg-[#F7EBDD] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#E8D5C2]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of All Destination Cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-[#FFF8EF] rounded-3xl border border-[#E8D5C2] space-y-3">
          <p className="font-serif text-2xl text-[#351E1A]">No landmarks found matching your criteria.</p>
          <p className="text-xs text-[#351E1A]/60">Try searching for &ldquo;Victoria&rdquo;, &ldquo;Ghat&rdquo;, or reset filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedRegion('All');
              setSearchQuery('');
            }}
            className="px-6 py-2 rounded-full bg-[#C6532B] text-white text-xs font-sans font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((dest, idx) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.06)] hover:shadow-[0_16px_36px_rgba(53,30,26,0.12)] transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-[#351E1A]">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/80 via-transparent to-[#351E1A]/20 pointer-events-none" />

                <div className="absolute top-3.5 left-3.5 bg-[#FFF8EF]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#351E1A] shadow-xs border border-[#E8D5C2]">
                  {String(idx + 1).padStart(2, '0')} / {String(destinations.length).padStart(2, '0')}
                </div>

                <div className="absolute top-3.5 right-3.5 bg-[#351E1A]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold text-[#FFF8EF] shadow-xs border border-[#FFF8EF]/20 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D9A38E]" />
                  <span>{dest.region}</span>
                </div>

                <div className="absolute bottom-3 left-3.5">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#C5A25A] bg-[#351E1A]/90 px-2 py-0.5 rounded-sm">
                    {dest.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug">
                    {dest.name}
                  </h3>
                  <p className="font-sans text-xs text-[#351E1A]/70 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D5C2]/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans text-[#351E1A]/80">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#C5A25A] text-[#C5A25A]" />
                      <span className="font-bold text-[#351E1A]">{dest.rating}</span>
                      <span className="text-[#351E1A]/50 text-[10px]">({dest.reviewsCount})</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#351E1A]/70">
                      <Clock className="w-3 h-3 text-[#C6532B]" />
                      <span className="truncate max-w-[120px]">{dest.bestTimeToVisit.split('(')[0]}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-sans font-semibold text-[#C6532B] group-hover:translate-x-1 transition-transform">
                    <span>View Visitor Guide &amp; Transit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return to home button */}
      <div className="pt-8 text-center">
        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] font-sans text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to WANDER.CCU Overview</span>
        </button>
      </div>
    </div>
  );
};
