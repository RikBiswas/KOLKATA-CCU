import React, { useState } from 'react';
import { Camera, MapPin, Maximize2 } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { GalleryItem } from '../../types';
import { MediaFrame } from '../common/MediaFrame';

interface GalleryPageProps {
  onSelectItem: (index: number) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Architecture', 'Design Systems', 'Workspaces', 'Minimalism'];

  const filteredItems =
    activeCategory === 'All'
      ? siteConfig.gallery
      : siteConfig.gallery.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Visual Archive</span>
          <span aria-hidden="true">&middot;</span>
          <span>Photographic &amp; Design Studies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Curated Gallery
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Documentary studies in architectural geometry, spatial design token rhythms, tactile workstation craft, and brutalist daylight.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeCategory === cat
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => {
          // Find original index in siteConfig.gallery for proper Lightbox navigation
          const originalIndex = siteConfig.gallery.findIndex((g) => g.id === item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(originalIndex)}
              className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] overflow-hidden transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              {/* Media Container */}
              <div className="relative overflow-hidden">
                <MediaFrame
                  title={item.title}
                  category={item.category}
                  aspectRatio={item.aspectRatio}
                  variant={
                    item.category === 'Design Systems'
                      ? 'abstract'
                      : item.category === 'Architecture'
                      ? 'architectural'
                      : 'schematic'
                  }
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-black/60 backdrop-blur-xs text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>{item.category}</span>
                  <span>{item.date}</span>
                </div>

                <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>

                {item.exif && (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="truncate max-w-[60%]">
                      {item.exif.camera || item.exif.settings}
                    </span>
                    {item.exif.location && (
                      <span className="truncate max-w-[38%] text-right">{item.exif.location}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-500 text-sm">
          No visual records found in this category.
        </div>
      )}
    </div>
  );
};
