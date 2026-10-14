import React from 'react';
import { ArrowUpRight, ArrowRight, Sparkles, Terminal, Layers, Cpu } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { PageRoute, Project, BlogPost } from '../../types';
import { MediaFrame } from '../common/MediaFrame';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectProject: (project: Project) => void;
  onSelectPost: (post: BlogPost) => void;
  onOpenContact: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProject,
  onSelectPost,
  onOpenContact,
}) => {
  const featuredProjects = siteConfig.projects.filter((p) => p.featured).slice(0, 3);
  const recentPosts = siteConfig.blogPosts.slice(0, 2);

  return (
    <div className="space-y-20 md:space-y-28">
      {/* Hero Section */}
      <section className="pt-6 sm:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span>{siteConfig.profile.location}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{siteConfig.profile.availability}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]">
              {siteConfig.profile.headline}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
              {siteConfig.profile.shortBio}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <span>View Selected Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>About &amp; Experience</span>
              </button>
            </div>
          </div>

          {/* Profile Visual Motif */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-2 bg-white dark:bg-neutral-900 shadow-sm">
              <MediaFrame
                title={siteConfig.profile.name}
                aspectRatio="1:1"
                variant="portrait"
                className="rounded-xl w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas / Architectural Tenets */}
      <section className="space-y-6">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
            Core Architectural Focus
          </h2>
          <span className="text-xs text-neutral-500 font-mono">01 &mdash; 03</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Distributed Systems
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Designing sub-millisecond event streaming, zero-copy memory buffers, and resilient edge clusters with predictable tail latency.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Design Token Systems
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Crafting mathematical spatial scales, accessible OKLCH color palettes, and zero-pill typography frameworks for complex enterprise applications.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Developer Ergonomics
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Building ultra-fast AST analyzers, terminal interfaces, and release automation pipelines that elevate engineering velocity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Selected Works
            </h2>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Production systems and open-source tooling
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <span>View All ({siteConfig.projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] transition-all hover:border-neutral-300 dark:hover:border-neutral-700 space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <span>{project.category}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{project.year}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {project.description}
                  </p>

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

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div
                    onClick={() => onSelectProject(project)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"
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
                      className="group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Writings Teaser */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Technical Writing
            </h2>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Essays on systems design, web performance, and ergonomics
            </p>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>{post.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                {post.summary}
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                <span>Read essay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Banner */}
      <section className="p-8 sm:p-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-lg">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Have an architectural challenge or project?
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Available for systems advisory, engineering design reviews, and high-impact technical initiatives.
          </p>
        </div>
        <button
          onClick={onOpenContact}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
        >
          Initiate Conversation
        </button>
      </section>
    </div>
  );
};
