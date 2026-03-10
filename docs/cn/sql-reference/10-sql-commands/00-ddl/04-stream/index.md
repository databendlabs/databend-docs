---
title: 流（Stream）
---

本页面提供 Databend 中流操作的全面概述，按功能组织以便于参考。

## 流管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE STREAM](create-stream.md) | 创建新流以跟踪表中的变更 |
| [DROP STREAM](drop-stream.md) | 删除流 |

## 流信息

| 命令 | 描述 |
|---------|-------------|
| [DESC STREAM](desc-stream.md) | 显示流的详细信息 |
| [SHOW STREAMS](show-streams.md) | 列出当前或指定数据库中的所有流 |

## 相关主题

- [通过流跟踪和转换数据](/guides/load-data/continuous-data-pipelines/stream)

:::note
Databend 中的流用于跟踪和捕获表变更，实现持续数据管道和实时数据处理。
:::