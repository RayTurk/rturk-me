/**
 * High-level API Functions
 * Wraps GraphQL queries and provides typed data
 */

/* eslint-disable @typescript-eslint/no-explicit-any --
 * GraphQL responses are read as `any` until codegen is unblocked (WPGraphQL
 * introspection is disabled on prod). See codegen.ts. Once generated types
 * land, replace fetchGraphQL<any> with the typed operations and drop this. */

import { fetchGraphQL } from './graphql';
import {
  GET_ALL_PROJECTS,
  GET_PROJECT_BY_SLUG,
  GET_FEATURED_PROJECTS,
  GET_ALL_PROJECT_SLUGS,
  GET_PROJECTS_BY_TYPE,
  GET_PROJECTS_BY_TECH_STACK,
  GET_ALL_POSTS,
  GET_POST_BY_SLUG,
  GET_RECENT_POSTS,
  GET_ALL_POST_SLUGS,
  GET_POSTS_BY_CATEGORY,
  GET_POSTS_BY_TAG,
  GET_RELATED_POSTS,
  GET_SITE_SETTINGS,
  GET_PRIMARY_MENU,
  GET_FOOTER_MENU,
  GET_MENU_BY_LOCATION,
  GET_SITE_INFO,
} from './queries';
import { STATIC_PROJECTS, STATIC_FEATURED_PROJECTS } from './data/projects';

import {
  Project,
  BlogPost,
  MenuItem,
  SiteSettings,
  PageInfo,
} from '@/types/wordpress';
import { FEATURED_PROJECTS_COUNT, RECENT_POSTS_COUNT } from './constants';

// ============================================================================
// PROJECT API FUNCTIONS
// ============================================================================

/**
 * Get all projects with pagination
 */
