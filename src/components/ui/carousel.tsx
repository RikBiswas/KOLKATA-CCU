import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CarouselApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  on: (event: 'select' | 'reInit', callback: () => void) => () => void;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: {
    loop?: boolean;
    slidesToScroll?: number;
    startIndex?: number;
    align?: 'start' | 'center';
  };
  plugins?: any[];
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  currentIndex: number;
  totalSlides: number;
  setTotalSlides: React.Dispatch<React.SetStateAction<number>>;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, plugins, setApi, className, children, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(opts?.startIndex || 0);
    const [totalSlides, setTotalSlides] = useState(0);
    const listenersRef = useRef<Map<string, Set<() => void>>>(new Map());

    const loop = opts?.loop ?? true;

    const canScrollPrev = loop || currentIndex > 0;
    const canScrollNext = loop || currentIndex < totalSlides - 1;

    const emit = useCallback((event: string) => {
      listenersRef.current.get(event)?.forEach((cb) => cb());
    }, []);

    const scrollTo = useCallback(
      (index: number) => {
        if (totalSlides <= 0) return;
        let target = index;
        if (loop) {
          target = ((index % totalSlides) + totalSlides) % totalSlides;
        } else {
          target = Math.max(0, Math.min(index, totalSlides - 1));
        }
        setCurrentIndex(target);
      },
      [totalSlides, loop]
    );

    const scrollPrev = useCallback(() => {
      scrollTo(currentIndex - 1);
    }, [currentIndex, scrollTo]);

    const scrollNext = useCallback(() => {
      scrollTo(currentIndex + 1);
    }, [currentIndex, scrollTo]);

    // Notify listeners when currentIndex changes
    useEffect(() => {
      emit('select');
    }, [currentIndex, emit]);

    // Center the active slide in view smoothly
    useEffect(() => {
      if (!trackRef.current) return;
      const items = trackRef.current.children;
      if (items && items[currentIndex]) {
        const item = items[currentIndex] as HTMLElement;
        const container = containerRef.current;
        if (container) {
          const containerCenter = container.offsetWidth / 2;
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          const scrollLeft = itemCenter - containerCenter;

          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth',
          });
        }
      }
    }, [currentIndex]);

    // Build the shadcn-compatible API
    const api = useMemo<CarouselApi>(() => {
      return {
        scrollPrev,
        scrollNext,
        scrollTo,
        selectedScrollSnap: () => currentIndex,
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
        on: (event: string, callback: () => void) => {
          if (!listenersRef.current.has(event)) {
            listenersRef.current.set(event, new Set());
          }
          listenersRef.current.get(event)?.add(callback);
          return () => {
            listenersRef.current.get(event)?.delete(callback);
          };
        },
      };
    }, [scrollPrev, scrollNext, scrollTo, currentIndex, canScrollPrev, canScrollNext]);

    useEffect(() => {
      if (setApi) {
        setApi(api);
      }
    }, [setApi, api]);

    return (
      <CarouselContext.Provider
        value={{
          containerRef,
          trackRef,
          currentIndex,
          totalSlides,
          setTotalSlides,
          scrollTo,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          className={cn('relative w-full overflow-hidden select-none', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = 'Carousel';

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { containerRef, trackRef, setTotalSlides } = useCarousel();

  useEffect(() => {
    if (trackRef.current) {
      setTotalSlides(trackRef.current.children.length);
    }
  });

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div
        ref={trackRef}
        className={cn('flex items-center', className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0', className)}
      {...props}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        'w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95',
        className
      )}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
});

CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        'w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] disabled:opacity-30 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95',
        className
      )}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  );
});

CarouselNext.displayName = 'CarouselNext';
