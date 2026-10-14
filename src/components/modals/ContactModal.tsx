import React, { useState } from 'react';
import { X, Copy, Check, Mail, ExternalLink } from 'lucide-react';
import { siteConfig } from '../../config/site.config';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState<'advisory' | 'collaboration' | 'general'>('advisory');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subjectTitles = {
    advisory: 'Architectural Advisory & Systems Strategy',
    collaboration: 'Project Collaboration & Design Systems',
    general: 'General Inquiries & Engineering Discussion',
  };

  const mailtoLink = `mailto:${siteConfig.profile.email}?subject=${encodeURIComponent(
    subjectTitles[subject]
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8 shadow-2xl relative text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 id="contact-modal-title" className="text-xl font-bold tracking-tight">
              Get in Touch
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {siteConfig.profile.availability}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors rounded-md focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Email Copy Strip */}
        <div className="mt-5 p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 truncate">
              {siteConfig.profile.email}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Message Draft Assist */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Topic of Discussion
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['advisory', 'collaboration', 'general'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSubject(key)}
                  className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-center transition-all truncate ${
                    subject === key
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {key === 'advisory' ? 'Advisory' : key === 'collaboration' ? 'Collaborate' : 'General'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Brief Note (Optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Outline your project scope, timeline, or engineering inquiry..."
              className="w-full text-xs p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-neutral-500">
              Typical response time: within 24–48 hours
            </span>
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Compose Email</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
