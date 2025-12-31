---
title: 计算集群（Warehouse）
sidebar_position: 0
---

Databend Cloud 计算集群相关的 SQL 命令。

## 基本规则

- **命名规范**：长度 3–63 个字符，仅支持 `A-Z`、`a-z`、`0-9` 和 `-`。
- **标识符**：不含空格或特殊字符时可省略引号，否则需用单引号包裹。
- **数值参数**：支持整数或 `NULL`。设为 `NULL` 会重置为默认值（如 `AUTO_SUSPEND = NULL` 等同于 `0`）。
- **布尔参数**：仅接受 `TRUE` / `FALSE`。
- **`WITH` 关键字**：可放在整个选项列表前，也可放在每个选项前。选项间用空格分隔。

## 计算集群管理

| 命令 | 描述 |
|------|------|
| [CREATE WAREHOUSE](create-warehouse.md) | 创建计算集群 |
| [USE WAREHOUSE](use-warehouse.md) | 切换当前会话的计算集群 |
| [SHOW WAREHOUSES](show-warehouses.md) | 查看计算集群列表 |
| [ALTER WAREHOUSE](alter-warehouse.md) | 暂停、恢复或修改计算集群配置 |
| [DROP WAREHOUSE](drop-warehouse.md) | 删除计算集群 |
| [REPLACE WAREHOUSE](replace-warehouse.md) | 重建计算集群 |
| [QUERY_HISTORY](query-history.md) | 查询执行历史记录 |

:::note
计算集群是 Databend Cloud 中用于执行查询的计算资源。
:::
