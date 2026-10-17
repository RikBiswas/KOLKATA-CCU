import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Calendar, BookOpen, Feather } from 'lucide-react';
import { GuideStory } from '../../types/travel';

interface StoryDetailModalProps {
  story: GuideStory | null;
  onClose: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({ story, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (story) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [story, onClose]);

  if (!story) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-story-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FFF8EF] rounded-3xl shadow-2xl border border-[#E8D5C2] overflow-hidden max-h-[92vh] flex flex-col text-[#351E1A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#351E1A]/80 hover:bg-[#351E1A] text-[#FFF8EF] transition-all shadow-lg hover:scale-105 active:scale-95 border border-[#FFF8EF]/20 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Banner */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 bg-[#351E1A]">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351E1A]/95 via-[#351E1A]/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-6 right-6 text-[#FFF8EF] space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C6532B] text-[10px] font-mono font-bold uppercase tracking-wider text-white mb-1">
              {story.category}
            </span>
            <h2 id="modal-story-title" className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
              {story.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#FFF8EF]/80">
              {story.location && (
                <span className="flex items-center gap-1 text-[#FFF8EF]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span className="font-medium">{story.location}</span>
                </span>
              )}
              {story.era && (
                <>
                  <span>&bull;</span>
                  <span className="text-[#D9A38E]">{story.era}</span>
                </>
              )}
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C5A25A]" />
                <span>{story.readTime}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D9A38E]" />
                <span>{story.date}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Essay & Lore Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm font-sans text-[#351E1A]/85 leading-relaxed">
          {/* Pull quote summary */}
          <div className="p-4 rounded-2xl bg-[#F7EBDD] border-l-4 border-[#C6532B] text-[#582822] font-serif text-base sm:text-lg italic leading-relaxed">
            &ldquo;{story.summary}&rdquo;
          </div>

          {/* Historical lore highlight callout */}
          {story.historicalLore && (
            <div className="p-4 rounded-2xl bg-[#FFF1E4] border border-[#E8D5C2] space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#C6532B]">
                <span>The Legend &amp; Lore &bull; ঐতিহাসিক জনশ্রুতি</span>
              </div>
              <p className="text-xs sm:text-sm text-[#351E1A]/90 italic font-serif">
                {story.historicalLore}
              </p>
            </div>
          )}

          {story.fullStory && story.fullStory.length > 0 ? (
            story.fullStory.map((para, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:font-serif first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#C6532B] first-letter:leading-none'
                    : ''
                }
              >
                {para}
              </p>
            ))
          ) : (
            <>
              <p className="first-letter:font-serif first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#C6532B] first-letter:leading-none">
                Kolkata isn’t merely a physical geography of streets and buildings; it is a sentiment woven into the fabric of everyday conversations, street corner tea stalls (cha-er dokan), and the gentle hum of vintage electric trams coasting along the green expanse of the Maidan.
              </p>
              <p>
                For more than three centuries, the city has nurtured an unparalleled cultural legacy—home to Nobel laureates, pioneering filmmakers, radical artists, and master sculptors. When you step through the classical Greco-Roman pillars of Princep Ghat or sit for an afternoon &ldquo;Adda&rdquo; at the College Street Coffee House, time yields to deep dialogue and intellectual curiosity.
              </p>
              <p>
                The narrow lanes of North Kolkata still preserve ancestral courtyards (thakur dalan), cast-iron balconies, and slatted green window shutters (khorkhori) that have witnessed generations of history. Here, neighbors still greet each other by name, the postman stops for afternoon tea, and the scent of evening incense mingles with the river mist from the holy Hooghly.
              </p>
              <p>
                Our native travel chronicles make sure that you do not just observe Kolkata as an outsider, but experience its pulse, the fragrance of roasted cumin in puchka water, and the enduring warmth of Bengali hospitality firsthand.
              </p>
            </>
          )}

          <div className="pt-6 border-t border-[#E8D5C2] flex items-center justify-between">
            <span className="text-[11px] font-sans text-[#351E1A]/60 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#C6532B]" />
              <span>Calcutta Historical Lore Archive &bull; WANDER.CCU</span>
            </span>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold shadow-xs transition-colors cursor-pointer"
            >
              Close Lore &amp; Chronicles
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
