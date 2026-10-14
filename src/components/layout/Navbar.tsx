import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../../types';
import { siteConfig } from '../../config/site.config';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenContact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageRoute; label: string; enabled: boolean }[] = [
    { id: 'home' as const, label: 'Home', enabled: siteConfig.enabledPages.home },
    { id: 'about' as const, label: 'About', enabled: siteConfig.enabledPages.about },
    { id: 'projects' as const, label: 'Work', enabled: siteConfig.enabledPages.projects },
    { id: 'gallery' as const, label: 'Gallery', enabled: siteConfig.enabledPages.gallery },
    { id: 'github' as const, label: 'GitHub', enabled: siteConfig.enabledPages.github },
    { id: 'blog' as const, label: 'Writing', enabled: siteConfig.enabledPages.blog },
  ].filter((item) => item.enabled);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fafafa]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark, single text element */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-md"
        >
          {siteConfig.profile.name}
        </button>

        {/* Zone 2: Single-line text navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                  isActive
                    ? 'text-neutral-950 dark:text-neutral-50 font-semibold'
                    : 'hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-neutral-950 dark:bg-neutral-50"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary action + Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <button
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-[#fafafa] dark:bg-[#0a0a0a] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
