import React, { useState, useEffect } from 'react';
import { PageRoute, Project, BlogPost, GalleryItem } from './types';
import { siteConfig } from './config/site.config';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { GitHubPage } from './components/pages/GitHubPage';
import { BlogPage } from './components/pages/BlogPage';
import { CaseStudyModal } from './components/modals/CaseStudyModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { ArticleModal } from './components/modals/ArticleModal';
import { ContactModal } from './components/modals/ContactModal';
import MicroSlats from './components/common/MicroSlats';

export default function App() {
  // Sync page route from URL hash if available
  const [activePage, setActivePage] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = ['home', 'about', 'projects', 'gallery', 'github', 'blog'];
      if (validRoutes.includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  // Modals state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  // Sync hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = ['home', 'about', 'projects', 'gallery', 'github', 'blog'];
      if (validRoutes.includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageRoute) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update document title dynamically
    const pageTitles: Record<PageRoute, string> = {
      home: `${siteConfig.profile.name} — ${siteConfig.profile.headline}`,
      about: `About & Career — ${siteConfig.profile.name}`,
      projects: `Engineering Works & Case Studies — ${siteConfig.profile.name}`,
      gallery: `Curated Visual Archive — ${siteConfig.profile.name}`,
      github: `GitHub Repositories & Source — ${siteConfig.profile.name}`,
      blog: `Writings & Architecture Notes — ${siteConfig.profile.name}`,
    };
    document.title = pageTitles[page] || siteConfig.seo.title;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 relative">
      {/* Background MicroSlats */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-40" 
        aria-hidden="true"
      >
        <MicroSlats
          preset="swell"
          color="#A855F7"
          glintColor="#ffffff"
          backgroundColor="transparent"
          slatWidth={10}
          slatHeight={25}
          gap={3}
          roundness={0.75}
          interactive
          cursorStrength={1}
          cursorSize={40}
          swirl={0}
          trail={1.4}
          lean={0}
          intro
        />
      </div>

      {/* 3-Zone Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProject={setSelectedProject}
            onSelectPost={setSelectedPost}
            onOpenContact={() => setContactOpen(true)}
          />
        )}

        {activePage === 'about' && (
          <AboutPage onOpenContact={() => setContactOpen(true)} />
        )}

        {activePage === 'projects' && (
          <ProjectsPage onSelectProject={setSelectedProject} />
        )}

        {activePage === 'gallery' && (
          <GalleryPage onSelectItem={(idx) => setLightboxIndex(idx)} />
        )}

        {activePage === 'github' && <GitHubPage />}

        {activePage === 'blog' && (
          <BlogPage onSelectPost={setSelectedPost} />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Modals & Overlays */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <LightboxModal
        items={siteConfig.gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      <ArticleModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
