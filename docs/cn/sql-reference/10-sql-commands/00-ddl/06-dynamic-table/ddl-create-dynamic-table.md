---
title: CREATE DYNAMIC TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

创建动态表并存储其定义查询的结果。只有初始数据物化成功后，创建操作才会完成。在执行 [REFRESH DYNAMIC TABLE](ddl-refresh-dynamic-table.md) 之前，查询始终读取该存储结果。

## 语法

```sql
CREATE [ OR REPLACE ] [ TRANSIENT ] DYNAMIC TABLE [ IF NOT EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<table_name>
  [ ( <column_name> <data_type> [ NULL | NOT NULL ] [ COMMENT '<comment>' ], ... )
    | LIKE [ <database_name>. ]<source_table_name> ]
  [ CLUSTER BY ( <expr>, ... ) ]
  [ <fuse_table_option> = <value> ... ]
AS <query>
```

`OR REPLACE` 和 `IF NOT EXISTS` 不能同时使用。

## 参数

| 参数 | 描述 |
|-----------|-------------|
| `OR REPLACE` | 初始化成功后替换现有表。如果初始化失败，原表仍然可用。 |
| `TRANSIENT` | 使用瞬态表的存储行为。请参阅 [CREATE TRANSIENT TABLE](../01-table/10-ddl-create-transient-table.md)。 |
| `IF NOT EXISTS` | 保持现有表不变。此子句不会刷新数据或修改定义。 |
| `table_name` | 要创建的动态表名称。 |
| 列定义 | 可选的输出 Schema。省略时，Databend 从查询推导列名和类型。 |
| `LIKE` | 复制现有表的列定义。数据仍由 `AS` 查询提供。 |
| `CLUSTER BY` | 引用存储结果中列的聚簇表达式。 |
| `fuse_table_option` | 存储选项，包括 `COMMENT`。请参阅 [CREATE TABLE](../01-table/10-ddl-create-table.md)。 |
| `query` | 至少引用一个受支持源表的定义查询。支持 JOIN、自关联和聚合。 |

即使目标表位于另一个数据库中，未限定数据库名的源表也按创建时会话的当前数据库解析。存储的定义会在后续刷新时保留该数据库解析结果。

## 要求与限制

- 所有查询源必须是持久化、可写的 FUSE 基表，且与目标表位于同一 Catalog。源表可以位于该 Catalog 中的不同数据库。
- 查询源不能是视图、Stream、临时表、其他动态表或非 FUSE 表。
- 源表无需启用变更跟踪。
- 不支持索引定义、列约束和表约束。
- 不支持 `TARGET_LAG` 和 `WAREHOUSE`，指定这些选项会报错。创建和刷新在调用者的会话中执行。
- 不支持 `REFRESH_MODE` 和 `INITIALIZE` 选项。创建时始终物化初始结果。刷新时始终重建完整结果。
- 禁止直接修改数据，包括 `INSERT`、`UPDATE`、`DELETE`、`MERGE`、`REPLACE` 和 `TRUNCATE`。也不能使用 `ALTER TABLE` 添加或删除列。
- 如需修改定义查询，请使用 `CREATE OR REPLACE DYNAMIC TABLE`。

创建需要目标数据库的 `CREATE` 权限，以及查询源表的 `SELECT` 权限。

## 示例

```sql
CREATE OR REPLACE TABLE orders (
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount INT NOT NULL
);

CREATE OR REPLACE TABLE customers (
  customer_id INT NOT NULL,
  customer_name STRING NOT NULL
);

INSERT INTO orders VALUES (1, 10, 100), (2, 20, 200);
INSERT INTO customers VALUES (10, 'alice'), (20, 'bob');

CREATE OR REPLACE DYNAMIC TABLE customer_totals AS
SELECT c.customer_name, SUM(o.amount) AS total_amount
FROM orders AS o
JOIN customers AS c ON o.customer_id = c.customer_id
GROUP BY c.customer_name;

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          100 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

使用标准表命令查看或删除动态表：

```sql
SHOW CREATE TABLE customer_totals;
DESC customer_totals;
DROP TABLE IF EXISTS customer_totals;
```
