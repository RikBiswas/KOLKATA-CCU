import React from 'react';
import { Compass, MapPin, Heart } from 'lucide-react';

interface TravelFooterProps {
  onSelectTab: (tab: string) => void;
}

export const TravelFooter: React.FC<TravelFooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#f4f7f9] dark:bg-[#0c1017] transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b3a4b] to-[#2d6a4f] text-white flex items-center justify-center font-black">
                <Compass className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                WANDER<span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold ml-1">.CCU</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              An independent, non-commercial travel and heritage guide dedicated to Kolkata. 
              Helping visitors and residents discover colonial architecture, Hooghly river ferry crossings, 
              historic tramways, and authentic street food.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Iconic Sights
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Victoria Memorial Hall
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Howrah Cantilever Bridge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Kumartuli Potter Studios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  College Street &amp; Coffee House
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Dakshineswar Kali Temple
                </button>
              </li>
            </ul>
          </div>

          {/* Self-guided walking routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Self-Guided Trails
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Colonial Dalhousie Walk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Hooghly Public Ferry Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Street Gastronomy &amp; Adda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  North Kolkata Rajbari &amp; Trams
                </button>
              </li>
            </ul>
          </div>

          {/* Public Transit & Visitor Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
              Visitor Information
            </h4>
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-600 dark:text-neutral-300">
                <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">
                  Tourist Police Helpline
                </span>
                Dial 100 / (033) 2214-5000 for 24/7 visitor assistance across the city.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} WANDER.CCU &mdash; Independent Kolkata Heritage &amp; Travel Guidance.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for explorers of Kolkata culture, architecture &amp; street food.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
