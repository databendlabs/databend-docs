---
title: Manage protocol version for meta server and client
sidebar_label: Meta Service Version
description:
  When to upgrade protocol versions for meta server or meta client
---

:::tip

Expected deployment time: **5 minutes ⏱**

:::

Meta server has a build version(`METASRV_COMMIT_VERSION`) and the minimal compatible version of meta client(`MIN_METACLI_SEMVER`),
which are defined in `src/meta/service/src/version.rs`.

Meta client has a build version(`METACLI_COMMIT_SEMVER`) and the minimal compatible version of meta server(`MIN_METASRV_SEMVER`),
which are defined in `src/meta/grpc/src/lib.rs`.

These four versions defines compatibility between meta server and meta client.
[Compatibility][Compatibility] explains how it works.

For developers, if incompatible or compatible changes are introduced, either `MIN_METACLI_SEMVER` or `MIN_METASRV_SEMVER` should be increased,
in order to report a compatibility issue before actual data exchange between meta server and meta client.

According to the algorithm [Compatibility][Compatibility] defines:

- If no protocol related types change is introduced, do **NOT** change `MIN_METACLI_SEMVER` or `MIN_METASRV_SEMVER`;
- If new API is added to meta server, but very other API are still valid, do **NOT** change `MIN_METACLI_SEMVER` or `MIN_METASRV_SEMVER`;
- If meta client starts using a new API provided by meta server, upgrade `MIN_METASRV_SEMVER` to the build version in which this new API was introduced.
- If meta server removes an API, upgrade `MIN_METACLI_SEMVER` to a client build version since which this API is never used.


Protocol related crates are(this list may not be exhausted if new types are introduced in future):
- `src/meta/protos`: defines the protobuf messages a meta client talks to a meta server.
- `src/meta/proto-conv`: defines how to convert metadata types in rust from and to protobuf messages.
- `src/meta/types`: defines the rust types for metadata.


[Compatibility](/doc/deploy/upgrade/compatibility)

