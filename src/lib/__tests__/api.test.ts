import { describe, it, expect, vi } from 'vitest';

vi.mock('../graphql', () => ({
  fetchGraphQL: vi.fn().mockRejectedValue(new Error('CMS down')),
  GraphQLRequestError: class extends Error {},
}));

import { getAllProjects } from '../api';
import { STATIC_PROJECTS } from '../data/projects';

describe('api fallbacks', () => {
  it('returns static projects when the CMS is unreachable', async () => {
    const { projects } = await getAllProjects();
    expect(projects).toEqual(STATIC_PROJECTS);
    expect(projects.length).toBeGreaterThan(0);
  });
});
