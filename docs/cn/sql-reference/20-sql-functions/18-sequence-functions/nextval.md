---
title: NEXTVAL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.453"/>

从序列中获取下一个值。

## 语法

```sql
NEXTVAL(<sequence_name>)
```

## 返回类型

整数。

## 示例

此示例展示了 NEXTVAL 函数如何与序列一起工作：

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

此示例展示了如何使用序列和 NEXTVAL 函数来自动生成并分配唯一标识符给表中的行。

```sql
-- 创建一个名为 staff_id_seq 的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建一个名为 staff 的新表，包含 staff_id、name 和 department 列
CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 向 staff 表插入新行，使用 staff_id_seq 序列的下一个值作为 staff_id 列的值
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

-- 向 staff 表插入另一行，使用 staff_id_seq 序列的下一个值作为 staff_id 列的值
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'Jane Smith', 'Finance');

SELECT * FROM staff;

┌───────────────────────────────────────────────────────┐
│     staff_id    │       name       │    department    │
├─────────────────┼──────────────────┼──────────────────┤
│               2 │ Jane Smith       │ Finance          │
│               1 │ John Doe         │ HR               │
└───────────────────────────────────────────────────────┘
```