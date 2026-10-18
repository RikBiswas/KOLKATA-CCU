import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Clock,
  ArrowRight,
  Coffee,
  Ship,
  Train,
  BookOpen,
  Camera,
  UtensilsCrossed,
  Sun
} from 'lucide-react';

export interface KolkataActivity {
  id: string;
  title: string;
  category: 'Heritage' | 'Gastronomy' | 'River & Transit' | 'Culture & Books' | 'Hidden Gem';
  subtitle: string;
  tagline: string;
  location: string;
  bestTime: string;
  cost: string;
  icon: string;
  imageUrl: string;
  insiderTip: string;
  highlightTag: string;
}

const THINGS_TO_DO: KolkataActivity[] = [
  {
    id: 'tram-ride-maidan',
    title: 'Ride Vintage Route 24 Tram',
    category: 'River & Transit',
    subtitle: 'Asia’s oldest electric tramway slicing through green Maidan',
    tagline: 'Step back to 1873 with the gentle wooden shudder and brass conductor bell.',
    location: 'Esplanade to Gariahat / Maidan',
    bestTime: '7:30 AM – 9:00 AM',
    cost: '₹7 per ticket',
    icon: '🚋',
    imageUrl: '/images/stories/heritage-tram.jpg',
    insiderTip: 'Sit on the left window seat facing the Red Road tree canopy.',
    highlightTag: 'Iconic Transit',
  },
  {
    id: 'princep-ghat-sunset',
    title: 'Wooden Country Boat on the Ganges',
    category: 'River & Transit',
    subtitle: 'Drift beneath the monumental Vidyasagar Setu suspension bridge',
    tagline: 'Hire a hand-rowed dinghy at dusk while riverside aarti bells sound in the distance.',
    location: 'Princep Ghat & Strand Road',
    bestTime: '4:45 PM – 5:45 PM',
    cost: '₹300 – ₹400 for 30 mins',
    icon: '⛵',
    imageUrl: '/images/destinations/princep-ghat.jpg',
    insiderTip: 'Pick up clay pot hot milk tea and singara from the station stall first.',
    highlightTag: 'Golden Hour',
  },
  {
    id: 'college-street-adda',
    title: 'Book Hunting & Coffee House Adda',
    category: 'Culture & Books',
    subtitle: 'Browse 1.5 miles of wooden bookstalls and historic intellectual cafes',
    tagline: 'The world’s largest second-hand book market with over 200 years of literary history.',
    location: 'College Street (Boi Para)',
    bestTime: '11:00 AM – 4:00 PM',
    cost: 'Free entry (Cutlet ₹70)',
    icon: '☕',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8vPye0_p6ks_0jA6YKprl0ZdpFbjKrDIElPkAF6cgmJRplpsXIUwFA5M&s=10',
    insiderTip: 'Ask the mezzanine server for infused black coffee and mutton afghani cutlet.',
    highlightTag: 'Literary Hub',
  },
  {
    id: 'tiretta-bazaar-breakfast',
    title: 'Dawn Chinese Street Breakfast',
    category: 'Gastronomy',
    subtitle: 'Fresh steaming pork/chicken momos, fish ball broth and sesame pastries',
    tagline: 'India’s oldest Chinatown street market serves dawn delicacies straight from steamers.',
    location: 'Sun Yat Sen Street, Poddar Court',
    bestTime: '6:30 AM – 8:00 AM daily',
    cost: '₹120 – ₹200 for full breakfast',
    icon: '🥟',
    imageUrl: 'https://assets.telegraphindia.com/telegraph/DSC_1922.jpg',
    insiderTip: 'Arrive before 7:15 AM; the best steamed fish dumpling bowls sell out in 45 minutes.',
    highlightTag: 'Foodie Must',
  },
  {
    id: 'kumartuli-artisan-walk',
    title: 'Wander Kumartuli Clay Idol Studios',
    category: 'Heritage',
    subtitle: 'Watch hereditary master sculptors transform Ganges silt into gods',
    tagline: 'Centuries-old labyrinth of straw armatures, terracotta clay, and natural pigments.',
    location: 'Bonomali Sarkar Street, North Kolkata',
    bestTime: '8:00 AM – 10:30 AM',
    cost: 'Free (Respect studio etiquette)',
    icon: '🎨',
    imageUrl: '/images/stories/kumartuli-sculptors.jpg',
    insiderTip: 'Walk down to Mayer Ghat after your visit to watch clay boats unloading straw.',
    highlightTag: 'Artisan Quarter',
  },
  {
    id: 'mallick-ghat-flower-market',
    title: 'Explore Asia’s Largest Flower Market',
    category: 'River & Transit',
    subtitle: 'Mountains of golden marigolds and blue lotus under Howrah Bridge',
    tagline: 'Sensory riot of fresh dew, eucalyptus, orange garlands, and river porters.',
    location: 'Mallick Ghat, under Howrah Bridge',
    bestTime: '5:30 AM – 7:30 AM',
    cost: 'Free entry',
    icon: '🌸',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Rs-8UpdNWb0aXjLTh_HP4nGT6V3U63RPvt8BB5Ay3JvLXG_a9Kw_Hog&s=10',
    insiderTip: 'Climb the south pedestrian steps of Howrah Bridge for an aerial view of the market.',
    highlightTag: 'Early Morning',
  },
  {
    id: 'south-park-street-cemetery',
    title: 'Gothic Silence at Park Street Cemetery',
    category: 'Heritage',
    subtitle: '1767 neoclassical urns and overgrown moss-covered obelisks',
    tagline: 'One of the earliest non-church cemeteries in the world, shrouded under massive banyan roots.',
    location: '52 Park Street, Mullick Bazar',
    bestTime: '10:00 AM – 12:30 PM',
    cost: '₹20 Entry fee',
    icon: '🏛️',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrxkTbe557OhtQNXPjTajM2zz2k8S1g3ah7zzyHcOQB13Kfbj3Y5iFOlw&s=10',
    insiderTip: 'Look for Rose Aylmer’s tomb and poet Walter Savage Landor’s poetic epitaph.',
    highlightTag: 'Hidden Oasis',
  },
  {
    id: 'underwater-metro-crossing',
    title: 'Ride India’s Underwater Metro Line',
    category: 'River & Transit',
    subtitle: 'Tunnel 33 meters beneath the Hooghly riverbed on the Green Line',
    tagline: 'A modern marvel whisking travelers under the holy river in just 45 seconds.',
    location: 'Howrah Station to Esplanade',
    bestTime: 'Anytime (Avoid 9-10 AM peak)',
    cost: '₹10 metro token',
    icon: '🚇',
    imageUrl: '/images/destinations/howrah-bridge.jpg',
    insiderTip: 'Watch for the blue illumination panels inside the tunnel marking the river stretch.',
    highlightTag: 'Modern Feat',
  },
];

