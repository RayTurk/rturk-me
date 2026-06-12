/**
 * Static project data. Used as the primary source while cms.rturk.me is
 * unavailable, and as a fallback whenever WPGraphQL is unreachable.
 *
 * When the CMS is restored and projects are entered in WordPress, this file
 * can be removed and the API will automatically use the CMS data.
 */

import type { Project } from '@/types/wordpress';

// ---------------------------------------------------------------------------
// Shared taxonomy helpers
// ---------------------------------------------------------------------------

function makeTech(id: string, name: string, slug: string) {
  return { id, databaseId: parseInt(id), name, slug };
}

function makeType(id: string, name: string, slug: string) {
  return { id, databaseId: parseInt(id), name, slug };
}

// Tech stacks
const NEXT_JS    = makeTech('t1', 'Next.js',     'nextjs');
const REACT      = makeTech('t2', 'React',        'react');
const TYPESCRIPT = makeTech('t3', 'TypeScript',   'typescript');
const TAILWIND   = makeTech('t4', 'Tailwind CSS', 'tailwind-css');
const FRAMER     = makeTech('t5', 'Framer Motion','framer-motion');
const NETLIFY    = makeTech('t6', 'Netlify',      'netlify');
const WORDPRESS  = makeTech('t7', 'WordPress',    'wordpress');
const WPGRAPHQL  = makeTech('t8', 'WPGraphQL',    'wpgraphql');

