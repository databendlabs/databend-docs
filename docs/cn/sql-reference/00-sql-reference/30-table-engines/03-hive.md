---
id: hive
title: Apache Hive 表
sidebar_label: Apache Hive 表
slug: /sql-reference/table-engines/hive
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend 无需复制数据即可直接查询 Apache Hive 中的数据。将 Hive Metastore 注册为 Databend catalog，指向存储表数据的对象存储，即可像查询原生 Databend 表一样查询这些数据。

## 快速入门

1. **注册 Hive Metastore**

   ```sql
   CREATE CATALOG hive_prod
   TYPE = HIVE
   CONNECTION = (
     METASTORE_ADDRESS = '127.0.0.1:9083'
     URL = 's3://lakehouse/'
     ACCESS_KEY_ID = '<your_key_id>'
     SECRET_ACCESS_KEY = '<your_secret_key>'
   );
   ```

2. **浏览 catalog**

   ```sql
   USE CATALOG hive_prod;
   SHOW DATABASES;
   SHOW TABLES FROM tpch;
   ```

3. **查询 Hive 表**

   ```sql
   SELECT l_orderkey, SUM(l_extendedprice) AS revenue
   FROM tpch.lineitem
   GROUP BY l_orderkey
   ORDER BY revenue DESC
   LIMIT 10;
   ```

## 保持元数据同步

Hive 的 schema 或分区可能在 Databend 之外发生变更。发生变更时，刷新 Databend 缓存的元数据：

```sql
ALTER TABLE tpch.lineitem REFRESH CACHE;
```

## 数据类型映射

查询执行时，Databend 会自动将 Hive 原始类型转换为最接近的原生类型：

| Hive 类型 | Databend 类型 |
| --------- | ------------- |
| `BOOLEAN` | [BOOLEAN](/sql/sql-reference/data-types/boolean) |
| `TINYINT`、`SMALLINT`、`INT`、`BIGINT` | [整数类型](/sql/sql-reference/data-types/numeric#integer-data-types) |
| `FLOAT`、`DOUBLE` | [浮点类型](/sql/sql-reference/data-types/numeric#floating-point-data-types) |
| `DECIMAL(p,s)` | [DECIMAL](/sql/sql-reference/data-types/decimal) |
| `STRING`、`VARCHAR`、`CHAR` | [STRING](/sql/sql-reference/data-types/string) |
| `DATE`、`TIMESTAMP` | [DATETIME](/sql/sql-reference/data-types/datetime) |
| `ARRAY<type>` | [ARRAY](/sql/sql-reference/data-types/array) |
| `MAP<key,value>` | [MAP](/sql/sql-reference/data-types/map) |

`STRUCT` 等嵌套结构通过 [VARIANT](/sql/sql-reference/data-types/variant) 类型呈现。

## 注意事项与限制

- Hive catalog 在 Databend 中为**只读**（写入操作须通过 Hive 兼容引擎完成）。
- 需要具备访问底层对象存储的权限，凭证配置请参考[连接参数](/sql/sql-reference/connect-parameters)。
- 表结构发生变更时（例如新增分区），请执行 `ALTER TABLE ... REFRESH CACHE` 以确保查询结果准确。
