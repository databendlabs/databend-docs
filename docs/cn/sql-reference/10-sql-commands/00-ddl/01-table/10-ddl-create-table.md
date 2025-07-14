---
title: CREATE TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.714"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='计算列（COMPUTED COLUMN）'/>

创建表是许多数据库中最复杂的操作之一，因为您可能需要：

- 手动指定存储引擎（Engine）
- 手动指定索引（Index）
- 甚至需要指定数据分区（Partition）或数据分片（Shard）

Databend 的设计目标是易于使用，在创建表时**不需要**执行上述任何操作。此外，CREATE TABLE 语句提供以下选项，使您在各种场景下都能轻松创建表：

- [CREATE TABLE](#create-table)：从头创建新表
- [CREATE TABLE ... LIKE](#create-table--like)：基于现有表的列定义创建新表
- [CREATE TABLE ... AS](#create-table--as)：通过 SELECT 查询结果创建表并插入数据

另请参阅：

- [CREATE TEMP TABLE](10-ddl-create-temp-table.md)
- [CREATE TRANSIENT TABLE](10-ddl-create-transient-table.md)
- [CREATE EXTERNAL TABLE](10-ddl-create-table-external-location.md)

## CREATE TABLE

```sql
CREATE [ OR REPLACE ] TABLE [ IF NOT EXISTS ] [ <database_name>. ]<table_name>
(
    <column_name> <data_type> [ NOT NULL | NULL ]
                              [ { DEFAULT <expr> } ]
                              [ AS (<expr>) STORED | VIRTUAL ]
                              [ COMMENT '<comment>' ],
    <column_name> <data_type> ...
    ...
)
```

:::note

- Databend 支持的数据类型请参阅[数据类型（Data Types）](../../../00-sql-reference/10-data-types/index.md)
- 建议尽量避免在列名中使用特殊字符。如必须使用，需用反引号包裹别名：`CREATE TABLE price(\`$CA\` int)`
- Databend 会自动将列名转为小写（如 _Total_ 会显示为 _total_）
:::

## CREATE TABLE ... LIKE

创建与现有表列定义相同的新表，复制列名、数据类型及非空约束（NOT NULL Constraints）。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

此命令**不复制**原始表的数据或属性（如 `CLUSTER BY`、`TRANSIENT`、`COMPRESSION`），新表使用系统默认设置。

:::note 变通方案
创建时可显式指定 `TRANSIENT` 和 `COMPRESSION`：
```sql
create transient table t_new like t_old;
create table t_new compression='lz4' like t_old;
```
:::

## CREATE TABLE ... AS

通过 SELECT 查询结果创建表并填充数据。

语法：
```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

此命令**不复制**原始表属性（如 `CLUSTER BY`、`TRANSIENT`、`COMPRESSION`），新表使用系统默认设置。

:::note 变通方案
创建时可显式指定 `TRANSIENT` 和 `COMPRESSION`：
```sql
create transient table t_new as select * from t_old;
create table t_new compression='lz4' as select * from t_old;
```
:::

## 列可空性（Column Nullability）

Databend 中所有列默认**可为空（NULL）**。如需禁止 NULL 值，请使用 `NOT NULL` 约束。详见 [NULL 值与 NOT NULL 约束](../../../00-sql-reference/10-data-types/index.md)。

## 列默认值（Column Default Values）

`DEFAULT <expr>` 设置当未提供显式值时的列默认值，支持：
- 固定常量（如 `'Marketing'`）
- 无参数标量表达式（如 `NOW()`、`UUID()`）
- 序列动态生成值（如 `NEXTVAL(staff_id_seq)`）

```sql
CREATE SEQUENCE staff_id_seq;
CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq), -- 从序列生成
    name VARCHAR(50),
    department VARCHAR(50) DEFAULT 'Marketing' -- 固定默认值
);
```

## 计算列（Computed Columns）

通过标量表达式从其他列生成的列，当依赖列更新时自动重新计算。支持两种类型：
- **存储列（STORED）**：物理存储计算结果
- **虚拟列（VIRTUAL）**：查询时动态计算

语法：
```sql
-- 简写语法
CREATE TABLE ... (
    <column> <type> AS (<expr>) STORED|VIRTUAL
)

-- 完整语法
CREATE TABLE ... (
    <column> <type> GENERATED ALWAYS AS (<expr>) STORED|VIRTUAL
)
```

**存储列示例**：`total_price` 随 `price`/`quantity` 更新
```sql
CREATE TABLE products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
```

**虚拟列示例**：`full_name` 动态拼接 `first_name`/`last_name`
```sql
CREATE TABLE employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip 选择存储（STORED）还是虚拟（VIRTUAL）？
| 考量因素       | 存储列（STORED）                | 虚拟列（VIRTUAL）               |
|----------------|--------------------------------|--------------------------------|
| 存储空间       | 占用物理存储                    | 不占用存储空间                 |
| 实时性         | 写入时立即更新                 | 查询时动态计算                |
| 数据一致性     | 始终保持最新                   | 可能存在瞬时不一致           |
| 查询性能       | 读取速度快                     | 计算增加查询开销             |
:::

## MySQL 兼容性

Databend 与 MySQL 的主要差异在于数据类型和特定索引提示（Index Hints）。

## 访问控制要求

| 权限   | 对象类型      | 描述         |
|--------|--------------|--------------|
| CREATE | 全局, 表      | 创建表权限   |

用户或 [current_role](https://docs.databend.cn/guides/security/access-control/roles) 需具备 CREATE [权限](https://docs.databend.cn/guides/security/access-control/privileges#table-privileges)。

## 示例

### 基础建表
创建带默认值的表：
```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```
插入验证默认值：
```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
SELECT * FROM books;
```
结果：
```
+----+----------------+---------+
| id | title          | genre   |
+----+----------------+---------+
|  1 | Invisible Stars| General |
+----+----------------+---------+
```

### 结构复制
基于现有表结构创建：
```sql
CREATE TABLE books_copy LIKE books;
DESC books_copy; -- 验证结构复制
```

### 查询建表
通过 SELECT 结果创建：
```sql
CREATE TABLE books_backup AS SELECT * FROM books;
DESC books_backup; -- 注意默认值未复制
```

### 计算列应用
**存储列示例**：自动计算总额
```sql
CREATE TABLE products (
  id INT, price FLOAT64, quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);
INSERT INTO products VALUES (1,10.5,3), (2,15.2,5);
SELECT * FROM products;
```
结果：
```
+------+-------+----------+-------------+
| id   | price | quantity | total_price |
+------+-------+----------+-------------+
|    1 |  10.5 |        3 |        31.5 |
|    2 |  15.2 |        5 |        76.0 |
+------+-------+----------+-------------+
```

**虚拟列示例**：动态解析 JSON
```sql
CREATE TABLE student_profiles (
    id STRING,
    profile VARIANT,
    age INT NULL AS (profile['age']::INT) VIRTUAL
);
INSERT INTO student_profiles VALUES 
    ('d78236', '{"name":"Arthur","age":"16"}'),
    ('t63512', '{"name":"Ernie"}');
SELECT id, age FROM student_profiles;
```
结果：
```
+--------+------+
| id     | age  |
+--------+------+
| d78236 |   16 |
| t63512 | NULL |
+--------+------+
```