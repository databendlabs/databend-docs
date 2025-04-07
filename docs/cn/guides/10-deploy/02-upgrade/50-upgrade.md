---
title: 升级 Databend
sidebar_label: 升级 Databend
description:
  不停机升级 databend-query 或 databend-meta
---

本主题概述了升级 Databend 的典型步骤。

:::note
具有重大更改的新 Databend 版本可能会导致与早期版本不兼容。在这种情况下，Databend 将在发布日志或博客中提供从不兼容版本升级的详细说明。
:::

## 通用原则

Databend 的升级遵循以下原则：

- Databend 升级实际上是指将 databend-query 和/或 databend-meta 升级到更新的版本。
- 升级 Databend 时，需要分别升级 databend-query 和 databend-meta。您也可以选择仅升级其中一个，只要新版本与另一个版本兼容即可。升级前请[检查兼容性](#check-compatibility)。
- 同一集群中所有 query 节点的版本必须相同，并且部署中的所有 meta 节点（无论是否在同一集群中）都必须运行相同的版本。
- 通常，不支持回滚。升级后无法恢复到以前的版本。这是因为新版本通常会带来底层数据格式的更改，这可能会导致与以前的版本不兼容。

## 步骤 1. 检查兼容性

Databend 强烈建议您在仅升级 databend-meta 和 databend-query 之一之前，检查它们之间的兼容性。有关如何操作，请参阅 [Query-Meta 兼容性](10-compatibility.md)。

## 步骤 2. 升级 databend-query

杀死旧的 databend-query 并在每个节点中启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-query

# 启动新的二进制文件
databend-query -c ...
```
新版本启动后，检查 databend-query 日志以确保升级期间未发生任何错误。

## 步骤 3. 升级 databend-meta

杀死旧的 databend-meta 并在每个节点中启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-meta

# 启动新的二进制文件
databend-meta -c ...
```
新版本启动后，检查 databend-query 和 databend-meta 日志以确保升级期间未发生任何错误。