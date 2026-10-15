import React, { useState } from 'react';
import { Utensils, MapPin, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface FoodAndCultureSectionProps {
  onExploreFoodTrail: () => void;
}

export interface CulinaryItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  region: 'all' | 'north' | 'central' | 'south' | 'sweets';
  regionLabel: string;
  timing: string;
  description: string;
  quote: string;
  tag: string;
  image: string;
}

const ITEMS_PER_PAGE = 4;

export const FoodAndCultureSection: React.FC<FoodAndCultureSectionProps> = ({
  onExploreFoodTrail,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const culinaryStories: CulinaryItem[] = [
    {
      id: 'puchka-alchemy',
      title: 'The Sacred Alchemy of Kolkata Puchka',
      subtitle: 'Gandharaj Lime, Roasted Cumin & Tamarind Water',
      location: 'Vivekananda Park & Southern Avenue',
      region: 'south',
      regionLabel: 'South Kolkata',
      timing: 'Best: 5:00 PM – 8:00 PM',
      description: 'Unlike generic pani puri, Kolkata puchka is an explosive craft: paper-thin semolina spheres filled with warm spiced potato mash, black chickpeas, crushed green chilies, and iced water infused with fragrant Gandharaj lemon juice.',
      quote: '“One does not simply eat a puchka; one surrenders to its tart, fiery grace.”',
      tag: 'Street Gastronomy',
      image: '/images/stories/puchka.jpg',
    },
    {
      id: 'kathi-rolls-nizam',
      title: 'The Original Kathi Roll at Nizam’s & Kusum',
      subtitle: 'Charcoal-Grilled Kebabs Rolled in Flaky Paratha',
      location: 'New Market & Park Street',
      region: 'central',
      regionLabel: 'Central Kolkata',
      timing: 'Best: 6:00 PM – 10:30 PM',
      description: 'Invented at Nizam’s in 1932 to let British sahibs eat kebabs without greasing their hands. Tender charcoal-skewered mutton and spiced onions wrapped in crisp egg-layered paratha.',
      quote: '“The birthplace of the world’s rolls—crisp, charred, and infinitely imitated.”',
      tag: 'Iconic Street Classic',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Kolkata_Rolls.jpg/500px-Kolkata_Rolls.jpg',
    },
    {
      id: 'dacres-lane-stew',
      title: 'Chitto Da’s Chicken Stew & Butter Toast',
      subtitle: 'The Colonial Office Alley Feasting Babu & Diplomat Alike',
      location: 'Dacres Lane (James Hickey Sarani)',
      region: 'central',
      regionLabel: 'Central Kolkata',
      timing: 'Best: 12:30 PM – 3:30 PM Lunch',
      description: 'Since colonial times, Dacres Lane has fed Kolkata’s Secretariat. Chitto Da’s aromatic, hearty pepper-spiced chicken stew with thick slices of butter-toasted pav and fish roll is a rite of passage.',
      quote: '“A narrow colonial lane where high court judges and tram conductors share the same bench.”',
      tag: 'Secretariat Heritage',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Chittobaburdokan.jpg/500px-Chittobaburdokan.jpg',
    },
    {
      id: 'mitra-cafe-kabiraji',
      title: 'Diamond Fish Kabiraji Cutlet',
      subtitle: 'Crisp Golden Egg-Lace Net Enclosing Tender Bhetki',
      location: 'Mitra Cafe, Sovabazar & Shyambazar',
      region: 'north',
      regionLabel: 'North Kolkata',
      timing: 'Best: 5:00 PM – 9:00 PM Evening Adda',
      description: 'Born in Edwardian Calcutta (from "coverage" -> Kabiraji). A tender bhetki fish fillet marinated in ginger-garlic and green chili, plunged into boiling oil wrapped in an intricate spun egg-net canopy.',
      quote: '“The delicate egg mesh crackles at first bite, yielding to fresh Hooghly bhetki.”',
      tag: 'Edwardian Cabin Craft',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG/500px-Kobiraji_Cutlet_or_%E0%A6%95%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%BF_%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%B2%E0%A7%87%E0%A6%9F.JPG',
    },
    {
      id: 'kolkata-biryani-arsalan',
      title: 'Awadhi-Calcutta Biryani with Aloo & Egg',
      subtitle: 'Wajid Ali Shah’s Saffron-Soaked Fragrant Masterpiece',
      location: 'Park Circus, Shiraz & Arsalan',
      region: 'south',
      regionLabel: 'Central-South',
      timing: 'Best: 1:00 PM Lunch & 8:30 PM Dinner',
      description: 'Brought to Metiabruz by the exiled Nawab of Awadh in 1856. Fragrant long-grain basmati cooked in dum with ghee, kewra, saffron, tender meat, and the legendary golden potato that absorbs every ounce of rich broth.',
      quote: '“In Kolkata, the potato in the biryani is sacred—often cherished even more than the meat.”',
      tag: 'Royal Heritage',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Kolkata_mutton_biryani.jpg/500px-Kolkata_mutton_biryani.jpg',
    },
    {
      id: 'anadi-cabin-mughlai',
      title: 'Anadi Cabin’s Crispy Mughlai Paratha',
      subtitle: 'Deep-Fried Flaky Paratha Stuffed with Minced Keema & Eggs',
      location: 'Esplanade & Jawaharlal Nehru Road',
      region: 'central',
      regionLabel: 'Central Kolkata',
      timing: 'Best: 4:30 PM – 9:00 PM',
      description: 'Operating for over a century near Esplanade, Anadi Cabin masters the Mughlai paratha: paper-thin dough folded into envelopes of spiced duck eggs, minced mutton keema, and deep-fried to crisp perfection.',
      quote: '“Served with dry alur dom, salad, and a mustard kick that defines old Calcutta teatime.”',
      tag: 'Heritage Cabin',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Moglai_Porota.jpg/500px-Moglai_Porota.jpg',
    },
    {
      id: 'coffee-house-infusion',
      title: 'Coffee House Adda & Cold Infusion',
      subtitle: 'Where Nobel Laureates & Poets Debated for Hours',
      location: 'College Street Boi Para (Est. 1876)',
      region: 'north',
      regionLabel: 'North Kolkata',
      timing: 'Best: 2:00 PM – 5:30 PM',
      description: 'Under massive 30-foot ceilings and slowly whirring fans, generations of Calcuttans have discussed French cinema, Marxism, and modern poetry over ₹25 cups of black Infusion coffee and crisp mutton kobiraji cutlets.',
      quote: '“The table here belongs to whoever can argue the longest.”',
      tag: 'Intellectual Lore',
      image: '/images/stories/coffee-house.jpg',
    },
    {
      id: 'paramount-daab-sarbat',
      title: 'Paramount’s Cold Daab Sarbat & Malai',
      subtitle: 'Secret Swadeshi Rendezvous Since 1918',
      location: 'College Square & Boi Para',
      region: 'north',
      regionLabel: 'North Kolkata',
      timing: 'Best: 11:30 AM – 7:30 PM',
      description: 'Frequented by Subhas Chandra Bose and Satyajit Ray, this 100-year-old heritage sherbet shop serves its legendary Daab Sarbat—a revitalising chilled concoction of tender green coconut water, scraped malai, and secret herbal syrup.',
      quote: '“Revolutionaries planned India’s freedom right here over tumblers of iced green coconut.”',
      tag: 'Historic Sharbat',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Daab_Sharbat_-_Tender_Coconut_Drink.JPG/500px-Daab_Sharbat_-_Tender_Coconut_Drink.JPG',
    },
    {
      id: 'hing-kochuri-alur-dom',
      title: 'Hing Kochuri, Chholar Dal & Radhaballabhi',
      subtitle: 'Morning Puffed Puris with Sweet-Spicy Asafoetida Gravy',
      location: 'Putiram (College St) & Mohan Bhandar',
      region: 'north',
      regionLabel: 'North Kolkata',
      timing: 'Best: 7:00 AM – 10:30 AM Morning',
      description: 'The definitive Bengali morning breakfast: piping hot club kachoris stuffed with fragrant hing (asafoetida) paste or lentil urad dal, paired with spicy alur dom, rich chholar dal with coconut bits, and syrupy jalebi.',
      quote: '“Morning in North Kolkata starts when the kadai of boiling mustard oil begins to hiss.”',
      tag: 'Traditional Breakfast',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Kachori-sabzi.jpg/500px-Kachori-sabzi.jpg',
    },
    {
      id: 'jhalmuri-telebhaja',
      title: 'Street-Corner Jhalmuri & Telebhaja Adda',
      subtitle: 'Fiery Mustard Oil Puffed Rice & Golden Beguni Fritters',
      location: 'Gariahat, Princep Ghat & Dhiren Cabin',
      region: 'south',
      regionLabel: 'South Kolkata',
      timing: 'Best: 4:30 PM – 7:30 PM Sunset',
      description: 'Crisp puffed rice thrown into a tin can with boiled potatoes, raw coconut slices, roasted cumin, black salt, and a pungent splash of raw mustard oil. Accompanied by batter-fried beguni (eggplant) and alur chop.',
      quote: '“The crackle of paper thonga bags and the unmistakable sting of cold-pressed mustard oil.”',
      tag: 'Evening Street Snack',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Chop_moori.jpg/500px-Chop_moori.jpg',
    },
    {
      id: 'flurys-tearoom',
      title: 'Park Street Tea Rooms & Rum Balls',
      subtitle: 'Colonial Elegance & Anglo-Indian Bakery Craft',
      location: 'Park Street Boulevard (Est. 1927)',
      region: 'central',
      regionLabel: 'Park Street',
      timing: 'Best: 8:00 AM Breakfast / 4:00 PM High Tea',
      description: 'Founded by Mr. and Mrs. J. Flury in 1927, this tearoom remains Kolkata’s most cherished morning ritual. Enjoy classic English breakfast platters, chocolate boat pastries, and legendary dark rum balls.',
      quote: '“A taste of 1920s Calcutta elegance preserved in every silver teapot.”',
      tag: 'Heritage Confectionery',
      image: 'https://ishitaunblogged.com/wp-content/uploads/2014/08/20140801_153531-copy.jpg?w=674',
    },
    {
      id: 'clay-pot-mishti',
      title: 'Mishti Doi & Baked Rosogolla in Clay',
      subtitle: 'Centuries of Bengal Milk Confectionery & Nolen Gur',
      location: 'Balaram Mullick, K.C. Das & Nakur Nandy',
      region: 'sweets',
      regionLabel: 'Citywide Sweetcraft',
      timing: 'Best: Anytime after morning prayers',
      description: 'Bengal is the world capital of sweetcraft. From slow-steamed caramelised Mishti Doi served in porous earthenware pots that cool the curd naturally, to warm spongy baked Rosogolla and seasonal winter Nolen Gur Sandesh.',
      quote: '“Earthenware clay absorbs excess whey, leaving only sweet, silky perfection.”',
      tag: 'Living Tradition',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Mishti_Doi.jpg/500px-Mishti_Doi.jpg',
    },
  ];

  const filterTabs = [
    { id: 'all', label: 'All Kolkata', count: culinaryStories.length },
    { id: 'north', label: 'North Kolkata', count: culinaryStories.filter(c => c.region === 'north').length },
    { id: 'central', label: 'Central & Esplanade', count: culinaryStories.filter(c => c.region === 'central').length },
    { id: 'south', label: 'South Kolkata', count: culinaryStories.filter(c => c.region === 'south').length },
    { id: 'sweets', label: 'Sweets & Sips', count: culinaryStories.filter(c => c.region === 'sweets' || c.id === 'flurys-tearoom').length },
  ];

  const handleFilterChange = (regionId: string) => {
    setActiveRegion(regionId);
    setCurrentPage(1);
  };

  const filteredItems = culinaryStories.filter((item) => {
    if (activeRegion === 'all') return true;
    if (activeRegion === 'sweets') return item.region === 'sweets' || item.id === 'flurys-tearoom';
    return item.region === activeRegion;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    } else {
      setCurrentPage(totalPages); // wrap around
    }
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    } else {
      setCurrentPage(1); // wrap around
    }
  };

  return (
    <section id="culture" className="py-16 sm:py-24 my-8 rounded-3xl bg-[#C6532B] text-[#FFF8EF] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_16px_50px_rgba(198,83,43,0.22)] scroll-mt-24">
      {/* Decorative background motifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Page Stepper */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#FFF8EF]/80 uppercase">
              Chapter III &bull; Gastronomy &amp; Culture
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#FFF8EF] font-semibold">
              স্বাদ ও সংস্কৃতির অলিগলি
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#FFF8EF] leading-[1.08]">
            Where every street corner smells of <span className="italic text-[#FFF8EF]/90">celebration</span>
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#FFF8EF]/85 leading-relaxed mt-4">
            In Kolkata, food is neither a commodity nor an afterthought. It is a cultural sacrament, 
            an artistic passion, and the centerpiece of every deep conversation. Explore 4 iconic culinary stops at a time.
          </p>
        </div>

        {/* Top-Right Page Indicator & Quick Nav */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-full bg-[#FFF8EF] text-[#351E1A] text-xs font-sans font-bold shadow-sm flex items-center gap-2">
            <span className="text-[#C6532B]">Page {safeCurrentPage}</span>
            <span className="text-[#351E1A]/40">/</span>
            <span>{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevPage}
              className="w-9 h-9 rounded-full bg-[#FFF8EF]/20 hover:bg-[#FFF8EF] text-[#FFF8EF] hover:text-[#351E1A] flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Previous 4 foods"
              aria-label="Previous 4 cards"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPage}
              className="w-9 h-9 rounded-full bg-[#FFF8EF]/20 hover:bg-[#FFF8EF] text-[#FFF8EF] hover:text-[#351E1A] flex items-center justify-center transition-all duration-200 cursor-pointer"
              title="Next 4 foods"
              aria-label="Next 4 cards"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {filterTabs.map((tab) => {
          const isActive = activeRegion === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#FFF8EF] text-[#351E1A] font-bold shadow-md scale-102'
                  : 'bg-[#FFF8EF]/15 text-[#FFF8EF] border border-[#FFF8EF]/20 hover:bg-[#FFF8EF]/25 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isActive ? 'bg-[#C6532B]/15 text-[#C6532B] font-bold' : 'bg-black/20 text-[#FFF8EF]/80'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Cards Per Page Grid (2x2 on desktop, clean and spacious) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 min-h-[460px]">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl bg-[#FFF8EF] text-[#351E1A] p-6 sm:p-8 border border-[#E8D5C2] shadow-[0_10px_30px_rgba(53,30,26,0.1)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(53,30,26,0.18)] hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Card Header with Tag & Location */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#C6532B]/10 text-[#C6532B] font-mono text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
                <span className="text-[11px] font-sans text-[#351E1A]/60 flex items-center gap-1 shrink-0 max-w-[55%] truncate">
                  <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </span>
              </div>

              {/* Title & Image Layout */}
              <div className="flex flex-col sm:flex-row gap-5 items-start mb-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-serif text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs font-semibold text-[#582822]">
                    {item.subtitle}
                  </p>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E8D5C2] shadow-xs bg-[#351E1A]/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/stories/puchka.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Bottom Quote & Timing */}
            <div className="pt-3 border-t border-[#E8D5C2]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
              <span className="font-script text-xs sm:text-sm text-[#582822] italic leading-tight">
                {item.quote}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#C6532B] uppercase tracking-wider shrink-0">
                {item.timing}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls & Footnote */}
      <div className="relative z-10 mt-10 pt-6 border-t border-[#FFF8EF]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Counter Info */}
        <div className="text-xs font-sans text-[#FFF8EF]/80">
          Showing <span className="font-bold text-[#FFF8EF]">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}</span> of <span className="font-bold text-[#FFF8EF]">{filteredItems.length}</span> street delicacies
        </div>

        {/* Page Switcher Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF] text-[#FFF8EF] hover:text-[#351E1A] text-xs font-sans font-semibold transition-all duration-200 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FFF8EF] text-[#351E1A] shadow-md scale-105'
                        : 'bg-[#FFF8EF]/15 text-[#FFF8EF] hover:bg-[#FFF8EF]/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF] text-[#FFF8EF] hover:text-[#351E1A] text-xs font-sans font-semibold transition-all duration-200 flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Curated Trail CTA */}
        <div>
          <button
            onClick={onExploreFoodTrail}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFF8EF] hover:bg-white text-[#351E1A] font-sans text-xs font-bold tracking-wide shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-[#C6532B]" />
            <span>Follow Food Trail &rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};
