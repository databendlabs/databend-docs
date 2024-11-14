---
title: 升级 Databend
sidebar_label: 升级 Databend
description:
  升级 databend-query 或 databend-meta 而不停机
---

本主题概述了升级 Databend 的典型步骤。

:::note
具有破坏性更改的新 Databend 版本可能会导致与早期版本的不兼容。在这种情况下，Databend 将在发布日志或博客中提供从不兼容版本升级的详细说明。
:::

## 一般原则

Databend 的升级遵循以下原则：

- Databend 升级实际上是指将 databend-query 和/或 databend-meta 升级到更新版本。
- 当你升级 Databend 时，你分别升级 databend-query 和 databend-meta。你也可以选择只升级其中一个，只要新版本与另一个兼容即可。在升级之前，请[检查兼容性](#check-compatibility)。
- 同一集群中的所有查询节点版本必须相同，无论是否在同一集群中，所有元节点都必须运行相同版本。
- 通常不支持回滚。升级后无法回滚到之前的版本。这是因为新版本通常会带来底层数据格式的变化，可能会导致与之前版本的不兼容。

## 步骤 1. 检查兼容性

Databend 强烈建议你在仅升级其中一个组件之前，检查 databend-meta 和 databend-query 之间的兼容性。请参阅 [Query-Meta 兼容性](10-compatibility.md) 了解如何进行检查。

## 步骤 2. 升级 databend-query

在每个节点上终止旧的 databend-query 并启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-query

# 启动新的二进制文件
databend-query -c ...
```
新版本启动后，检查 databend-query 日志，确保升级过程中没有发生错误。

## 步骤 3. 升级 databend-meta

在每个节点上终止旧的 databend-meta 并启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-meta

# 启动新的二进制文件
databend-meta -c ...
```
新版本启动后，检查 databend-query 和 databend-meta 日志，确保升级过程中没有发生错误。