---
title: 加载时数据转换
---

Databend 的 `COPY INTO` 命令支持在数据加载过程中进行转换操作。通过集成基础转换功能，简化了 ETL 流程，无需使用临时表。

带转换功能的 `COPY INTO` 通用语法如下：

```sql
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<file_col> ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | Avro } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

更多细节请参阅 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)。

可执行的关键转换操作包括：

-   **加载数据列子集**：选择性导入特定列
-   **列重排序**：在加载时调整列顺序
-   **数据类型转换**：确保一致性和兼容性
-   **执行算术运算**：生成衍生数据
-   **加载到含额外列的表中**：映射并插入数据到现有结构

## 操作教程

以下教程展示加载过程中的数据转换。每个示例均演示从暂存文件加载数据。

### 准备工作

创建 stage 并生成示例 Parquet 文件：

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id,
           'Name_' || CAST(number AS VARCHAR) AS name,
           20 + MOD(number, 23) AS age,
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded
    FROM numbers(10)
)
FILE_FORMAT = (TYPE = PARQUET);
```

查询暂存的示例文件：

```sql
SELECT * FROM @my_parquet_stage;
```

返回结果：

```
┌───────────────────────────────────────┐
│   id   │  name  │   age  │  onboarded │
├────────┼────────┼────────┼────────────┤
│      1 │ Name_0 │     20 │ 2022-01-01 │
│      2 │ Name_5 │     25 │ 2022-01-06 │
│      3 │ Name_1 │     21 │ 2022-01-02 │
│      4 │ Name_6 │     26 │ 2022-01-07 │
│      5 │ Name_7 │     27 │ 2022-01-08 │
│      6 │ Name_2 │     22 │ 2022-01-03 │
│      7 │ Name_8 │     28 │ 2022-01-09 │
│      8 │ Name_3 │     23 │ 2022-01-04 │
│      9 │ Name_4 │     24 │ 2022-01-05 │
│     10 │ Name_9 │     29 │ 2022-01-10 │
└───────────────────────────────────────┘
```

### 教程 1 - 加载数据列子集

将数据加载到比源文件列数少的表中（例如排除 'age' 列）。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);

COPY INTO employees_no_age
FROM (
    SELECT t.id,
           t.name,
           t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_no_age;
```

返回结果（前 3 行）：

```
┌──────────────────────────────────────────────────────────┐
│        id       │       name       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────────┤
│               1 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │ 2022-01-02 00:00:00 │
└──────────────────────────────────────────────────────────┘
```

### 教程 2 - 加载时列重排序

将数据加载到列顺序不同的表中（例如 'age' 列置于 'name' 列前）。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);

COPY INTO employees_new_order
FROM (
    SELECT
        t.id,
        t.age,
        t.name,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_new_order;
```
返回结果（前 3 行）：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       age       │       name       │      onboarded      │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────┤
│               1 │              20 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │              25 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │              21 │ Name_1           │ 2022-01-02 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 3 - 加载时数据类型转换

加载数据并转换列数据类型（例如将 'onboarded' 转为 `DATE` 类型）。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);

COPY INTO employees_date
FROM (
    SELECT
        t.id,
        t.name,
        t.age,
        to_date(t.onboarded)
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_date;
```
返回结果（前 3 行）：

```
┌───────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │    onboarded   │
├─────────────────┼──────────────────┼─────────────────┼────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01     │
│               2 │ Name_5           │              25 │ 2022-01-06     │
│               3 │ Name_1           │              21 │ 2022-01-02     │
└───────────────────────────────────────────────────────────────────────┘
```

### 教程 4 - 加载时执行算术运算

加载数据并执行算术运算（例如将 'age' 列值加 1）。

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);

COPY INTO employees_new_age
FROM (
    SELECT
        t.id,
        t.name,
        t.age + 1,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_new_age;
```
返回结果（前 3 行）：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┤
│               1 │ Name_0           │              21 │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │              26 │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │              22 │ 2022-01-02 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 5 - 加载到含额外列的表中

将数据加载到比源文件列数多的表中。

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);

COPY INTO employees_plus (id, name, age, onboarded)
FROM (
    SELECT
        t.id,
        t.name,
        t.age,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_plus;
```
返回结果（前 3 行）：

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │       lastday       │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┼─────────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01 00:00:00 │ NULL                │
│               2 │ Name_5           │              25 │ 2022-01-06 00:00:00 │ NULL                │
│               3 │ Name_1           │              21 │ 2022-01-02 00:00:00 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```