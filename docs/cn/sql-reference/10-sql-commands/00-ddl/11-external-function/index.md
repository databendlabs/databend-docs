---
title: 外部函数（External Function）
---

本页面全面概述了 Databend 中的外部函数（External Function）操作，并按功能进行组织，方便参考。

## 外部函数（External Function）管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE EXTERNAL FUNCTION](ddl-create-function.md) | 创建一个新的外部函数（External Function） |
| [ALTER EXTERNAL FUNCTION](ddl-alter-function.md) | 修改一个现有的外部函数（External Function） |
| [DROP EXTERNAL FUNCTION](ddl-drop-function.md) | 移除一个外部函数（External Function） |

:::note
Databend 外部函数允许你用自定义逻辑扩展 SQL，逻辑运行在远程服务器上，通过 [Apache Arrow Flight](https://arrow.apache.org/docs/format/Flight.html) 协议与 Databend 通信。远程处理程序可以用任意语言实现，Python 是最常见的选择，可通过 [databend-udf](https://pypi.org/project/databend-udf) 包快速上手。
:::