export async function getAllProjects(
  first: number = 100,
  after?: string
): Promise<{ projects: Project[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_PROJECTS, { first, after });

    const projects: Project[] = data.projects?.nodes || [];
    if (projects.length > 0) {
      return {
        projects,
        pageInfo: data.projects?.pageInfo || { hasNextPage: false, hasPreviousPage: false },
      };
    }
    // CMS returned no projects — fall back to static data
    return { projects: STATIC_PROJECTS, pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  } catch (error) {
    console.error('Error fetching all projects. Using static fallback:', error);
    return {
      projects: STATIC_PROJECTS,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    };
  }
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const data = await fetchGraphQL<any>(GET_PROJECT_BY_SLUG, { slug });

    if (data.project) return data.project;
    // CMS returned nothing — try static fallback
    return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}. Trying static fallback:`, error);
    return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const data = await fetchGraphQL<any>(GET_FEATURED_PROJECTS);

    const allProjects: Project[] = data.projects?.nodes || [];
    const featured = allProjects
      .filter((p) => p.projectDetails?.isFeatured)
      .sort((a, b) => (a.projectDetails?.projectOrder ?? 99) - (b.projectDetails?.projectOrder ?? 99))
      .slice(0, FEATURED_PROJECTS_COUNT);

    if (featured.length > 0) return featured;
    // CMS returned nothing — fall back to static featured projects
    return STATIC_FEATURED_PROJECTS.slice(0, FEATURED_PROJECTS_COUNT);
  } catch (error) {
    console.error('Error fetching featured projects. Using static fallback:', error);
    return STATIC_FEATURED_PROJECTS.slice(0, FEATURED_PROJECTS_COUNT);
  }
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_PROJECT_SLUGS);

    const slugs: string[] = data.projects?.nodes?.map((p: Project) => p.slug) || [];
    if (slugs.length > 0) return slugs;
    return STATIC_PROJECTS.map((p) => p.slug);
  } catch (error) {
    console.error('Error fetching project slugs. Using static fallback:', error);
    return STATIC_PROJECTS.map((p) => p.slug);
  }
}

/**
 * Get projects by type (taxonomy)
 */
export async function getProjectsByType(
  typeSlug: string,
  first: number = 12
): Promise<{ projects: Project[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_PROJECTS_BY_TYPE, { typeSlug, first });

    return {
      projects: data.projects?.nodes || [],
      pageInfo: data.projects?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching projects by type ${typeSlug}:`, error);
    return {
      projects: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Get projects by tech stack
 */
export async function getProjectsByTechStack(
  techSlug: string,
  first: number = 12
): Promise<{ projects: Project[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_PROJECTS_BY_TECH_STACK, { techSlug, first });

    return {
      projects: data.projects?.nodes || [],
      pageInfo: data.projects?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching projects by tech stack ${techSlug}:`, error);
    return {
      projects: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Get related projects by taxonomy
 */
export async function getRelatedProjects(
  projectId: string | number,
  typeId?: string | number,
  first: number = 3
): Promise<Project[]> {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_PROJECTS, { first: first + 1 });

    const projects = data.projects?.nodes || [];
    // Filter out current project and limit to first N
    return projects
      .filter((p: Project) => p.id !== projectId)
      .slice(0, first);
  } catch (error) {
    console.error(`Error fetching related projects:`, error);
    return [];
  }
}

// ============================================================================
// BLOG POST API FUNCTIONS
// ============================================================================

/**
 * Get all posts with pagination
 */
export async function getAllPosts(
  first: number = 10,
  after?: string
): Promise<{ posts: BlogPost[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_POSTS, { first, after });

    return {
      posts: data.posts?.nodes || [],
      pageInfo: data.posts?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return {
      posts: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    };
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await fetchGraphQL<any>(GET_POST_BY_SLUG, { slug });

    return data.post || null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get recent posts
 */
export async function getRecentPosts(count: number = RECENT_POSTS_COUNT): Promise<BlogPost[]> {
  try {
    const data = await fetchGraphQL<any>(GET_RECENT_POSTS, { count });

    return data.posts?.nodes || [];
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<any>(GET_ALL_POST_SLUGS);

    return data.posts?.nodes?.map((p: BlogPost) => p.slug) || [];
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  categorySlug: string,
  first: number = 10
): Promise<{ posts: BlogPost[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_POSTS_BY_CATEGORY, { categorySlug, first });

    return {
      posts: data.posts?.nodes || [],
      pageInfo: data.posts?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts by category ${categorySlug}:`, error);
    return {
      posts: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  tagSlug: string,
  first: number = 10
): Promise<{ posts: BlogPost[]; pageInfo: PageInfo }> {
  try {
    const data = await fetchGraphQL<any>(GET_POSTS_BY_TAG, { tagSlug, first });

    return {
      posts: data.posts?.nodes || [],
      pageInfo: data.posts?.pageInfo || {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts by tag ${tagSlug}:`, error);
    return {
      posts: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Get related posts
 */
export async function getRelatedPosts(
  categoryIds: string[],
  currentPostId: string,
  first: number = 3
): Promise<BlogPost[]> {
  try {
    const data = await fetchGraphQL<any>(GET_RELATED_POSTS, { categoryIds, currentPostId, first });

    return data.posts?.nodes || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// ============================================================================
// SITE SETTINGS & MENU API FUNCTIONS
// ============================================================================

/**
 * Get all site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await fetchGraphQL<any>(GET_SITE_SETTINGS);

    return data.siteSettings || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

/**
 * Get primary menu
 */
export async function getPrimaryMenu(): Promise<MenuItem[]> {
  try {
    const data = await fetchGraphQL<any>(GET_PRIMARY_MENU);

    return data.menu?.menuItems?.nodes || [];
  } catch (error) {
    console.error('Error fetching primary menu:', error);
    return [];
  }
}

/**
 * Get footer menu
 */
export async function getFooterMenu(): Promise<MenuItem[]> {
  try {
    const data = await fetchGraphQL<any>(GET_FOOTER_MENU);

    return data.menu?.menuItems?.nodes || [];
  } catch (error) {
    console.error('Error fetching footer menu:', error);
    return [];
  }
}

/**
 * Get menu by location
 */
export async function getMenuByLocation(location: string): Promise<MenuItem[]> {
  try {
    const data = await fetchGraphQL<any>(GET_MENU_BY_LOCATION, { location: location.toUpperCase() });

    return data.menu?.menuItems?.nodes || [];
  } catch (error) {
    console.error(`Error fetching menu at location ${location}:`, error);
    return [];
  }
}

/**
 * Get site info (for SEO and headers)
 */
export async function getSiteInfo(): Promise<{
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteSettings: SiteSettings | null;
} | null> {
  try {
    const data = await fetchGraphQL<any>(GET_SITE_INFO);

    return {
      siteName: data.generalSettings?.title || '',
      siteDescription: data.generalSettings?.description || '',
      siteUrl: data.generalSettings?.url || '',
      siteSettings: data.siteSettings || null,
    };
  } catch (error) {
    console.error('Error fetching site info:', error);
    return null;
  }
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export const api = {
  // Projects
  getAllProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getAllProjectSlugs,
  getProjectsByType,
  getProjectsByTechStack,

  // Posts
  getAllPosts,
  getPostBySlug,
  getRecentPosts,
  getAllPostSlugs,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,

  // Settings & Menus
  getSiteSettings,
  getPrimaryMenu,
  getFooterMenu,
  getMenuByLocation,
  getSiteInfo,
};
