import React, { useState } from 'react';
import { Clock, Calendar, ArrowRight, BookOpen, Search } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { BlogPost } from '../../types';

interface BlogPageProps {
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    ...Array.from(new Set(siteConfig.blogPosts.map((p) => p.category))),
  ];

  const filteredPosts = siteConfig.blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Writing</span>
          <span aria-hidden="true">&middot;</span>
          <span>Architectural Essays</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Writings &amp; Notes
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Essays on distributed systems tail latency, typographic design token math, web performance metrics, and software craft.
        </p>
      </div>

      {/* Toolbar: Category Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>{post.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-neutral-400">
                <Clock className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
              {post.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.summary}
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:underline">
              <span>Read complete essay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-500 text-sm">
            No essays found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