// Project types
const TYPE_DEMO      = makeType('p1', 'Demo Site',          'demo-site');
const TYPE_HEADLESS  = makeType('p2', 'Headless WordPress', 'headless-wordpress');
const TYPE_SAAS      = makeType('p3', 'SaaS / App',         'saas-app');
const TYPE_ECOMMERCE = makeType('p4', 'E-Commerce',         'ecommerce');

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const STATIC_PROJECTS: Project[] = [
  // 1 ── Summit HVAC & Plumbing
  {
    id: 'local-1',
    databaseId: 1,
    title: 'Summit HVAC & Plumbing',
    slug: 'summit-hvac',
    excerpt: 'Full-featured contractor website built headless. WordPress manages content, Next.js delivers a fast, SEO-optimised front end for a Greater Cleveland home-service company.',
    content: `<p>Summit HVAC &amp; Plumbing is a headless WordPress demo that shows how a traditional contractor business can benefit from a modern decoupled architecture. WordPress handles all content management while Next.js delivers a fast, fully static front end.</p>
<p>The site features service listings, a team page, testimonials, an emergency contact CTA, and an area-coverage map. All driven by WPGraphQL and rebuilt automatically whenever content changes.</p>`,
    date: '2025-09-01T00:00:00',
    modified: '2025-09-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/summit-hvac.jpg',
        altText: 'Summit HVAC & Plumbing team photo',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'Headless WordPress contractor site for a Greater Cleveland HVAC & plumbing company.',
      projectUrl: 'https://summit-hvac-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Client',
      projectDate: '2025-09-01',
      projectDuration: '2 weeks',
      isFeatured: true,
      projectOrder: 1,
    },
    projectTypes: { nodes: [TYPE_HEADLESS, TYPE_DEMO] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, WORDPRESS, WPGRAPHQL, NETLIFY] },
    projectStatuses: { nodes: [] },
  },

  // 2 ── Luminary Aesthetics
  {
    id: 'local-2',
    databaseId: 2,
    title: 'Luminary Aesthetics',
    slug: 'luminary-aesthetics',
    excerpt: 'High-end med-spa website with a dark, editorial look. Built in Next.js with smooth Framer Motion transitions, treatment pages, pricing, and an online booking flow.',
    content: `<p>Luminary Aesthetics is a premium med-spa demo built to showcase what a boutique aesthetics practice based in Chagrin Falls, OH could look like online.</p>
<p>The design leans into a dark, editorial palette with warm neutrals and subtle gold accents. Framer Motion powers scroll-reveal animations and page transitions. Key sections include treatment detail pages, a pricing guide, before &amp; after gallery, and a multi-step consultation booking form.</p>`,
    date: '2025-10-01T00:00:00',
    modified: '2025-10-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/luminary-aesthetics.jpg',
        altText: 'Luminary Aesthetics studio interior',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'Dark, editorial med-spa site with Framer Motion animations and a booking flow.',
      projectUrl: 'https://luminary-aesthetics-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Client',
      projectDate: '2025-10-01',
      projectDuration: '2 weeks',
      isFeatured: true,
      projectOrder: 2,
    },
    projectTypes: { nodes: [TYPE_DEMO] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, FRAMER, NETLIFY] },
    projectStatuses: { nodes: [] },
  },

  // 3 ── Ember & Oak
  {
    id: 'local-3',
    databaseId: 3,
    title: 'Ember & Oak',
    slug: 'ember-oak',
    excerpt: 'Upscale restaurant website with animated hero, full digital menu, OpenTable integration prompt, and a private dining enquiry form. Dark, wood-fire aesthetic.',
    content: `<p>Ember &amp; Oak is a fine-dining restaurant demo set in Cleveland, OH. The brief was to capture the warmth of a wood-fired kitchen. Rich textures, dramatic photography, and deliberately slow-paced typography.</p>
<p>Sections include a full digital menu with sections &amp; dietary filters, a private dining enquiry form, a meet-the-team page, and a reservations prompt wired to OpenTable. Built entirely in Next.js with Framer Motion for entrance animations.</p>`,
    date: '2025-11-01T00:00:00',
    modified: '2025-11-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/ember-oak.jpg',
        altText: 'Ember & Oak dining room',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'Fine-dining restaurant demo with animated hero, digital menu, and reservation flow.',
      projectUrl: 'https://ember-and-oak-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Client',
      projectDate: '2025-11-01',
      projectDuration: '2 weeks',
      isFeatured: true,
      projectOrder: 3,
    },
    projectTypes: { nodes: [TYPE_DEMO] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, FRAMER, NETLIFY] },
    projectStatuses: { nodes: [] },
  },

  // 4 ── Revive Auto Detailing
  {
    id: 'local-4',
    databaseId: 4,
    title: 'Revive Auto Detailing',
    slug: 'revive-detailing',
    excerpt: 'Auto-detailing shop site with service packages, an online booking form, before & after gallery, and a mobile-first layout designed for same-day appointment conversions.',
    content: `<p>Revive Auto Detailing serves the Greater Cleveland area from a shop in Brooklyn, OH. The site needed to convert mobile visitors into same-day bookings. So the design leads with a clear package comparison, prominent pricing, and a lightweight booking form above the fold.</p>
<p>Additional sections cover the detailing process, a before &amp; after gallery, customer testimonials, and a service-area map. Built in Next.js and deployed to Netlify.</p>`,
    date: '2025-08-01T00:00:00',
    modified: '2025-08-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/revive-detailing.jpg',
        altText: 'Sports car being detailed',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'Mobile-first auto detailing site focused on same-day booking conversions.',
      projectUrl: 'https://revive-detailing-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Client',
      projectDate: '2025-08-01',
      projectDuration: '10 days',
      isFeatured: false,
      projectOrder: 4,
    },
    projectTypes: { nodes: [TYPE_DEMO] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, FRAMER, NETLIFY] },
    projectStatuses: { nodes: [] },
  },

  // 5 ── Clover Garden Centre
  {
    id: 'local-5',
    databaseId: 5,
    title: 'Clover Garden Centre',
    slug: 'clover-garden',
    excerpt: 'Garden centre e-commerce demo with a full product catalogue, category browsing, a seasonal feature section, and a loyalty programme landing page. Hudson, OH.',
    content: `<p>Clover Garden Centre has served Hudson, OH since 1987. This demo shows how a long-established local garden centre can modernise its web presence with a clean, nature-forward design and lightweight e-commerce.</p>
<p>The catalogue covers annuals, perennials, trees &amp; shrubs, and garden supplies. A seasonal section highlights current in-store specials, and a loyalty programme page encourages repeat visits. The shop-like interface was built with Next.js and static data. Ready to connect to a real commerce backend.</p>`,
    date: '2025-07-01T00:00:00',
    modified: '2025-07-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/clover-garden.jpg',
        altText: 'Clover Garden Centre entrance with spring flowers',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'Local garden centre e-commerce demo with product catalogue and seasonal promotions.',
      projectUrl: 'https://clover-garden-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Client',
      projectDate: '2025-07-01',
      projectDuration: '2 weeks',
      isFeatured: false,
      projectOrder: 5,
    },
    projectTypes: { nodes: [TYPE_DEMO, TYPE_ECOMMERCE] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, NETLIFY] },
    projectStatuses: { nodes: [] },
  },

  // 6 ── Beacon
  {
    id: 'local-6',
    databaseId: 6,
    title: 'Beacon',
    slug: 'beacon',
    excerpt: 'SaaS marketing site for a fictional uptime-monitoring product. Pricing tiers, feature comparison, integrations grid, changelog, and an animated hero built in Next.js.',
    content: `<p>Beacon is a SaaS demo that shows the kind of polished marketing site a modern software product needs to convert visitors into trial sign-ups. It covers everything a real SaaS landing page requires: a feature grid, tiered pricing with a toggle, an integrations showcase, a team page, and a public changelog.</p>
<p>The animated hero uses Framer Motion for entrance effects. Dark mode is the default. The project demonstrates how the same Next.js + Tailwind stack used for local-business sites scales naturally to product marketing.</p>`,
    date: '2025-12-01T00:00:00',
    modified: '2025-12-01T00:00:00',
    featuredImage: {
      node: {
        sourceUrl: '/images/projects/beacon.jpg',
        altText: 'Beacon SaaS dashboard preview',
        mediaDetails: { width: 1200, height: 800 },
      },
    },
    projectInfo: {
      projectExcerpt: 'SaaS marketing site demo with pricing tiers, feature grid, and animated hero.',
      projectUrl: 'https://rturk-beacon-demo.netlify.app/',
      githubUrl: '',
    },
    projectDetails: {
      clientName: 'Demo Project',
      projectDate: '2025-12-01',
      projectDuration: '3 weeks',
      isFeatured: true,
      projectOrder: 6,
    },
    projectTypes: { nodes: [TYPE_SAAS, TYPE_DEMO] },
    techStacks: { nodes: [NEXT_JS, REACT, TYPESCRIPT, TAILWIND, FRAMER, NETLIFY] },
    projectStatuses: { nodes: [] },
  },
];

export const STATIC_FEATURED_PROJECTS = STATIC_PROJECTS.filter(
  (p) => p.projectDetails?.isFeatured
).sort(
  (a, b) => (a.projectDetails?.projectOrder ?? 99) - (b.projectDetails?.projectOrder ?? 99)
);
