# ACF "Project Info" cleanup + frontend reconciliation

## Context

The `project` post type's ACF field group ("Project Info", `group_67eac35c19a05`) had drifted in two ways:

1. **Internally messy** — a tab label ("Project Details") used twice, a "Visual Elements" tab whose two fields (`logo`, `color_scheme`) are unused anywhere in the frontend, a field name containing a literal `&` (`challenges_&_solutions`, unsafe for GraphQL field-name generation), and several fields (`role`, `industry`, `marketing_blurb`) that duplicate each other or WP's native post excerpt without ever being consumed.
2. **Out of sync with the Next.js frontend** — `src/lib/queries/fragments.ts`, `src/lib/queries/projects.ts`, and `src/types/wordpress.ts` reference a `projectDetails` ACF group (`clientName`, `projectDate`, `projectDuration`, `isFeatured`, `projectOrder`) and three taxonomies (`projectTypes`, `techStacks`, `projectStatuses`) that **do not exist** in the real ACF/taxonomy setup. The real taxonomies are `audience` and `technology-used`; "project type" is a `select` field inside Project Info, not a taxonomy at all.

The rendered pages (`/work`, `/work/[slug]`) don't display any ACF project fields yet — they only render title/excerpt/content. So reconciling the frontend is purely a data-layer accuracy fix (types, fragments, queries, static fallback), not new UI work.

**Caveat:** WPGraphQL introspection is disabled on prod (see `codegen.ts`), so exact auto-generated GraphQL names (`technologiesUsed`, `audiences`, the `TECHNOLOGY_USED` taxonomy enum) are inferred from WPGraphQL's naming conventions, not verified against the live schema. Run `npm run codegen` (with `WP_CODEGEN_BASIC_AUTH` set) or check GraphiQL once the PHP changes are live, before shipping.

## Decisions made during brainstorming

- Remove fields with no current or planned consumer: `logo`, `color_scheme` (and its `primary_color`/`secondary_color` sub-fields), `role`, `challenges_&_solutions`, `marketing_blurb`, `industry`.
- Keep `featured_status` and `completion_date` — they map directly onto concepts the frontend already wants (`isFeatured`, `projectDate`); rename on the frontend side instead of deleting and recreating.
- Add `client_name` and `project_duration` — the defunct `projectDetails` group wanted these and the static fallback content already models them (`'Demo Client'`, `'2 weeks'`).
- Do **not** add a `projectOrder` field — `GET_ALL_PROJECTS`/`GET_FEATURED_PROJECTS` already order by WP's native `MENU_ORDER` (drag-and-drop in wp-admin); a custom order field would be redundant.
- Drop the `projectStatuses` concept entirely — nothing in the real schema suggests it's tracked.
- Wire the existing-but-unused `audience` taxonomy into the frontend now, since it's already registered.
- Collapse the fictional `projectDetails` group into the real, single `projectInfo` group on the frontend.
- `techStacks` → renamed to `technologiesUsed` throughout, matching the real taxonomy's `graphql_plural_name`.
- `project_type` is a single-select ACF field, not a taxonomy — `GET_PROJECTS_BY_TYPE`/`GET_ALL_PROJECT_TYPES` (which assumed a taxonomy) are deleted; `getProjectsByType()` is rewritten to filter client-side on `projectInfo.projectType`.

## Part 1 — ACF PHP (apply on cms.rturk.me, not part of this git repo)

Replace the `acf_add_local_field_group` call's `'fields'` array with:

```php
'fields' => array(
    array(
        'key' => 'field_67eac35f9277d',
        'label' => 'Links',
        'name' => '',
        'aria-label' => '',
        'type' => 'tab',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'placement' => 'top',
        'endpoint' => 0,
        'selected' => 0,
    ),
    array(
        'key' => 'field_67eac37a9277e',
        'label' => 'Project URL',
        'name' => 'project_url',
        'aria-label' => '',
        'type' => 'url',
        'instructions' => 'Text field for the live demo link',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'allow_in_bindings' => 0,
        'placeholder' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'projectUrl',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_67eac3969277f',
        'label' => 'GitHub URL',
        'name' => 'github_url',
        'aria-label' => '',
        'type' => 'url',
        'instructions' => 'Text field for the source code repository (if public)',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'allow_in_bindings' => 0,
        'placeholder' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'githubUrl',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_67eac48092788',
        'label' => 'Details',
        'name' => '',
        'aria-label' => '',
        'type' => 'tab',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'placement' => 'top',
        'endpoint' => 0,
        'selected' => 0,
    ),
    array(
        'key' => 'field_67eac3ab92780',
        'label' => 'Featured Status',
        'name' => 'featured_status',
        'aria-label' => '',
        'type' => 'true_false',
        'instructions' => 'Boolean field to mark certain projects as featured',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'message' => '',
        'default_value' => 0,
        'allow_in_bindings' => 0,
        'ui' => 0,
        'ui_on_text' => '',
        'ui_off_text' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'featuredStatus',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_67eac3c092781',
        'label' => 'Completion Date',
        'name' => 'completion_date',
        'aria-label' => '',
        'type' => 'date_picker',
        'instructions' => 'Date field to track when projects were finished',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'display_format' => 'F j, Y',
        'return_format' => 'F j, Y',
        'first_day' => 1,
        'allow_in_bindings' => 0,
        'default_to_current_date' => 0,
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'completionDate',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_6f1a2b3c4d5e7',
        'label' => 'Client Name',
        'name' => 'client_name',
        'aria-label' => '',
        'type' => 'text',
        'instructions' => 'Name of the client or company this project was built for',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'maxlength' => '',
        'allow_in_bindings' => 0,
        'placeholder' => '',
        'prepend' => '',
        'append' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'clientName',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_6f1a2b3c4d5e8',
        'label' => 'Project Duration',
        'name' => 'project_duration',
        'aria-label' => '',
        'type' => 'text',
        'instructions' => "How long the project took, e.g. '2 weeks'",
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'maxlength' => '',
        'allow_in_bindings' => 0,
        'placeholder' => '',
        'prepend' => '',
        'append' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'projectDuration',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_67eac4dc9278a',
        'label' => 'Project Type',
        'name' => 'project_type',
        'aria-label' => '',
        'type' => 'select',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '50',
            'class' => '',
            'id' => '',
        ),
        'choices' => array(
            'redesign' => 'Redesign',
            'new-build' => 'New Build',
            'maintenance' => 'Maintenance',
            'demo-site' => 'Demo Site',
        ),
        'default_value' => false,
        'return_format' => 'value',
        'multiple' => 0,
        'allow_null' => 1,
        'allow_in_bindings' => 0,
        'ui' => 0,
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'projectType',
        'graphql_non_null' => 0,
        'ajax' => 0,
        'placeholder' => '',
        'create_options' => 0,
        'save_options' => 0,
    ),
    array(
        'key' => 'field_67ed56196d7af',
        'label' => 'Project Excerpt',
        'name' => 'project_excerpt',
        'aria-label' => '',
        'type' => 'textarea',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'maxlength' => '',
        'allow_in_bindings' => 0,
        'rows' => '',
        'placeholder' => '',
        'new_lines' => '',
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'projectExcerpt',
        'graphql_non_null' => 0,
    ),
    array(
        'key' => 'field_67eac52e9278b',
        'label' => 'Project Scope',
        'name' => 'project_scope',
        'aria-label' => '',
        'type' => 'wysiwyg',
        'instructions' => 'Text area to describe the scope of work',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
            'width' => '',
            'class' => '',
            'id' => '',
        ),
        'default_value' => '',
        'allow_in_bindings' => 1,
        'tabs' => 'all',
        'toolbar' => 'full',
        'media_upload' => 1,
        'delay' => 0,
        'show_in_graphql' => 1,
        'graphql_description' => '',
        'graphql_field_name' => 'projectScope',
        'graphql_non_null' => 0,
    ),
),
```

All other settings on the `acf_add_local_field_group` call (group key, title, location rules, `show_in_graphql`/`graphql_field_name` => `projectInfo`, etc.) are unchanged. The `register_taxonomy` (`audience`, `technology-used`) and `register_post_type` (`project`) calls are unchanged — no PHP edits needed there, only frontend query changes (Part 2).

Existing field **keys** for kept fields are preserved, so no existing post data is lost. Removed fields' stored postmeta becomes orphaned (harmless, but can be cleaned up via a one-off DB query later if desired — out of scope here).

## Part 2 — Frontend reconciliation (this repo)

### `src/types/wordpress.ts`

