import React, { useState } from 'react';

interface MediaFrameProps {
  id?: string;
  title: string;
  category?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  imageUrl?: string;
  className?: string;
  variant?: 'schematic' | 'architectural' | 'terminal' | 'abstract' | 'portrait';
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  id = 'frame',
  title,
  category,
  aspectRatio = '16:9',
  imageUrl,
  className = '',
  variant = 'schematic',
}) => {
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
  }[aspectRatio];

  // If a valid image URL is given and has not errored, attempt loading
  if (imageUrl && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${aspectClasses} ${className}`}>
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Fallback to high-craft CSS/SVG architectural graphics
  return (
    <div
      className={`relative overflow-hidden bg-neutral-950 text-neutral-100 select-none ${aspectClasses} ${className} border border-neutral-200 dark:border-neutral-800/80`}
      role="img"
      aria-label={title}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Architectural & schematic vector geometry based on variant */}
      {variant === 'schematic' && (
        <svg
          className="absolute inset-0 w-full h-full stroke-neutral-700/60 dark:stroke-neutral-600/50 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="10%" y1="20%" x2="90%" y2="20%" strokeDasharray="3 3" />
          <line x1="10%" y1="80%" x2="90%" y2="80%" strokeDasharray="3 3" />
          <line x1="25%" y1="10%" x2="25%" y2="90%" strokeDasharray="3 3" />
          <line x1="75%" y1="10%" x2="75%" y2="90%" strokeDasharray="3 3" />
          {/* Node boxes */}
          <rect x="20%" y="35%" width="20%" height="30%" rx="6" className="stroke-neutral-500 dark:stroke-neutral-400 fill-neutral-900/80" />
          <rect x="60%" y="35%" width="20%" height="30%" rx="6" className="stroke-neutral-500 dark:stroke-neutral-400 fill-neutral-900/80" />
          {/* Connecting arrow line */}
          <path d="M 40% 50% L 60% 50%" strokeWidth="1.5" className="stroke-neutral-400 dark:stroke-neutral-300" />
          <circle cx="50%" cy="50%" r="3" className="fill-neutral-300 dark:fill-neutral-200" />
        </svg>
      )}

      {variant === 'architectural' && (
        <svg
          className="absolute inset-0 w-full h-full stroke-neutral-700/70 dark:stroke-neutral-600/60 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Angled geometric plane lines */}
          <polygon points="10,180 180,20 320,160 220,240" strokeWidth="1" />
          <polygon points="80,220 240,80 380,200 280,270" strokeWidth="1" strokeDasharray="4 2" />
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>
      )}

      {variant === 'terminal' && (
        <div className="absolute inset-4 font-mono text-[11px] text-neutral-400/90 leading-relaxed overflow-hidden pointer-events-none">
          <div className="text-neutral-500 mb-2">// AST Parse Engine & Dependency Cycle Graph</div>
          <div className="text-neutral-300">&gt; vanguard scan --target=./packages/core</div>
          <div className="text-neutral-400 mt-1">Found 4,120 modules across 18 workspace boundaries.</div>
          <div className="text-emerald-400/90 mt-1">&#10003; Zero circular dependency cycles detected (1.12s)</div>
          <div className="text-neutral-500 mt-2">p99 memory allocation: 23.4 MB &middot; Rayon workers: 8</div>
        </div>
      )}

      {variant === 'portrait' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full border border-neutral-700/80 bg-neutral-900/90 flex items-center justify-center shadow-inner">
            <span className="font-mono text-2xl font-bold tracking-widest text-neutral-300">KV</span>
            <div className="absolute -inset-1 rounded-full border border-neutral-800/60 pointer-events-none" />
          </div>
        </div>
      )}

      {variant === 'abstract' && (
        <svg
          className="absolute inset-0 w-full h-full stroke-neutral-700/50 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50%" cy="50%" r="28%" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="42%" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="50%" cy="50%" r="56%" strokeWidth="0.5" />
          <line x1="50%" y1="0%" x2="50%" y2="100%" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      )}

      {/* Subtle overlay metadata */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-neutral-400/80 pointer-events-none">
        <span className="truncate max-w-[65%]">{title}</span>
        {category && <span className="text-neutral-500 shrink-0">{category}</span>}
      </div>
    </div>
  );
};
