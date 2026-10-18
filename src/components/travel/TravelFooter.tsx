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
    <footer className="bg-[#351E1A] text-[#F7EBDD] border-t-4 border-[#C6532B] pt-12 sm:pt-16 pb-10 mt-10 sm:mt-14">
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-[#E8D5C2]/15">
          {/* Brand Info & Colophon */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C6532B] text-white flex items-center justify-center font-bold">
                <Compass className="w-4 h-4 text-[#FFF8EF]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight uppercase">
                WANDER<span className="text-[#C6532B] font-sans text-xs font-black ml-1">.CCU</span>
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#F7EBDD]/75 max-w-sm leading-relaxed">
              An independent, non-commercial cultural travel journal dedicated to the memory, 
              architecture, and living soul of Kolkata. Built to celebrate vintage trams, 
              the sacred Hooghly, literary adda, and historic street gastronomy.
            </p>

            <div className="pt-2">
              <span className="font-bengali text-sm text-[#D9A38E] font-medium block">
                &ldquo;কলকাতা শুধু একটি শহর নয়, এটি একটি অনুভূতি।&rdquo;
              </span>
              <span className="text-[11px] font-sans text-[#F7EBDD]/50 italic">
                (Kolkata is not merely a city; it is a sentiment.)
              </span>
            </div>
          </div>

          {/* Quick Links: Iconic Landmarks */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-4">
              Historic Sights
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#F7EBDD]/70">
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Victoria Memorial Hall
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Howrah Cantilever Bridge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Kumartuli Potter Colony
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  College Street (Boi Para)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Dakshineswar Kali Temple
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Princep Ghat Riverfront
                </button>
              </li>
            </ul>
          </div>

          {/* Self-guided walking routes */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-4">
              Self-Guided Trails
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#F7EBDD]/70">
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Colonial Dalhousie Walk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Hooghly Public Ferry Trail
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Street Gastronomy &amp; Adda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  North Kolkata Rajbari &amp; Trams
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trails')}
                  className="hover:text-[#FFF8EF] hover:underline transition-colors cursor-pointer text-left"
                >
                  Dawn Flower Bazaar Trail
                </button>
              </li>
            </ul>
          </div>

          {/* Visitor Information & Tourist Police */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C5A25A] mb-4">
              Visitor Helpline
            </h4>
            
            <div className="p-4 rounded-2xl bg-[#FFF8EF]/5 border border-[#FFF8EF]/10 space-y-2 text-xs font-sans">
              <span className="font-bold text-[#FFF8EF] block">
                Kolkata Tourist Police
              </span>
              <p className="text-[#F7EBDD]/70">
                24/7 dedicated traveler assistance and safety advisory across major heritage spots.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-[#C5A25A] font-mono text-[11px]">
                <Phone className="w-3.5 h-3.5" />
                <span>Dial 100 / (033) 2214-5000</span>
              </div>
            </div>

            <div className="pt-1 text-[11px] font-sans text-[#F7EBDD]/50 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C6532B]" />
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
