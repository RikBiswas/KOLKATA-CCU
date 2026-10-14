import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Sliders } from 'lucide-react';
import { GalleryItem } from '../../types';
import { MediaFrame } from '../common/MediaFrame';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-neutral-400 z-10">
        <div className="text-xs font-mono tabular-nums">
          {currentIndex + 1} / {items.length}
        </div>
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2 hover:text-white transition-colors rounded-lg bg-neutral-900/60 border border-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-neutral-400 hover:text-white bg-neutral-900/70 border border-neutral-800 rounded-full transition-all hover:scale-105 z-10 hidden sm:flex"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next image"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-neutral-400 hover:text-white bg-neutral-900/70 border border-neutral-800 rounded-full transition-all hover:scale-105 z-10 hidden sm:flex"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main Content Box */}
      <div
        className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950">
          <MediaFrame
            title={currentItem.title}
            category={currentItem.category}
            aspectRatio={currentItem.aspectRatio}
            variant="architectural"
            className="w-full max-h-[60vh]"
          />
        </div>

        {/* Caption & EXIF Panel */}
        <div className="w-full mt-4 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>{currentItem.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{currentItem.date}</span>
              </div>
              <h3 id="lightbox-title" className="text-base font-semibold mt-0.5 text-white">
                {currentItem.title}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              {currentItem.description}
            </p>
          </div>

          {/* EXIF Data */}
          {currentItem.exif && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-400">
              {currentItem.exif.camera && (
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{currentItem.exif.camera}</span>
                </div>
              )}
              {currentItem.exif.settings && (
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{currentItem.exif.settings}</span>
                </div>
              )}
              {currentItem.exif.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{currentItem.exif.location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
