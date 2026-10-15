import React, { useState } from 'react';
import { Search, Compass, Map, Menu, X, BookOpen } from 'lucide-react';

interface TravelNavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TravelNavbar: React.FC<TravelNavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'trails', label: 'Walking Trails' },
    { id: 'how-to-explore', label: 'How to Explore' },
    { id: 'blog', label: 'Guide & Lore' },
    { id: 'reviews', label: 'Traveler Tips' },
  ];

  const handleLinkClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#12151c]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="group flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b3a4b] to-[#2d6a4f] text-white flex items-center justify-center font-extrabold text-xl shadow-sm tracking-tighter">
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white uppercase leading-none font-sans">
                WANDER<span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest ml-1">.CCU</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                Kolkata Travel &amp; Heritage Guide
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all text-[13px] ${activeTab === link.id
                    ? 'font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 shadow-xs'
                    : 'hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar + Explore Trails CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center relative w-56 md:w-64 lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Victoria, Ghats, Food..."
              className="w-full text-xs bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-700/80 rounded-full pl-9 pr-4 py-2 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={() => handleLinkClick('trails')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#1a2e3b] dark:bg-emerald-600 hover:bg-[#12222d] dark:hover:bg-emerald-500 rounded-full transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Map className="w-3.5 h-3.5 text-emerald-300" />
            <span>Explore Trails</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search destinations, food, monuments..."
              className="w-full text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full pl-9 pr-4 py-2.5 text-neutral-800 dark:text-neutral-200"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === link.id
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('trails')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-[#1a2e3b] dark:bg-emerald-600 rounded-full flex items-center justify-center gap-2"
            >
              <Map className="w-4 h-4 text-emerald-300" />
              <span>Browse Walking Itineraries</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
