import React, { useState, useEffect } from 'react';
import { travelData } from './config/travel.config';
import { Destination, SuggestedTrail, GuideStory, Neighborhood, DiaryItem } from './types/travel';
import { TravelNavbar } from './components/travel/TravelNavbar';
import { HeroBanner } from './components/travel/HeroBanner';
import { WhyChooseUs } from './components/travel/WhyChooseUs';
import { NeighborhoodsSection } from './components/travel/NeighborhoodsSection';
import { DistrictDetailModal } from './components/travel/DistrictDetailModal';
import { DestinationsSection } from './components/travel/DestinationsSection';
import { SuggestedTrailsSection } from './components/travel/SuggestedTrailsSection';
import { FoodAndCultureSection } from './components/travel/FoodAndCultureSection';
import { SeasonalCalendarSection } from './components/travel/SeasonalCalendarSection';
import { PhotoGallerySection } from './components/travel/PhotoGallerySection';
import { TransitCodexSection } from './components/travel/TransitCodexSection';
import { TravelStoriesSection } from './components/travel/TravelStoriesSection';
import { HowToExploreSection } from './components/travel/HowToExploreSection';
import { ClosingMonologueSection } from './components/travel/ClosingMonologueSection';
import { ThingsToDoSection } from './components/travel/ThingsToDoSection';
import { TravelFooter } from './components/travel/TravelFooter';
import { DestinationDetailModal } from './components/travel/DestinationDetailModal';
import { TrailDetailModal } from './components/travel/TrailDetailModal';
import { StoryDetailModal } from './components/travel/StoryDetailModal';
import { AllDestinationsPage } from './components/travel/AllDestinationsPage';
import { PocketDiaryModal } from './components/travel/PocketDiaryModal';
import { CalcuttaSoundscape } from './components/travel/CalcuttaSoundscape';
import { ItineraryBuilderModal } from './components/travel/ItineraryBuilderModal';

const DIARY_STORAGE_KEY = 'wander_ccu_diary_v2';

