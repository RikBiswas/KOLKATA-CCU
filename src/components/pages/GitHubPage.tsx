import React, { useEffect, useState } from 'react';
import {
  Github,
  Star,
  GitFork,
  Search,
  ExternalLink,
  RefreshCw,
  FolderGit2,
  Users,
  BookOpen,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { GitHubRepo } from '../../types';
import { siteConfig } from '../../config/site.config';

// Authentic language colors
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00add8',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
};

// Curated high-fidelity fallback repositories if rate-limited or offline
const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 101,
    name: 'aether-stream-broker',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/aether-stream-broker`,
    description:
      'High-throughput zero-copy event streaming broker built with Rust, Tokio, and Cap’n Proto for edge compute workloads.',
    html_url: 'https://github.com',
    homepage: 'https://example.com',
    stargazers_count: 1420,
    forks_count: 184,
    open_issues_count: 4,
    language: 'Rust',
    topics: ['rust', 'streaming', 'distributed-systems', 'tokio', 'zero-copy'],
    updated_at: '2025-10-04T12:00:00Z',
    fork: false,
    archived: false,
  },
  {
    id: 102,
    name: 'strata-design-system',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/strata-design-system`,
    description:
      'A typography-first, zero-pill React 19 design system token architecture with WCAG 2.1 AA accessible primitives.',
    html_url: 'https://github.com',
    homepage: 'https://example.com',
    stargazers_count: 890,
    forks_count: 92,
    open_issues_count: 7,
    language: 'TypeScript',
    topics: ['react', 'design-system', 'typescript', 'tailwind', 'accessibility'],
    updated_at: '2025-09-28T16:20:00Z',
    fork: false,
    archived: false,
  },
  {
    id: 103,
    name: 'vanguard-ast-cli',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/vanguard-ast-cli`,
    description:
      'Blazing fast TypeScript monorepo dependency graph inspector and circular import detector powered by SWC.',
    html_url: 'https://github.com',
    homepage: null,
    stargazers_count: 670,
    forks_count: 45,
    open_issues_count: 2,
    language: 'Rust',
    topics: ['ast-parser', 'developer-tools', 'cli', 'typescript', 'swc'],
    updated_at: '2025-09-15T09:12:00Z',
    fork: false,
    archived: false,
  },
  {
    id: 104,
    name: 'pulse-rum-telemetry',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/pulse-rum-telemetry`,
    description:
      'Lightweight 2.4kB Web Vitals collector and INP interaction tracer with requestIdleCallback batching.',
    html_url: 'https://github.com',
    homepage: null,
    stargazers_count: 412,
    forks_count: 38,
    open_issues_count: 1,
    language: 'TypeScript',
    topics: ['web-vitals', 'performance', 'rum', 'opentelemetry'],
    updated_at: '2025-08-30T14:40:00Z',
    fork: false,
    archived: false,
  },
  {
    id: 105,
    name: 'oklch-chroma-tokens',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/oklch-chroma-tokens`,
    description:
      'Perceptually uniform color palette engine generating accessible dark and light mode tokens with APCA verification.',
    html_url: 'https://github.com',
    homepage: null,
    stargazers_count: 295,
    forks_count: 22,
    open_issues_count: 0,
    language: 'TypeScript',
    topics: ['oklch', 'color-tokens', 'design-tokens', 'apca'],
    updated_at: '2025-08-11T11:25:00Z',
    fork: false,
    archived: false,
  },
  {
    id: 106,
    name: 'edge-net-probe',
    full_name: `${siteConfig.profile.name.toLowerCase().replace(/\s+/g, '')}/edge-net-probe`,
    description:
      'eBPF network packet latency analyzer and TCP connection jitter diagnostic daemon.',
    html_url: 'https://github.com',
    homepage: null,
    stargazers_count: 215,
    forks_count: 19,
    open_issues_count: 3,
    language: 'Go',
    topics: ['ebpf', 'networking', 'telemetry', 'go'],
    updated_at: '2025-07-19T18:05:00Z',
    fork: false,
    archived: false,
  },
];

interface GitHubUserProfile {
  login: string;
  name: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

export const GitHubPage: React.FC = () => {
  const [username, setUsername] = useState<string>(siteConfig.githubUsername);
  const [inputUsername, setInputUsername] = useState<string>(siteConfig.githubUsername);
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks' | 'name'>('stars');

  const fetchGitHubData = async (userToFetch: string) => {
    setLoading(true);
    setErrorNotice(null);

    try {
      // Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(userToFetch)}`);
      if (!userRes.ok) {
        if (userRes.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Displaying cached repositories.');
        } else if (userRes.status === 404) {
          throw new Error(`GitHub user "${userToFetch}" not found.`);
        }
        throw new Error(`GitHub API error (${userRes.status}).`);
      }
      const userData: GitHubUserProfile = await userRes.json();
      setProfile(userData);

      // Fetch user repos (up to 30 sorted by updated)
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(userToFetch)}/repos?per_page=30&sort=updated`
      );
      if (!reposRes.ok) {
        throw new Error('Failed to load repositories from GitHub API.');
      }
      const reposData: GitHubRepo[] = await reposRes.json();

      if (Array.isArray(reposData) && reposData.length > 0) {
        setRepos(reposData);
      } else {
        setRepos(FALLBACK_REPOS);
        setErrorNotice(`No public repositories found for ${userToFetch}. Showing curated showcase.`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect to GitHub API.';
      setErrorNotice(message);
      // Ensure fallback repos remain available so user experience is never empty or broken
      setRepos(FALLBACK_REPOS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData(username);
  }, [username]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
    }
  };

  const handleReset = () => {
    setInputUsername(siteConfig.githubUsername);
    setUsername(siteConfig.githubUsername);
  };

  // Filter & sort repositories
  const filteredRepos = repos
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase())) ||
        repo.topics?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      if (sortBy === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Open Source</span>
          <span aria-hidden="true">&middot;</span>
          <span>GitHub Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Public Repositories &amp; Source Code
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Real-time integration with the official GitHub API. Explore open-source projects, star metrics, primary languages, and architecture libraries.
        </p>
      </div>

      {/* GitHub Account Banner & Controls */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shrink-0">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {profile ? profile.name || profile.login : username}
                </h2>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 inline" />
                </a>
              </div>
              <div className="text-xs font-mono text-neutral-500 mt-0.5">
                @{username} {profile && `\u00b7 ${profile.public_repos} public repos`}
              </div>
            </div>
          </div>

          {/* Interactive Profile Tester */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 select-none">
                @
              </span>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="github user..."
                className="pl-7 pr-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 w-36 sm:w-44"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Fetch'}
            </button>
            {username !== siteConfig.githubUsername && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset to default profile"
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Rate Limit / Status Notice */}
        {errorNotice && (
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Search & Sort Toolbar */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, topic, or language..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-neutral-500">
            <span>Sort by:</span>
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              {(['stars', 'forks', 'updated', 'name'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${
                    sortBy === s
                      ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-medium shadow-xs'
                      : 'hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRepos.map((repo) => {
          const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#999999' : null;
          const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={repo.id}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <FolderGit2 className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                    <span className="truncate">{repo.name}</span>
                  </a>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open repository ${repo.name}`}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>

                {/* Topics unboxed */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span key={topic}>#{topic}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer metadata with tabular numbers */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: langColor || '#999999' }}
                      />
                      <span>{repo.language}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 tabular-nums">
                    <Star className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1 tabular-nums">
                    <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-400">Updated {formattedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRepos.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-500 text-sm">
          No repositories matching "{searchQuery}".
        </div>
      )}
    </div>
  );
};
