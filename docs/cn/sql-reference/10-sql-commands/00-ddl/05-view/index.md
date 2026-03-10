---
title: 视图（View）
---

本页面全面概述了 Databend 中的视图操作，按功能分类以便查阅。

## 视图管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE VIEW](ddl-create-view.md) | 基于查询创建新视图 |
| [ALTER VIEW](ddl-alter-view.md) | 修改现有视图 |
| [DROP VIEW](ddl-drop-view.md) | 删除视图 |

## 视图信息

| 命令 | 描述 |
|---------|-------------|
| [DESC VIEW](desc-view.md) | 显示视图的详细信息 |
| [SHOW VIEWS](show-views.md) | 列出当前或指定数据库中的所有视图 |

:::note
Databend 中的视图是存储在数据库中的命名查询，可像表一样引用。它们能简化复杂查询并控制对底层数据的访问。
:::