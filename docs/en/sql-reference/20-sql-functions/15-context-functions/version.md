---
title: VERSION
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Returns the current version of DatabendQuery.

## Syntax

```sql
VERSION()
```

## Version Format

Since v1.2.953, the build removes a terminal `-nightly` suffix from the embedded Databend version. The release tag keeps its original name.

| Build version input | Embedded Databend version |
|---------------------|---------------------------|
| `v1.2.953-nightly` | `v1.2.953` |
| `v1.2.953` | `v1.2.953` |
| `v1.2.953-p2` | `v1.2.953-p2` |
| `v1.2.953-rc.1` | `v1.2.953-rc.1` |

These mappings describe version formatting, not a list of published releases. The build input can come from a release tag or `DATABEND_RELEASE_VERSION`. Other suffixes remain unchanged.

The full version string still includes commit and build information. Rust compiler metadata can contain `nightly`; that does not mean the Databend version retains the suffix. The result prefix can differ by client protocol. A MySQL connection uses a compatibility-version prefix; the rule above concerns the embedded Databend version, not the entire result.

Do not infer the release channel from the absence of `-nightly` in the result. Check the release tag when you identify a build. See [Databend Release Channels](/release-notes/release-channels).

## Examples

The following historical output is from v1.2.252, before the format change. It retains the old Databend `-nightly` suffix:

```sql
SELECT VERSION();

┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           version()                                           │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│ DatabendQuery v1.2.252-nightly-193ed56304(rust-1.75.0-nightly-2023-12-12T22:07:25.371440000Z) │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```