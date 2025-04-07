---
title: 灾难恢复
description: 使 Databend 能够从涉及元数据或数据丢失的灾难中恢复。
---

- RFC PR: [databendlabs/databend-docs#1546](https://github.com/databendlabs/databend-docs/pull/1546)
- Tracking Issue: [datafuselabs/databend#17234](https://github.com/datafuselabs/databend/issues/17234)

## 概要

使 databend 能够从涉及元数据或数据丢失的灾难中恢复。

## 动机

Databend 旨在实现高可用性和容错性。其元数据由 Databend MetaSrv 提供服务，该服务由 [OpenRaft](https://github.com/databendlabs/openraft) 提供支持。数据存储在对象存储系统中，例如 S3、GCS 等，这些系统保证 99.99% 的可用性和 99.999999999% 的持久性。

但是，对于需要强大的灾难恢复计划的企业用户来说，这还不够。这些用户要么对跨大陆灾难恢复有重大需求，要么必须遵守严格的监管要求。

例如，[健康保险流通与责任法案 (HIPAA)](https://www.hhs.gov/hipaa/index.html) 规定医疗保健组织制定并实施应急计划。此类计划确保在发生扰乱运营的自然或人为灾难时，企业可以继续运营，直到恢复常规服务。

本 RFC 提出了一种解决方案，使 Databend 能够从涉及元数据或数据丢失的灾难中恢复。

## 指导性说明

本 RFC 介绍了通过提供强大的备份和恢复解决方案，使 Databend 能够从灾难（例如元数据或数据丢失）中恢复的第一步。我们提出的产品，暂定名为 `bendsave`，将允许用户有效地备份和恢复元数据和数据。

_此产品的名称尚未确定，我们称之为 `bendsave`_

### 1. 备份

使用 `bendsave backup` 命令创建集群数据和元数据的备份。支持增量备份，确保仅保存自上次备份以来的更改。这简化了日常备份。

示例：

```shell
bendsave backup --from /path/to/query-node-1.toml --to s3://backup/
```

要点：

- 元数据和数据存储在备份位置。
- 即使在完全失败的情况下，也能实现完整的集群恢复。

### 2. 列出备份

要查看存储在指定位置的所有备份，请使用 `bendsave list` 命令。

示例：

```shell
bendsave list s3://backup/
```

### 3. 恢复

使用 `bendsave restore` 命令从备份恢复 Databend 集群。默认情况下，这以 dry-run 模式运行，以防止意外恢复。对于自动恢复，请使用 `--confirm` 标志。

示例：

```shell
# Dry-run 模式 (默认)
bendsave restore --from s3://backup/path/to/backup/manifest --to /path/to/query-node-1.toml

# 立即执行恢复
bendsave restore --from s3://backup/path/to/backup/manifest --to /path/to/query-node-1.toml --confirm
```

### 4. 清理

使用 `bendsave vacuum` 命令管理备份保留。这通过删除旧的或不必要的备份来确保备份符合您的保留策略。

示例：

```shell
bendsave vacuum s3://backup \
    --retention-days 30     \
    --min-retention-days 7  \
    --max-backups 5         \
    --min-backups 2
```

`bendsave` 工具将提供一种简单而强大的方式，通过备份和恢复操作来保护 Databend 集群。凭借增量备份、dry-run 恢复模式和基于 vacuum 的保留管理等功能，它为用户在灾难恢复场景中提供了控制和可靠性。

## 参考级说明

`bendsave` 将引入一个 `BackupManifest`，其中存储以下内容：

- 给定备份的元数据：如备份时间、备份位置、备份类型（完整或增量）等。
- 元数据备份的位置：指向元数据备份的位置。
- 数据备份的位置：包含所有表数据的位置。

```rust
struct BackupManifest {
    backup_meta: BackupMeta,

    metasrv: BackupFile,
    storage: Vec<BackupFile>,
    ...
}

struct BackupMeta {
    backup_time: DateTime<Utc>,
    ...
}

struct BackupFile {
    blocks: Vec<Block>,
    etag: String,
}

struct BackupBlock {
    block_id: String,
    block_size: u64,
    ...
}
```

`BackupManifest` 将由 protobuf 编码并与备份元数据和数据一起存储在备份存储中。

`BackupManifest` 的 protobuf 定义将进行版本控制，以确保向后和向前兼容性。这将使 Databend Query 能够恢复使用不同版本的 Databend 创建的备份。

### 备份存储布局

备份存储布局如下：

```
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/manifests/20250115_201500.manifest
s3://backup/manifests/20250116_201500.manifest
s3://backup/data/<block_id_0>
s3://backup/data/<block_id_1>
s3://backup/data/<block_id_....>
s3://backup/data/<block_id_N>
```

- `bendsave.md` 用作快速参考指南，以帮助用户了解备份存储并恢复集群。
- `manifests/` 目录中的每个 manifest 都包含恢复集群所需的一切。
- `data/` 目录存储所有数据块。Bendsave 将源数据拆分为固定大小的块（例如，8 MiB），并使用其 SHA-256 校验和作为块 ID。

### 备份过程

- 导出所有 metasrv 数据并将其保存到备份存储。
- 枚举源后端存储服务以创建 `BackupManifest` 文件。
- 将所有数据文件复制到备份存储。

对于增量备份，Databend 检查现有的 `BackupManifest` 文件，并将仅修改的数据文件以及新的 `BackupManifest` 文件传输到备份存储。

例如：

用户第一次执行备份，例如：

```shell
bendsave backup --from /path/to/query-node-1.toml --to s3://backup/
```

他们将看到创建以下文件：

```shell
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/data/<sha256_of_block_0>
s3://backup/data/<sha256_of_block_1>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_N>
```

用户第二次执行备份时，bendsave 将生成以下文件并省略现有块：

```shell
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/manifests/20250115_201500.manifest
s3://backup/data/<sha256_of_block_0>
s3://backup/data/<sha256_of_block_1>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_N>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_M>
```

块 ID 由块内容的 SHA-256 校验和生成。因此，如果之前已备份过同一块，我们可以重复使用它。

### 恢复过程

- 从备份存储读取 `BackupManifest` 文件。
- 将所有相关数据文件复制到其原始位置。
- 读取备份的 metasrv 数据并导入到新的 metasrv 集群中。

请注意，恢复过程将覆盖整个 MetaSrv 集群。备份目标 MetaSrv 集群中的所有现有元数据将永久丢失。

用户可以使用以下命令从备份恢复：

```shell
bendsave restore --from s3://backup/manifests/20250114_201500.manifest --to /path/to/query-node-1.toml
```

用户还可以通过指定最新的 manifest 文件来增量恢复：

```shell
bendsave restore --from s3://backup/manifests/20250115_201500.manifest --to /path/to/query-node-1.toml
```

## 缺点

无。

## 基本原理和替代方案

无。

## 先前技术

### Databricks Clone

Databricks 允许用户执行表的 shadow 和 deep cloning。

例如：

使用 clone 进行数据存档

```sql
CREATE OR REPLACE TABLE archive_table CLONE my_prod_table;
```

或者使用 clone 对生产表进行短期实验

```sql
-- 执行 shallow clone
CREATE OR REPLACE TABLE my_test SHALLOW CLONE my_prod_table;

UPDATE my_test WHERE user_id is null SET invalid=true;
-- 运行一堆验证。一旦满意：

-- 如果可能，这应该利用 clone 中的更新信息来修剪到 clone 中仅更改的文件
MERGE INTO my_prod_table
USING my_test
ON my_test.user_id <=> my_prod_table.user_id
WHEN MATCHED AND my_test.user_id is null THEN UPDATE *;

DROP TABLE my_test;
```

## 未解决的问题

无。

## 未来可能性

### 复制

将来，我们可以扩展备份和恢复功能以支持复制。这将允许用户跨不同的 databend 集群复制数据库或表，以实现灾难恢复或数据分发。

Databend 还可以实施热备，以确保高可用性和容错性。
