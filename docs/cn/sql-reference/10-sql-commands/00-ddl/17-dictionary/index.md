---
title: 字典（Dictionary）
---

本页面提供了 Databend 中字典操作的全面概述，按功能组织以便于参考。

## 字典管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE DICTIONARY](create-dictionary.md) | 创建新的字典以访问外部数据源 |
| [DROP DICTIONARY](drop-dictionary.md) | 删除字典 |

## 字典信息

| 命令 | 描述 |
|---------|-------------|
| [SHOW DICTIONARIES](show-dictionaries.md) | 列出当前数据库中的所有字典 |
| [SHOW CREATE DICTIONARY](show-create-dictionary.md) | 显示现有字典的 CREATE 语句 |

:::note
Databend 中的字典允许您直接实时查询外部数据源（如 MySQL、Redis）的数据，无需 ETL 过程。这有助于解决数据一致性问题，提高查询（Query）性能，并简化数据管理。您可以使用 `dict_get` 函数查询外部数据。
:::