---
title: 标签 (Tag)
---

Tag 允许您将键值元数据附加到 Databend 对象上，用于数据治理、分类和合规追踪。您可以定义带有可选允许值的 Tag，将其分配给对象，并通过 TAG_REFERENCES 表函数查询 Tag 分配情况。

## Tag 管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE TAG](01-ddl-create-tag.md) | 创建新 Tag，可选设置允许值和注释 |
| [DROP TAG](02-ddl-drop-tag.md) | 删除 Tag（不能有活跃引用） |
| [SHOW TAGS](03-ddl-show-tags.md) | 列出 Tag 定义 |

## Tag 分配

| 命令 | 描述 |
|---------|-------------|
| [SET TAG / UNSET TAG](04-ddl-set-tag.md) | 为数据库对象分配或移除 Tag |
| [TAG_REFERENCES](/sql/sql-functions/table-functions/tag-references) | 查询指定对象上的 Tag 分配情况 |