```ts
export interface Project {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage?: { node: WPImage };
  projectInfo?: {
    projectType?: string;        // was string[]; field is single-select
    projectScope?: string;
    projectUrl?: string;
    projectExcerpt?: string;
    githubUrl?: string;
    featuredStatus?: boolean;    // replaces projectDetails.isFeatured
    completionDate?: string;     // replaces projectDetails.projectDate
    clientName?: string;         // replaces projectDetails.clientName
    projectDuration?: string;    // replaces projectDetails.projectDuration
  };
  technologiesUsed?: { nodes: TaxonomyTerm[] }; // renamed from techStacks
  audiences?: { nodes: TaxonomyTerm[] };        // newly wired in
  // projectDetails, projectTypes, projectStatuses: removed
}
```

`FilterOptions.techStacks` → renamed `technologiesUsed` for naming consistency (no functional change; not currently consumed).

### `src/lib/queries/fragments.ts`

`PROJECT_FRAGMENT`:
```graphql
projectInfo {
  projectType
  projectScope
  projectUrl
  projectExcerpt
  githubUrl
  featuredStatus
  completionDate
  clientName
  projectDuration
}
technologiesUsed {
  nodes {
    ...TaxonomyTermFragment
  }
}
audiences {
  nodes {
    ...TaxonomyTermFragment
  }
}
```
(`projectDetails`, `projectTypes`, `projectStatuses` selections removed.)

`PROJECT_FRAGMENT_MINIMAL`:
```graphql
projectInfo {
  projectUrl
  projectExcerpt
  projectType
  featuredStatus
  clientName
}
technologiesUsed {
  nodes {
    name
    slug
  }
}
```
(`projectDetails`, `projectTypes` selections removed; `techStacks` renamed.)

### `src/lib/queries/projects.ts`

- `GET_PROJECTS_BY_TECH_STACK`: taxonomy enum `TECH_STACK` → `TECHNOLOGY_USED`; fragment field `techStacks` → `technologiesUsed` (via the renamed `PROJECT_FRAGMENT_MINIMAL`).
- `GET_ALL_TECH_STACKS`: root query field `techStacks(...)` → `technologiesUsed(...)`.
- `GET_PROJECTS_BY_TYPE`: **deleted** (assumed a `PROJECT_TYPE` taxonomy that doesn't exist).
- `GET_ALL_PROJECT_TYPES`: **deleted** (assumed a `projectTypes` taxonomy; the 4 choices are a fixed ACF `select`, not queryable as terms).

### `src/lib/queries/index.ts`

Remove `GET_PROJECTS_BY_TYPE` and `GET_ALL_PROJECT_TYPES` from the re-exported list; keep the rest (with `GET_ALL_TECH_STACKS` continuing to point at the same identifier name, now backed by the renamed query).

### `src/lib/api.ts`

- `getFeaturedProjects()`: filter on `p.projectInfo?.featuredStatus`; drop the `.sort((a, b) => ... projectOrder ...)` call — `GET_FEATURED_PROJECTS` already orders by native `MENU_ORDER`, making the client-side sort dead weight.
- `getProjectsByType(typeSlug, first)`: rewritten to call `getAllProjects(100)` and filter the result by `projectInfo?.projectType === typeSlug`, reusing `getAllProjects`'s existing CMS-down fallback instead of duplicating it. `GET_PROJECTS_BY_TYPE` import removed.
- `getProjectsByTechStack`: unchanged logic; rides the renamed `GET_PROJECTS_BY_TECH_STACK` query.

### `src/lib/data/projects.ts` (`STATIC_PROJECTS`)

Each project's `projectInfo` block gains `featuredStatus`, `completionDate`, `clientName`, `projectDuration` (values already implied by the existing `projectDetails`/`projectExcerpt` content — e.g. Summit HVAC's `isFeatured: true` → `featuredStatus: true`, `projectDuration: '2 weeks'` stays as-is, `clientName: 'Demo Client'` stays as-is). `techStacks` key renames to `technologiesUsed`. `projectTypes` and `projectStatuses` arrays removed. `audiences: { nodes: [] }` added for shape consistency. `STATIC_FEATURED_PROJECTS`'s filter/sort updates to match (filter on `featuredStatus`, drop the now-removed `projectOrder` sort, rely on array order).

### `src/lib/__tests__/api.test.ts`

No changes needed — it asserts against `STATIC_PROJECTS` by reference equality, not by shape.

## Out of scope (explicitly not touched)

- No new UI rendering of any of these fields on `/work` or `/work/[slug]` — that's future work once a case-study layout is designed.
- `src/lib/constants.ts` is not touched beyond what's described above (it has unrelated stale/speculative content — e.g. `NAV_ITEMS` pointing at `/projects`/`/blog` instead of `/work`/`/writing` — left alone as out of scope).
- No cleanup of orphaned ACF postmeta for removed fields.
