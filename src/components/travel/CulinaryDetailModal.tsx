import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Clock, Utensils, Sparkles, Train, 
  Lightbulb, Coins, Bookmark, Check, Share2, Compass, Flame, Info
} from 'lucide-react';
import { CulinaryItem } from './FoodAndCultureSection';

interface CulinaryDetailModalProps {
  item: CulinaryItem | null;
  onClose: () => void;
  onBookmark?: (item: CulinaryItem) => void;
  isBookmarked?: boolean;
}

export const CulinaryDetailModal: React.FC<CulinaryDetailModalProps> = ({
  item,
  onClose,
  onBookmark,
  isBookmarked = false,
}) => {
  const [activeTab, setActiveTab] = useState<'lore' | 'stalls' | 'orders' | 'tips'>('lore');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (item) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setActiveTab('lore');
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Discovering Kolkata's culinary legacy: ${item.title} (${item.subtitle}) at ${item.location}. Explore Kolkata's food lore on WANDER.CCU!`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#351E1A]/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-culinary-title"
    >
      <div className="relative w-full max-w-3xl bg-[#FFF8EF] rounded-3xl shadow-2xl border-2 border-[#E8D5C2] overflow-hidden max-h-[92vh] flex flex-col text-[#351E1A] transition-all">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#351E1A]/70 hover:bg-[#351E1A] text-[#FFF8EF] transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          aria-label="Close culinary detail dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-[#351E1A] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/stories/puchka.jpg';
            }}
            className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-700 hover:scale-106"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A] via-[#351E1A]/50 to-transparent pointer-events-none" />

          {/* Bengali Watermark Silhouette */}
          <div className="absolute top-4 left-6 pointer-events-none opacity-20">
            <span className="font-bengali text-5xl font-black text-[#FFF8EF]">
              {item.bengaliTitle || 'রসনা বিলাস'}
            </span>
          </div>

          {/* Banner Captions */}
          <div className="absolute bottom-4 left-6 right-6 text-[#FFF8EF] space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C6532B] text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFF8EF] shadow-xs">
                {item.tag}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-mono text-[#D9A38E] border border-[#FFF8EF]/20 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D9A38E]" />
                <span>{item.regionLabel}</span>
              </span>
              {item.bengaliTitle && (
                <span className="font-bengali text-xs text-[#FFF8EF]/90 font-semibold px-2 py-0.5 rounded-full bg-white/10">
                  {item.bengaliTitle}
                </span>
              )}
            </div>

            <h2 id="modal-culinary-title" className="font-serif text-2xl sm:text-3xl font-bold leading-snug drop-shadow-sm">
              {item.title}
            </h2>

            <p className="font-sans text-xs sm:text-sm font-medium text-[#F7EBDD] drop-shadow-xs line-clamp-1">
              {item.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Spec Pills Bar */}
        <div className="bg-[#582822] text-[#FFF8EF] px-6 py-3 border-b border-[#351E1A] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans shrink-0">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#C5A25A] shrink-0" />
            <div>
              <span className="block text-[9px] font-mono uppercase text-[#FFF8EF]/60 font-semibold">Price Range</span>
              <span className="font-bold text-[#FFF8EF] text-[11px] truncate">{item.priceRange || '₹30 – ₹120'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D9A38E] shrink-0" />
            <div>
              <span className="block text-[9px] font-mono uppercase text-[#FFF8EF]/60 font-semibold">Best Timing</span>
              <span className="font-bold text-[#FFF8EF] text-[11px] truncate">{item.timing}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-[#C5A25A] shrink-0" />
            <div>
              <span className="block text-[9px] font-mono uppercase text-[#FFF8EF]/60 font-semibold">Transit Route</span>
              <span className="font-bold text-[#FFF8EF] text-[11px] truncate">Metro &amp; Vintage Trams</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#D9A38E] shrink-0" />
            <div>
              <span className="block text-[9px] font-mono uppercase text-[#FFF8EF]/60 font-semibold">Experience</span>
              <span className="font-bold text-[#FFF8EF] text-[11px] truncate">Authentic Calcutta Adda</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#E8D5C2] bg-[#F7EBDD]/60 px-6 pt-3 gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('lore')}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'lore'
                ? 'bg-[#FFF8EF] text-[#C6532B] border-[#C6532B] shadow-xs'
                : 'text-[#351E1A]/70 hover:text-[#351E1A] border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heritage Lore &amp; Story</span>
          </button>

          <button
            onClick={() => setActiveTab('stalls')}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'stalls'
                ? 'bg-[#FFF8EF] text-[#C6532B] border-[#C6532B] shadow-xs'
                : 'text-[#351E1A]/70 hover:text-[#351E1A] border-transparent'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Famous Stalls &amp; Spots</span>
            {item.famousStalls && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#C6532B]/10 text-[#C6532B] font-mono">
                {item.famousStalls.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'orders'
                ? 'bg-[#FFF8EF] text-[#C6532B] border-[#C6532B] shadow-xs'
                : 'text-[#351E1A]/70 hover:text-[#351E1A] border-transparent'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>What to Order</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-t-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'tips'
                ? 'bg-[#FFF8EF] text-[#C6532B] border-[#C6532B] shadow-xs'
                : 'text-[#351E1A]/70 hover:text-[#351E1A] border-transparent'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Native Etiquette &amp; Tips</span>
          </button>
        </div>

        {/* Tabbed Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: HERITAGE LORE */}
          {activeTab === 'lore' && (
            <div className="space-y-5 animate-fade-in">
              {/* Quote Pull-box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EBDD] border-l-4 border-[#C6532B] text-[#582822] shadow-xs">
                <p className="font-serif text-base sm:text-lg italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[#C6532B] font-bold">
                  &bull; Calcutta Culinary Sacrament
                </div>
              </div>

              {/* Main Narrative */}
              <div className="space-y-4 text-xs sm:text-sm font-sans text-[#351E1A]/85 leading-relaxed">
                <p className="first-letter:font-serif first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#C6532B] first-letter:leading-none">
                  {item.heritageLore || item.description}
                </p>

                {item.atmosphere && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E8D5C2] space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#582822] font-serif">
                      <Flame className="w-4 h-4 text-[#C6532B]" />
                      <span>The Street Adda Atmosphere</span>
                    </div>
                    <p className="text-xs text-[#351E1A]/80 font-sans leading-relaxed">
                      {item.atmosphere}
                    </p>
                  </div>
                )}

                {item.transitGuide && (
                  <div className="p-4 rounded-2xl bg-[#F7EBDD]/70 border border-[#E8D5C2] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#582822] font-serif">
                      <Train className="w-4 h-4 text-[#C6532B]" />
                      <span>How to Reach by Metro &amp; Tram</span>
                    </div>
                    <p className="text-xs text-[#351E1A]/80 font-sans leading-relaxed">
                      {item.transitGuide}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAMOUS STALLS & CORNERS */}
          {activeTab === 'stalls' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#351E1A]">
                  Iconic Establishments &amp; Street Corners
                </h3>
                <span className="text-xs font-sans text-[#582822]">
                  {item.location}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.famousStalls && item.famousStalls.length > 0 ? (
                  item.famousStalls.map((stall, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[#E8D5C2] shadow-xs space-y-2 hover:border-[#C6532B] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C6532B]/10 text-[#C6532B] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6532B] font-bold">
                          Heritage Stop
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#351E1A]">
                        {stall.name}
                      </h4>

                      <p className="text-xs font-sans text-[#351E1A]/75 leading-relaxed flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C6532B] shrink-0 mt-0.5" />
                        <span>{stall.address}</span>
                      </p>

                      {stall.landmark && (
                        <div className="text-[11px] font-sans text-[#582822] bg-[#F7EBDD]/60 p-2 rounded-xl">
                          <strong className="text-[#351E1A]">Landmark:</strong> {stall.landmark}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-6 rounded-2xl bg-white border border-[#E8D5C2] text-center text-xs font-sans text-[#351E1A]/70">
                    Explore around {item.location}. Best stalls gather near major metro exits and tram crossings!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WHAT TO ORDER */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#351E1A]">
                  What to Order (The Native Palate)
                </h3>
                <span className="text-xs font-mono font-bold text-[#C6532B]">
                  {item.priceRange}
                </span>
              </div>

              <div className="space-y-3">
                {item.signatureItems && item.signatureItems.length > 0 ? (
                  item.signatureItems.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[#E8D5C2] flex items-center gap-3.5 shadow-xs hover:border-[#C6532B] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#C6532B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm sm:text-base font-bold text-[#351E1A]">
                          {dish}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#582822] bg-[#F7EBDD] px-2.5 py-1 rounded-full uppercase font-bold shrink-0">
                        Must Try
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-white border border-[#E8D5C2] text-xs font-sans text-[#351E1A]/80">
                    Ask the vendor for their daily specialty and freshest warm batch!
                  </div>
                )}
              </div>

              {/* Special Pairing Recommendation */}
              <div className="p-4 rounded-2xl bg-[#582822] text-[#FFF8EF] space-y-1 mt-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A25A] font-bold block">
                  Classic Kolkata Pairing
                </span>
                <p className="text-xs font-sans leading-relaxed text-[#FFF8EF]/90">
                  Always pair with scalding hot milk tea in an earthenware clay cup (Bhaar-er Cha) from the adjacent corner tea stall to conclude your culinary pilgrimage.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: NATIVE TIPS & ETISUETTE */}
          {activeTab === 'tips' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#351E1A]">
                  Native Adda Etiquette &amp; Insider Secrets
                </h3>
              </div>

              <div className="space-y-3">
                {item.nativeTips && item.nativeTips.length > 0 ? (
                  item.nativeTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8D5C2] flex items-start gap-3.5 shadow-xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#C6532B]/10 text-[#C6532B] flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-[#351E1A]/85 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#351E1A]/80">
                    Join the local queue, observe how natives order, and never rush the vendor!
                  </p>
                )}
              </div>

              {/* Cash & Digital Payment Note */}
              <div className="p-3.5 rounded-2xl bg-[#F7EBDD] border border-[#E8D5C2] text-xs font-sans text-[#582822] flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#C6532B] shrink-0" />
                <span>
                  <strong>Explorer Note:</strong> While UPI (Google Pay, PhonePe, Paytm) QR codes are now ubiquitous even at roadside carts, keeping ₹10 and ₹20 currency notes is always recommended for rapid street transactions.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8D5C2] bg-[#FFF8EF] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8D5C2] hover:bg-[#F7EBDD] text-xs font-sans font-bold text-[#351E1A] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C6532B]" />
              <span>{copiedShare ? 'Copied Link!' : 'Share Lore'}</span>
            </button>

            {onBookmark && (
              <button
                onClick={() => onBookmark(item)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-sans font-bold transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#C6532B] border-[#C6532B] text-white shadow-xs'
                    : 'border-[#E8D5C2] hover:bg-[#F7EBDD] text-[#351E1A]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : 'text-[#C6532B]'}`} />
                <span>{isBookmarked ? 'Saved to Diary' : 'Save to Pocket Diary'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold shadow-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
