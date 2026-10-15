import React, { useState } from 'react';
import { travelData } from './config/travel.config';
import { Destination, SuggestedTrail, GuideStory } from './types/travel';
import { TravelNavbar } from './components/travel/TravelNavbar';
import { HeroBanner } from './components/travel/HeroBanner';
import { WhyChooseUs } from './components/travel/WhyChooseUs';
import { DestinationsSection } from './components/travel/DestinationsSection';
import { SuggestedTrailsSection } from './components/travel/SuggestedTrailsSection';
import { HowToExploreSection } from './components/travel/HowToExploreSection';
import { TravelReviewsSection } from './components/travel/TravelReviewsSection';
import { TravelStoriesSection } from './components/travel/TravelStoriesSection';
import { TravelFooter } from './components/travel/TravelFooter';
import { DestinationDetailModal } from './components/travel/DestinationDetailModal';
import { TrailDetailModal } from './components/travel/TrailDetailModal';
import { StoryDetailModal } from './components/travel/StoryDetailModal';
import { AllDestinationsPage } from './components/travel/AllDestinationsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'all-destinations'>('home');
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedTrail, setSelectedTrail] = useState<SuggestedTrail | null>(null);
  const [selectedStory, setSelectedStory] = useState<GuideStory | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#0b0e14] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Travel Navigation Bar */}
      <TravelNavbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
            {/* Search Results Alert if querying */}
            {searchQuery.trim() && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>
                  Showing guidance results for &ldquo;<strong>{searchQuery}</strong>&rdquo; ({filteredDestinations.length} landmark{filteredDestinations.length !== 1 ? 's' : ''} found)
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenAllDestinations}
                    className="text-xs font-bold underline hover:text-emerald-800"
                  >
                    View in All Destinations &rarr;
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Hero Banner Section */}
            <HeroBanner
              onExploreDestinations={handleExploreDestinations}
              onExploreTrails={handleExploreTrails}
            />

            {/* Why Independent Explorers Choose WANDER.ccu */}
            <WhyChooseUs />

            {/* Top Destinations Section */}
            <DestinationsSection
              destinations={filteredDestinations}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              onViewAll={handleOpenAllDestinations}
            />

            {/* Curated Walking & Transit Trails Section */}
            <SuggestedTrailsSection
              trails={travelData.suggestedTrails}
              onSelectTrail={(trail) => setSelectedTrail(trail)}
              onBrowseAll={handleExploreTrails}
            />

            {/* How to Explore Kolkata 1-2-3 Guide Section */}
            <HowToExploreSection onExploreTrails={handleExploreTrails} />

            {/* Travel Insights, Culture & Food Stories */}
            <TravelStoriesSection
              stories={travelData.guideStories}
              onSelectStory={(story) => setSelectedStory(story)}
            />

            {/* Community Explorer Notes and Tips */}
            <TravelReviewsSection />
          </>
        )}
      </main>

      {/* Kolkata Travel & Heritage Footer */}
      <TravelFooter onSelectTab={handleSelectTab} />

      {/* Visitor Detail & Exploration Modals */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />

      <TrailDetailModal
        trail={selectedTrail}
        onClose={() => setSelectedTrail(null)}
      />

      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
}
