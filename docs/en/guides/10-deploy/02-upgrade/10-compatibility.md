---
title: Compatibility
sidebar_label: Compatibility
description: Investigate and manage the compatibility
---

This guideline will introduce how to investigate and manage the compatibility:

- between databend-query and databend-meta.
- between different versions of databend-meta.

## Compatibility between databend-query and databend-meta

### Identifying the versions

- To find out the build version of databend-query and its compatible databend-meta version:

  ```shell
  databend-query --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-metasrv-version: 0.7.59
  ```

  Which means this build of databend-query(`0.7.61-nightly`) can talk to a databend-meta of at least version `0.7.59`, inclusive.

- To find out the build version of databend-meta and its compatible databend-query version:

  ```shell
  databend-meta --cmd ver

  # output:
  version: 0.7.61-nightly
  min-compatible-client-version: 0.7.57
  ```

  Which means this build of databend-meta(`0.7.61-nightly`) can talk to a databend-query of at least version `0.7.57`, inclusive.

### Maintaining compatibility

A databend cluster has to be deployed with compatible versions of databend-query and databend-meta.
A databend-query and databend-meta are compatible iff the following statements hold:

```
databend-query.version >= databend-meta.min-compatible-client-version
databend-bend.version  >= databend-query.min-compatible-metasrv-version
```

:::caution

If incompatible versions are deployed, an error `InvalidArgument` will occur when databend-query tries to connect to databend-meta,
which can be found in databend-query log.
Then databend-query will stop working.

:::

#### Compatibility verification protocol

Compatibility will be checked when a connection is established between meta-client(databend-query) and databend-meta, in a `handshake` RPC.

The client `C`(databend-query) and the server `S`(databend-meta) maintains two semantic-versions:

- `C` maintains its own semver(`C.ver`) and the minimal compatible `S` semver(`C.min_srv_ver`).
- `S` maintains its own semver(`S.ver`) and the minimal compatible `S` semver(`S.min_cli_ver`).

When handshaking:

- `C` sends its ver `C.ver` to `S`,
- When `S` receives handshake request, `S` asserts that `C.ver >= S.min_cli_ver`.
- Then `S` replies handshake-reply with its `S.ver`.
- When `C` receives the reply, `C` asserts that `S.ver >= C.min_srv_ver`.

Handshake succeeds if both of these two assertions hold.

E.g.:

- `S: (ver=3, min_cli_ver=1)` is compatible with `C: (ver=3, min_srv_ver=2)`.
- `S: (ver=4, min_cli_ver=4)` is **NOT** compatible with `C: (ver=3, min_srv_ver=2)`.
  Because although `S.ver(4) >= C.min_srv_ver(3)` holds,
  but `C.ver(3) >= S.min_cli_ver(4)` does not hold.

```text
C.ver:    1             3      4
C --------+-------------+------+------------>
          ^      .------'      ^
          |      |             |
          '-------------.      |
                 |      |      |
                 v      |      |
S ---------------+------+------+------------>
S.ver:           2      3      4
```

#### Compatibility status

The following is an illustration of the latest query-meta compatibility:

| `Meta\Query`       | [0.9.41, 1.1.34) | [1.1.34, 1.2.287) | [1.2.287, 1.2.361) | [1.2.361, +∞) |
| :----------------- | :--------------- | :---------------- | :----------------- | :------------ |
| [0.8.30, 0.8.35)   | ❌               | ❌                | ❌                 | ❌            |
| [0.8.35, 0.9.23)   | ✅               | ❌                | ❌                 | ❌            |
| [0.9.23, 0.9.42)   | ✅               | ❌                | ❌                 | ❌            |
| [0.9.42, 1.1.32)   | ✅               | ❌                | ❌                 | ❌            |
| [1.1.32, 1.2.63)   | ✅               | ✅                | ❌                 | ❌            |
| [1.2.63, 1.2.226)  | ✅               | ✅                | ❌                 | ❌            |
| [1.2.226, 1.2.258) | ✅               | ✅                | ✅                 | ❌            |
| [1.2.258, +∞)      | ✅               | ✅                | ✅                 | ✅            |

History versions that are not included in the above chart:

- Query `[0.7.59, 0.8.80)` is compatible with Meta `[0.8.30, 0.9.23)`.
- Query `[0.8.80, 0.9.41)` is compatible with Meta `[0.8.35, 0.9.42)`.

<img alt="Compatibility status" src="/img/deploy/compatibility.excalidraw.png"/>

# Compatibility between databend-query

## Version Compatibility Matrix

| Query version      | Backward compatible with | Key Changes                              |
| :----------------- | :----------------------- | :--------------------------------------- |
| [-∞, 1.2.307)      | [-∞, 1.2.311)            | Original format                          |
| [1.2.307, 1.2.311) | [-∞, 1.2.311)            | Added Role info with PB/JSON support     |
| [1.2.311, 1.2.709) | [1.2.307, +∞)            | Role info serialized to PB only          |
| [1.2.709, +∞)      | [1.2.709, +∞)            | **Important**: Fuse storage path changed |

## Important Changes & Upgrade Instructions

### Version 1.2.307

