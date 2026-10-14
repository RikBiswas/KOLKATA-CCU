import React, { useEffect } from 'react';
import { X, Clock, Calendar, Bookmark } from 'lucide-react';
import { BlogPost } from '../../types';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (post) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl my-8 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>{post.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h2 id="article-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                {post.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close article"
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 py-1">
            "{post.summary}"
          </p>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[65vh] overflow-y-auto text-neutral-800 dark:text-neutral-200 text-sm sm:text-base leading-relaxed">
          {post.content.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {section.sectionTitle}
              </h3>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>
          ))}

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-neutral-400" />
              <span>Written by Kaelen Vance &middot; Architectural Essays</span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Back to Writings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
