# AGENTS.md — Databend Docs contribution guide

Guidance for any AI agent or contributor working in the databend-docs repo. Follow it whenever you add a new doc, translate content, build a doc UI component, or move/delete a page.

## Golden rules (read first)

1. Every English doc under `docs/en` must have a matching translation under `docs/cn` at the same relative path.
2. When you add or change docs, translate ONLY the files you just touched. Never run a global scan or bulk re-translate the whole tree.
3. Any `<details>` block must be wrapped in a `<DetailsWrap>` component.
4. New UI must support both light and dark themes using the existing CSS variables (never hardcode colors).
5. If you delete or move a page (change its URL), add a redirect in `site-redirects.ts` to avoid 404s.
6. Doc content must follow the ASD-STE100 (Simplified Technical English) specification: short sentences, one instruction per sentence, active voice, and consistent terminology.
7. Write comments in docs with MDX syntax `{/* ... */}`. Do not use HTML comments `<!-- ... -->`.

## Repository layout

```
docs/
  en/                # English source of truth. Write new docs here first.
  cn/                # Chinese translations. Must mirror docs/en structure exactly.
  fragment/          # Shared markdown fragments imported into multiple docs (paired *-en.md / *-cn.md).
  release-stable/    # Auto/managed release note snapshots. Do not hand-edit for content tasks.
```

Both `docs/en` and `docs/cn` share the same top-level sections. Each is served as a separate Docusaurus instance selected by the `site` env var (`site=en` or `site=cn`), and both use `docs/en/sidebars.js` for sidebar config.

| Directory | routeBasePath | Purpose |
|-----------|---------------|---------|
| `guides/` | `/guides` | Task and concept guides: loading data, querying, security, deployment, performance. The main product documentation. |
| `sql-reference/` | `/sql` | SQL commands, functions, data types, stored procedures. Reference material. |
| `tutorials/` | `/tutorials` | End-to-end walkthroughs. |
| `developer/` | `/developer` | Drivers, APIs, community developer material. |
| `dev/` | `/dev` | Internal subsystems and project policies. |
| `integrations/` | `/integrations` | Third-party tool integrations. |
| `release-notes/` | `/release-notes` | Release channels and version notes. |

Supporting files:
- `docs/en/sidebars.js` — sidebar definition shared by EN and CN.
- `_category_.json` — per-folder sidebar label (translate the `label` value in the CN copy).
- `site-redirects.ts` — URL redirect table (see "Deleting or moving docs").
- `sync_exclusions.txt` — files intentionally NOT kept in EN/CN sync.

## Adding a new doc (the core workflow)

1. Create the English doc under `docs/en/<section>/...`. Match the numeric prefix naming of sibling files (e.g. `02-local.md`) so sidebar ordering stays correct.
2. Add front matter matching neighbors:
   ```md
   ---
   title: Loading from Local File
   sidebar_label: Local
   ---
   ```
3. If you add a new folder, create its `_category_.json` with a `label`.
4. Wire the doc into the sidebar/index pages as needed (relative links, `_category_.json`).
5. Translate to Chinese: create the same file at the identical relative path under `docs/cn/`. Translate prose, `title`, `sidebar_label`, and `_category_.json` `label`. Keep code, SQL, identifiers, file paths, URLs, and component imports unchanged.
   - Scope: translate only the files you created or edited in this task. Do not touch unrelated CN files and do not scan the whole tree.
   - Check `sync_exclusions.txt` first; skip translation for anything listed there.
6. Verify the build: `npm run build:en` and `npm run build:cn` (or `npm run start:en` / `start:cn` for a quick local preview).

## Comments

Docs are parsed as MDX (Docusaurus v3). Use the MDX comment syntax `{/* ... */}`. Do not use HTML comments `<!-- ... -->`.

```md
{/* https://github.com/databendlabs/databend-docs/blob/main/src/components/BillingExample/index.tsx */}

<BillingExample example={1} />
```

Apply the same rule to the CN translation.

## details / DetailsWrap

Collapsible sections use native `<details>` but MUST be wrapped by `<DetailsWrap>` (it provides the styling that works in both themes). Import it once near the top of the doc.

```md
import DetailsWrap from '@site/src/components/DetailsWrap';

<DetailsWrap>

<details>
<summary> Parquet </summary>

- [Load Parquet into table](./03-load-semistructured/00-load-parquet.md)

</details>

</DetailsWrap>
```

Reference example: `docs/en/guides/40-load-data/index.md`. A bare `<details>` without `<DetailsWrap>` renders unstyled and inconsistent — always wrap it.

## Versioning: FunctionDescription

To mark when a feature/function was introduced or updated, use the `FunctionDescription` component. It renders a tag next to the page title.

```md
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.34"/>
```

Update the version string when the documented behavior changes. Add the same component (same English version string) to the CN translation.