- Support deserialize Role info with PB and JSON
- Only support serialize Role info to JSON
- **Upgrade to this version first** if you're on an earlier version

### Version 1.2.311

- Only support serialize Role info to PB
- **Upgrade to this version next** after reaching 1.2.307
- Example upgrade path: `1.2.306 -> 1.2.307 -> 1.2.311 -> 1.2.312`

### Version 1.2.709

- **Important Change**: Fuse storage path modified
- ⚠️ Versions before 1.2.709 may not be able to read some data from versions 1.2.709+
- ⚠️ **Recommendation**: All nodes under the same tenant should be upgraded together
- Avoid mixing nodes with versions before and after 1.2.709 to prevent potential data access issues

### Version 1.2.764

- If you need specify a different storage location for `system_history` tables. All nodes under the same tenant need to be upgraded to 1.2.764+

## Compatibility between databend-meta

| Meta version       | Backward compatible with |
| :----------------- | :----------------------- |
| [0.9.41, 1.2.212)  | [0.9.41, 1.2.212)        |
| [1.2.212, 1.2.479) | [0.9.41, 1.2.479)        |
| [1.2.479, 1.2.655) | [1.2.288, 1.2.655)       |
| [1.2.655, +∞)      | [1.2.288, +∞)            |

![](@site/static/img/deploy/compat-meta-meta-1-2-655.svg)

- `1.2.53` Incompatible, rolling upgrade is allowed without snapshot transmitting.
  Snapshot format changed thus during rolling upgrading,
  it requires all node data to be up-to-date, ensure there is no need to replicate with snapshot.

- `1.2.163` Feature: gRPC API: `kv_read_v1()` is added. For stream reading.

- `1.2.212` 2023-11-16 Feature: raft API: `install_snapshot_v1()`. Compatible with old versions.
  Rolling upgrade is supported.
  In this version, databend-meta raft-server introduced a new API `install_snapshot_v1()`.
  The raft-client will try to use either this new API or the original `install_snapshot()`.

- `1.2.479` 2024-05-21 Remove: `install_snapshot()`(v0) from client and server.
  The `install_snapshot_v1()` is the only API to install snapshot, and becomes **REQUIRED** for the client.

- `1.2.528` 2024-06-13 Remove on-disk data version `V001`. The first version using `V002` is `1.2.53`, 2023-08-08.
  Therefore, since `1.2.528`, the oldest compatible version is `1.2.53`.
  Consequently, compatibility remains unchanged from this version onward.

- `1.2.552` 2024-07-02 Introduce on-disk `V003`, using `rotbl` format snapshot,
  which is compatible with `V002`. The oldest compatible version is `1.2.288`(`1.2.212~1.2.287` are removed).

- `1.2.655` 2024-11-11 Introduce on-disk `V004`, using WAL based Raft log storage,
  which is compatible with `V002`. The oldest compatible version is `1.2.288`(`1.2.212~1.2.287` are removed).

## Compatibility of databend-meta on-disk data

The on-disk data of Databend-meta evolves over time while maintaining backward compatibility.

| DataVersion | Databend-version | Min Compatible with |
| :---------- | :--------------- | :------------------ |
| V004        | 1.2.655          | V002                |
| V003        | 1.2.547          | V002                |
| V002        | 1.2.53           | V001                |
| V001        | 1.1.40           | V0                  |

### Identifying the versions

Upon startup, Databend-meta will display the on-disk data version:

For example, running `databend-meta --single` produces:

```
Databend Metasrv

Version: v1.1.33-nightly-...
Working DataVersion: V0

On Disk Data:
    Dir: ./.databend/meta
    Version: version=V0, upgrading=None
```

- `Working DataVersion` denotes the version Databend-meta operates on.
- `On Disk Data -- DataVersion` denotes the version of the on-disk data.

The Working DataVersion must be greater than or equal to the on-disk DataVersion; otherwise, it will panic.

The on-disk DataVersion must be compatible with the current Databend-meta version.
If not, the system will prompt the user to downgrade Databend-meta and quit with a panic.

### Automatic upgrade

When `databend-meta` starting up, the on-disk is upgraded if it is compatible with the working DataVersion.
The upgrade progress will be printed to `stderr` and to log file at INFO level, e.g.:

```text
Upgrade on-disk data
    From: V0(2023-04-21: compatible with openraft v07 and v08, using openraft::compat)
    To:   V001(2023-05-15: Get rid of compat, use only openraft v08 data types)
Begin upgrading: version: V0, upgrading: V001
Write header: version: V0, upgrading: V001
Upgraded 167 records
Finished upgrading: version: V001, upgrading: None
Write header: version: V001, upgrading: None
```

If `databend-meta` crashes before upgrading finishes,
it will clear partially upgraded data and resume the upgrade when it starts up again.

### Backup data compatibility

- The exported backup data **can only be imported** with the same version of `databend-metactl`.

- The first line of the backup is the version, e.g.:
  `["header",{"DataHeader":{"key":"header","value":{"version":"V100","upgrading":null}}}]`

- **NO automatic upgrade** will be done when importing.
  Automatic upgrade will only be done when `databend-meta` is brought up.
