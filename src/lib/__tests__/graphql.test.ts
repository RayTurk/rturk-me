import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gql from 'graphql-tag';
import { fetchGraphQL, GraphQLRequestError } from '../graphql';

const QUERY = gql`query Ping { ping }`;

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok, status,
    json: () => Promise.resolve(body),
  }));
}

describe('fetchGraphQL', () => {
  beforeEach(() => vi.stubEnv('WORDPRESS_GRAPHQL_ENDPOINT', 'https://cms.example.com/graphql'));
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it('returns data on success', async () => {
    mockFetchOnce({ data: { ping: 'pong' } });
    const data = await fetchGraphQL<{ ping: string }>(QUERY);
    expect(data.ping).toBe('pong');
  });

  it('POSTs printed query and variables to the endpoint', async () => {
    mockFetchOnce({ data: {} });
    await fetchGraphQL(QUERY, { first: 5 });
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://cms.example.com/graphql');
    const body = JSON.parse(init.body);
    expect(body.query).toContain('query Ping');
    expect(body.variables).toEqual({ first: 5 });
  });

  it('throws GraphQLRequestError on GraphQL errors', async () => {
    mockFetchOnce({ errors: [{ message: 'Field "ping" not found' }] });
    await expect(fetchGraphQL(QUERY)).rejects.toThrow(GraphQLRequestError);
  });

  it('throws GraphQLRequestError on HTTP failure', async () => {
    mockFetchOnce({}, false, 500);
    await expect(fetchGraphQL(QUERY)).rejects.toThrow('500');
  });

  it('throws when endpoint env var is missing', async () => {
    vi.stubEnv('WORDPRESS_GRAPHQL_ENDPOINT', '');
    await expect(fetchGraphQL(QUERY)).rejects.toThrow('WORDPRESS_GRAPHQL_ENDPOINT');
  });
});
