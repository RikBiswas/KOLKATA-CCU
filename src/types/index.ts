export type PageRoute = 'home' | 'about' | 'projects' | 'gallery' | 'github' | 'blog';

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problem: string;
  objectives: string[];
  approach: string;
  architecture: string[];
  challenges: string[];
  outcome: string;
  metrics?: { label: string; value: string }[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Systems' | 'Design Systems' | 'Developer Tools' | 'Open Source';
  status: 'Production' | 'Active' | 'Prototype' | 'Archived';
  year: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  imageAlt: string;
  caseStudy: ProjectCaseStudy;
}

export interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  honors?: string;
  focus: string;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level?: 'Expert' | 'Proficient' | 'Advanced' }[];
}

export interface Achievement {
  year: string;
  title: string;
  issuer: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Architecture' | 'Design Systems' | 'Workspaces' | 'Minimalism';
  date: string;
  description: string;
  exif?: {
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
  };
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  category: string;
  content: {
    sectionTitle: string;
    paragraphs: string[];
  }[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export interface SiteConfig {
  profile: {
    name: string;
    headline: string;
    shortBio: string;
    fullBio: string[];
    location: string;
    timezone: string;
    availability: string;
    email: string;
    avatarInitials: string;
  };
  seo: {
    title: string;
    description: string;
    siteUrl: string;
    keywords: string[];
  };
  socials: SocialLink[];
  enabledPages: {
    home: boolean;
    about: boolean;
    projects: boolean;
    gallery: boolean;
    github: boolean;
    blog: boolean;
  };
  githubUsername: string;
  projects: Project[];
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  achievements: Achievement[];
  gallery: GalleryItem[];
  blogPosts: BlogPost[];
}
