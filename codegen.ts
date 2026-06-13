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

const config: CodegenConfig = {
  schema: schemaConfig,
  documents: ['src/lib/queries/**/*.ts'],
  generates: {
    'src/lib/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: { skipTypename: true, avoidOptionals: false },
    },
  },
};

export default config;
