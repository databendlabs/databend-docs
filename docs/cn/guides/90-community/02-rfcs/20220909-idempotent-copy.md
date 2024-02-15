---
title: 幂等复制
description: 在将Stage文件复制到表中时避免重复
---

- 跟踪问题：https://github.com/datafuselabs/databend/issues/6338

## 摘要

在将 Stage 文件流式复制到表中时，有可能某些文件已经被复制过了。因此，需要一些方法来避免重复复制文件，使其成为一个`幂等`操作。

## 将复制到表中的 Stage 文件元信息保存在元服务中

每当将 Stage 文件复制到表中时，将 Stage 文件的元信息保存到元服务中：

- 键：由`(租户, 数据库, 表, 文件名)`组合而成。
- 值：值必须包含 Stage 文件的所有元信息，例如`content-length`、`etag`、`last modified`。

![](/img/rfc/20220909-idempotent-copy/stage-file-meta.png)

Stage 文件元信息的默认过期时间为 64 天。

## 在将 Stage 文件复制到表中时避免重复

使用 Stage 文件元信息，每当将 Stage 文件复制到表中时，遵循以下步骤：

- 首先，获取想要复制到表中的所有 Stage 文件的表文件元信息（如果有的话）。
- 其次，获取所有 Stage 文件的元信息。
- 第三，比较表文件元信息与 Stage 文件元信息：
  - 如果它们匹配，这个文件就会被忽略，不进行复制。
  - 否则，复制 Stage 文件并上插入到表 Stage 文件元中。

![](/img/rfc/20220909-idempotent-copy/example.png)

以上图为例：

- 客户端发出请求，将三个文件（file1, file2, file3）复制到表中。

- 获取（file1, file2, file3）的表 Stage 文件元信息。

- 在元服务中，只找到了（file1,file3）的 Stage 文件信息。

- 比较表 Stage 文件信息与 Stage 文件信息，发现 file1 没有变化，所以在这次复制操作中 file1 将被忽略，而（file2,file3）将被复制。

- 复制新文件后，（file2, file3）的 Stage 文件信息将被保存到表文件信息中。
