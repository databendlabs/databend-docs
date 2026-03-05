---
title: CREATE TABLE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.821"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='COMPUTED COLUMN'/>

在许多数据库中，创建表是最复杂的操作之一，因为你可能需要：

- 手动指定引擎  
- 手动指定索引  
- 甚至指定数据分区或分片  

Databend 以“开箱即用”为设计目标，创建表时无需上述任何操作。此外，CREATE TABLE 语句提供以下选项，帮助你在不同场景下轻松建表：

- [CREATE TABLE](#create-table)：从零开始创建表。  
- [CREATE TABLE ... LIKE](#create-table--like)：按已有表的列定义创建新表。  
- [CREATE TABLE ... AS](#create-table--as)：创建表并将 SELECT 查询结果作为数据插入。  

另请参阅：

- [CREATE TEMP TABLE](10-ddl-create-temp-table.md)  
- [CREATE TRANSIENT TABLE](10-ddl-create-transient-table.md)  
- [CREATE EXTERNAL TABLE](10-ddl-create-table-external-location.md)  

## CREATE TABLE

```sql
CREATE [ OR REPLACE ] TABLE [ IF NOT EXISTS ] [ <database_name>. ]<table_name>
(
    <column_name> <data_type> [ NOT NULL | NULL ]
                              [ { DEFAULT <expr>
                                | { AUTOINCREMENT | IDENTITY }
                                  [ { ( <start_num> , <step_num> )
                                    | START <num> INCREMENT <num> } ]
                                  [ { ORDER | NOORDER } ]
                                } ]
                              [ AS (<expr>) STORED | VIRTUAL ]
                              [ COMMENT '<comment>' ],
    <column_name> <data_type> ...
    ...
)
```

:::note

- 关于 Databend 支持的数据类型，参见 [数据类型](../../../00-sql-reference/10-data-types/index.md)。  
- 建议列名避免特殊字符；如必须使用，请用反引号包裹，例如：CREATE TABLE price(\`$CA\` int);  
- Databend 会自动将列名转为小写。例如列名 _Total_ 在结果中显示为 _total_。  
:::

## CREATE TABLE ... LIKE

按已有表的列定义创建新表，复制列名、数据类型及非 NULL 约束，但不复制数据及其他属性（如 `CLUSTER BY`、`TRANSIENT`、`COMPRESSION`）。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
LIKE [db.]origin_table_name
```

:::note 解决方法

可显式指定 `TRANSIENT` 或 `COMPRESSION`：

```sql
create transient table t_new like t_old;
create table t_new compression='lz4' like t_old;
```
:::

## CREATE TABLE ... AS

创建表并用 SELECT 查询结果填充数据，不继承原表的任何属性（如 CLUSTER BY、TRANSIENT、COMPRESSION）。

语法：

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
AS SELECT query
```

:::note 解决方法

可显式指定 `TRANSIENT` 或 `COMPRESSION`：

```sql
create transient table t_new as select * from t_old;
create table t_new compression='lz4' as select * from t_old;
```
:::

## 列的可空性

默认情况下，**所有列都允许 NULL**。如需禁止 NULL，请使用 NOT NULL 约束。详见 [NULL 值与 NOT NULL 约束](../../../00-sql-reference/10-data-types/index.md)。

## 列默认值

`DEFAULT <expr>` 为列设置默认值，支持：

- 固定常量，如 `Marketing`  
- 无入参的标量表达式，如 `1 + 1`、`NOW()`、`UUID()`  
- 序列动态值，如 `NEXTVAL(staff_id_seq)`  
  - NEXTVAL 必须独立使用，不支持 `NEXTVAL(seq1) + 1`  
  - 需具备相应序列权限  

## 自增列

<FunctionDescription description="Introduced or updated: v1.2.821"/>

使用 `AUTOINCREMENT` 或 `IDENTITY` 创建自增列，自动生成顺序数字，常用于唯一标识。

**语法：**

```sql
{ AUTOINCREMENT | IDENTITY }
  [ { ( <start_num> , <step_num> )
    | START <num> INCREMENT <num> } ]
  [ { ORDER | NOORDER } ]
```

**参数：**

- `start_num`：起始值（默认 1）  
- `step_num`：步长（默认 1）  
- `ORDER`：保证单调递增（可能有间隙）  
- `NOORDER`：不保证顺序（默认）  

**要点：**

- 内部由序列实现  
- 删除列时关联序列一并删除  
- 未指定值时自动生成  
- `AUTOINCREMENT` 与 `IDENTITY` 等价  

**示例：**

```sql
CREATE TABLE users (
    user_id BIGINT AUTOINCREMENT,
    order_id BIGINT AUTOINCREMENT START 100 INCREMENT 10,
    username VARCHAR
);

INSERT INTO users (username) VALUES ('alice'), ('bob'), ('charlie');

SELECT * FROM users;
```

## 计算列

计算列通过标量表达式由其他列生成，支持两种类型：

- **STORED**：值持久化存储，依赖列变更时自动更新  
- **VIRTUAL**：查询时实时计算，节省存储  

**语法：**

```sql
<column_name> <data_type> [ NOT NULL | NULL ] AS (<expr>) { STORED | VIRTUAL }
<column_name> <data_type> [ NOT NULL | NULL ] GENERATED ALWAYS AS (<expr>) { STORED | VIRTUAL }
```

**示例：**

```sql
-- STORED：物理存储，立即更新
CREATE TABLE products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

-- VIRTUAL：查询时计算，无存储开销
CREATE TABLE employees (
  id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  full_name VARCHAR AS (CONCAT(first_name, ' ', last_name)) VIRTUAL
);
```

:::tip
频繁查询且对性能敏感时选 **STORED**；计算成本可接受且需节省空间时选 **VIRTUAL**。  
:::

## MySQL 兼容性

Databend 语法与 MySQL 的差异主要在数据类型及部分索引提示。

## 访问控制要求

| 权限   | 对象类型   | 描述     |
|:-------|:-----------|:---------|
| CREATE | 全局、表   | 创建表   |

创建表时，用户或 [current_role](/guides/security/access-control/roles) 需具备 CREATE [权限](/guides/security/access-control/privileges#table-privileges)。

## 示例

### 创建表

创建带默认值的表：

```sql
CREATE TABLE books (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
);
```

查看表结构：

```sql
DESC books;
```

插入数据：

```sql
INSERT INTO books(id, title) VALUES(1, 'Invisible Stars');
```

查询结果：

```sql
SELECT * FROM books;
```

### CREATE TABLE ... LIKE

按结构创建新表：

```sql
CREATE TABLE books_copy LIKE books;
```

### CREATE TABLE ... AS

创建并复制数据：

```sql
CREATE TABLE books_backup AS SELECT * FROM books;
```

### 计算列示例

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

INSERT INTO products VALUES (1,10.5,3),(2,15.2,5),(3,8.7,2);

SELECT * FROM products;
```

```sql
CREATE TABLE student_profiles (
    id STRING,
    profile VARIANT,
    age INT NULL AS (profile['age']::INT) VIRTUAL
);

INSERT INTO student_profiles VALUES
  ('d78236','{"id":"d78236","name":"Arthur Read","age":"16"}'),
  ('f98112','{"name":"Buster Bunny","age":"15","id":"f98112"}'),
  ('t63512','{"name":"Ernie Narayan","id":"t63512"}');

SELECT * FROM student_profiles;
```