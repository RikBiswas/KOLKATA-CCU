import React from 'react';
import { Compass, MapPin, Heart, Phone, Mail, ArrowUp } from 'lucide-react';

interface TravelFooterProps {
  onSelectTab: (tab: string) => void;
}

export const TravelFooter: React.FC<TravelFooterProps> = ({ onSelectTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#351E1A] text-[#F7EBDD] border-t-4 border-[#C6532B] pt-8 sm:pt-12 pb-8 mt-8 sm:mt-12">
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-[#E8D5C2]/15">
          {/* Brand Info & Colophon */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C6532B] text-white flex items-center justify-center font-bold">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF8EF]" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight uppercase">
                WANDER<span className="text-[#C6532B] font-sans text-xs font-black ml-1">.CCU</span>
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#F7EBDD]/75 max-w-sm leading-relaxed">
              An independent, non-commercial cultural travel journal dedicated to the memory, 
              architecture, and living soul of Kolkata. Built to celebrate vintage trams, 
              the sacred Hooghly, literary adda, and historic street gastronomy.
            </p>

            <div className="pt-1">
              <span className="font-bengali text-xs sm:text-sm text-[#D9A38E] font-medium block">
                &ldquo;কলকাতা শুধু একটি শহর নয়, এটি একটি অনুভূতি।&rdquo;
              </span>
              <span className="text-[10px] sm:text-[11px] font-sans text-[#F7EBDD]/50 italic">
                (Kolkata is not merely a city; it is a sentiment.)
              </span>
            </div>
          </div>

          {/* Quick Links Container: 2-column on mobile */}
          <div className="grid grid-cols-2 sm:contents gap-4">
            {/* Quick Links: Iconic Landmarks */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-2.5 sm:mb-4">
                Historic Sights
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs font-sans text-[#F7EBDD]/70">
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Victoria Memorial
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Howrah Bridge
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Kumartuli Colony
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    College Street
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Dakshineswar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('destinations')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Princep Ghat
                  </button>
                </li>
              </ul>
            </div>

            {/* Self-guided walking routes */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-2.5 sm:mb-4">
                Walking Trails
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs font-sans text-[#F7EBDD]/70">
                <li>
                  <button
                    onClick={() => onSelectTab('trails')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Colonial Dalhousie
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('trails')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Hooghly Public Ferry
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('trails')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Street Food &amp; Adda
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('trails')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    North Rajbari Walk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('trails')}
                    className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                  >
                    Flower Bazaar Dawn
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Visitor Information & Tourist Police */}
          <div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
            <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-2 sm:mb-4">
              Visitor Helpline
            </h4>
            
            <div className="p-3 sm:p-4 rounded-xl bg-[#FFF8EF]/5 border border-[#FFF8EF]/10 space-y-1.5 text-xs font-sans">
              <span className="font-bold text-[#FFF8EF] block">
                Kolkata Tourist Police
              </span>
              <p className="text-[#F7EBDD]/70 text-[11px] sm:text-xs">
                24/7 dedicated traveler assistance and safety advisory across heritage spots.
              </p>
              <div className="pt-0.5 flex items-center gap-1.5 text-[#C5A25A] font-mono text-[10px] sm:text-[11px]">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Dial 100 / (033) 2214-5000</span>
              </div>
            </div>

            <div className="pt-0.5 text-[10px] sm:text-[11px] font-sans text-[#F7EBDD]/50 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
              <span>Calcutta, West Bengal, India &bull; 700001</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Colophon, and Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#F7EBDD]/60">
          <div>
            &copy; {new Date().getFullYear()} WANDER.CCU &mdash; Independent Non-Commercial Calcutta Travel Journal.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              Crafted with <Heart className="w-3 h-3 text-[#C6532B] fill-[#C6532B] inline" /> for slow travelers.
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#FFF8EF]/10 hover:bg-[#FFF8EF]/20 text-[#FFF8EF] transition-colors cursor-pointer"
              aria-label="Back to top"
              title="Return to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
