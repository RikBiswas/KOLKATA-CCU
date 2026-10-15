import React, { useState } from 'react';
import { Train, Ship, Compass, ArrowRight, Clock, Banknote, MessageCircle, Check, Copy } from 'lucide-react';
import { TransitMode } from '../../types/travel';

interface TransitCodexSectionProps {
  transitModes: TransitMode[];
}

export const TransitCodexSection: React.FC<TransitCodexSectionProps> = ({ transitModes }) => {
  const [activeTransitId, setActiveTransitId] = useState<string>(transitModes[0]?.id || 'vintage-trams');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeMode = transitModes.find((m) => m.id === activeTransitId) || transitModes[0];

  const handleCopyPhrase = (phrase: string, id: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTransitIcon = (id: string) => {
    switch (id) {
      case 'vintage-trams':
        return <Train className="w-5 h-5" />;
      case 'hooghly-ferries':
        return <Ship className="w-5 h-5" />;
      case 'kolkata-metro':
        return <Train className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <section id="transit" className="py-14 sm:py-20 my-8 scroll-mt-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#C6532B] uppercase">
              Chapter V &bull; The Public Transit Codex
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="font-bengali text-xs text-[#582822] font-semibold">
              ঐতিহ্যবাহী যানবাহন ও পথনির্দেশ
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#351E1A] tracking-tight leading-tight">
            How to Move Through Calcutta with Soul
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/75 leading-relaxed">
            Forget sterile rideshares. Kolkata is best experienced aboard her historic electric trams, 
            ₹6 municipal passenger ferries across the Ganges, rapid subway tunnels, and iconic yellow cabs.
          </p>
        </div>

        {/* 4 Mode Pills Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar shrink-0">
          {transitModes.map((mode) => {
            const isActive = mode.id === activeTransitId;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveTransitId(mode.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-sans whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#351E1A] text-[#FFF8EF] font-bold shadow-sm'
                    : 'bg-[#FFF8EF] text-[#351E1A]/80 border border-[#E8D5C2] hover:bg-[#F7EBDD]'
                }`}
              >
                <span>{mode.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Vintage Transit Pass Layout */}
      {activeMode && (
        <div className="bg-[#FFF8EF] border-2 border-dashed border-[#D9A38E] rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_rgba(53,30,26,0.06)] relative overflow-hidden">
          {/* Top Stamp Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D5C2] pb-6 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#351E1A] text-[#FFF8EF] flex items-center justify-center shrink-0 shadow-xs">
                {getTransitIcon(activeMode.id)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A]">
                    {activeMode.name}
                  </h3>
                  <span className="font-bengali text-sm font-semibold text-[#582822]">
                    {activeMode.bengaliName}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#C6532B] font-semibold">
                  {activeMode.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-1.5 rounded-full bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-mono font-bold text-[#582822]">
                Operating since {activeMode.operatingSince}
              </span>
            </div>
          </div>

          {/* 3-Column Quick Specs Grid: Fare, Hours, Character */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Banknote className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Fare Range</span>
              </div>
              <p className="text-sm font-sans font-bold text-[#351E1A]">
                {activeMode.fareRange}
              </p>
              <span className="text-[11px] text-[#351E1A]/60 block">Nominal public subsidized rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Operating Hours</span>
              </div>
              <p className="text-sm font-sans font-bold text-[#351E1A]">
                {activeMode.operatingHours}
              </p>
              <span className="text-[11px] text-[#351E1A]/60 block">Operates every day of the week</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] space-y-1">
              <div className="flex items-center gap-1.5 text-[#C6532B]">
                <Compass className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase">Transit Vibe</span>
              </div>
              <p className="text-sm font-sans font-bold text-[#351E1A]">
                {activeMode.badgeText}
              </p>
              <span className="text-[11px] text-[#351E1A]/60 block">Essential Calcuttan experience</span>
            </div>
          </div>

          {/* Narrative Summary */}
          <p className="font-sans text-xs sm:text-sm text-[#351E1A]/85 leading-relaxed mb-8">
            {activeMode.summary}
          </p>

          {/* 2 Sub-Columns: Recommended Routes & Practical Insider Advice */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Routes List */}
            <div className="lg:col-span-6 space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#351E1A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C6532B]" />
                <span>Signature Routes &amp; Terminals</span>
              </h4>

              <div className="space-y-2.5">
                {activeMode.routes.map((rt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-sans font-bold text-[#351E1A]">
                      <span className="text-[#C6532B]">{rt.name}</span>
                      <span
                        dangerouslySetInnerHTML={{ __html: rt.stops }}
                        className="text-[#582822]"
                      />
                    </div>
                    <p className="text-[11px] font-sans text-[#351E1A]/70">
                      {rt.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insider Advice */}
            <div className="lg:col-span-6 space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#351E1A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#582822]" />
                <span>Tips for First-Time Commuters</span>
              </h4>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-3 text-xs font-sans text-[#351E1A]/85">
                {activeMode.insiderAdvice.map((advice, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#351E1A] text-[#FFF8EF] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{advice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bengali Phrase Box for Effortless Communication */}
          <div className="p-5 rounded-2xl bg-[#582822] text-[#FFF8EF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#D9A38E] text-[10px] font-mono uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Handy Bengali Transit Phrase:</span>
              </div>
              <p className="font-bengali text-lg sm:text-xl font-bold text-[#FFF8EF]">
                &ldquo;{activeMode.keyPhrase.bengali}&rdquo;
              </p>
              <p className="font-sans text-xs text-[#D9A38E]">
                <em>Pronunciation:</em> {activeMode.keyPhrase.phonetic} &bull; ({activeMode.keyPhrase.english})
              </p>
            </div>

            <button
              onClick={() => handleCopyPhrase(activeMode.keyPhrase.bengali, activeMode.id)}
              className="px-4 py-2 rounded-full bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-white text-xs font-sans font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copiedId === activeMode.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C5A25A]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Phrase</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
