import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Map, Menu, X, BookOpen, Sparkles, Bookmark, Calendar, Star } from 'lucide-react';

interface TravelNavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDiary?: () => void;
  onOpenItineraryBuilder?: () => void;
  diaryCount?: number;
  onOpenReviewModal?: () => void;
}

export const TravelNavbar: React.FC<TravelNavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenDiary,
  onOpenItineraryBuilder,
  diaryCount = 0,
  onOpenReviewModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search on click outside if search query is empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showSearchInput &&
        !searchQuery &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchInput, searchQuery]);

  // Keep track of scroll for background styling (without hiding navbar)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect when any card or modal is open in the application
  useEffect(() => {
    const updateModalState = () => {
      const hasOverflowHidden = document.body.style.overflow === 'hidden';
      const hasDialog = Boolean(document.querySelector('[role="dialog"], [aria-modal="true"]'));
      setIsModalOpen(hasOverflowHidden || hasDialog);
    };

    updateModalState();

    const observer = new MutationObserver(() => {
      updateModalState();
    });

    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'neighborhoods', label: 'Districts' },
    { id: 'destinations', label: 'Landmarks' },
    { id: 'kolkata-map-atlas', label: 'Atlas Map' },
    { id: 'trails', label: 'Trails' },
    { id: 'culture', label: 'Gastronomy' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'gallery', label: 'Photo Archive' },
    { id: 'transit', label: 'Transit Codex' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleLinkClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    setShowSearchInput(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Dimming Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#351E1A]/40 backdrop-blur-xs z-30 transition-opacity xl:hidden pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header 
        className={`fixed top-3 sm:top-4 xl:top-5 inset-x-0 flex justify-center pointer-events-none px-3 sm:px-4 xl:px-5 2xl:px-6 transition-all duration-300 ease-out ${
          isModalOpen ? 'z-10 opacity-40 pointer-events-none' : 'z-40'
        } translate-y-0 opacity-100 scale-100`}
      >
        {/* Floating Centered Capsule / Card */}
        <div
          className={`pointer-events-auto w-full max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1440px] transition-all duration-300 border border-[#E8D5C2] ${
            mobileMenuOpen
              ? 'rounded-2xl sm:rounded-3xl shadow-[0_16px_40px_rgba(53,30,26,0.18)]'
              : 'rounded-full shadow-[0_8px_30px_rgba(53,30,26,0.08)]'
          } ${
            isScrolled
              ? 'bg-[#FFF8EF]/95 backdrop-blur-md py-2 px-3 sm:px-4 xl:px-4 2xl:px-5 shadow-[0_12px_36px_rgba(53,30,26,0.12)]'
              : 'bg-[#F7EBDD]/95 backdrop-blur-md py-2 sm:py-2.5 xl:py-2.5 2xl:py-3 px-3 sm:px-4 xl:px-4 2xl:px-5'
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 xl:gap-3 2xl:gap-4">
            {/* Brand Wordmark & Descriptor */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('home');
              }}
              className="group flex items-center gap-2 sm:gap-2.5 focus:outline-none shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#351E1A] text-[#FFF8EF] flex items-center justify-center shadow-xs group-hover:bg-[#C6532B] transition-colors duration-300">
                <Compass className="w-4 h-4 text-[#F7EBDD] group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#351E1A] uppercase leading-none">
                    WANDER<span className="text-[#C6532B] font-sans text-xs font-black tracking-widest ml-0.5">.CCU</span>
                  </span>
                </div>
                <span className="text-[10px] font-sans font-medium text-[#351E1A]/75 tracking-wider hidden sm:inline-block">
                  <span className="xl:hidden 2xl:inline">The Calcutta Journal &bull; </span>
                  <span className="font-bengali text-[#C6532B] font-semibold">স্মৃতির শহর</span>
                </span>
              </div>
            </a>

            {/* Desktop Nav Links (hidden when search is active to keep review button perfectly aligned inside capsule) */}
            <nav className={`${showSearchInput ? 'hidden' : 'hidden xl:flex'} items-center space-x-0.5 2xl:space-x-1 font-sans text-[11px] 2xl:text-xs font-medium shrink-0`}>
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    style={{
                      backgroundColor: isActive ? '#351E1A' : undefined,
                      color: isActive ? '#FFF8EF' : '#351E1A',
                    }}
                    className={`relative px-2 xl:px-1.5 2xl:px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#351E1A] !text-[#FFF8EF] font-bold shadow-xs'
                        : 'text-[#351E1A]/80 hover:text-[#351E1A] hover:bg-[#E8D5C2]/50'
                    }`}
                  >
                    <span
                      style={{ color: isActive ? '#FFF8EF' : undefined }}
                      className={`transition-colors truncate ${isActive ? '!text-[#FFF8EF] font-bold' : ''}`}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C6532B]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Search, Diary & CTA Buttons */}
            <div className={`flex items-center gap-1.5 sm:gap-2 xl:gap-2 2xl:gap-2.5 ${showSearchInput ? 'flex-1 justify-end min-w-0' : 'shrink-0'}`}>
              {/* Search Input Bar or Toggle */}
              <div
                ref={searchContainerRef}
                className={`relative flex items-center transition-all duration-300 ${
                  showSearchInput ? 'flex-1 max-w-xs sm:max-w-sm md:max-w-md min-w-0' : ''
                }`}
              >
                {showSearchInput ? (
                  <div className="flex items-center w-full relative animate-slide-in-right">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setShowSearchInput(false);
                        }
                      }}
                      placeholder="Search Victoria, Tram, Puchka..."
                      autoFocus
                      className="w-full text-xs bg-[#FFF8EF] border border-[#E8D5C2] rounded-full pl-8 pr-7 py-1.5 text-[#351E1A] placeholder-[#351E1A]/60 focus:outline-none focus:ring-1 focus:ring-[#C6532B] focus:border-[#C6532B] shadow-inner"
                    />
                    <Search className="w-3.5 h-3.5 text-[#351E1A]/60 absolute left-2.5 pointer-events-none" />
                    <button
                      onClick={() => {
                        if (searchQuery) onSearchChange('');
                        setShowSearchInput(false);
                      }}
                      className="absolute right-2.5 text-xs text-[#351E1A]/50 hover:text-[#351E1A] cursor-pointer"
                      aria-label="Close search"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="hidden sm:flex p-1.5 sm:p-2 rounded-full text-[#351E1A]/70 hover:text-[#351E1A] hover:bg-[#E8D5C2]/40 transition-colors cursor-pointer"
                    title="Search landmarks, food, trails..."
                    aria-label="Open search input"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Itinerary Builder Button (Desktop/Tablet) */}
              {onOpenItineraryBuilder && (
                <button
                  onClick={onOpenItineraryBuilder}
                  className={`${
                    showSearchInput ? 'hidden' : 'hidden md:flex'
                  } items-center gap-1.5 px-2.5 xl:px-2.5 2xl:px-3 py-1.5 rounded-full bg-[#FFF8EF] border border-[#C5A25A] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0`}
                  title="Build Custom Day-Trip Itinerary"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#C6532B]" />
                  <span>Plan Day</span>
                </button>
              )}

              {/* Pocket Diary Button (Desktop/Tablet, visible inside mobile menu on small screens) */}
              {onOpenDiary && (
                <button
                  onClick={onOpenDiary}
                  className="hidden sm:flex relative p-1.5 sm:px-2.5 xl:px-2.5 2xl:px-3 sm:py-1.5 rounded-full bg-[#F7EBDD] border border-[#E8D5C2] hover:bg-[#E8D5C2] text-[#351E1A] text-xs font-sans font-semibold items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  title="Open My Calcutta Diary"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                  <span className="hidden sm:inline">Diary</span>
                  {diaryCount > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full bg-[#C6532B] text-white text-[9px] font-mono font-bold flex items-center justify-center leading-none">
                      {diaryCount}
                    </span>
                  )}
                </button>
              )}

              {/* Review / Feedback CTA Button */}
              <button
                onClick={onOpenReviewModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 xl:px-3 2xl:px-3.5 py-1.5 text-xs font-sans font-bold tracking-wide text-white bg-[#C6532B] hover:bg-[#B04520] active:scale-95 rounded-full shadow-sm transition-all duration-200 cursor-pointer shrink-0 group"
                title="Leave a Review / Feedback"
                aria-label="Open review and feedback form"
              >
                <Star className="w-3.5 h-3.5 fill-current text-[#F7EBDD] group-hover:rotate-12 transition-transform" />
                <span>Review</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 rounded-full text-[#351E1A] hover:bg-[#E8D5C2]/50 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-[#E8D5C2] space-y-2.5 pb-2 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
              {/* Mobile Search Bar */}
              <div className="relative mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search landmarks, trails, food..."
                  aria-label="Search landmarks, trails, food"
                  className="w-full text-xs bg-[#FFF8EF] border border-[#E8D5C2] rounded-full pl-8 pr-8 py-2 text-[#351E1A] placeholder-[#351E1A]/60 focus:outline-none focus:ring-1 focus:ring-[#C6532B]"
                />
                <Search className="w-3.5 h-3.5 text-[#351E1A]/60 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-2 text-xs text-[#351E1A]/70 hover:text-[#351E1A]"
                    aria-label="Clear search query"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Symmetrical 2-Column Links Grid (10 items = 5 full rows) */}
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      style={{
                        backgroundColor: isActive ? '#351E1A' : undefined,
                        color: isActive ? '#FFF8EF' : '#351E1A',
                      }}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-sans font-medium transition-colors cursor-pointer min-h-[42px] flex items-center justify-between gap-1.5 ${
                        isActive
                          ? 'bg-[#351E1A] !text-[#FFF8EF] font-bold shadow-xs'
                          : 'text-[#351E1A]/85 hover:bg-[#E8D5C2]/45 hover:text-[#351E1A]'
                      }`}
                    >
                      <span
                        className="truncate"
                        style={{ color: isActive ? '#FFF8EF' : '#351E1A' }}
                      >
                        {link.label}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6532B] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Action Tools Quick Row */}
              <div className="pt-2 border-t border-[#E8D5C2]/70 grid grid-cols-2 gap-2">
                {onOpenItineraryBuilder && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenItineraryBuilder();
                    }}
                    className="px-3 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#C5A25A] text-[#351E1A] text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C6532B]" />
                    <span>Plan My Day</span>
                  </button>
                )}

                {onOpenDiary && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDiary();
                    }}
                    className="px-3 py-2.5 rounded-xl bg-[#F7EBDD] border border-[#E8D5C2] text-[#351E1A] text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                    <span>My Diary ({diaryCount})</span>
                  </button>
                )}
              </div>

              {/* Bottom Colophon */}
              <div className="pt-2 pb-0.5 flex items-center justify-between text-[11px] text-[#351E1A]/75 px-1 border-t border-[#E8D5C2]/50">
                <span className="font-sans font-medium">Calcutta Travel Journal</span>
                <span className="font-bengali text-[#C6532B] font-semibold">স্মৃতির শহর &bull; CCU</span>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

