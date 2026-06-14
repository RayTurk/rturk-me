import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllProjectSlugs } from '@/lib/api';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

/** Static + dynamic sitemap. Slug fetches fall back to [] on CMS error, so the
 *  build never fails — static routes always ship. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/work', '/writing', '/about', '/colophon', '/contact', '/privacy', '/terms'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })
  );

  const [postSlugs, projectSlugs] = await Promise.all([
    getAllPostSlugs().catch(() => [] as string[]),
    getAllProjectSlugs().catch(() => [] as string[]),
  ]);

  const postRoutes = postSlugs.map((slug) => ({
    url: `${SITE_URL}/writing/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
