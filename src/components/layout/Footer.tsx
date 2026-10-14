import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { PageRoute } from '../../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 mt-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Upper strip */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <div className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {siteConfig.profile.name}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {siteConfig.profile.headline}
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>{siteConfig.profile.location}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{siteConfig.profile.timezone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-14">
            {/* Quick Navigation */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Index
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    About &amp; Resume
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('projects')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    Work &amp; Case Studies
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('gallery')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    Curated Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('github')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    GitHub Explorer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('blog')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    Writings &amp; Essays
                  </button>
                </li>
              </ul>
            </div>

            {/* External Links */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Connect
              </div>
              <ul className="space-y-2 text-xs">
                {siteConfig.socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                    >
                      <span>{social.platform}</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={onOpenContact}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                  >
                    Direct Email
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lower hairline & copyright */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.profile.name}. Designed with Once UI principles.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-neutral-400">
              Zero-pill discipline &middot; Typographic craft
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
