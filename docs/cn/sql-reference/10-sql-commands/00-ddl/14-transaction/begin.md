---
title: BEGIN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.371"/>

开始一个新的事务。BEGIN 和 [COMMIT](commit.md)/[ROLLBACK](rollback.md) 必须一起使用，以开始事务并随后保存或撤销事务。

- Databend 不支持嵌套事务，因此未匹配的事务语句将被忽略。

  ```sql title="示例："
  BEGIN; -- 开始一个事务

  MERGE INTO ... -- 此语句属于该事务

  BEGIN; -- 在事务内部执行 BEGIN 被忽略，不会开始新事务，不会引发错误

  INSERT INTO ... -- 此语句也属于该事务

  COMMIT; -- 结束事务

  INSERT INTO ... -- 此语句属于单语句事务

  COMMIT; -- 在多语句事务外部执行 COMMIT 被忽略，不会执行提交操作，不会引发错误

  BEGIN; -- 开始另一个事务
  ...
  ```

- 当在多语句事务中执行 DDL 语句时，它将提交当前的多语句事务，并将后续语句作为单语句事务执行，直到发出另一个 BEGIN。

  ```sql title="示例："
  BEGIN; -- 开始一个多语句事务

  -- 这里的 DML 语句是当前事务的一部分
  INSERT INTO table_name (column1, column2) VALUES (value1, value2);

  -- 在事务内部执行 DDL 语句
  CREATE TABLE new_table (column1 data_type, column2 data_type);
  -- 这将提交当前事务

  -- 后续语句作为单语句事务执行
  UPDATE table_name SET column1 = value WHERE condition;

  BEGIN; -- 开始一个新的多语句事务

  -- 新的 DML 语句是新事务的一部分
  DELETE FROM table_name WHERE condition;

  COMMIT; -- 结束新事务
  ```

## 语法

```sql
BEGIN [ TRANSACTION ]
```

## 事务 ID 与状态

Databend 会自动为每个事务生成一个事务 ID。此 ID 允许用户识别哪些语句属于同一事务，便于问题排查。

如果你使用的是 Databend Cloud，可以在 **Monitor** > **SQL History** 中找到事务 ID：

![alt text](../../../../../../static/img/documents/sql/transaction-id.png)

在 **Transaction** 列中，还可以看到 SQL 语句执行期间的事务状态：

| 事务状态   | 描述                                                               |
| ---------- | ------------------------------------------------------------------ |
| AutoCommit | 该语句不是多语句事务的一部分。                                     |
| Active     | 该语句是多语句事务的一部分，且事务中所有之前的语句都成功执行。     |
| Fail       | 该语句是多语句事务的一部分，且事务中至少有一个之前的语句执行失败。 |

## 示例

在此示例中，所有三个语句（INSERT, UPDATE, DELETE）都是同一多语句事务的一部分。它们作为单个单元执行，并在发出 COMMIT 时一起提交更改。

```sql
-- 首先创建一个表
CREATE TABLE employees (
    id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 开始一个多语句事务
BEGIN;

-- 事务中的第一个语句：插入一名新员工
INSERT INTO employees (id, name, department) VALUES (1, 'Alice', 'HR');

-- 事务中的第二个语句：插入另一名新员工
INSERT INTO employees (id, name, department) VALUES (2, 'Bob', 'Engineering');

-- 事务中的第三个语句：更新第一名员工的部门
UPDATE employees SET department = 'Finance' WHERE id = 1;

-- 提交所有更改
COMMIT;

-- 验证表中的数据
SELECT * FROM employees;

┌───────────────────────────────────────────────────────┐
│        id       │       name       │    department    │
├─────────────────┼──────────────────┼──────────────────┤
│               1 │ Alice            │ Finance          │
│               2 │ Bob              │ Engineering      │
└───────────────────────────────────────────────────────┘
```

在此示例中，ROLLBACK 语句撤销了事务期间所做的所有更改。因此，最后的 SELECT 查询应该显示一个空的 employees 表，确认没有更改被提交。

```sql
-- 首先创建一个表
CREATE TABLE employees (
    id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 开始一个多语句事务
BEGIN;

-- 事务中的第一个语句：插入一名新员工
INSERT INTO employees (id, name, department) VALUES (1, 'Alice', 'HR');

-- 事务中的第二个语句：插入另一名新员工
INSERT INTO employees (id, name, department) VALUES (2, 'Bob', 'Engineering');

-- 事务中的第三个语句：更新第一名员工的部门
UPDATE employees SET department = 'Finance' WHERE id = 1;

-- 回滚事务
ROLLBACK;

-- 验证表是否为空
SELECT * FROM employees;
```

此示例设置了一个流和一个任务来消费该流，使用事务块（BEGIN; COMMIT）将数据插入两个目标表。

```sql
CREATE DATABASE my_db;
USE my_db;

CREATE TABLE source_table (
    id INT,
    source_flag VARCHAR(50),value VARCHAR(50)
);

CREATE TABLE target_table_1 (
    id INT,value VARCHAR(50)
);

CREATE TABLE target_table_2 (
    id INT,value VARCHAR(50)
);

CREATE STREAM source_stream ON TABLE source_table;

INSERT INTO source_table VALUES
(1, 'source1', 'value1'),
(2, 'source2', 'value2'),
(3, 'source3', 'value3'),
(4, 'source4', 'value4');

CREATE TASK insert_task
WAREHOUSE = 'system'
SCHEDULE = 1 SECOND AS
BEGIN
    BEGIN;
    INSERT INTO my_db.target_table_1
    SELECT id, value
    FROM my_db.source_stream;

    INSERT INTO my_db.target_table_2
    SELECT id, value
    FROM my_db.source_stream;
    COMMIT;
END;

EXECUTE TASK insert_task;
```
