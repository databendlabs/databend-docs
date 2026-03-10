---
title: 数据库（Database）
---

本页面全面介绍 Databend 中的数据库操作，按功能分类便于查阅。

## 数据库创建与管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE DATABASE](ddl-create-database.md) | 创建新数据库 |
| [ALTER DATABASE](ddl-alter-database.md) | 修改数据库 |
| [DROP DATABASE](ddl-drop-database.md) | 删除数据库 |
| [USE DATABASE](ddl-use-database.md) | 设置当前工作数据库 |
| [UNDROP DATABASE](undrop-database.md) | 恢复已删除的数据库 |

## 数据库信息

| 命令 | 描述 |
|---------|-------------|
| [SHOW DATABASES](show-databases.md) | 列出所有数据库 |
| [SHOW CREATE DATABASE](show-create-database.md) | 显示数据库的 CREATE DATABASE 语句 |
| [SHOW DROP DATABASES](show-drop-databases.md) | 列出可恢复的已删除数据库 |

:::note
数据库操作是 Databend 中组织数据的基础，执行前请确保具备相应权限。
:::