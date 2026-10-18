import React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Camera, Calendar, Film, ArrowLeft, ArrowRight, Share2, Download } from 'lucide-react';
import { GalleryPhoto } from '../../types/travel';

interface PhotoLightboxModalProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const prevPhoto = photos[currentIndex - 1] || photos[photos.length - 1];
  const nextPhoto = photos[currentIndex + 1] || photos[0];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onSelectPhoto(prevPhoto);
    if (e.key === 'ArrowRight') onSelectPhoto(nextPhoto);
  };

  return createPortal(
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#1f100d]/95 backdrop-blur-md animate-fade-in focus:outline-none"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top Bar with Navigation Controls & Close */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FFF8EF]/15 border border-[#FFF8EF]/20 text-white font-mono text-xs">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-xs font-mono text-[#D9A38E] hidden sm:inline">
            ARCHIVE PHOTOGRAPH &bull; {photo.yearTaken}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#FFF8EF]/20 hover:bg-[#FFF8EF]/30 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
          aria-label="Close photo view"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Photographic Display Frame */}
      <div className="relative max-w-5xl w-full max-h-[88vh] flex flex-col md:flex-row items-center justify-center bg-[#FFF8EF] rounded-3xl overflow-hidden shadow-2xl border border-[#E8D5C2]">
        {/* Left Arrow Button */}
        <button
          onClick={() => onSelectPhoto(prevPhoto)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
          aria-label="Previous photograph"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => onSelectPhoto(nextPhoto)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
          aria-label="Next photograph"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Big Photographic Plate with Analog White Postcard Margin */}
        <div className="flex-1 h-[340px] sm:h-[450px] md:h-[580px] w-full bg-[#1A0E0C] relative flex items-center justify-center overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Right Editorial Sidebar: Notes & Story */}
        <div className="w-full md:w-80 lg:w-96 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-[#351E1A] bg-[#FFF8EF]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#E8D5C2] pb-3">
              <span className="px-2.5 py-0.5 rounded-sm bg-[#C6532B]/10 text-[#C6532B] font-mono text-[10px] font-bold uppercase tracking-wider">
                {photo.category}
              </span>
              <span className="text-[11px] font-mono text-[#351E1A]/60">
                Plate {String(currentIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold leading-tight">
                {photo.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#582822] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>{photo.location}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#351E1A]/80 leading-relaxed italic">
              &ldquo;{photo.caption}&rdquo;
            </p>
          </div>

          {/* Bottom Bar: Instructions */}
          <div className="pt-3 border-t border-[#E8D5C2] flex items-center justify-between text-[11px] text-[#351E1A]/60">
            <span>Use &larr; &rarr; arrow keys to browse</span>
            <span className="font-bengali text-[#C6532B]">স্মৃতির স্থিরচিত্র</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
