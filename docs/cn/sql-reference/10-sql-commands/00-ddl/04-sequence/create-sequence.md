---
title: 创建序列
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.426"/>

在Databend中创建一个新的序列。

序列是一种用于自动生成唯一数值标识的对象，常用于为表中的行分配唯一标识，例如用户ID列。通常，序列从一个指定的值开始，并按指定量递增。

:::note
Databend中的序列当前从1开始，每次递增1。虽然序列保证值的唯一性，但**不保证**连续性（即无间隔）。
:::

## 语法

```sql
CREATE [ OR REPLACE ] SEQUENCE [IF NOT EXISTS] <sequence>
```

| 参数          | 描述                                 |
|--------------|------------------------------------|
| `<sequence>` | 要创建的序列的名称。               |

## 示例

此示例展示了如何使用序列和[NEXTVAL](/sql/sql-functions/sequence-functions/nextval)函数来自动生成并分配唯一标识给表中的行。

```sql
-- 创建一个名为staff_id_seq的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建一个名为staff的新表，包含staff_id、name和department列
CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 向staff表插入一行，使用staff_id_seq序列的下一个值作为staff_id列的值
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

-- 向staff表插入另一行，使用staff_id_seq序列的下一个值作为staff_id列的值
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