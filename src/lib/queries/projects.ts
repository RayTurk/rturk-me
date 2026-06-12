/**
 * GraphQL Queries for Projects
 */

import { gql } from '@apollo/client';
import {
  PROJECT_FRAGMENT,
  PROJECT_FRAGMENT_MINIMAL,
  PAGE_INFO_FRAGMENT,
} from './fragments';

// ============================================================================
// GET ALL PROJECTS (with pagination)
// ============================================================================

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects($first: Int!, $after: String) {
    projects(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: MENU_ORDER, order: ASC } }
    ) {
      nodes {
        ...ProjectFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PROJECT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET PROJECT BY SLUG
// ============================================================================

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

// ============================================================================
// GET FEATURED PROJECTS
// ============================================================================

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($first: Int = 100) {
    projects(
      first: $first
      where: {
        status: PUBLISH
        orderby: { field: MENU_ORDER, order: ASC }
      }
    ) {
      nodes {
        ...ProjectFragmentMinimal
      }
    }
  }
  ${PROJECT_FRAGMENT_MINIMAL}
`;

// ============================================================================
// GET ALL PROJECT SLUGS (for generateStaticParams)
// ============================================================================

export const GET_ALL_PROJECT_SLUGS = gql`
  query GetAllProjectSlugs {
    projects(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

// ============================================================================
// GET PROJECTS BY TYPE (filter by project_type taxonomy)
// ============================================================================

export const GET_PROJECTS_BY_TYPE = gql`
  query GetProjectsByType($typeSlug: String!, $first: Int!) {
    projects(
      first: $first
      where: {
        status: PUBLISH
        taxQuery: {
          relation: AND
          taxArray: [
            {
              taxonomy: PROJECT_TYPE
              field: SLUG
              terms: [$typeSlug]
              operator: IN
            }
          ]
        }
      }
    ) {
      nodes {
        ...ProjectFragmentMinimal
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PROJECT_FRAGMENT_MINIMAL}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET PROJECTS BY TECH STACK
// ============================================================================

export const GET_PROJECTS_BY_TECH_STACK = gql`
  query GetProjectsByTechStack($techSlug: String!, $first: Int!) {
    projects(
      first: $first
      where: {
        status: PUBLISH
        taxQuery: {
          relation: AND
          taxArray: [
            {
              taxonomy: TECH_STACK
              field: SLUG
              terms: [$techSlug]
              operator: IN
            }
          ]
        }
      }
    ) {
      nodes {
        ...ProjectFragmentMinimal
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PROJECT_FRAGMENT_MINIMAL}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET SINGLE PROJECT WITH RELATED PROJECTS
// ============================================================================

export const GET_PROJECT_WITH_RELATED = gql`
  query GetProjectWithRelated($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

// ============================================================================
// GET PROJECT COUNT
// ============================================================================

export const GET_PROJECT_COUNT = gql`
  query GetProjectCount {
    projects(where: { status: PUBLISH }) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

// ============================================================================
// GET ALL PROJECT TYPES (taxonomy)
// ============================================================================

export const GET_ALL_PROJECT_TYPES = gql`
  query GetAllProjectTypes($first: Int = 50) {
    projectTypes(first: $first, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
        description
      }
    }
  }
`;

// ============================================================================
// GET ALL TECH STACKS (taxonomy)
// ============================================================================

export const GET_ALL_TECH_STACKS = gql`
  query GetAllTechStacks($first: Int = 50) {
    techStacks(first: $first, where: { hideEmpty: true }) {
      nodes {
        id
        databaseId
        name
        slug
        count
        description
      }
    }
  }
`;
