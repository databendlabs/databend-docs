# AGENTS.md — Databend Docs contribution guide

Guidance for any AI agent or contributor working in the databend-docs repo. Follow it whenever you add a new doc, translate content, build a doc UI component, or move/delete a page.

## Golden rules (read first)

1. Every English doc under `docs/en` must have a matching translation under `docs/cn` at the same relative path.
2. When you add or change docs, translate ONLY the files you just touched. Never run a global scan or bulk re-translate the whole tree.
3. Any `<details>` block must be wrapped in a `<DetailsWrap>` component.
4. New UI must support both light and dark themes using the existing CSS variables (never hardcode colors).
5. If you delete or move a page (change its URL), add a redirect in `site-redirects.ts` to avoid 404s.

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
- [ ] Every `<details>` is inside a `<DetailsWrap>`, with the import present.
- [ ] `FunctionDescription` version strings updated where behavior changed.
- [ ] Any UI component works in light AND dark mode using theme variables.
- [ ] Removed/moved URLs have redirects in `site-redirects.ts`.
- [ ] `npm run build:en` / `npm run build:cn` (or the dev servers) run without errors.
