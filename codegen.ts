import type { CodegenConfig } from '@graphql-codegen/cli';

// WPGraphQL disables introspection for unauthenticated requests by default.
// To run codegen, add to .env.local:
//   WP_CODEGEN_BASIC_AUTH=<base64 of "username:application_password">
// Generate one via WP Admin → Users → Profile → Application Passwords.
const schemaConfig =
  process.env.WP_CODEGEN_BASIC_AUTH
    ? {
        [process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://cms.rturk.me/?graphql']: {
          headers: {
            Authorization: `Basic ${process.env.WP_CODEGEN_BASIC_AUTH}`,
          },
        },
      }
    : process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://cms.rturk.me/?graphql';

// NOTE: the live WPGraphQL schema is technically invalid — a plugin (SEO/ACF)
// registers the interface `WithAcfOptionsPageSEODefaults` with a `sEODefaults`
// field that RootQuery doesn't implement. That breaks the `typescript-operations`
// plugin (crashes generating per-operation result types), so we emit only the
// base `typescript` schema types here. Until the WP plugin is fixed, the app
// keeps using the hand-written types in `src/types/wordpress.ts` + fetchGraphQL<any>.
// Requires WPGraphQL public introspection enabled and query-depth limit raised/off.
const config: CodegenConfig = {
  schema: schemaConfig,
  documents: ['src/lib/queries/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/lib/generated/graphql.ts': {
      plugins: ['typescript'],
      config: { skipTypename: true, avoidOptionals: false, skipDocumentsValidation: true },
    },
  },
};

export default config;
