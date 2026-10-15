import React from 'react';
import { X, Clock, Calendar, BookOpen, Share2 } from 'lucide-react';
import { GuideStory } from '../../types/travel';

interface StoryDetailModalProps {
  story: GuideStory | null;
  onClose: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#151c27] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-60 sm:h-68 w-full shrink-0 bg-neutral-900">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-1">
              {story.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-snug">{story.title}</h2>
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{story.readTime}</span>
              </span>
              <span>&middot;</span>
              <span>{story.date}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p className="font-semibold text-base text-neutral-900 dark:text-white border-l-4 border-emerald-500 pl-3">
            {story.summary}
          </p>

          <p>
            Kolkata isn’t merely a physical geography; it is a sentiment woven into the fabric of everyday conversations, street corner tea stalls (cha-er dokan), and the gentle hum of vintage electric trams coasting along the green expanse of the Maidan.
          </p>

          <p>
            For more than three centuries, the city has maintained an unparalleled cultural legacy—home to Nobel laureates, pioneering filmmakers, radical artists, and master sculptors. When you step through the classical Greco-Roman pillars of Princep Ghat or sit for an afternoon &ldquo;Adda&rdquo; at the College Street Coffee House, time yields to deep dialogue and intellectual curiosity.
          </p>

          <p>
            Our native travel guides make sure that you do not just observe Kolkata as an outsider, but experience its pulse, aroma of roasted cumin in puchka water, and the warmth of Bengali hospitality firsthand.
          </p>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1a2e3b] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-neutral-900 transition-colors"
            >
              Close Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
