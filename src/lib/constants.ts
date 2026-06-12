/**
 * Site-wide Constants and Configuration
 */

// ============================================================================
// SITE METADATA
// ============================================================================

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Ray Turk';
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Cleveland-based WordPress and full-stack developer specializing in web maintenance, hosting, updates, and custom website builds.';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rturk.me';
export const SITE_AUTHOR =
  process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Ray Turk';

// ============================================================================
// DEFAULT SEO
// ============================================================================

export const DEFAULT_OG_IMAGE =
  process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE ||
  `${SITE_URL}/api/og`;
export const DEFAULT_TWITTER_HANDLE =
  process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@rayturk';

// ============================================================================
// CACHING AND ISR
// ============================================================================

/**
 * Revalidate interval for ISR (Incremental Static Regeneration) in seconds
 * Default: 3600 (1 hour)
 */
export const REVALIDATE_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_REVALIDATE_INTERVAL || '3600', 10);

/**
 * Revalidate intervals for different content types
 */
export const REVALIDATE_INTERVALS = {
  HOMEPAGE: 3600, // 1 hour
  PROJECTS: 7200, // 2 hours
  POSTS: 3600, // 1 hour
  SERVICES: 86400, // 24 hours
  TESTIMONIALS: 604800, // 7 days
  SETTINGS: 86400, // 24 hours
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const POSTS_PER_PAGE = 10;
export const PROJECTS_PER_PAGE = 12;
export const TESTIMONIALS_PER_PAGE = 6;

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAV_ITEMS = [
  { label: 'Home', href: '/', target: '_self' },
  { label: 'Projects', href: '/projects', target: '_self' },
  { label: 'Blog', href: '/blog', target: '_self' },
  { label: 'Services', href: '/services', target: '_self' },
  { label: 'About', href: '/about', target: '_self' },
  { label: 'Contact', href: '/contact', target: '_self' },
] as const;

export const FOOTER_NAV_ITEMS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap.xml' },
] as const;

// ============================================================================
// SOCIAL MEDIA
// ============================================================================

export const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    platform: 'twitter',
    url: process.env.NEXT_PUBLIC_TWITTER_URL || '#',
    icon: 'twitter',
  },
  {
    name: 'GitHub',
    platform: 'github',
    url: process.env.NEXT_PUBLIC_GITHUB_URL || '#',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    platform: 'linkedin',
    url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    platform: 'email',
    url: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'rturk.me@gmail.com'}`,
    icon: 'email',
  },
] as const;

// ============================================================================
// SERVICES (Fallback Content)
// ============================================================================

export const SERVICE_HIGHLIGHTS = [
  {
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies',
    icon: '🚀',
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive interfaces that users love',
    icon: '✨',
  },
  {
    title: 'Performance',
    description: 'Fast, optimized, and SEO-friendly websites',
    icon: '⚡',
  },
] as const;

// ============================================================================
// ANIMATION VARIANTS (Framer Motion)
// ============================================================================

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
  staggerContainer: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
} as const;

// ============================================================================
// TAILWIND BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

// ============================================================================
// COLOR PALETTE (Tailwind)
// ============================================================================

export const COLORS = {
  primary: 'rgb(59, 130, 246)', // blue-500
  primaryLight: 'rgb(219, 234, 254)', // blue-100
  primaryDark: 'rgb(29, 78, 216)', // blue-700
  secondary: 'rgb(168, 85, 247)', // purple-500
  accent: 'rgb(59, 130, 246)', // blue-500
  background: 'rgb(255, 255, 255)', // white
  backgroundAlt: 'rgb(249, 250, 251)', // slate-50
  text: 'rgb(15, 23, 42)', // slate-900
  textMuted: 'rgb(100, 116, 139)', // slate-500
  border: 'rgb(203, 213, 225)', // slate-300
  error: 'rgb(239, 68, 68)', // red-500
  success: 'rgb(34, 197, 94)', // green-500
  warning: 'rgb(245, 158, 11)', // amber-500
  info: 'rgb(59, 130, 246)', // blue-500
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  headingXL: 'text-4xl font-bold',
  headingLarge: 'text-3xl font-bold',
  headingMedium: 'text-2xl font-bold',
  headingSmall: 'text-xl font-semibold',
  bodyLarge: 'text-lg',
  body: 'text-base',
  bodySmall: 'text-sm',
  caption: 'text-xs',
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// CONTENT SETTINGS
// ============================================================================

/**
 * Maximum number of related posts to show
 */
export const MAX_RELATED_POSTS = 3;

/**
 * Default excerpt length in characters
 */
export const DEFAULT_EXCERPT_LENGTH = 160;

/**
 * Featured projects count
 */
export const FEATURED_PROJECTS_COUNT = 6;

/**
 * Featured services count
 */
export const FEATURED_SERVICES_COUNT = 3;

/**
 * Featured testimonials count
 */
export const FEATURED_TESTIMONIALS_COUNT = 6;

/**
 * Recent posts count on homepage
 */
export const RECENT_POSTS_COUNT = 3;

// ============================================================================
// EXTERNAL LINKS
// ============================================================================

export const EXTERNAL_LINKS = {
  resume: process.env.NEXT_PUBLIC_RESUME_URL || '#',
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#',
  liveChat: process.env.NEXT_PUBLIC_LIVE_CHAT_URL || '',
} as const;

// ============================================================================
// FORM SETTINGS
// ============================================================================

export const FORM_CONFIG = {
  contactForm: {
    successMessage: 'Thank you for reaching out! We will get back to you soon.',
    errorMessage: 'Something went wrong. Please try again later.',
    submitButtonText: 'Send Message',
  },
  newsLetter: {
    successMessage: 'Thank you for subscribing!',
    errorMessage: 'Failed to subscribe. Please try again.',
    submitButtonText: 'Subscribe',
  },
} as const;

// ============================================================================
// FEATURES FLAGS
// ============================================================================

export const FEATURES = {
  BLOG_ENABLED: process.env.NEXT_PUBLIC_BLOG_ENABLED !== 'false',
  PROJECTS_ENABLED: process.env.NEXT_PUBLIC_PROJECTS_ENABLED !== 'false',
  SERVICES_ENABLED: process.env.NEXT_PUBLIC_SERVICES_ENABLED !== 'false',
  TESTIMONIALS_ENABLED: process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED !== 'false',
  NEWSLETTER_ENABLED: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED !== 'false',
  DARK_MODE_ENABLED: process.env.NEXT_PUBLIC_DARK_MODE_ENABLED !== 'false',
} as const;
