import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  profile: {
    name: 'Kaelen Vance',
    headline: 'Staff Software Architect & Systems Designer',
    shortBio:
      'Designing high-throughput distributed infrastructure, resilient developer tools, and typography-first user interfaces with uncompromising craft.',
    fullBio: [
      'I am a software architect and systems engineer with over 8 years of experience building resilient web applications, distributed data engines, and design systems. My focus sits at the intersection of systems architecture, developer velocity, and human-computer ergonomics.',
      'Currently, I lead architecture initiatives for cloud-native platforms, crafting high-performance protocols and design foundations that empower engineering teams to deliver reliably at scale.',
      'Previously, I contributed to core infrastructure at distributed infrastructure startups, open-source compilers, and high-concurrency event telemetry engines. When not shipping code, I study industrial design, brutalist architecture, and typography theory.'
    ],
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    availability: 'Open for architectural advisory & select collaborations',
    email: 'kaelen.vance.dev@gmail.com',
    avatarInitials: 'KV',
  },
  seo: {
    title: 'Kaelen Vance — Personal Website & Portfolio',
    description:
      'A modern, minimal, typography-focused personal website and portfolio inspired by Once UI, showcasing engineering projects, experience, curated gallery, and GitHub repositories.',
    siteUrl: 'https://kaelenvance.dev',
    keywords: [
      'Software Architect',
      'Full Stack Engineer',
      'TypeScript',
      'Systems Design',
      'Once UI',
      'Distributed Systems',
      'Web Architecture',
      'Design Systems'
    ],
  },
  socials: [
    { platform: 'GitHub', url: 'https://github.com', label: 'github.com/kaelenvance' },
    { platform: 'X / Twitter', url: 'https://x.com', label: '@kaelenvance' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', label: 'linkedin.com/in/kaelenvance' },
    { platform: 'Substack', url: 'https://substack.com', label: 'vance.substack.com' },
  ],
  enabledPages: {
    home: true,
    about: true,
    projects: true,
    gallery: true,
    github: true,
    blog: true,
  },
  githubUsername: 'facebook', // default high-quality public profile for live repository showcases, user can test any username
  projects: [
    {
      id: 'aether-engine',
      title: 'Aether Engine',
      tagline: 'High-concurrency event streaming broker with sub-millisecond dispatch',
      description:
        'A lightweight, embedded stream processing broker designed for edge workloads, supporting zero-allocation serialization and memory-mapped persistence.',
      category: 'Systems',
      status: 'Production',
      year: '2025',
      technologies: ['Rust', 'Tokio', 'Cap’n Proto', 'eBPF', 'Prometheus'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      imageAlt: 'Aether Engine distributed architecture schematic and telemetry graph',
      caseStudy: {
        overview:
          'Aether Engine was engineered to solve high ingestion latency in edge clusters where JVM-based messaging queues consumed excessive memory and introduced unpredictable GC pauses.',
        problem:
          'Legacy message queues at the edge required over 512MB RAM minimum and suffered from p99 tail latency spikes exceeding 65ms under bursty telemetry loads.',
        objectives: [
          'Maintain p99 ingestion latency under 2.5ms at 50,000 events/sec per node',
          'Reduce idle memory footprint to under 32MB RAM',
          'Provide zero-copy serialization with backward-compatible schema migration',
          'Deliver single-binary deployment with zero runtime external dependencies',
        ],
        approach:
          'Constructed a custom ring-buffer ring bus utilizing memory-mapped append-only logs. Replaced JSON payloads with schema-compiled Cap’n Proto zero-copy buffers and integrated Tokio asynchronous I/O multiplexing.',
        architecture: [
          'Non-blocking thread-per-core event dispatch loop',
          'Zero-copy memory mapped ring buffer with atomic write cursors',
          'Embedded LSM-tree index for instantaneous sub-key lookups',
          'eBPF network packet filter for kernel-level connection triage',
        ],
        challenges: [
          'Preventing disk write head thrashing during concurrent consumer replay',
          'Eliminating false sharing across CPU cache lines in the multi-threaded ring buffer',
          'Ensuring strict message ordering across dynamic partition rebalancing',
        ],
        outcome:
          'Achieved a sustained 72,000 events/sec per node on quad-core edge gateways with p99 latency settled at 1.4ms. Memory footprint stabilized at 24MB, cutting edge cloud compute costs by 68%.',
        metrics: [
          { label: 'p99 Tail Latency', value: '1.4ms' },
          { label: 'Throughput', value: '72k msg/s' },
          { label: 'RAM Footprint', value: '24MB' },
          { label: 'Cost Reduction', value: '68%' },
        ],
      },
    },
    {
      id: 'strata-ui',
      title: 'Strata Design System',
      tagline: 'Typography-led, multi-brand React design system built for complex SaaS',
      description:
        'An accessible, zero-runtime CSS tokens architecture with strict spatial rhythm, high-contrast dark mode optics, and polymorphic component primitives.',
      category: 'Design Systems',
      status: 'Active',
      year: '2025',
      technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'CSS Custom Properties'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      imageAlt: 'Strata design system component hierarchy and typography tokens',
      caseStudy: {
        overview:
          'Strata was built to unify four disparate enterprise web applications under a single, coherent design token pipeline while strictly adhering to WCAG 2.1 AA accessibility guidelines.',
        problem:
          'The existing product surface suffered from 14 conflicting button styles, fragmented color palettes, inconsistent keyboard navigation, and uncoordinated dark mode implementations.',
        objectives: [
          'Create a single source of truth for spacing, typography, and color tokens',
          'Achieve 100% WCAG 2.1 AA compliance across all form controls and modals',
          'Ensure zero runtime CSS-in-JS overhead to protect Core Web Vitals',
          'Provide full keyboard navigation and screen-reader accessibility out of the box',
        ],
        approach:
          'Engineered a headless component layer grounded in Radix UI primitives, layered with standard CSS custom properties. Implemented strict anti-AI-slop visual standards: clean unboxed metadata, zero pill badge sandwiches, and disciplined 60-30-10 color distribution.',
        architecture: [
          'Token compiler exporting semantic JSON tokens to CSS variables',
          'Compound component architecture with React 19 context ergonomics',
          'Automated accessibility test suite running axe-core across 45 component fixtures',
          'Interactive documentation playground with live prop controls and code copy',
        ],
        challenges: [
          'Preserving 4.5:1 text contrast ratios across dynamic user-selected accent themes',
          'Eliminating layout shift during font loading and dark mode synchronization',
          'Designing complex data table controls without visual clutter',
        ],
        outcome:
          'Adopted by 18 engineering teams across 4 core products. Component velocity increased by 42%, while design-related UI bugs dropped by 74% within the first two quarters.',
        metrics: [
          { label: 'Adoption Rate', value: '100%' },
          { label: 'A11y Pass Rate', value: '100% AA' },
          { label: 'Bundle Impact', value: '11kB gzip' },
          { label: 'UI Bug Reduction', value: '74%' },
        ],
      },
    },
    {
      id: 'vanguard-cli',
      title: 'Vanguard CLI',
      tagline: 'Next-generation build analyzer and monorepo dependency graph inspector',
      description:
        'A fast developer workstation CLI that parses TypeScript ASTs, visualizes circular dependencies, and identifies unused exports in large-scale codebases.',
      category: 'Developer Tools',
      status: 'Active',
      year: '2024',
      technologies: ['Rust', 'SWC', 'TypeScript', 'Ratatui', 'WebAssembly'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      imageAlt: 'Vanguard terminal user interface showing circular dependency graphs',
      caseStudy: {
        overview:
          'Vanguard CLI was engineered to give frontend architects immediate insight into bloated dependency trees and silent circular imports in monorepos containing over 500,000 lines of code.',
        problem:
          'Existing Node-based AST analyzers took upwards of 90 seconds to parse the monorepo, making pre-commit git hooks prohibitively slow and leading developers to bypass verification checks.',
        objectives: [
          'Scan 500,000 LOC monorepo in under 1.5 seconds',
          'Provide interactive terminal graph visualization without external GUI tools',
          'Generate actionable CI reports highlighting critical import cycles',
          'Offer automated autofix commands for orphan barrel exports',
        ],
        approach:
          'Utilized Rust with the SWC parser to parallelize AST traversal across all CPU cores with Rayon. Rendered an interactive TUI using Ratatui for terminal graph exploration.',
        architecture: [
          'Parallel multi-threaded file scanner and parser using SWC engine',
          'Tarjan’s strongly connected components algorithm for cycle detection',
          'Terminal User Interface (TUI) with vim-style keybindings and search',
          'Compiled WebAssembly module for running the analyzer in web browsers',
        ],
        challenges: [
          'Accurately resolving complex TypeScript path aliases and monorepo tsconfig references',
          'Minimizing terminal screen redrawing flicker during rapid live search',
        ],
        outcome:
          'Decreased monorepo dependency scan time from 94 seconds to 1.1 seconds. Adopted by over 4,000 developers on GitHub with zero native crash reports.',
        metrics: [
          { label: 'Scan Time (500k LOC)', value: '1.1s' },
          { label: 'Speedup', value: '85x' },
          { label: 'Active Installs', value: '4.2k+' },
          { label: 'Cycle Prevention', value: '100%' },
        ],
      },
    },
    {
      id: 'pulse-telemetry',
      title: 'Pulse Observability SDK',
      tagline: 'Zero-overhead client-side performance and error telemetry pipeline',
      description:
        'An ergonomic web vital collector that batches user timing metrics and network traces using requestIdleCallback and Beacon API.',
      category: 'Open Source',
      status: 'Production',
      year: '2024',
      technologies: ['TypeScript', 'Web Vitals API', 'OpenTelemetry', 'Protobuf'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false,
      imageAlt: 'Pulse Observability web vitals timeline breakdown',
      caseStudy: {
        overview:
          'Pulse Observability was developed to track Real User Monitoring (RUM) metrics without introducing CPU overhead or main thread blocking on low-end mobile devices.',
        problem:
          'Commercial APM vendor scripts were adding 45ms of Total Blocking Time (TBT) and bloating client bundle sizes by 85kB.',
        objectives: [
          'Total bundle size under 2.8kB compressed',
          'Zero measurable contribution to Interaction to Next Paint (INP)',
          'Reliable event delivery on browser window unload',
        ],
        approach:
          'Leveraged PerformanceObserver APIs with native navigator.sendBeacon fallback. Queued telemetry in an in-memory priority queue flushed strictly during idle microtasks.',
        architecture: [
          'Event-driven Observer queue utilizing requestIdleCallback',
          'Compact delta-compression algorithm for batch network requests',
          'Native OpenTelemetry format exporter',
        ],
        challenges: [
          'Preventing event loss during sudden iOS Safari mobile tab dismissal',
          'Standardizing INP calculation across varying browser rendering engines',
        ],
        outcome:
          'Provided sub-3kB observability script that captured 99.8% of navigation events while consuming 0ms of main thread execution time during user interactions.',
        metrics: [
          { label: 'Script Size', value: '2.4kB' },
          { label: 'TBT Impact', value: '0ms' },
          { label: 'Delivery Rate', value: '99.8%' },
        ],
      },
    },
    {
      id: 'chroma-tokens',
      title: 'Chroma Token Engine',
      tagline: 'OKLCH color palette generator with perceptual contrast validation',
      description:
        'A browser-based color utility for design system engineers to generate mathematically uniform OKLCH tints, shades, and accessible contrast pairs.',
      category: 'Developer Tools',
      status: 'Active',
      year: '2024',
      technologies: ['TypeScript', 'OKLCH Color Model', 'Canvas API', 'Tailwind CSS'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false,
      imageAlt: 'Chroma Token Engine perceptual contrast color curves',
      caseStudy: {
        overview:
          'Traditional RGB/HSL color spaces fail to provide uniform perceived lightness, resulting in dark mode colors that feel washed out or illegible. Chroma Token Engine automates OKLCH color generation.',
        problem:
          'Designers manually adjusted hex values across 10 elevation steps, leading to contrast failures when switching from light to dark surfaces.',
        objectives: [
          'Compute APCA and WCAG 2.1 contrast ratios dynamically in browser',
          'Export directly to Tailwind config, CSS custom properties, and Figma tokens',
        ],
        approach:
          'Implemented CIE OKLCH mathematical conversion matrices in TypeScript. Created live gamut-clamping visualizations for sRGB and Display P3 color spaces.',
        architecture: [
          'OKLCH perceptual conversion algorithms',
          'Web Worker contrast validator for 1,000+ shade combinations',
          'Clipboard export generator for Tailwind v4 and CSS variables',
        ],
        challenges: ['Handling P3 wide gamut boundaries gracefully on standard sRGB displays'],
        outcome:
          'Used by 1,200+ designers and frontend engineers to audit and generate production-ready design tokens.',
        metrics: [
          { label: 'Calculation Time', value: '<2ms' },
          { label: 'Export Formats', value: '5' },
        ],
      },
    },
  ],
  experience: [
    {
      role: 'Staff Software Architect',
      company: 'Axiom Infrastructure Labs',
      location: 'San Francisco, CA',
      period: '2023 — Present',
      description:
        'Directing architecture for next-generation distributed systems, cloud observability platforms, and unified web application frameworks.',
      highlights: [
        'Designed high-throughput distributed event broker processing 10B+ daily records with sub-2ms p99 dispatch latency',
        'Spearheaded the migration of 6 core applications to a consolidated React 19 and Tailwind design token architecture',
        'Authored company-wide technical RFCs for zero-trust API contracts and schema validation pipelines',
        'Mentored 14 senior and staff engineers across 3 distributed engineering groups',
      ],
      technologies: ['TypeScript', 'Rust', 'Distributed Systems', 'React', 'eBPF', 'Tailwind CSS'],
    },
    {
      role: 'Lead Systems Engineer',
      company: 'Helios Distributed Cloud',
      location: 'San Francisco, CA',
      period: '2021 — 2023',
      description:
        'Led a core platform team of 8 engineers delivering edge routing gateways, developer toolchains, and real-time dashboard experiences.',
      highlights: [
        'Built an edge reverse proxy reducing global p95 TTFB by 48% across 32 regional edge locations',
        'Architected an internal developer portal and CLI tool suite adopted by 350+ engineers',
        'Implemented rigorous automated CI performance regression gates preventing bundle bloat and memory leaks',
      ],
      technologies: ['TypeScript', 'Go', 'GraphQL', 'Next.js', 'Docker', 'Kubernetes'],
    },
    {
      role: 'Senior Frontend Engineer',
      company: 'Vesper Interactive',
      location: 'Austin, TX (Remote)',
      period: '2018 — 2021',
      description:
        'Architected high-performance web applications, interactive data visualization tools, and foundational component libraries.',
      highlights: [
        'Created enterprise design system used across 12 product surfaces with 100% WCAG AA compliance',
        'Optimized core application rendering pipeline, improving Core Web Vitals LCP from 3.8s to 0.9s',
        'Designed real-time financial charting canvas handling 60fps streaming market data',
      ],
      technologies: ['React', 'TypeScript', 'WebGL', 'Canvas API', 'Node.js', 'Tailwind CSS'],
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science & Mathematics',
      institution: 'University of California, Berkeley',
      period: '2014 — 2018',
      location: 'Berkeley, CA',
      honors: 'Summa Cum Laude · Regents’ Scholar',
      focus: 'Distributed Systems, Formal Verification, Computer Graphics',
    },
  ],
  skills: [
    {
      category: 'Languages & Core',
      skills: [
        { name: 'TypeScript', level: 'Expert' },
        { name: 'JavaScript (ESNext)', level: 'Expert' },
        { name: 'Rust', level: 'Proficient' },
        { name: 'Go', level: 'Proficient' },
        { name: 'Python', level: 'Advanced' },
        { name: 'SQL', level: 'Advanced' },
      ],
    },
    {
      category: 'Frontend & UI Architecture',
      skills: [
        { name: 'React 19 / Modern Hooks', level: 'Expert' },
        { name: 'Tailwind CSS & Token Systems', level: 'Expert' },
        { name: 'Web Performance & Core Web Vitals', level: 'Expert' },
        { name: 'Accessibility (WCAG 2.1 AA)', level: 'Expert' },
        { name: 'State Machines & Complex UI Logic', level: 'Advanced' },
        { name: 'Canvas & Data Visualization', level: 'Advanced' },
      ],
    },
    {
      category: 'Systems & Infrastructure',
      skills: [
        { name: 'Distributed Systems Architecture', level: 'Expert' },
        { name: 'Event-Driven Systems & Streaming', level: 'Advanced' },
        { name: 'High-Throughput API Design', level: 'Expert' },
        { name: 'Docker & Containerization', level: 'Advanced' },
        { name: 'CI/CD & Release Engineering', level: 'Advanced' },
        { name: 'Observability & OpenTelemetry', level: 'Advanced' },
      ],
    },
    {
      category: 'Tooling & Methodology',
      skills: [
        { name: 'Developer Tooling & CLIs', level: 'Expert' },
        { name: 'AST Parsers & Code Analysis', level: 'Advanced' },
        { name: 'RFC Authoring & Tech Strategy', level: 'Expert' },
        { name: 'Monorepo Architecture', level: 'Advanced' },
        { name: 'Test-Driven Architecture', level: 'Advanced' },
      ],
    },
  ],
  achievements: [
    {
      year: '2025',
      title: 'Keynote Speaker: Designing for Millisecond Determinism',
      issuer: 'SystemsCon Global',
      description:
        'Delivered keynote presentation on edge-first stream processing and zero-copy memory ring architecture to an audience of 1,800+ systems engineers.',
    },
    {
      year: '2024',
      title: 'Open Source Excellence Award',
      issuer: 'Developer Tooling Guild',
      description:
        'Recognized for open-source contributions to AST analysis tooling and static dependency verification in large-scale TypeScript codebases.',
    },
    {
      year: '2023',
      title: 'Architectural Excellence Citation',
      issuer: 'Helios Engineering Council',
      description:
        'Awarded for the design and deployment of the global edge routing gateway that reduced p95 global latency by nearly 50%.',
    },
  ],
  gallery: [
    {
      id: 'gallery-brutalist-study',
      title: 'Monolithic Geometry & Shadow Studies',
      category: 'Architecture',
      date: 'Autumn 2025',
      description:
        'Study of raw concrete planes, sharp geometric light transitions, and structural proportion in contemporary brutalist architecture.',
      exif: {
        camera: 'Leica Q3',
        lens: 'Summilux 28mm f/1.7 ASPH',
        settings: '1/500s · f/5.6 · ISO 100',
        location: 'Kyoto Institute of Technology, Japan',
      },
      aspectRatio: '16:9',
    },
    {
      id: 'gallery-token-system',
      title: 'Spatial Rhythm & Token Specimen',
      category: 'Design Systems',
      date: 'Summer 2025',
      description:
        'Mathematical visualization of base-4 typography and spatial padding scales, establishing optical balance across dark and light surfaces.',
      exif: {
        camera: 'Vector Asset Study',
        lens: 'Pixel-perfect 1440px grid',
        settings: 'OKLCH gamut · Strict 60-30-10 distribution',
        location: 'Studio Workspace',
      },
      aspectRatio: '4:3',
    },
    {
      id: 'gallery-workspace-rig',
      title: 'Acoustic & Engineering Station',
      category: 'Workspaces',
      date: 'Spring 2025',
      description:
        'Curated mechanical keyboard, planar magnetic reference audio, and matte high-density display setup optimized for deep engineering focus.',
      exif: {
        camera: 'Fujifilm X-T5',
        lens: 'XF 33mm f/1.4 R LM WR',
        settings: '1/125s · f/2.0 · ISO 200',
        location: 'San Francisco Studio',
      },
      aspectRatio: '16:9',
    },
    {
      id: 'gallery-kinetic-form',
      title: 'Brutalist Concrete & Ambient Daylight',
      category: 'Minimalism',
      date: 'Winter 2024',
      description:
        'Interplay between textured travertine, architectural glass, and quiet morning shadows.',
      exif: {
        camera: 'Leica M11',
        lens: 'Apo-Summicron-M 50mm f/2 ASPH',
        settings: '1/250s · f/4.0 · ISO 64',
        location: 'Barbican Estate, London',
      },
      aspectRatio: '4:3',
    },
    {
      id: 'gallery-terminal-telemetry',
      title: 'High-Density Diagnostic Interface',
      category: 'Design Systems',
      date: 'Late 2024',
      description:
        'Typographic hierarchy for high-frequency trading and distributed telemetry displays, emphasizing zero visual fatigue and tabular alignment.',
      exif: {
        camera: 'Digital Interface Specimen',
        lens: 'Monospace 13px tabular figures',
        settings: 'JetBrains Mono · 4.8:1 minimum contrast',
        location: 'Axiom Infrastructure Labs',
      },
      aspectRatio: '16:9',
    },
    {
      id: 'gallery-materials-study',
      title: 'Tactile Materials & Industrial Surfaces',
      category: 'Minimalism',
      date: 'Mid 2024',
      description:
        'Anodized aluminum, matte ceramics, and natural walnut textures under diffuse northern daylight.',
      exif: {
        camera: 'Sony A7R V',
        lens: 'FE 50mm f/1.2 GM',
        settings: '1/160s · f/2.8 · ISO 100',
        location: 'Zurich Design Museum, Switzerland',
      },
      aspectRatio: '4:3',
    },
  ],
  blogPosts: [
    {
      id: 'post-systems-tail-latency',
      slug: 'taming-tail-latency-in-distributed-edge-systems',
      title: 'Taming Tail Latency: Architectural Patterns for Edge-Native Systems',
      date: 'October 2, 2025',
      readTime: '6 min read',
      category: 'Systems Architecture',
      summary:
        'How zero-copy ring buffers, eBPF packet steering, and proactive deadline propagation can eliminate the dreaded p99 latency spikes in distributed clusters.',
      content: [
        {
          sectionTitle: 'The Anatomy of the 99th Percentile',
          paragraphs: [
            'In distributed systems, the average latency is a comforting lie. A service reporting a 5ms median response time can easily subject 1 out of 100 requests to 200ms delays. When a user action spans 10 downstream microservices, the probability of experiencing tail latency approaches 10%.',
            'Most engineers default to caching or scaling replicas. However, at the edge, tail latency rarely stems from CPU saturation—it is almost always driven by memory allocation overhead, queue head-of-line blocking, and unpredictable garbage collection cycles.',
          ],
        },
        {
          sectionTitle: 'Zero-Allocation Memory Structures',
          paragraphs: [
            'By adopting fixed-capacity ring buffers backed by memory-mapped files, we eliminate heap churn entirely during steady-state ingestion. Every incoming event is parsed into pre-allocated memory pools.',
            'Furthermore, using zero-copy binary serialization formats (such as Cap’n Proto or FlatBuffers) allows traversal of complex data payloads directly within network receive buffers without deserialization allocations.',
          ],
        },
        {
          sectionTitle: 'Hedge Requests & Proactive Deadlines',
          paragraphs: [
            'When a replica fails to acknowledge an RPC within its 95th percentile expected threshold, a client-side hedge request is immediately dispatched to an alternate node. The first response wins, and the redundant RPC is cancelled via cancellation tokens.',
            'Implementing this simple pattern across our edge gateway cluster compressed our overall p99 tail latency from 84ms down to 3.2ms with only a 2.4% increase in total network traffic.',
          ],
        },
      ],
    },
    {
      id: 'post-design-systems-tokens',
      slug: 'spatial-discipline-and-zero-pill-design-systems',
      title: 'Spatial Discipline & Zero-Pill Design: Crafting Timeless Interfaces',
      date: 'August 14, 2025',
      readTime: '5 min read',
      category: 'Design Systems',
      summary:
        'Why the recent wave of rounded pill capsules and glassmorphism degrades typographic clarity, and how to build high-clarity interfaces with typographic math.',
      content: [
        {
          sectionTitle: 'The Pill Proliferation Dilemma',
          paragraphs: [
            'Modern web applications have developed an addiction to capsule badges. Every timestamp, status, tag, category, and author label is frequently packaged in its own rounded container with a pastel background and a 1px border. The result is visual noise that fractures reading rhythm.',
            'Great editorial typography has never needed a pill box to denote a publication date. Clean whitespace and quiet punctuation marks (such as the middle dot · or a slash /) establish relationship and hierarchy with zero decorative baggage.',
          ],
        },
        {
          sectionTitle: 'Mathematical Spatial Scales',
          paragraphs: [
            'A design system is only as solid as its spatial math. Outer container padding must always equal or exceed the internal gap between its child components. Button horizontal padding should consistently scale to approximately twice its vertical padding.',
            'When nesting rounded elements, maintaining concentric harmony requires r_inner = r_outer - padding. Breaking this rule causes awkward visual cramping that users instinctively perceive as unpolished.',
          ],
        },
        {
          sectionTitle: 'The 60-30-10 Color Discipline',
          paragraphs: [
            'Reserve color strictly for intent. Dedicate 60% of the surface to the dominant neutral background, 30% to structural borders and muted typography, and strictly 10% to focal accent colors at interactive touchpoints. An interface that shouts everywhere achieves silence nowhere.',
          ],
        },
      ],
    },
    {
      id: 'post-web-vitals-inp',
      slug: 'mastering-interaction-to-next-paint',
      title: 'Mastering Interaction to Next Paint (INP) in Complex React Applications',
      date: 'May 28, 2025',
      readTime: '7 min read',
      category: 'Web Performance',
      summary:
        'Deep dive into the browser event loop, scheduling microtasks with requestIdleCallback, and eliminating main-thread locking during high-frequency user inputs.',
      content: [
        {
          sectionTitle: 'Understanding INP Beyond First Input Delay',
          paragraphs: [
            'First Input Delay (FID) measured only the delay before the browser began processing the very first click. INP, by contrast, tracks every single interaction across the entire lifespan of the page session, reporting the worst or near-worst delay until visual paint.',
            'This means a bloated click handler triggered on minute 15 of user session can permanently degrade your application’s Core Web Vitals score.',
          ],
        },
        {
          sectionTitle: 'Yielding to the Main Thread',
          paragraphs: [
            'Long JavaScript tasks (>50ms) prevent the browser from executing the compositor and style recalculations needed to show user feedback. Using scheduler.yield() or strategic setTimeout(..., 0) boundaries breaks monolithic processing loops into bite-sized chunks.',
            'React 19’s transition primitives allow developers to mark non-urgent state updates as interruptible, ensuring typing, slider drags, and modal toggles retain crisp 60fps responsiveness.',
          ],
        },
      ],
    },
  ],
};
