---
title: CREATE SEQUENCE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.784"/>

在 Databend 中创建一个新的序列（Sequence）。

序列（Sequence）是一种用于自动生成唯一数字标识符的对象，常用于为表中的行分配唯一标识符，例如用户 ID 列。通常，序列从指定值开始，并按指定量递增。

:::note
Databend 中的序列目前从 1 开始，并以 1 为步长递增。虽然序列保证值的唯一性，但**不**保证其连续性（即没有间隙）。
:::

## 语法

```sql
CREATE [ OR REPLACE ] SEQUENCE [IF NOT EXISTS] <sequence>
```

| 参数 | 说明 |
|--------------|-----------------------------------------|
| `<sequence>` | 要创建的序列的名称。 |

## 访问控制要求

| 权限 | 对象类型 | 说明 |
|:----------------|:------------|:----------------------|
| CREATE SEQUENCE | 全局 | 创建一个序列。 |


要创建一个序列，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 CREATE SEQUENCE [权限](/guides/security/access-control/privileges)。

:::note

`enable_experimental_sequence_rbac_check` 设置用于控制序列级别的访问控制。默认情况下，此功能是禁用的。
创建序列仅要求用户拥有超级用户权限，从而绕过详细的 RBAC 检查。
启用后，在创建序列时将强制执行精细的权限验证。

这是一个实验性功能，未来可能会默认启用。

:::

## 示例

此示例展示了如何使用序列和 [NEXTVAL](/sql/sql-functions/sequence-functions/nextval) 函数为表中的行自动生成并分配唯一标识符。

```sql
-- 创建一个名为 staff_id_seq 的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建一个名为 staff 的新表，包含 staff_id、name 和 department 列
CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 向 staff 表中插入新行，使用 staff_id_seq 序列的下一个值为 staff_id 列赋值
INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

-- 向 staff 表中插入另一行，使用 staff_id_seq 序列的下一个值为 staff_id 列赋值
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