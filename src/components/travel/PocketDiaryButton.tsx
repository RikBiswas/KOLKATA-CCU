import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';

interface PocketDiaryButtonProps {
  count: number;
  onClick: () => void;
}

export const PocketDiaryButton: React.FC<PocketDiaryButtonProps> = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#351E1A] text-[#FFF8EF] hover:bg-[#582822] shadow-[0_12px_30px_rgba(53,30,26,0.3)] border-2 border-[#D9A38E] flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer group"
      aria-label="Open My Calcutta Diary"
      title="Open My Calcutta Diary & Saved Places"
    >
      <div className="relative">
        <Bookmark className="w-4 h-4 text-[#C5A25A] group-hover:scale-110 transition-transform" />
        {count > 0 && (
          <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-[#C6532B] text-white text-[9px] font-bold font-mono flex items-center justify-center border border-[#FFF8EF] animate-pulse">
            {count}
          </span>
        )}
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-sans font-bold tracking-wide leading-none">
          Pocket Diary
        </span>
        <span className="text-[10px] text-[#D9A38E] leading-none mt-0.5">
          {count === 0 ? 'Save spots' : `${count} saved place${count > 1 ? 's' : ''}`}
        </span>
      </div>
    </button>
  );
};
