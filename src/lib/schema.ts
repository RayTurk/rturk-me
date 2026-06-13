/**
 * JSON-LD structured-data generators. Pure functions returning schema.org
 * objects; rendered by <JsonLd/>. Identity URLs come from env with sane
 * fallbacks so the build works before launch env vars are set.
 */
import { SITE_URL, SITE_NAME, SITE_AUTHOR } from './constants';

const GITHUB = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/RayTurk';
const LINKEDIN =
  process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/raymond-turk-cle';

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    jobTitle: 'Full-Stack Web Developer',
    url: SITE_URL,
    sameAs: [GITHUB, LINKEDIN],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cleveland',
      addressRegion: 'OH',
      addressCountry: 'US',
    },
    knowsAbout: ['Next.js', 'React', 'TypeScript', 'WordPress', 'WPGraphQL', 'PHP', 'Laravel'],
    description:
      'Cleveland-based full-stack developer building fast, headless, animated web experiences.',
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    author: { '@type': 'Person', name: SITE_AUTHOR },
  };
}

interface ArticleInput {
  title: string;
  date?: string;
  excerpt?: string;
  image?: string;
}

export function generateArticleSchema(post: ArticleInput, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    url,
    datePublished: post.date,
    description: post.excerpt,
    image: post.image,
    author: { '@type': 'Person', name: SITE_AUTHOR, url: SITE_URL },
    publisher: { '@type': 'Person', name: SITE_AUTHOR },
  };
}

interface CreativeWorkInput {
  title: string;
  excerpt?: string;
  image?: string;
}

export function generateCreativeWorkSchema(project: CreativeWorkInput, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url,
    description: project.excerpt,
    image: project.image,
    creator: { '@type': 'Person', name: SITE_AUTHOR, url: SITE_URL },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
