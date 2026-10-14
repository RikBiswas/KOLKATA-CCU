import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Github, Filter } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { Project } from '../../types';
import { MediaFrame } from '../common/MediaFrame';

interface ProjectsPageProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Systems', 'Design Systems', 'Developer Tools', 'Open Source'];

  const filteredProjects =
    activeFilter === 'All'
      ? siteConfig.projects
      : siteConfig.projects.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Portfolio</span>
          <span aria-hidden="true">&middot;</span>
          <span>Engineering Systems</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Selected Projects &amp; Case Studies
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          A showcase of distributed stream brokers, design system architectures, developer CLIs, and open-source infrastructure tools.
        </p>
      </div>

      {/* Filter Tabs - Interactive buttons adhering to Section 1.A */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeFilter === cat
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] transition-all hover:border-neutral-300 dark:hover:border-neutral-700 space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <span>{project.category}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{project.year}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {project.status}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {project.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Metrics / Highlights if present */}
                {project.caseStudy.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {project.caseStudy.metrics.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/80"
                      >
                        <div className="text-sm font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clean unboxed technologies metadata */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 font-mono">
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

                {/* Actions */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                  >
                    <span>Explore Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Cover visual frame */}
              <div className="lg:col-span-5">
                <div
                  onClick={() => onSelectProject(project)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
                >
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
                    className="transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-500 text-sm">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
