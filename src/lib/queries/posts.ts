/**
 * GraphQL Queries for Blog Posts
 */

import { gql } from '@apollo/client';
import {
  POST_FRAGMENT,
  POST_FRAGMENT_MINIMAL,
  PAGE_INFO_FRAGMENT,
} from './fragments';

// ============================================================================
// GET ALL POSTS (with pagination)
// ============================================================================

export const GET_ALL_POSTS = gql`
  query GetAllPosts($first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        ...PostFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${POST_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET POST BY SLUG
// ============================================================================

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFragment
    }
  }
  ${POST_FRAGMENT}
`;

// ============================================================================
// GET RECENT POSTS
// ============================================================================

export const GET_RECENT_POSTS = gql`
  query GetRecentPosts($count: Int = 3) {
    posts(
      first: $count
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        ...PostFragmentMinimal
      }
    }
  }
  ${POST_FRAGMENT_MINIMAL}
`;

// ============================================================================
// GET ALL POST SLUGS (for generateStaticParams)
// ============================================================================

export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

// ============================================================================
// GET POSTS BY CATEGORY
// ============================================================================

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categorySlug: String!, $first: Int!) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        taxQuery: {
          relation: AND
          taxArray: [
            {
              taxonomy: CATEGORY
              field: SLUG
              terms: [$categorySlug]
              operator: IN
            }
          ]
        }
      }
    ) {
      nodes {
        ...PostFragmentMinimal
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${POST_FRAGMENT_MINIMAL}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET POSTS BY TAG
// ============================================================================

export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($tagSlug: String!, $first: Int!) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        taxQuery: {
          relation: AND
          taxArray: [
            {
              taxonomy: TAG
              field: SLUG
              terms: [$tagSlug]
              operator: IN
            }
          ]
        }
      }
    ) {
      nodes {
        ...PostFragmentMinimal
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${POST_FRAGMENT_MINIMAL}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET POSTS BY AUTHOR
// ============================================================================

export const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($authorSlug: String!, $first: Int!) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        authorName: $authorSlug
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        ...PostFragmentMinimal
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${POST_FRAGMENT_MINIMAL}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// GET POSTS COUNT
// ============================================================================

export const GET_POSTS_COUNT = gql`
  query GetPostsCount {
    posts(where: { status: PUBLISH }) {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

// ============================================================================
// GET ALL CATEGORIES
// ============================================================================

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($first: Int = 50) {
    categories(first: $first, where: { hideEmpty: true }) {
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
// GET ALL TAGS
// ============================================================================

export const GET_ALL_TAGS = gql`
  query GetAllTags($first: Int = 100) {
    tags(first: $first, where: { hideEmpty: true }) {
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
// GET RELATED POSTS (by category)
// ============================================================================

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($categoryIds: [ID!]!, $currentPostId: ID!, $first: Int = 3) {
    posts(
      first: $first
      where: {
        status: PUBLISH
        categoryIn: $categoryIds
        notIn: [$currentPostId]
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        ...PostFragmentMinimal
      }
    }
  }
  ${POST_FRAGMENT_MINIMAL}
`;

// ============================================================================
// SEARCH POSTS
// ============================================================================

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!, $first: Int = 10) {
    posts(first: $first, where: { search: $search, status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
