---
title: 幂等复制
description: 避免将 Stage 文件复制到表时出现重复
---

- Tracking Issue: https://github.com/databendlabs/databend/issues/6338

## 概要

当流式复制 Stage 文件到表时，某些文件可能已经被复制，因此需要一些方法来避免重复复制文件，使其成为一个 `idempotent` 操作。

## 将复制到表的 Stage 文件元信息保存在 Meta Service 中

每当将 Stage 文件复制到表时，将 Stage 文件元信息保存到 Meta Service 中：

- 键：与 `(tenant, database, table, file name)` 组合。
- 值：值必须包含 Stage 文件的所有元数据，例如 `content-length`、`etag`、`last modified`。

![](/img/rfc/20220909-idempotent-copy/stage-file-meta.png)

Stage 文件元信息的过期时间默认为 64 天。

## 避免将 Stage 文件复制到表时出现重复

使用 Stage 文件元信息，每当将 Stage 文件复制到表时，请按照以下步骤操作：

- 首先，获取要复制到表中的复制 Stage 文件的所有表文件元信息（如果有）。
- 其次，获取所有 Stage 文件元信息。
- 第三，比较表文件元信息与 Stage 文件元信息：
  - 如果它们匹配，则忽略此文件而不进行复制。
  - 否则，复制 Stage 文件并向上插入到表 Stage 文件元数据中。

![](/img/rfc/20220909-idempotent-copy/example.png)

以上图为例：

- 客户端发出将三个文件（file1、file2、file3）复制到表中的请求。

- 获取（file1、file2、file3）的表 Stage 文件元数据。

- 在 Meta Service 中，仅找到（file1、file3）Stage 文件信息。

- 将表 Stage 文件信息与 Stage 文件信息进行比较，发现 file1 没有更改，因此在此复制操作中将忽略 file1，并且将复制（file2、file3）。

- 复制新文件后，（file2、file3）Stage 文件信息将保存到表文件信息中。