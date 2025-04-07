---
title: NEXTVAL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.453"/>

从序列中检索下一个值。

## 句法

```sql
NEXTVAL(<sequence_name>)
```

## 返回类型

Integer.

## 示例

此示例演示了 NEXTVAL 函数如何与序列一起使用：

```sql
CREATE SEQUENCE my_seq;

SELECT
  NEXTVAL(my_seq),
  NEXTVAL(my_seq),
  NEXTVAL(my_seq);

┌─────────────────────────────────────────────────────┐
│ nextval(my_seq) │ nextval(my_seq) │ nextval(my_seq) │
├─────────────────┼─────────────────┼─────────────────┤
│               1 │               2 │               3 │
└─────────────────────────────────────────────────────┘
```

此示例展示了如何使用序列和 NEXTVAL 函数来自动生成唯一标识符并将其分配给表中的行。

```sql
-- 创建一个名为 staff_id_seq 的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建一个名为 staff 的新表，其中包含自动生成的 staff_id
CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq),
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 将具有自动生成的 staff_id 的新员工插入到 staff 表中
INSERT INTO staff (name, department)
VALUES ('John Doe', 'HR');

-- 插入另一行
INSERT INTO staff (name, department)
VALUES ('Jane Smith', 'Finance');

SELECT * FROM staff;

┌───────────────────────────────────────────────────────┐
│     staff_id    │       name       │    department    │
├─────────────────┼──────────────────┼──────────────────┤
│               3 │ Jane Smith       │ Finance          │
│               2 │ John Doe         │ HR               │
└───────────────────────────────────────────────────────┘
```