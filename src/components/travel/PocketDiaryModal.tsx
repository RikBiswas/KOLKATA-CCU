import React, { useState } from 'react';
import { X, Bookmark, CheckCircle2, Circle, Trash2, Printer, MapPin, Share2, Sparkles, BookOpen, Download, Loader2 } from 'lucide-react';
import { DiaryItem } from '../../types/travel';
import { downloadDiaryPDF } from '../../utils/pdfGenerator';

interface PocketDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryItems: DiaryItem[];
  onToggleVisited: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onClearAll: () => void;
  onAddCuratedItems?: () => void;
}

export const PocketDiaryModal: React.FC<PocketDiaryModalProps> = ({
  isOpen,
  onClose,
  diaryItems,
  onToggleVisited,
  onRemoveItem,
  onUpdateNotes,
  onClearAll,
  onAddCuratedItems,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Landmark', 'Trail', 'Food', 'Neighborhood', 'Story'];

  const filteredItems = diaryItems.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.category === selectedFilter;
  });

  const visitedCount = diaryItems.filter((i) => i.visited).length;

  const handleStartEditNotes = (item: DiaryItem) => {
    setEditingNotesId(item.id);
    setTempNote(item.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNote);
    setEditingNotesId(null);
  };

  const handleDownloadPDF = () => {
    if (diaryItems.length === 0) return;
    setIsDownloading(true);
    try {
      downloadDiaryPDF(diaryItems);
    } catch (err) {
      console.error('Failed to generate Diary PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#351E1A]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF8EF] border border-[#E8D5C2] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Editorial Top Bar */}
        <div className="p-6 sm:p-8 border-b border-[#E8D5C2] bg-[#F7EBDD]/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6532B]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C6532B]">
                Personal Field Codex &bull; স্মৃতির ডায়েরি
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#351E1A]">
              My Calcutta Pocket Diary
            </h2>

            <p className="font-sans text-xs text-[#351E1A]/75">
              Saved landmarks, walking trails, culinary stops, and field notes preserved for your voyage.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-sm shrink-0"
            aria-label="Close diary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats & Filter Bar */}
        <div className="px-6 py-3 bg-[#FFF8EF] border-b border-[#E8D5C2] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-[#351E1A]/80 font-sans">
            <span>
              <strong>{diaryItems.length}</strong> saved spot{diaryItems.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[#D9A38E]">&bull;</span>
            <span className="text-[#C6532B] font-semibold">
              <strong>{visitedCount}</strong> explored
            </span>
            {onAddCuratedItems && (
              <button
                onClick={onAddCuratedItems}
                className="hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-[#C6532B]/10 hover:bg-[#C6532B]/20 text-[#C6532B] font-semibold text-[10px] transition-colors cursor-pointer"
                title="Restore or add the 18 curated places, activities, and foods"
              >
                <Sparkles className="w-3 h-3" />
                <span>Reset to Curated Spots (18)</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-[#351E1A] text-[#FFF8EF] font-bold'
                    : 'bg-[#F7EBDD] text-[#351E1A]/70 hover:bg-[#E8D5C2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Diary Items List */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-[#F7EBDD]/40 rounded-3xl border border-dashed border-[#D9A38E] space-y-3">
              <BookOpen className="w-10 h-10 text-[#C6532B]/60 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#351E1A]">
                Your Calcutta Diary is currently empty
              </h3>
              <p className="font-sans text-xs text-[#351E1A]/70 max-w-sm mx-auto leading-relaxed">
                Click the <strong>Bookmark</strong> button on any landmark, walking trail, 
                or food story across WANDER.CCU, or load the complete curated collection.
              </p>
              {onAddCuratedItems && (
                <button
                  onClick={onAddCuratedItems}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A25A]" />
                  <span>Load 18 Curated Places, Activities &amp; Foods</span>
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.visited
                    ? 'bg-[#F7EBDD]/50 border-[#E8D5C2] opacity-80'
                    : 'bg-[#FFF8EF] border-[#E8D5C2] shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Thumbnail + Details */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleVisited(item.id)}
                    className="cursor-pointer shrink-0 text-[#C6532B] hover:scale-110 transition-transform"
                    title={item.visited ? 'Mark as unvisited' : 'Mark as visited'}
                  >
                    {item.visited ? (
                      <CheckCircle2 className="w-5 h-5 fill-[#C6532B] text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#D9A38E]" />
                    )}
                  </button>

                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E8D5C2] bg-neutral-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/destinations/victoria-memorial.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-sm bg-[#C6532B]/10 text-[#C6532B] font-mono text-[9px] font-bold uppercase">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[#351E1A]/50">
                        Added {item.addedAt}
                      </span>
                    </div>

                    <h4
                      className={`font-serif text-base font-bold text-[#351E1A] truncate ${
                        item.visited ? 'line-through text-[#351E1A]/60' : ''
                      }`}
                    >
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-[#351E1A]/60 truncate">
                      <MapPin className="w-3 h-3 text-[#C6532B] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {/* Personal Notes Display */}
                    {item.notes && editingNotesId !== item.id && (
                      <p className="text-[11px] font-script text-[#582822] italic pt-0.5">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Notes editor & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {editingNotesId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder="Add a field note..."
                        className="text-xs bg-[#F7EBDD] border border-[#E8D5C2] rounded-lg px-2.5 py-1 text-[#351E1A] w-36 focus:outline-none focus:ring-1 focus:ring-[#C6532B]"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#351E1A] text-white text-[10px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEditNotes(item)}
                      className="text-[11px] font-sans text-[#C6532B] hover:underline cursor-pointer"
                    >
                      {item.notes ? 'Edit Note' : '+ Note'}
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-[#351E1A]/40 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove from diary"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 sm:p-6 bg-[#F7EBDD]/60 border-t border-[#E8D5C2] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              disabled={diaryItems.length === 0 || isDownloading}
              className="px-4 py-2 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] text-xs font-sans font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95"
              title="Download your pocket diary as a beautifully formatted PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 text-[#C5A25A] animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#C5A25A]" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download Diary (PDF)'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={diaryItems.length === 0}
              className="px-3 py-2 rounded-full border border-[#E8D5C2] bg-[#FFF8EF] hover:bg-[#FFFDF9] text-[#351E1A] text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              title="Print diary"
            >
              <Printer className="w-3.5 h-3.5 text-[#582822]" />
              <span>Print</span>
            </button>

            {diaryItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-sans text-[#351E1A]/60 hover:text-red-700 underline cursor-pointer ml-1"
              >
                Clear All
              </button>
            )}
          </div>

          <span className="font-bengali text-xs text-[#582822] font-semibold">
            স্মৃতির পাতা কখনো মলিন হয় না
          </span>
        </div>
      </div>
    </div>
  );
};
