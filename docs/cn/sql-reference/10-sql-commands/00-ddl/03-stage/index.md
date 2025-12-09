---
title: 存储阶段（Stage）
---

本页面全面概述了 Databend 中的 Stage 操作，按功能分类以便参考。

## Stage 管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE STAGE](01-ddl-create-stage.md) | 创建用于存储文件的新 Stage |
| [DROP STAGE](02-ddl-drop-stage.md) | 删除 Stage |
| [PRESIGN](presign.md) | 为 Stage 访问生成预签名 URL |

## Stage 操作

| 命令 | 描述 |
|---------|-------------|
| [LIST STAGE](04-ddl-list-stage.md) | 列出 Stage 中的文件 |
| [REMOVE STAGE](05-ddl-remove-stage.md) | 从 Stage 中删除文件 |

## Stage 信息

| 命令 | 描述 |
|---------|-------------|
| [DESC STAGE](03-ddl-desc-stage.md) | 显示 Stage 的详细信息 |
| [SHOW STAGES](06-ddl-show-stages.md) | 列出当前或指定数据库中的所有 Stage |

## 相关主题

- [使用 Stage](/guides/load-data/stage/)
- [从 Stage 加载数据](/guides/load-data/load/stage)
- [查询和转换](/guides/load-data/transform/querying-stage)
- [文件格式 (DDL)](/sql/sql-commands/ddl/file-format/)

:::note
Databend 中的 Stage 用作临时存储位置，用于存放需加载到表或从表卸载的数据文件。
:::
