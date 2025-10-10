---
title: ALTER TABLE SWAP WITH
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.821"/>

在单个事务（Transaction）中原子地交换两个表的所有元数据和数据。此操作会交换表结构（schema），包括所有列、约束和数据，从而有效地使每个表承担另一个表的身份。

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <source_table_name> SWAP WITH <target_table_name>
```

| 参数            | 说明                                    |
|----------------------|------------------------------------------------|
| `source_table_name`  | 要交换的第一个表的名称            |
| `target_table_name`  | 要与之交换的第二个表的名称      |

## 使用说明

- **引擎支持**：仅适用于 Fuse 引擎表。不支持外部表、系统表和其他非 Fuse 表。
- **表类型**：临时表不能与永久表或瞬时表交换。
- **权限**：当前角色必须是两个表的所有者才能执行交换操作。
- **数据库范围**：两个表必须在同一个数据库中。不支持跨数据库交换。
- **原子性**：交换操作是原子性的。要么两个表都成功交换，要么两个表都不变。
- **数据保留**：交换期间会保留所有数据和元数据。不会丢失或修改任何数据。

## 示例

```sql
-- 创建两个具有不同表结构的表
CREATE OR REPLACE TABLE t1(a1 INT, a2 VARCHAR, a3 DATE);
CREATE OR REPLACE TABLE t2(b1 VARCHAR);

-- 交换前检查表结构
DESC t1;
DESC t2;

-- 交换表
ALTER TABLE t1 SWAP WITH t2;

-- 交换后，t1 拥有 t2 的表结构，t2 拥有 t1 的表结构
DESC t1;
DESC t2;
```