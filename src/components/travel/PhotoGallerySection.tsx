import React, { useState } from 'react';
import { Camera, MapPin, Eye, Film, ArrowRight, Sparkles } from 'lucide-react';
import { GalleryPhoto } from '../../types/travel';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface PhotoGallerySectionProps {
  photos: GalleryPhoto[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['All', 'Architecture', 'River & Ghats', 'Street Life', 'Trams & Transit', 'Gastronomy'];

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-8 sm:py-12 lg:py-14 scroll-mt-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter VI &bull; Analogue Film Archive
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              স্মৃতির স্থিরচিত্র
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            Kolkata Through the Analogue Lens
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            A curated photographic archive of Calcutta&rsquo;s timeless architecture, riverfront ghats, 
            living quarters, and historic transit. Click any photograph to view the full plate and location context.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#351E1A] text-[#FFF8EF] font-bold shadow-xs'
                  : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asymmetric Gallery Masonry / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {filteredPhotos.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative bg-[#FFF8EF] p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#E8D5C2] shadow-[0_4px_16px_rgba(53,30,26,0.06)] hover:shadow-[0_16px_36px_rgba(53,30,26,0.14)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            {/* Photographic Print Box */}
            <div className="relative h-36 sm:h-56 lg:h-64 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#1f100d]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1f100d]/80 via-transparent to-transparent pointer-events-none" />

              {/* View Overlay on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-xs">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FFF8EF] text-[#351E1A] text-[10px] sm:text-xs font-sans font-bold flex items-center gap-1.5 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-[#C6532B]" />
                  <span>View Photo</span>
                </span>
              </div>

              {/* Location Pill at Image Bottom */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-[#FFF8EF] text-[9px] sm:text-[10px] font-sans">
                <span className="flex items-center gap-1 truncate max-w-[90px] sm:max-w-[150px]">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D9A38E]" />
                  <span className="truncate">{item.location}</span>
                </span>
                <span className="font-mono text-[#C5A25A] shrink-0">{item.yearTaken}</span>
              </div>
            </div>

            {/* Handwritten Title & Plate Note */}
            <div className="pt-2 sm:pt-3.5 pb-0.5 sm:pb-1 space-y-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xs sm:text-lg font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug min-h-[32px] sm:min-h-[48px] flex items-start line-clamp-2">
                  {item.title}
                </h3>
                <p className="font-script text-xs sm:text-base text-[#582822] leading-tight line-clamp-1">
                  {item.caption}
                </p>
              </div>
              <div className="pt-1.5 border-t border-[#E8D5C2]/70 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#351E1A]/60 mt-auto">
                <span>{item.category}</span>
                <span className="text-[#C6532B] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Examine &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightboxModal
        photo={activePhoto}
        photos={filteredPhotos}
        onClose={() => setActivePhoto(null)}
        onSelectPhoto={(photo) => setActivePhoto(photo)}
      />
    </section>
  );
};
