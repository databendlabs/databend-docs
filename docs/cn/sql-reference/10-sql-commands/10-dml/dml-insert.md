---
title: INSERT
---

将数据写入表中。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除操作要么完全成功，要么完全失败。
:::

## 直接插入值

### 语法

```sql
INSERT INTO|OVERWRITE [db.]table [(c1, c2, c3)] VALUES (v11, v12, v13), (v21, v22, v23), ...
```

### 示例

```sql
CREATE TABLE test(a INT UNSIGNED, b Varchar);

INSERT INTO test(a,b) VALUES(888, 'stars');
INSERT INTO test VALUES(1024, 'stars');

SELECT * FROM test;
+------+-------+
| a    | b     |
+------+-------+
|  888 | stars |
| 1024 | stars |
+------+-------+

INSERT OVERWRITE test VALUES(2048, 'stars');
SELECT * FROM test;
+------+-------+
| a    | b     |
+------+-------+
| 2048 | stars |
+------+-------+
```

## 插入查询结果

在插入SELECT语句的结果时，列的映射遵循SELECT子句中的位置。因此，SELECT语句中的列数必须等于或大于INSERT表中的列数。如果SELECT语句和INSERT表中的列的数据类型不同，则会根据需要进行类型转换。

### 语法

```sql
INSERT INTO [db.]table [(c1, c2, c3)] SELECT ...
```

### 示例

```sql
CREATE TABLE select_table(a VARCHAR, b VARCHAR, c VARCHAR);
INSERT INTO select_table VALUES('1','11','abc');

SELECT * FROM select_table;
+------+------+------+
| a    | b    | c    |
+------+------+------+
| 1    | 11   | abc  |
+------+------+------+

CREATE TABLE test(c1 TINTINT UNSIGNED, c2 BIGINT UNSIGNED, c3 VARCHAR);
INSERT INTO test SELECT * FROM select_table;

SELECT * from test;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|    1 |   11 | abc  |
+------+------+------+
```

聚合示例：

```sql
-- 创建表
CREATE TABLE base_table(a INT);
CREATE TABLE aggregate_table(b INT);

-- 向base_table插入一些数据
INSERT INTO base_table VALUES(1),(2),(3),(4),(5),(6);

-- 从聚合中插入数据到aggregate_table
INSERT INTO aggregate_table SELECT SUM(a) FROM base_table GROUP BY a%3;

SELECT * FROM aggregate_table ORDER BY b;
+------+
| b    |
+------+
|    5 |
|    7 |
|    9 |
+------+
```

## 插入默认值

Databend允许您使用INSERT INTO语句将数据添加到表中，根据需要为列指定值或默认值。

### 语法

```sql
INSERT INTO [db.]table [(c1, c2, c3)] VALUES (v1|DEFAULT, v2|DEFAULT, v3|DEFAULT) ...
```

### 示例

```sql
CREATE TABLE t_insert_default(a int null, b int default 2, c float, d varchar default 'd');

INSERT INTO t_insert_default
VALUES
    (default, default, default, default),
    (1, default, 1.0, default),
    (3, 3, 3.0, default),
    (4, 4, 4.0, 'a');

SELECT * FROM t_insert_default;
+------+------+------+------+
| a    | b    | c    | d    |
+------+------+------+------+
| NULL |    2 |  0.0 | d    |
|    1 |    2 |  1.0 | d    |
|    3 |    3 |  3.0 | d    |
|    4 |    4 |  4.0 | a    |
+------+------+------+------+
```

## 通过阶段文件插入

Databend允许您通过INSERT INTO语句从阶段文件中将数据插入表中。这是通过Databend的[查询阶段文件](/guides/load-data/transform/querying-stage)能力并随后将查询结果并入表中来实现的。

### 语法

```sql
INSERT INTO [db.]table [(c1, c2, c3)] SELECT ...
```

### 示例

1. 创建一个名为`sample`的表：

```sql
CREATE TABLE sample
(
    id      INT,
    city    VARCHAR,
    score   INT,
    country VARCHAR DEFAULT 'China'
);
```

2. 使用样本数据设置一个内部阶段

我们将建立一个名为`mystage`的内部阶段，然后用样本数据填充它。

```sql
CREATE STAGE mystage;
       
COPY INTO @mystage
FROM 
(
    SELECT * 
    FROM 
    (
        VALUES 
        (1, 'Chengdu', 80),
        (3, 'Chongqing', 90),
        (6, 'Hangzhou', 92),
        (9, 'Hong Kong', 88)
    )
)
FILE_FORMAT = (TYPE = PARQUET);
```

3. 使用`INSERT INTO`从阶段的Parquet文件插入数据

:::tip
您可以使用[COPY INTO](dml-copy-into-table.md)命令中可用的FILE_FORMAT和COPY_OPTIONS指定文件格式和各种复制相关的设置。当`purge`设置为`true`时，只有在数据更新成功的情况下，原始文件才会被删除。
:::

```sql
INSERT INTO sample 
    (id, city, score) 
ON
    (Id)
SELECT
    $1, $2, $3
FROM
    @mystage
    (FILE_FORMAT => 'parquet');
```

4. 验证数据插入

```sql
SELECT * FROM sample;
```

结果应该是：
```sql
┌─────────────────────────────────────────────────────────────────────────┐
│        id       │       city       │      score      │      country     │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(String) │
├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
│               1 │ 成都             │              80 │ 中国             │
│               3 │ 重庆             │              90 │ 中国             │
│               6 │ 杭州             │              92 │ 中国             │
│               9 │ 香港             │              88 │ 中国             │
└─────────────────────────────────────────────────────────────────────────┘
```