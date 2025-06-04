---
title: 序列（Sequence）
---

本文全面介绍了 Databend 中的序列操作，按功能分类组织以便查阅。

## 序列管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE SEQUENCE](create-sequence.md) | 创建新的序列生成器 |
| [DROP SEQUENCE](drop-sequence.md) | 删除序列生成器 |

## 序列信息

| 命令 | 描述 |
|---------|-------------|
| [DESC SEQUENCE](desc-sequence.md) | 显示序列的详细信息 |
| [SHOW SEQUENCES](show-sequences.md) | 列出当前或指定数据库中的所有序列 |

:::note
Databend 中的序列用于按顺序生成唯一数值，通常应用于主键（Primary Key）或其他唯一标识符场景。
:::