export const DEFAULT_CURATED_DIARY_ITEMS: DiaryItem[] = [
  // --- PLACES & HERITAGE LANDMARKS ---
  {
    id: 'victoria-memorial',
    title: 'Victoria Memorial Hall',
    category: 'Landmark',
    location: 'Central Kolkata (Maidan)',
    imageUrl: '/images/destinations/victoria-memorial.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Watch sunset reflection by South Lake at 5 PM & tour the Queen’s Gallery',
    visited: false,
  },
  {
    id: 'howrah-bridge-flower-market',
    title: 'Howrah Bridge & Mallick Ghat Flower Market',
    category: 'Landmark',
    location: 'Strand Road Riverfront',
    imageUrl: '/images/destinations/howrah-bridge.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Visit at dawn (6:00 AM) to experience Asia’s largest flower market and watch traditional wrestlers',
    visited: false,
  },
  {
    id: 'princep-ghat-riverfront',
    title: 'Princep Ghat & Strand Promenade',
    category: 'Landmark',
    location: 'Hooghly Riverfront',
    imageUrl: '/images/destinations/princep-ghat.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Hire a traditional wooden dinghy boat for a sunset sail under the Vidyasagar Setu cable bridge',
    visited: false,
  },
  {
    id: 'dakshineswar-kali-temple',
    title: 'Dakshineswar Kali Temple',
    category: 'Landmark',
    location: 'Hooghly Riverbank, North Kolkata',
    imageUrl: '/images/destinations/dakshineswar-temple.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Historic 1855 nine-spire temple where Ramakrishna Paramahamsa meditated; board the ferry to Belur Math',
    visited: false,
  },
  {
    id: 'kalighat-temple-bhowanipore',
    title: 'Kalighat Kali Temple & Bhowanipore Mansions',
    category: 'Landmark',
    location: 'South Kolkata',
    imageUrl: 'https://www.tourmyindia.com/states/west-bengal/images/kalighat-kali-temple1.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Ancient 51 Shakti Peeth; pick up red hibiscus garlands and wander past Harish Park Art Deco balconies',
    visited: false,
  },
  {
    id: 'college-street-boipara',
    title: 'College Street Boi Para & Historic Bookstalls',
    category: 'Neighborhood',
    location: 'North-Central Kolkata',
    imageUrl: '/images/destinations/college-street.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Explore 1.5 miles of second-hand academic and vintage bookstalls; find rare first editions',
    visited: false,
  },
  {
    id: 'kumartuli-artisan-quarter',
    title: 'Kumartuli Clay Idol Sculptors’ Quarter',
    category: 'Neighborhood',
    location: 'North Kolkata',
    imageUrl: '/images/destinations/kumartuli.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Wander the narrow potters’ ateliers watching master artisans shape straw and clay into goddess Durga idols',
    visited: false,
  },

  // --- ACTIVITIES & WALKING TRAILS ---
  {
    id: 'heritage-tram-ride',
    title: 'Heritage Wooden Tram Ride (Esplanade to Gariahat)',
    category: 'Trail',
    location: 'Esplanade Terminus',
    imageUrl: '/images/stories/heritage-tram.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Board Asia’s oldest electric tram; sit beside wooden slatted windows listening to the conductor’s foot-pedal brass bell',
    visited: false,
  },
  {
    id: 'tiretta-bazaar-breakfast-walk',
    title: 'Dawn Chinese Breakfast Walk at Tiretta Bazaar',
    category: 'Trail',
    location: 'Tiretta Bazaar, Central Kolkata',
    imageUrl: 'https://mapapi.sahapedia.org/assets/images/202109291447459Fig_5.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Arrive at 6:15 AM sharp for steaming pork and chicken baozi, fish ball soup, and sweet sesame balls',
    visited: false,
  },
  {
    id: 'kolkata-street-food-crawl',
    title: 'The Ultimate Street Food & Adda Trail',
    category: 'Trail',
    location: 'Park Street & Vivekananda Park',
    imageUrl: '/images/trails/kolkata-street-food.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Must sample crisp puchka with fresh Gandharaj lime juice, followed by egg-mutton roll at Kusum',
    visited: true,
  },
  {
    id: 'ganges-sunset-ferry',
    title: 'Ganges Sunset Wooden Ferry Cruise to Belur Math',
    category: 'Trail',
    location: 'Fairlie Place / Babughat',
    imageUrl: '/images/trails/hooghly-river-ferry.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Breeze across the Holy Hooghly at twilight as evening temple conch shells sound across both banks',
    visited: false,
  },

  // --- FOODS & CULINARY STOPS ---
  {
    id: 'kathi-roll-nizam',
    title: 'The Original Kathi Roll at Nizam’s & Kusum',
    category: 'Food',
    location: 'New Market & Park Street',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Kolkata_Rolls.jpg/500px-Kolkata_Rolls.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Taste the 1932 Kolkata original: iron-skewered tender mutton kebabs rolled inside hot layered egg paratha',
    visited: false,
  },
  {
    id: 'fish-kabiraji-mitra-cafe',
    title: 'Diamond Fish Kabiraji Cutlet at Mitra Cafe',
    category: 'Food',
    location: 'Sovabazar, North Kolkata',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG/500px-Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG',
    addedAt: 'Oct 15, 2026',
    notes: 'Delicate spun golden egg-mesh crust wrapping fresh marinated Hooghly Bhetki fish with fiery Kasundi',
    visited: false,
  },
  {
    id: 'kolkata-biryani-arsalan',
    title: 'Awadhi-Calcutta Mutton Biryani with Aloo & Egg',
    category: 'Food',
    location: 'Arsalan & Shiraz, Park Circus',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolkata_mutton_biryani.jpg/500px-Kolkata_mutton_biryani.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Slow-cooked dum biryani with long grain basmati, kewra water, saffron, tender meat, and the melt-in-mouth golden potato',
    visited: false,
  },
  {
    id: 'park-street-flurys-tearoom',
    title: 'Park Street Tea Rooms & Rum Balls (Flurys)',
    category: 'Food',
    location: 'Park Street Boulevard (Est. 1927)',
    imageUrl: 'https://ishitaunblogged.com/wp-content/uploads/2014/08/20140801_153531-copy.jpg?w=674',
    addedAt: 'Oct 15, 2026',
    notes: 'English breakfast platters, dark rum balls, and Darjeeling high tea served in 1920s vintage European porcelain',
    visited: false,
  },
  {
    id: 'paramount-daab-sarbat',
    title: 'Paramount’s Legendary Cold Daab Sarbat',
    category: 'Food',
    location: 'College Square (Est. 1918)',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Daab_Sharbat_-_Tender_Coconut_Drink.JPG/500px-Daab_Sharbat_-_Tender_Coconut_Drink.JPG',
    addedAt: 'Oct 15, 2026',
    notes: 'Sweet tender green coconut water, scraped coconut malai, and chilled fragrant secret syrup',
    visited: false,
  },
  {
    id: 'mishti-doi-balaram-mullick',
    title: 'Traditional Mishti Doi & Baked Rosogolla in Clay',
    category: 'Food',
    location: 'Balaram Mullick & Radharaman Mullick, Bhowanipore',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Mishti_Doi.jpg/500px-Mishti_Doi.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Slow-caramelised sweet curd set in porous earthen pots, and warm baked Nolen Gur rosogolla',
    visited: false,
  },
  {
    id: 'chitto-da-stew-dacres-lane',
    title: 'Chitto Da’s Chicken Stew & Butter Toast',
    category: 'Food',
    location: 'Dacres Lane (James Hickey Sarani)',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Chittobaburdokan.jpg/500px-Chittobaburdokan.jpg',
    addedAt: 'Oct 15, 2026',
    notes: 'Colonial corridor comfort food: peppered chicken stew and thick crisp butter toast served to Secretariat clerks',
    visited: false,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'all-destinations'>('home');
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<SuggestedTrail | null>(null);
  const [selectedStory, setSelectedStory] = useState<GuideStory | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Neighborhood | null>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);

  // Personal Pocket Diary state with persistent localStorage
  const [diaryItems, setDiaryItems] = useState<DiaryItem[]>(() => {
    try {
      const saved = localStorage.getItem(DIARY_STORAGE_KEY);
      if (saved) {
        const parsed: DiaryItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read error
    }
    return DEFAULT_CURATED_DIARY_ITEMS;
  });

  // Sync diary items to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(diaryItems));
    } catch {
      // Ignore storage write error
    }
  }, [diaryItems]);

  const handleToggleBookmark = (item: {
    id: string;
    title: string;
    category: 'Landmark' | 'Trail' | 'Food' | 'Story' | 'Neighborhood';
    location: string;
    imageUrl: string;
  }) => {
    setDiaryItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        const newItem: DiaryItem = {
          id: item.id,
          title: item.title,
          category: item.category,
          location: item.location,
          imageUrl: item.imageUrl,
          addedAt: 'Just now',
          visited: false,
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleToggleVisited = (id: string) => {
    setDiaryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, visited: !i.visited } : i))
    );
  };

  const handleRemoveDiaryItem = (id: string) => {
    setDiaryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateDiaryNotes = (id: string, notes: string) => {
    setDiaryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, notes } : i))
    );
  };

  const handleClearAllDiary = () => {
    setDiaryItems([]);
  };

  const handleLoadCuratedSpots = () => {
    setDiaryItems(DEFAULT_CURATED_DIARY_ITEMS);
  };

  // Filtered destinations based on search query
  const filteredDestinations = travelData.destinations.filter((dest) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.tagline.toLowerCase().includes(q) ||
      dest.category.toLowerCase().includes(q) ||
      dest.region.toLowerCase().includes(q) ||
      dest.description.toLowerCase().includes(q)
    );
  });

  const handleOpenAllDestinations = () => {
    setCurrentPage('all-destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll spy to dynamically sync active navbar tab on scroll
  useEffect(() => {
    if (currentPage !== 'home') return;

    const sectionIds = [
      'home',
      'neighborhoods',
      'destinations',
      'trails',
      'culture',
      'festivals',
      'gallery',
      'transit',
    ];

    const handleScroll = () => {
      if (window.scrollY < 200) {
        setActiveTab('home');
        return;
      }

      const scrollPosition = window.scrollY + 250;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTab(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      if (currentPage !== 'home') {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else if (tab === 'destinations') {
      if (currentPage === 'all-destinations') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById('destinations');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (currentPage !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById(tab);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        const el = document.getElementById(tab);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExploreDestinations = () => {
    if (currentPage === 'all-destinations') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('destinations');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExploreTrails = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('trails');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById('trails');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExploreFoodTrail = () => {
    const foodTrail = travelData.suggestedTrails.find((t) => t.id === 'kolkata-street-food-crawl');
    if (foodTrail) {
      setSelectedTrail(foodTrail);
    } else {
      handleExploreTrails();
    }
  };

  const handleExploreDistrictLandmarks = (districtKeyword: string) => {
    setSearchQuery(districtKeyword);
    const el = document.getElementById('destinations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBDD] text-[#351E1A] selection:bg-[#C6532B] selection:text-[#FFF8EF] relative">
      {/* Subtle Parchment Paper Grain Overlay */}
      <div className="parchment-grain-overlay" aria-hidden="true" />

      {/* Floating Centered Curved Capsule Navigation */}
      <TravelNavbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDiary={() => setIsDiaryOpen(true)}
        onOpenItineraryBuilder={() => setIsItineraryOpen(true)}
        diaryCount={diaryItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {currentPage === 'all-destinations' ? (
          /* Full Destination Gallery Page */
          <AllDestinationsPage
            destinations={travelData.destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBackToHome={handleBackToHome}
          />
        ) : (
          /* Home Overview Layout */
          <>
            {/* Search Results Notification Banner if querying */}
            {searchQuery.trim() && (
              <div className="mt-24 mb-4 p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-sans text-[#351E1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-slide-in-right">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C6532B]" />
                  <span>
                    Searching archive for &ldquo;<strong>{searchQuery}</strong>&rdquo; &mdash; {filteredDestinations.length} landmark{filteredDestinations.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleOpenAllDestinations}
                    className="text-xs font-bold text-[#C6532B] hover:text-[#B04520] underline cursor-pointer"
                  >
                    View in All Landmarks Archive &rarr;
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-[#351E1A]/60 hover:text-[#351E1A] cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* 1. Signature Hero Banner Section */}
            <HeroBanner
              onExploreDestinations={handleExploreDestinations}
              onExploreTrails={handleExploreTrails}
              onOpenItineraryBuilder={() => setIsItineraryOpen(true)}
            />

            {/* 2. Introductory Editorial Section: The Art of Slow Travel in Calcutta */}
            <WhyChooseUs />

            {/* 3. Chapter I: Cultural Districts & Living Quarters */}
            <NeighborhoodsSection
              neighborhoods={travelData.neighborhoods}
              onSelectDistrict={(district) => setSelectedDistrict(district)}
              onExploreDistrictLandmarks={handleExploreDistrictLandmarks}
            />

            {/* 4. Chapter II: Curated Architectural Landmarks */}
            <DestinationsSection
              destinations={filteredDestinations}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onViewAll={handleOpenAllDestinations}
            />

            {/* 5. Chapter III: Curated Walking & Transit Trails */}
            <SuggestedTrailsSection
              trails={travelData.suggestedTrails}
              onSelectTrail={(trail) => setSelectedTrail(trail)}
              onBrowseAll={handleExploreTrails}
            />

            {/* 6. Chapter IV: Visually Distinct Terracotta Food & Local Culture */}
            <FoodAndCultureSection onExploreFoodTrail={handleExploreFoodTrail} />

            {/* 7. Chapter V: Cultural Almanac & Festivals Calendar */}
            <SeasonalCalendarSection events={travelData.seasonalEvents} />

            {/* 8. Chapter VI: Analogue Film Photographic Archive */}
            <PhotoGallerySection photos={travelData.photoGallery} />

            {/* 9. Chapter VII: Literary Essays & Lore Stories */}
            <TravelStoriesSection
              stories={travelData.guideStories}
              onSelectStory={(story) => setSelectedStory(story)}
            />

            {/* 10. Chapter VIII: Public Transit Codex (Trams, Ferries, Metro, Taxis) */}
            <TransitCodexSection transitModes={travelData.transitModes} />

            {/* 11. Practical 1-2-3 Navigation & Transit Steps */}
            <HowToExploreSection onExploreTrails={handleExploreTrails} />

            {/* 12. Epilogue: Poetic Closing Monologue with Riverside Photography */}
            <ClosingMonologueSection onExploreDestinations={handleExploreDestinations} />

            {/* 13. Things to Do in Kolkata (Auto-sliding mini cards) */}
            <ThingsToDoSection onExploreLandmarks={handleExploreDestinations} />
          </>
        )}
      </main>

      {/* Kolkata Travel & Heritage Footer */}
      <TravelFooter onSelectTab={handleSelectTab} />


      {/* Personal Pocket Diary Modal */}
      <PocketDiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diaryItems={diaryItems}
        onToggleVisited={handleToggleVisited}
        onRemoveItem={handleRemoveDiaryItem}
        onUpdateNotes={handleUpdateDiaryNotes}
        onClearAll={handleClearAllDiary}
        onAddCuratedItems={handleLoadCuratedSpots}
      />

      {/* Neighborhood District Detail Modal */}
      <DistrictDetailModal
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
        onBookmarkDistrict={(district) =>
          handleToggleBookmark({
            id: district.id,
            title: district.name,
            category: 'Neighborhood',
            location: district.name,
            imageUrl: district.coverImage,
          })
        }
        isBookmarked={diaryItems.some((i) => i.id === selectedDistrict?.id)}
      />

      {/* Landmark Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onBookmark={(dest) =>
          handleToggleBookmark({
            id: dest.id,
            title: dest.name,
            category: 'Landmark',
            location: dest.region,
            imageUrl: dest.imageUrl,
          })
        }
        isBookmarked={diaryItems.some((i) => i.id === selectedDestination?.id)}
      />

      {/* Walking Trail Detail Modal */}
      <TrailDetailModal
        trail={selectedTrail}
        onClose={() => setSelectedTrail(null)}
        onBookmark={(trail) =>
          handleToggleBookmark({
            id: trail.id,
            title: trail.title,
            category: 'Trail',
            location: trail.keyStops[0] || 'Kolkata',
            imageUrl: trail.imageUrl,
          })
        }
        isBookmarked={diaryItems.some((i) => i.id === selectedTrail?.id)}
      />

      {/* Literary Story Detail Modal */}
      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Interactive Day-Trip / Itinerary Builder Modal */}
      <ItineraryBuilderModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
      />

      {/* Ambient Calcutta Audio Vignettes Soundscape Player */}
      <CalcuttaSoundscape />
    </div>
  );
}
