---
title: 升级 Databend
sidebar_label: 升级 Databend
description:
  无停机升级 databend-query 或 databend-meta
---

本主题提供了升级 Databend 的典型步骤概览。

:::note
新版本的 Databend 如果包含破坏性变更，可能会与早期版本不兼容。在这种情况下，Databend 将在发布日志或博客中提供从不兼容版本升级的详细说明。
:::

## 基本原则

Databend 的升级遵循以下原则：

- Databend 升级实际上是指将 databend-query 和/或 databend-meta 升级到更新的版本。
- 当您升级 Databend 时，您需要分别升级 databend-query 和 databend-meta。如果新版本与另一个版本兼容，您也可以选择只升级其中一个。在升级之前[检查兼容性](#check-compatibility)。
- 同一集群中所有查询节点的版本必须相同，无论是否在同一集群中，所有元节点都必须运行相同的版本。
- 通常情况下，不支持回滚。升级后无法恢复到之前的版本。这是因为新版本通常会带来底层数据格式的变化，可能会导致与前一个版本不兼容。

## 第 1 步. 检查兼容性

Databend 强烈建议您在只升级 databend-meta 或 databend-query 之前检查它们之间的兼容性。参见[查询-元兼容性](10-compatibility.md)了解如何进行检查。

## 第 2 步. 升级 databend-query

在每个节点中终止旧的 databend-query 并启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-query

# 启动新的二进制文件
databend-query -c ...
```
新版本启动后，检查 databend-query 日志以确保升级过程中没有发生错误。

## 第 3 步. 升级 databend-meta

在每个节点中终止旧的 databend-meta 并启动新版本：

```shell
# 关闭旧的二进制文件
killall databend-meta

# 启动新的二进制文件
databend-meta -c ...
```
新版本启动后，检查 databend-query 和 databend-meta 日志以确保升级过程中没有发生错误。