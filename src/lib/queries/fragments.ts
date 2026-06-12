/**
 * Reusable GraphQL Fragments
 * Used across multiple queries to maintain consistency and reduce duplication
 */

import gql from 'graphql-tag';

// ============================================================================
// MEDIA FRAGMENTS
// ============================================================================

export const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
    sizes
    srcSet
  }
`;

// ============================================================================
// SEO FRAGMENTS
// ============================================================================

export const SEO_FRAGMENT = gql`
  fragment SEOFragment on Post {
    seoTitle: seoTitle
    seoDescription: seoDescription
    seoKeywords: seoKeywords
  }
`;

// ============================================================================
// TAXONOMY FRAGMENTS
// ============================================================================

export const TAXONOMY_TERM_FRAGMENT = gql`
  fragment TaxonomyTermFragment on TermNode {
    id
    databaseId
    name
    slug
    count
    description
  }
`;

// ============================================================================
// AUTHOR FRAGMENTS
// ============================================================================

export const AUTHOR_FRAGMENT = gql`
  fragment AuthorFragment on User {
    name
    slug
    avatar {
      url
    }
    description
  }
`;

// ============================================================================
// MENU FRAGMENTS
// ============================================================================

export const MENU_ITEM_FRAGMENT = gql`
  fragment MenuItemFragment on MenuItem {
    id
    label
    url
    path
    target
    parentId
    childItems {
      nodes {
        id
        label
        url
        path
        target
      }
    }
    cssClasses
  }
`;

// ============================================================================
// PROJECT FRAGMENTS
// ============================================================================

export const PROJECT_FRAGMENT = gql`
  fragment ProjectFragment on Project {
    id
    databaseId
    title
    slug
    content
    excerpt
    date
    modified
    featuredImage {
      node {
        ...ImageFragment
      }
    }
    projectInfo {
      projectType
      projectScope
      projectUrl
      projectExcerpt
      githubUrl
    }
    projectDetails {
      clientName
      projectDate
      projectDuration
      isFeatured
      projectOrder
    }
    projectTypes {
      nodes {
        ...TaxonomyTermFragment
      }
    }
    techStacks {
      nodes {
        ...TaxonomyTermFragment
      }
    }
    projectStatuses {
      nodes {
        ...TaxonomyTermFragment
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${TAXONOMY_TERM_FRAGMENT}
`;

export const PROJECT_FRAGMENT_MINIMAL = gql`
  fragment ProjectFragmentMinimal on Project {
    id
    databaseId
    title
    slug
    excerpt
    date
    featuredImage {
      node {
        ...ImageFragment
      }
    }
    projectInfo {
      projectUrl
      projectExcerpt
    }
    projectDetails {
      isFeatured
      projectOrder
      clientName
    }
    projectTypes {
      nodes {
        name
        slug
      }
    }
    techStacks {
      nodes {
        name
        slug
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

// ============================================================================
// BLOG POST FRAGMENTS
// ============================================================================

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    databaseId
    title
    slug
    content
    excerpt
    date
    modified
    author {
      node {
        ...AuthorFragment
      }
    }
    featuredImage {
      node {
        ...ImageFragment
      }
    }
    categories {
      nodes {
        ...TaxonomyTermFragment
      }
    }
    tags {
      nodes {
        ...TaxonomyTermFragment
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${AUTHOR_FRAGMENT}
  ${TAXONOMY_TERM_FRAGMENT}
`;

export const POST_FRAGMENT_MINIMAL = gql`
  fragment PostFragmentMinimal on Post {
    id
    databaseId
    title
    slug
    excerpt
    date
    author {
      node {
        name
        slug
      }
    }
    featuredImage {
      node {
        ...ImageFragment
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

// ============================================================================
// PAGINATION FRAGMENT
// ============================================================================

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFragment on WPPageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;
