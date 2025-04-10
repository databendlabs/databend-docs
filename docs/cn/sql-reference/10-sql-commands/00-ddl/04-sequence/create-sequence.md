---
title: CREATE SEQUENCE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.426"/>

在 Databend 中创建一个新的序列。

序列是一种用于自动生成唯一数值标识符的对象，通常用于为表中的行分配不同的标识符，例如用户 ID 列。通常，序列从指定的值开始，并按指定的量递增。

:::note
Databend 中的序列当前从 1 开始，并递增 1。虽然序列保证唯一值，但它们**不**确保连续性（即，没有间隙）。
:::

## 语法

```sql
CREATE [ OR REPLACE ] SEQUENCE [IF NOT EXISTS] <sequence>
```

| 参数         | 描述                 |
| ------------ | -------------------- |
| `<sequence>` | 要创建的序列的名称。 |

## 示例

此示例展示了如何使用序列和 [NEXTVAL](/sql/sql-functions/sequence-functions/nextval) 函数来自动生成唯一标识符并将其分配给表中的行。

```sql
-- 创建一个名为 staff_id_seq 的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建一个名为 staff 的新表，其中包含 staff_id、name 和 department 列
CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 将新行插入到 staff 表中，使用 staff_id_seq 序列的下一个值作为 staff_id 列
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

-- 将另一行插入到 staff 表中，使用 staff_id_seq 序列的下一个值作为 staff_id 列
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
