import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Clock, Calendar, ChevronLeft, ChevronRight, Feather, MapPin, Landmark } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section 
      id="blog" 
      className="py-14 sm:py-20 my-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter IV &bull; Historical Lores &amp; Places
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              কলকাতার ঐতিহাসিক কাহিনী ও স্থান
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            Historical Lores &amp; Places of Kolkata
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            From haunted colonial estates and midnight phantom carriages to secret duelling grounds, riverfront doll houses, and historic babu palaces—unravel the captivating legends and timeless heritage of Calcutta.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-sans text-[#351E1A]/60">
            {currentIndex + 1}&ndash;{Math.min(currentIndex + itemsPerPage, stories.length)} of {stories.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous stories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Next stories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stories Grid / Slider */}
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
              className="group cursor-pointer rounded-3xl overflow-hidden bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.06)] hover:shadow-[0_16px_36px_rgba(53,30,26,0.12)] transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative h-56 w-full overflow-hidden bg-[#351E1A]">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Ribbon */}
                  <span className="absolute top-3.5 left-3.5 bg-[#FFF8EF]/95 backdrop-blur-md text-[#351E1A] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-[#E8D5C2]">
                    {story.category}
                  </span>

                  {/* Era badge */}
                  {story.era && (
                    <span className="absolute bottom-3 right-3 bg-[#351E1A]/85 backdrop-blur-md text-[#FFF8EF] text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                      {story.era}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-[11px] font-sans text-[#351E1A]/65 flex-wrap">
                    {story.location && (
                      <span className="flex items-center gap-1 font-semibold text-[#C6532B]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{story.location}</span>
                      </span>
                    )}
                    {story.location && <span>&bull;</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#582822]" />
                      <span>{story.readTime}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#582822]" />
                      <span>{story.date}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#351E1A]/70 leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-[#E8D5C2]/70 flex items-center justify-between text-xs font-sans font-semibold text-[#C6532B] group-hover:translate-x-1 transition-transform">
                  <span>Explore Lore &amp; History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
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
                ? 'w-7 h-2 bg-[#C6532B]'
                : 'w-2 h-2 bg-[#E8D5C2] hover:bg-[#D9A38E]'
            }`}
            aria-label={`Go to essay slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
