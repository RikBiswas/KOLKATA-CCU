import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { GuideStory } from '../../types/travel';

interface TravelStoriesSectionProps {
  stories: GuideStory[];
  onSelectStory: (story: GuideStory) => void;
}

export const TravelStoriesSection: React.FC<TravelStoriesSectionProps> = ({
  stories,
  onSelectStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Dynamically determine how many cards to show per slide view
  // On desktop: 3 items, tablet: 2 items, mobile: 1 item
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, stories.length - itemsPerPage);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="blog" className="py-12 sm:py-16">
      {/* Section Header with Carousel Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Heritage, Culture &amp; Cuisine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mt-1">
            Kolkata Travel Insights &amp; Stories
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Insider essays, street gastronomy maps, and historic lore curated by native Calcutta guides.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {currentIndex + 1}&ndash;{Math.min(currentIndex + itemsPerPage, stories.length)} of {stories.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label="Previous stories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label="Next stories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stories Slider Viewport with Slide Animation */}
      <div className="overflow-hidden">
        <div
          key={currentIndex}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500 ease-out ${
            slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          {visibleStories.map((story) => (
            <article
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#141b27] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    {story.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      <span>{story.readTime}</span>
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{story.date}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                    {story.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setSlideDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === index
                ? 'w-7 h-2 bg-emerald-600 dark:bg-emerald-400'
                : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
