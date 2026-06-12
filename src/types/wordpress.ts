/**
 * WordPress GraphQL TypeScript Types
 * Comprehensive type definitions for all WordPress content types
 */

// ============================================================================
// MEDIA TYPES
// ============================================================================

export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  };
  sizes?: string;
  srcSet?: string;
}

// ============================================================================
// SEO TYPES
// ============================================================================

export interface SEOFields {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

// ============================================================================
// TAXONOMY TYPES
// ============================================================================

export interface TaxonomyTerm {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

// ============================================================================
// AUTHOR TYPES
// ============================================================================

export interface Author {
  name: string;
  slug: string;
  avatar?: { url: string };
  description?: string;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage?: { node: WPImage };
  projectInfo?: {
    projectType?: string[];
    projectScope?: string;
    projectUrl?: string;
    projectExcerpt?: string;
    githubUrl?: string;
  };
  projectDetails?: {
    clientName?: string;
    projectDate?: string;
    projectDuration?: string;
    isFeatured?: boolean;
    projectOrder?: number;
  };
  projectTypes?: { nodes: TaxonomyTerm[] };
  techStacks?: { nodes: TaxonomyTerm[] };
  projectStatuses?: { nodes: TaxonomyTerm[] };
}

export type ProjectConnection = Connection<Project>;

// ============================================================================
// BLOG POST TYPES
// ============================================================================

export interface BlogPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: { node: Author };
  featuredImage?: { node: WPImage };
  categories?: { nodes: TaxonomyTerm[] };
  tags?: { nodes: TaxonomyTerm[] };
  blogFields: {
    readingTimeOverride?: number;
    postSubtitle?: string;
    showToc: boolean;
    relatedPosts?: BlogPost[];
    ctaText?: string;
    ctaUrl?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  };
  readingTime?: number;
}

export type BlogPostConnection = Connection<BlogPost>;

// ============================================================================
// TESTIMONIAL TYPES
// ============================================================================

export interface Testimonial {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  testimonialDetails?: {
    testimonialAuthorName?: string;
    testimonialAuthorRole?: string;
    testimonialCompany?: string;
    testimonialCompanyUrl?: string;
    testimonialRating?: number;
    isFeaturedTestimonial?: boolean;
  };
  featuredImage?: { node: WPImage };
}

export type TestimonialConnection = Connection<Testimonial>;

// ============================================================================
// MENU TYPES
// ============================================================================

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  target?: string;
  parentId?: string;
  childItems?: { nodes: MenuItem[] };
  cssClasses?: string[];
}

// ============================================================================
// SITE SETTINGS TYPES
// ============================================================================

export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  homeUrl?: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface Connection<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'project' | 'post' | 'service' | 'page';
}

export interface FilterOptions {
  projectTypes?: string[];
  techStacks?: string[];
  categories?: string[];
  tags?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}
