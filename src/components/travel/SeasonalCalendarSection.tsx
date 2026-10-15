import React, { useState } from 'react';
import { Calendar, Sparkles, Award, Heart, CheckCircle2, Utensils, Compass, ArrowRight } from 'lucide-react';
import { SeasonalEvent } from '../../types/travel';

interface SeasonalCalendarSectionProps {
  events: SeasonalEvent[];
  onSelectEvent?: (event: SeasonalEvent) => void;
}

export const SeasonalCalendarSection: React.FC<SeasonalCalendarSectionProps> = ({
  events,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [activeEventId, setActiveEventId] = useState<string>(events[0]?.id || 'durga-puja');

  const seasons = ['All', 'Autumn', 'Late Autumn', 'Winter', 'Spring', 'Summer'];

  const filteredEvents = events.filter((ev) => {
    if (selectedSeason === 'All') return true;
    return ev.season === selectedSeason;
  });

  const activeEvent = events.find((e) => e.id === activeEventId) || filteredEvents[0] || events[0];

  return (
    <section id="festivals" className="py-14 sm:py-20 my-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter IV &bull; Cultural Almanac &amp; Festivals
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              ঋতুচক্র ও উৎসবের পঞ্জিকা
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            The Living Calendar of Seasons &amp; Celebrations
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Bengal experiences six distinct seasons, each accompanied by transcendent artistic festivals, 
            sacred culinary rituals, and joyous street traditions. Plan your journey around Kolkata&rsquo;s cultural rhythms.
          </p>
        </div>

        {/* Season Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar shrink-0">
          {seasons.map((season) => (
            <button
              key={season}
              onClick={() => {
                setSelectedSeason(season);
                const first = events.find((e) => season === 'All' || e.season === season);
                if (first) setActiveEventId(first.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedSeason === season
                  ? 'bg-[#582822] text-[#FFF8EF] font-bold shadow-xs'
                  : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Layout: Event Selector List on Left + Rich Editorial Feature Plate on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Event List Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredEvents.map((ev) => {
            const isCurrent = ev.id === activeEvent.id;
            return (
              <div
                key={ev.id}
                onClick={() => setActiveEventId(ev.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                  isCurrent
                    ? 'bg-[#351E1A] text-[#FFF8EF] border-[#351E1A] shadow-md -translate-y-0.5'
                    : 'bg-[#FFF8EF] text-[#351E1A] border-[#E8D5C2] hover:bg-[#F7EBDD] hover:border-[#D9A38E]'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#E8D5C2]/50 bg-neutral-900">
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Event Summary */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        isCurrent
                          ? 'bg-[#C6532B] text-white'
                          : 'bg-[#C6532B]/10 text-[#C6532B]'
                      }`}
                    >
                      {ev.season}
                    </span>
                    <span
                      className={`text-[10px] font-sans ${
                        isCurrent ? 'text-[#D9A38E]' : 'text-[#351E1A]/60'
                      }`}
                    >
                      {ev.months.split('(')[0]}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold leading-snug">
                    {ev.title.split('—')[0].trim()}
                  </h3>

                  <p
                    className={`font-bengali text-xs font-medium ${
                      isCurrent ? 'text-[#D9A38E]' : 'text-[#582822]'
                    }`}
                  >
                    {ev.bengaliTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Editorial Exhibition Card for Active Event */}
        {activeEvent && (
          <div className="lg:col-span-7 bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(53,30,26,0.08)] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Top Banner Tag & Dates */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8D5C2] pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#C6532B] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {activeEvent.season}
                  </span>
                  <span className="font-bengali text-sm font-bold text-[#582822]">
                    {activeEvent.bengaliTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-sans text-[#351E1A]/70">
                  <Calendar className="w-3.5 h-3.5 text-[#C6532B]" />
                  <span>{activeEvent.months}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A] leading-tight">
                  {activeEvent.title}
                </h3>
                <p className="font-serif italic text-sm text-[#C6532B]">
                  {activeEvent.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed">
                {activeEvent.description}
              </p>

              {/* Heritage Note if available */}
              {activeEvent.heritageSignificance && (
                <div className="p-3.5 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] flex items-start gap-2.5 text-xs font-sans text-[#582822]">
                  <Award className="w-4 h-4 text-[#C5A25A] shrink-0 mt-0.5" />
                  <div>
                    <strong>Cultural Recognition: </strong>
                    {activeEvent.heritageSignificance}
                  </div>
                </div>
              )}

              {/* 2-Column: Key Rituals & Signature Delicacies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Rituals */}
                <div className="p-4 rounded-2xl bg-[#F7EBDD]/60 border border-[#E8D5C2] space-y-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C6532B] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#C6532B]" />
                    <span>Sacred Rituals &amp; Practices</span>
                  </span>
                  <ul className="space-y-1.5 text-xs font-sans text-[#351E1A]/90">
                    {activeEvent.rituals.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#C6532B] text-xs leading-tight">&bull;</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delicacies */}
                <div className="p-4 rounded-2xl bg-[#F7EBDD]/60 border border-[#E8D5C2] space-y-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#582822] flex items-center gap-1.5">
                    <Utensils className="w-3 h-3 text-[#582822]" />
                    <span>Festival Gastronomy &amp; Sweets</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeEvent.delicacies.map((food, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF8EF] border border-[#E8D5C2] text-xs font-sans font-medium text-[#351E1A]"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Traveler Advice Tips */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#351E1A]/70 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-[#C6532B]" />
                  <span>Tips for Independent Travelers:</span>
                </span>
                <ul className="space-y-1 text-xs font-sans text-[#351E1A]/80">
                  {activeEvent.travelerTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C6532B] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quote / Stamp Callout */}
            <div className="pt-3 border-t border-[#E8D5C2] flex items-center justify-between text-xs text-[#351E1A]/60">
              <span className="italic">
                &ldquo;উৎসবের কলকাতায় কোনো অপরিচিত নেই&rdquo; (In festive Kolkata, no one is a stranger)
              </span>
              <span className="font-mono text-[10px] font-bold text-[#C6532B]">CCU ALMANAC</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
