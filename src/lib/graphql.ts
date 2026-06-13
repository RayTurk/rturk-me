/**
 * Fetch-based GraphQL client for SSG/RSC.
 * Replaces Apollo — Next's data cache owns caching, with ISR by default.
 */
import { print } from 'graphql';
import type { DocumentNode } from 'graphql';

export class GraphQLRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphQLRequestError';
    this.status = status;
  }
}

export interface FetchGraphQLOptions {
  /**
   * ISR window in seconds. Defaults to 3600 so pages are statically generated
   * and revalidated hourly (the /api/revalidate webhook also purges on demand).
   * Pass `false` to opt a request out of caching entirely (mutations, preview).
   */
  revalidate?: number | false;
}

export async function fetchGraphQL<TData = unknown>(
  document: DocumentNode,
  variables?: Record<string, unknown>,
  options?: FetchGraphQLOptions
): Promise<TData> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new GraphQLRequestError('WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set');
  }

  const revalidate = options?.revalidate ?? 3600;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.WORDPRESS_AUTH_BEARER && {
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_BEARER}`,
      }),
    },
    body: JSON.stringify({ query: print(document), variables }),
    // POST fetches are uncached by default in Next; opt into the data cache so
    // routes stay static + ISR. `revalidate: false` forces a fresh request.
    ...(revalidate === false ? { cache: 'no-store' as const } : { next: { revalidate } }),
  });

  if (!res.ok) {
    throw new GraphQLRequestError(`GraphQL request failed: ${res.status}`, res.status);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new GraphQLRequestError(json.errors[0].message);
  }
  return json.data as TData;
}