interface ThingsToDoSectionProps {
  onSelectActivity?: (activity: KolkataActivity) => void;
  onExploreLandmarks?: () => void;
}

export const ThingsToDoSection: React.FC<ThingsToDoSectionProps> = ({
  onSelectActivity,
  onExploreLandmarks,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const timerRef = useRef<number | null>(null);

  const categories = ['All', 'River & Transit', 'Heritage', 'Gastronomy', 'Culture & Books'];

  const filteredActivities = THINGS_TO_DO.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  // Calculate items visible per frame based on responsive view (default 3 for desktop)
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, filteredActivities.length - itemsPerPage);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // loop back seamlessly
        }
        return prev + 1;
      });
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, maxIndex, filteredActivities.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleCards = filteredActivities.slice(currentIndex, currentIndex + itemsPerPage);
  // If fewer than itemsPerPage, wrap around to maintain a full row
  const displayCards =
    visibleCards.length < itemsPerPage && filteredActivities.length >= itemsPerPage
      ? [...visibleCards, ...filteredActivities.slice(0, itemsPerPage - visibleCards.length)]
      : visibleCards;

  return (
    <section
      id="things-to-do"
      className="py-14 sm:py-20 my-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Curated Experiences &bull; Things to Do
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              কলকাতায় করণীয় অভিজ্ঞতা
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            Things to Do in Kolkata
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Essential rituals, slow afternoon wanderings, and insider moments that define the soul of the city.
            Slides automatically with fresh inspiration for your daily itinerary.
          </p>
        </div>

        {/* Carousel Action & Autoplay Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Autoplay Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] text-xs font-sans font-medium hover:bg-[#F7EBDD] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title={isPaused ? 'Resume auto-sliding' : 'Pause auto-sliding'}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-[#C6532B]" />
                <span className="text-[11px]">Auto: Paused</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-[#C6532B]" />
                <span className="text-[11px]">Auto: Sliding</span>
              </>
            )}
          </button>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous suggestions"
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next suggestions"
              className="w-9 h-9 rounded-full bg-[#FFF8EF] border border-[#E8D5C2] text-[#351E1A] hover:bg-[#F7EBDD] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedCategory === cat
                ? 'bg-[#351E1A] text-[#FFF8EF] font-bold shadow-xs'
                : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Auto-sliding Mini Cards Grid */}
      <div className="overflow-hidden">
        <div
          key={`${selectedCategory}-${currentIndex}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 animate-slide-in-right"
        >
          {displayCards.map((act) => (
            <div
              key={act.id}
              className="archival-tilt-card group relative rounded-3xl overflow-hidden bg-[#FFF8EF] border border-[#E8D5C2] shadow-[0_8px_24px_rgba(53,30,26,0.06)] hover:shadow-[0_16px_36px_rgba(53,30,26,0.12)] transition-all flex flex-col justify-between"
            >
              {/* Card Image Banner with Tag & Icon */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#351E1A]">
                <img
                  src={act.imageUrl}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/85 via-transparent to-[#351E1A]/20 pointer-events-none" />

                {/* Highlight Tag */}
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#C6532B] text-[#FFF8EF] text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                  {act.highlightTag}
                </div>

                {/* Category Pill */}
                <div className="absolute top-3.5 right-3.5 bg-[#FFF8EF]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold text-[#351E1A] border border-[#E8D5C2] flex items-center gap-1 shadow-xs">
                  <span>{act.icon}</span>
                  <span>{act.category}</span>
                </div>

                {/* Card Title on Image Bottom */}
                <div className="absolute bottom-3 left-4 right-4 text-[#FFF8EF]">
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-sm group-hover:text-[#F7EBDD] transition-colors">
                    {act.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2">
                  <p className="font-sans text-xs text-[#351E1A]/80 leading-relaxed font-normal">
                    {act.tagline}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#F7EBDD]/70 border border-[#E8D5C2] text-[11px] font-sans text-[#582822] leading-relaxed">
                    <strong className="text-[#C6532B]">Native Tip:</strong> {act.insiderTip}
                  </div>
                </div>

                {/* Mini Practical Meta Grid */}
                <div className="pt-3 border-t border-[#E8D5C2]/80 space-y-1.5 text-[11px] font-sans text-[#351E1A]/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                    <span className="font-mono font-bold text-[#582822] text-[10px] shrink-0">
                      {act.cost}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C5A25A] shrink-0" />
                      <span>{act.bestTime}</span>
                    </div>

                    <span className="font-script text-[#C6532B] text-xs font-bold">
                      worth the trip &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Progress Dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${idx === currentIndex
                ? 'w-7 h-2 bg-[#C6532B]'
                : 'w-2 h-2 bg-[#E8D5C2] hover:bg-[#D9A38E]'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