## Cloud API changelog

`docs/en/guides/35-connect/04-cloud-api/16-changelog.md` (CN: same path under `docs/cn`) records changes to the Cloud API for Agents. Agents, skills, and scripts that call these endpoints read it to find what to update.

Add an entry in the same PR when you:

- add, change, deprecate, or remove an endpoint in `04-cloud-api/`, or change its request or response fields, limits, or access level;
- change a convention in `04-cloud-api/index.md`: authentication, request styles, JSON rules, pagination, errors, access levels, or the endpoints that API tokens cannot call.

Do not add an entry for wording or example fixes that do not change behavior.

How to write an entry:

1. Use the release date as the heading, `## YYYY-MM-DD`. Put the newest entry at the top, below the introduction. If a heading for that date exists, add to it. The endpoints have no version number, so the date identifies a release. In CN, keep the anchor: `## YYYY-MM-DD {/* #YYYY-MM-DD */}`.
2. Group the items under `### Added`, `### Changed`, `### Deprecated`, `### Removed`, in this order (CN: `### 新增 {/* #added */}`, `### 变更 {/* #changed */}`, `### 弃用 {/* #deprecated */}`, `### 移除 {/* #removed */}`). Leave out empty groups.
3. Write one item per endpoint or convention. Start with the method and path in code, for example `` `POST /api/v2/data-integration/datasource/create` ``, and link to its section on the reference page. Say what changed in one sentence.
4. Mark a change that can cause existing calls to fail with **Breaking** (CN: **不兼容变更**), and give the steps to migrate.
5. For a deprecation, say what to use instead and, if known, the removal date.
6. In the same PR, update the reference page and the [Endpoint Index](docs/en/guides/35-connect/04-cloud-api/index.md#endpoint-index). The changelog does not replace the reference pages.
7. Do not edit past entries, except to correct an error in them.
8. Write the CN entry in the same PR, with the same date and the same items.

Example (the endpoints and changes are hypothetical):

```md
## 2026-12-01

### Added

- `POST /api/v2/data-integration/task/{taskId}/pause`: pause a data integration task. See [Pause a Task](./14-data-integration-tasks.md#pause-a-task).

### Changed

- **Breaking** `POST /api/v2/data-integration/datasources`: `perPage` is now at most 100. Requests with a larger value return HTTP 400. Send 100 or less.
```

## Building doc UI components

When a doc needs a custom UI component (callout, card, interactive widget):

1. Use the `frontend-design` skill for the design/implementation quality bar.
2. Match the existing site theme rather than inventing a new visual language. Components live in `src/components/`; styles use SCSS modules (`styles.module.scss`).
3. Support BOTH light and dark themes. Use the existing CSS variables (`--color-text-0/1/2`, `--color-fill-0/1`, `--color-border`, `--color-primary`, `--color-bg-1`, etc.) instead of hardcoded hex values. The theme system is defined in `src/css/theme.scss`, with the dark palette under the `[data-theme='dark']` block — never hardcode colors that break in one mode.
4. Verify the component renders correctly by toggling the theme switcher in a local dev server.

## Deleting or moving docs

Removing a doc or changing its path changes its public URL and will 404 for existing links, search results, and bookmarks. Prevent this:

1. Determine the old public URL from the file path minus numeric prefixes and `routeBasePath` (e.g. `docs/en/guides/security/masking-policy.md` → `/guides/security/masking-policy`).
2. Add an entry to the array in `site-redirects.ts` pointing the old URL to the new one:
   ```ts
   {
     from: '/guides/security/masking-policy',
     to: '/guides/security/data-protection/masking-policy'
   },
   ```
3. If a section is consolidated into an anchor, redirect to the anchor: `to: '/sql/.../ddl-create-function#python'`.
4. Do the same reasoning for the CN site — redirects are path-based and apply to both locales.
5. Delete the file in BOTH `docs/en` and `docs/cn` to keep them in sync.

## Verification checklist before finishing

- [ ] New/edited EN docs have matching CN files at the same relative path (excluding `sync_exclusions.txt` entries).
- [ ] Only the touched files were translated — no global re-translation.
- [ ] Doc content follows the ASD-STE100 specification.
- [ ] Every `<details>` is inside a `<DetailsWrap>`, with the import present.
- [ ] Comments use `{/* ... */}`, not `<!-- ... -->`.
- [ ] `FunctionDescription` version strings updated where behavior changed.
- [ ] Cloud API endpoint or convention changes have an entry in `04-cloud-api/16-changelog.md` (EN and CN).
- [ ] Any UI component works in light AND dark mode using theme variables.
- [ ] Removed/moved URLs have redirects in `site-redirects.ts`.
- [ ] `npm run build:en` / `npm run build:cn` (or the dev servers) run without errors.
