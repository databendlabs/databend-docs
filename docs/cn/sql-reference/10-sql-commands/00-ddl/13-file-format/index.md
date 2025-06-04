---
title: 文件格式（File Format）
---

本页面提供了 Databend 中文件格式操作的全面概述，按功能组织以便参考。

## 文件格式管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE FILE FORMAT](01-ddl-create-file-format.md) | 创建一个命名的文件格式对象，用于数据加载和卸载 |
| [DROP FILE FORMAT](02-ddl-drop-file-format.md) | 删除文件格式对象 |

## 文件格式信息

| 命令 | 描述 |
|---------|-------------|
| [SHOW FILE FORMATS](03-ddl-show-file-formats.md) | 列出当前数据库中的所有文件格式 |

:::note
Databend 中的文件格式定义了数据加载操作期间如何解析数据文件，以及数据卸载操作期间如何格式化数据文件。它们提供了一种可重用的方式来指定文件类型、字段分隔符、压缩和其他格式选项。
:::