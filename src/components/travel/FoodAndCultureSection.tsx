import React from 'react';
import { Utensils, Coffee, Sparkles, MapPin, ArrowRight, Heart } from 'lucide-react';

interface FoodAndCultureSectionProps {
  onExploreFoodTrail: () => void;
}

export const FoodAndCultureSection: React.FC<FoodAndCultureSectionProps> = ({
  onExploreFoodTrail,
}) => {
  const culinaryStories = [
    {
      id: 'puchka-alchemy',
      title: 'The Sacred Alchemy of Kolkata Puchka',
      subtitle: 'Gandharaj Lime, Roasted Cumin & Tamarind Water',
      location: 'Vivekananda Park & Southern Avenue',
      timing: 'Best: 5:00 PM – 8:00 PM',
      description: 'Unlike generic pani puri, Kolkata puchka is an explosive craft: paper-thin semolina spheres filled with warm spiced potato mash, black chickpeas, crushed green chilies, and iced water infused with fragrant Gandharaj lemon juice.',
      quote: '“One does not simply eat a puchka; one surrenders to its tart, fiery grace.”',
      tag: 'Street Gastronomy',
      image: '/images/stories/puchka.jpg',
    },
    {
      id: 'coffee-house-infusion',
      title: 'Coffee House Adda & Cold Infusion',
      subtitle: 'Where Nobel Laureates & Poets Debated for Hours',
      location: 'College Street Boi Para (Est. 1876)',
      timing: 'Best: 2:00 PM – 5:30 PM',
      description: 'Under massive 30-foot ceilings and slowly whirring fans, generations of Calcuttans have discussed French cinema, Marxism, and modern poetry over ₹25 cups of black Infusion coffee and crisp mutton kobiraji cutlets.',
      quote: '“The table here belongs to whoever can argue the longest.”',
      tag: 'Intellectual Lore',
      image: '/images/stories/coffee-house.jpg',
    },
    {
      id: 'flurys-tearoom',
      title: 'Park Street Tea Rooms & Rum Balls',
      subtitle: 'Colonial Elegance & Anglo-Indian Bakery Craft',
      location: 'Park Street Boulevard (Est. 1927)',
      timing: 'Best: 8:00 AM Breakfast / 4:00 PM High Tea',
      description: 'Founded by Mr. and Mrs. J. Flury in 1927, this tearoom remains Kolkata’s most cherished morning ritual. Enjoy classic English breakfast platters, chocolate boat pastries, and legendary dark rum balls.',
      quote: '“A taste of 1920s Calcutta elegance preserved in every silver teapot.”',
      tag: 'Heritage Confectionery',
      image: '/images/stories/park-street-flurys.jpg',
    },
    {
      id: 'clay-pot-mishti',
      title: 'Mishti Doi & Baked Rosogolla in Clay',
      subtitle: 'Centuries of Bengal Milk Confectionery',
      location: 'Balaram Mullick, K.C. Das & Nakur Nandy',
      timing: 'Best: Anytime after morning prayers',
      description: 'Bengal is the world capital of sweetcraft. From slow-steamed caramelised Mishti Doi served in porous earthenware to melt-in-the-mouth Nolen Gur Sandesh and warm baked Rosogolla.',
      quote: '“Earthenware clay absorbs excess whey, leaving only sweet, silky perfection.”',
      tag: 'Living Tradition',
      image: '/images/trails/kolkata-street-food.jpg',
    },
  ];

  return (
    <section id="culture" className="py-16 sm:py-24 my-8 rounded-3xl bg-[#C6532B] text-[#FFF8EF] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_16px_50px_rgba(198,83,43,0.22)] scroll-mt-24">
      {/* Decorative background motifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mb-12 sm:mb-16">
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

        <p className="font-sans text-xs sm:text-base text-[#FFF8EF]/85 leading-relaxed mt-4 max-w-2xl">
          In Kolkata, food is neither a commodity nor an afterthought. It is a cultural sacrament, 
          an artistic passion, and the centerpiece of every deep conversation. From roadside puchka 
          stalls to century-old tea rooms, taste the culinary soul of Bengal.
        </p>
      </div>

      {/* 4 Asymmetric Food & Culture Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {culinaryStories.map((item, idx) => (
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
                <span className="text-[11px] font-sans text-[#351E1A]/60 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C6532B]" />
                  <span>{item.location}</span>
                </span>
              </div>

              {/* Title & Image Layout */}
              <div className="flex flex-col sm:flex-row gap-5 items-start mb-4">
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-2xl font-bold text-[#351E1A] group-hover:text-[#C6532B] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs font-semibold text-[#582822]">
                    {item.subtitle}
                  </p>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#E8D5C2] shadow-xs">
                  <img
                    src={item.image}
                    alt={item.title}
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
            <div className="pt-3 border-t border-[#E8D5C2]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-script text-xs sm:text-sm text-[#582822] italic">
                {item.quote}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#C6532B] uppercase tracking-wider shrink-0">
                {item.timing}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to explore street food trail */}
      <div className="relative z-10 mt-10 sm:mt-12 text-center">
        <button
          onClick={onExploreFoodTrail}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFF8EF] hover:bg-white text-[#351E1A] font-sans text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Utensils className="w-4 h-4 text-[#C6532B]" />
          <span>Follow the Curated Street Food &amp; Adda Trail &rarr;</span>
        </button>
      </div>
    </section>
  );
};
