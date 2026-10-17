import React, { useState, useEffect } from 'react';
import { Search, Compass, Map, Menu, X, BookOpen, Sparkles, Bookmark, Calendar } from 'lucide-react';

interface TravelNavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDiary?: () => void;
  onOpenItineraryBuilder?: () => void;
  diaryCount?: number;
}

export const TravelNavbar: React.FC<TravelNavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenDiary,
  onOpenItineraryBuilder,
  diaryCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll direction detection (hide smoothly on scroll down, reveal on scroll up)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 30);

          // If near the very top of the page, always keep navbar visible
          if (currentScrollY < 60) {
            setIsVisible(true);
          } else {
            const diff = currentScrollY - lastScrollY;
            // Ignore tiny jitters
            if (Math.abs(diff) > 8) {
              if (diff > 0 && currentScrollY > 100) {
                // Scrolling down -> hide navbar
                setIsVisible(false);
                setMobileMenuOpen(false);
              } else if (diff < 0) {
                // Scrolling up -> reveal navbar
                setIsVisible(true);
              }
            }
          }

          lastScrollY = currentScrollY;
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
    { id: 'trails', label: 'Trails' },
    { id: 'culture', label: 'Gastronomy' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'gallery', label: 'Photo Archive' },
    { id: 'transit', label: 'Transit Codex' },
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
    <header 
      className={`fixed top-3 sm:top-5 inset-x-0 flex justify-center pointer-events-none px-3 sm:px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isModalOpen ? 'z-10 opacity-40 pointer-events-none' : 'z-40'
      } ${
        !isVisible && !mobileMenuOpen
          ? '-translate-y-28 opacity-0 scale-95 pointer-events-none'
          : 'translate-y-0 opacity-100 scale-100'
      }`}
    >
      {/* Floating Centered Capsule */}
      <div
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-full border border-[#E8D5C2] shadow-[0_8px_30px_rgba(53,30,26,0.08)] ${isScrolled
            ? 'bg-[#FFF8EF]/95 backdrop-blur-md py-2 px-3.5 sm:px-6 shadow-[0_12px_36px_rgba(53,30,26,0.12)]'
            : 'bg-[#F7EBDD]/90 backdrop-blur-md py-2.5 sm:py-3 px-3.5 sm:px-6'
          }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Wordmark & Descriptor */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="group flex items-center gap-2.5 focus:outline-none shrink-0"
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
              <span className="text-[10px] font-sans font-medium text-[#351E1A]/60 tracking-wider hidden sm:inline-block">
                The Calcutta Journal &bull; <span className="font-bengali text-[#C6532B] font-semibold">স্মৃতির শহর</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 font-sans text-[11px] font-medium text-[#351E1A]/80">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${isActive
                      ? 'text-[#FFF8EF] bg-[#351E1A] font-semibold shadow-xs'
                      : 'text-[#351E1A]/80 hover:text-[#351E1A] hover:bg-[#E8D5C2]/50'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C6532B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search, Diary & CTA Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Input Bar or Toggle */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center relative animate-slide-in-right">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Victoria, Tram, Puchka..."
                    autoFocus
                    className="w-36 sm:w-48 text-xs bg-[#FFF8EF] border border-[#E8D5C2] rounded-full pl-8 pr-7 py-1.5 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C6532B] focus:border-[#C6532B]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#351E1A]/40 absolute left-2.5 pointer-events-none" />
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
                  className="p-1.5 sm:p-2 rounded-full text-[#351E1A]/70 hover:text-[#351E1A] hover:bg-[#E8D5C2]/40 transition-colors cursor-pointer"
                  title="Search landmarks, food, trails..."
                  aria-label="Open search input"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Itinerary Builder Button */}
            {onOpenItineraryBuilder && (
              <button
                onClick={onOpenItineraryBuilder}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8EF] border border-[#C5A25A] hover:bg-[#F7EBDD] text-[#351E1A] text-xs font-sans font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                title="Build Custom Day-Trip Itinerary"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C6532B]" />
                <span>Plan Day</span>
              </button>
            )}

            {/* Pocket Diary Button */}
            {onOpenDiary && (
              <button
                onClick={onOpenDiary}
                className="relative p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#F7EBDD] border border-[#E8D5C2] hover:bg-[#E8D5C2] text-[#351E1A] text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open My Calcutta Diary"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C6532B]" />
                <span className="hidden sm:inline">Diary</span>
                {diaryCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#C6532B] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {diaryCount}
                  </span>
                )}
              </button>
            )}

            {/* Primary Terracotta CTA */}
            <button
              onClick={() => handleLinkClick('destinations')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-sans font-bold tracking-wide text-white bg-[#C6532B] hover:bg-[#B04520] active:scale-95 rounded-full shadow-sm transition-all duration-200 cursor-pointer shrink-0"
            >
              <span>Explore</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-full text-[#351E1A] hover:bg-[#E8D5C2]/50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-[#E8D5C2] space-y-2.5 pb-2">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search landmarks, trails, food..."
                className="w-full text-xs bg-[#FFF8EF] border border-[#E8D5C2] rounded-full pl-8 pr-4 py-2 text-[#351E1A] placeholder-[#351E1A]/40 focus:outline-none focus:ring-1 focus:ring-[#C6532B]"
              />
              <Search className="w-3.5 h-3.5 text-[#351E1A]/40 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2 text-xs text-[#351E1A]/60"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${activeTab === link.id
                      ? 'bg-[#351E1A] text-[#FFF8EF] font-bold'
                      : 'text-[#351E1A]/80 hover:bg-[#E8D5C2]/40'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#351E1A]/60 px-1">
              <span>Non-Commercial Calcutta Travel Journal</span>
              <span className="font-bengali text-[#C6532B]">স্মৃতির শহর</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
