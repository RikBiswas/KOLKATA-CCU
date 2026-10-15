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
import { TravelReviewsSection } from './components/travel/TravelReviewsSection';
import { TravelFooter } from './components/travel/TravelFooter';
import { DestinationDetailModal } from './components/travel/DestinationDetailModal';
import { TrailDetailModal } from './components/travel/TrailDetailModal';
import { StoryDetailModal } from './components/travel/StoryDetailModal';
import { AllDestinationsPage } from './components/travel/AllDestinationsPage';
import { PocketDiaryModal } from './components/travel/PocketDiaryModal';
import { PocketDiaryButton } from './components/travel/PocketDiaryButton';

const DIARY_STORAGE_KEY = 'wander_ccu_diary_v1';

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

  // Personal Pocket Diary state with persistent localStorage
  const [diaryItems, setDiaryItems] = useState<DiaryItem[]>(() => {
    try {
      const saved = localStorage.getItem(DIARY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage read error
    }
    return [
      {
        id: 'victoria-memorial',
        title: 'Victoria Memorial Hall',
        category: 'Landmark',
        location: 'Central Kolkata',
        imageUrl: '/images/destinations/victoria-memorial.jpg',
        addedAt: 'Oct 15, 2026',
        notes: 'Watch sunset reflection by South Lake at 5 PM',
        visited: false,
      },
      {
        id: 'kolkata-street-food-crawl',
        title: 'The Ultimate Street Food & Adda Trail',
        category: 'Trail',
        location: 'Park Street & Vivekananda Park',
        imageUrl: '/images/trails/kolkata-street-food.jpg',
        addedAt: 'Oct 15, 2026',
        notes: 'Must sample puchka with Gandharaj lemon juice',
        visited: true,
      },
    ];
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

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'destinations') {
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
    <div className="min-h-screen flex flex-col bg-[#F7EBDD] text-[#351E1A] selection:bg-[#C6532B] selection:text-[#FFF8EF]">
      {/* Floating Centered Curved Capsule Navigation */}
      <TravelNavbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDiary={() => setIsDiaryOpen(true)}
        diaryCount={diaryItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* 13. Explorer Field Notes & Traveler Tips */}
            <TravelReviewsSection />
          </>
        )}
      </main>

      {/* Kolkata Travel & Heritage Footer */}
      <TravelFooter onSelectTab={handleSelectTab} />

      {/* Floating Pocket Diary Widget Button */}
      <PocketDiaryButton
        count={diaryItems.length}
        onClick={() => setIsDiaryOpen(true)}
      />

      {/* Personal Pocket Diary Modal */}
      <PocketDiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diaryItems={diaryItems}
        onToggleVisited={handleToggleVisited}
        onRemoveItem={handleRemoveDiaryItem}
        onUpdateNotes={handleUpdateDiaryNotes}
        onClearAll={handleClearAllDiary}
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
    </div>
  );
}
