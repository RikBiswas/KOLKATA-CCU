import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';
import { MediaFrame } from '../common/MediaFrame';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const { caseStudy } = project;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="casestudy-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl my-8 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1.5">
              <span>{project.category}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{project.year}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{project.status}</span>
            </div>
            <h2 id="casestudy-title" className="text-2xl font-bold tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {project.tagline}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Frame */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50">
          <MediaFrame
            title={project.title}
            category={project.category}
            aspectRatio="16:9"
            variant={
              project.category === 'Developer Tools'
                ? 'terminal'
                : project.category === 'Systems'
                ? 'schematic'
                : 'architectural'
            }
            className="rounded-xl"
          />
        </div>

        {/* Key Metrics Banner */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-200 dark:divide-neutral-800 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            {caseStudy.metrics.map((metric, idx) => (
              <div key={idx} className="p-4 text-center">
                <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                  {metric.value}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Case Study Body */}
        <div className="p-6 sm:p-8 space-y-8 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
          {/* Overview */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              01. Executive Overview
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">{caseStudy.overview}</p>
          </section>

          {/* Problem */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              02. The Core Problem
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">{caseStudy.problem}</p>
          </section>

          {/* Objectives */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
              03. Key Engineering Objectives
            </h3>
            <ul className="space-y-2">
              {caseStudy.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technical Approach & Architecture */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              04. Technical Architecture
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">{caseStudy.approach}</p>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              {caseStudy.architecture.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-neutral-400 select-none">&bull;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Key Challenges */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
              05. Critical Challenges & Trade-offs
            </h3>
            <ul className="space-y-2">
              {caseStudy.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                  <span className="font-mono text-xs text-neutral-400 shrink-0">{i + 1}.</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Measurable Outcome */}
          <section>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              06. Outcome & Impact
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">{caseStudy.outcome}</p>
          </section>

          {/* Technologies Used */}
          <section className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-semibold text-neutral-400 mb-2">Technologies & Stack</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              {project.technologies.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span>{tech}</span>
                  {idx < project.technologies.length - 1 && (
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                      &middot;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live View</span>
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Close Study
          </button>
        </div>
      </div>
    </div>
  );
};
