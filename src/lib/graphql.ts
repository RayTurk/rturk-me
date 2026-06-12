/**
 * Fetch-based GraphQL client for SSG/RSC.
 * Replaces Apollo: no client cache wanted — Next's data layer owns caching.
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

export async function fetchGraphQL<TData = unknown>(
  document: DocumentNode,
  variables?: Record<string, unknown>
): Promise<TData> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new GraphQLRequestError('WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.WORDPRESS_AUTH_BEARER && {
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_BEARER}`,
      }),
    },
    body: JSON.stringify({ query: print(document), variables }),
    cache: 'no-store',
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
