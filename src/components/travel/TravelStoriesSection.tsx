import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Calendar, MapPin, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { GuideStory } from '../../types/travel';
import { cn } from '../../lib/utils';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';

interface TravelStoriesSectionProps {
  stories: GuideStory[];
  onSelectStory: (story: GuideStory) => void;
}

export const TravelStoriesSection: React.FC<TravelStoriesSectionProps> = ({
  stories,
  onSelectStory,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    const unsubscribe = api.on('select', onSelect);
    return () => {
      unsubscribe();
    };
  }, [api]);

  // Autoplay with hover pause
  useEffect(() => {
    if (isHovered || !api || stories.length <= 1) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [api, isHovered, stories.length]);

  return (
    <section
      id="blog"
      className="py-10 sm:py-14 scroll-mt-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter VII &bull; Historical Lores &amp; Literary Essays
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

        {/* Carousel controls with slide counter */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-sans text-[#351E1A]/60">
            {current + 1} of {stories.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Next story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Skiper 54 Carousel with Dynamic Accordion ClipPath & Blur Reveal */}
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="h-[540px] sm:h-[580px] w-full py-4 items-center">
          {stories.map((story, index) => {
            const isActive = current === index;

            return (
              <CarouselItem
                key={story.id}
                className="relative flex h-full items-center justify-center basis-[84%] sm:basis-[62%] md:basis-[46%] lg:basis-[36%] xl:basis-[31%] px-2 sm:px-3"
              >
                <motion.div
                  initial={false}
                  animate={{
                    clipPath: isActive
                      ? 'inset(0% 0 0% 0 round 1.75rem)'
                      : 'inset(9% 0 9% 0 round 1.75rem)',
                    opacity: isActive ? 1 : 0.72,
                    scale: isActive ? 1 : 0.96,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  onClick={() => {
                    if (!isActive) {
                      api?.scrollTo(index);
                    } else {
                      onSelectStory(story);
                    }
                  }}
                  className={cn(
                    'relative h-full w-full overflow-hidden rounded-[1.75rem] cursor-pointer flex flex-col justify-between transition-shadow duration-500',
                    isActive
                      ? 'shadow-[0_20px_50px_rgba(53,30,26,0.18)] border-2 border-[#C6532B]/40 bg-[#FFF8EF]'
                      : 'shadow-md border border-[#E8D5C2] bg-[#FFF8EF]/95 hover:opacity-90'
                  )}
                >
                  {/* Top Photo Container */}
                  <div className="relative h-[48%] sm:h-[50%] w-full overflow-hidden bg-[#351E1A] shrink-0">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover object-center scale-102 hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/85 via-transparent to-transparent opacity-80" />

                    {/* Category Ribbon */}
                    <span className="absolute top-3 left-3 bg-[#FFF8EF]/95 backdrop-blur-md text-[#351E1A] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-[#E8D5C2]">
                      {story.category}
                    </span>

                    {/* Era badge */}
                    {story.era && (
                      <span className="absolute bottom-2.5 right-2.5 bg-[#351E1A]/85 backdrop-blur-md text-[#FFF8EF] text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                        {story.era}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-sans text-[#351E1A]/65 flex-wrap">
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

                      <h3 className={cn(
                        'font-serif font-bold text-[#351E1A] transition-colors leading-snug line-clamp-2 min-h-[56px] flex items-start',
                        isActive ? 'text-xl sm:text-2xl text-[#351E1A]' : 'text-lg sm:text-xl text-[#351E1A]/90'
                      )}>
                        {story.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-[#351E1A]/70 leading-relaxed line-clamp-3">
                        {story.summary}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-[#E8D5C2]/70 flex items-center justify-between text-xs font-sans font-semibold text-[#C6532B] group-hover:translate-x-1 transition-transform mt-auto">
                      <span>Explore Lore &amp; History</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Active Slide Blur-Reveal Title / Subtitle */}
      <div className="h-10 mt-3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stories[current] && (
            <motion.div
              key={stories[current].id}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 6 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)', y: -6 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-sans text-[#351E1A]/70"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6532B]" />
              <span className="font-serif italic font-medium text-[#582822]">
                {stories[current].title}
              </span>
              <span className="hidden md:inline font-mono text-[11px] text-[#C6532B]">
                ({stories[current].location})
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex w-full items-center justify-center gap-2 mt-4">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'cursor-pointer rounded-full transition-all duration-300',
              current === index
                ? 'w-7 h-2 bg-[#C6532B]'
                : 'w-2 h-2 bg-[#E8D5C2] hover:bg-[#D9A38E]'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
