---
title: CREATE SEQUENCE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.807"/>

在 Databend 中创建一个新的序列（Sequence）。

序列（Sequence）是一种自动生成唯一数字标识符的对象，通常用于为表行分配不同的值（例如用户 ID）。虽然序列保证值的唯一性，但**不**保证连续性（即可能出现间隙）。

## 语法

```sql
CREATE [ OR REPLACE ] SEQUENCE [ IF NOT EXISTS ] <sequence>
    [ START [ = ] <start_value> ]
    [ INCREMENT [ = ] <increment_value> ]
```

| 参数           | 描述                                           | 默认值 |
|----------------|------------------------------------------------|--------|
| `<sequence>`   | 要创建的序列名称。                             | -      |
| `START`        | 序列的初始值。                                 | 1      |
| `INCREMENT`    | 每次调用 NEXTVAL 时的增量值。                  | 1      |

## 访问控制要求

| 权限            | 对象类型 | 描述           |
|:----------------|:---------|:---------------|
| CREATE SEQUENCE | 全局     | 创建序列。     |

要创建序列，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 CREATE SEQUENCE [权限](/guides/security/access-control/privileges)。

:::note

`enable_experimental_sequence_rbac_check` 设置控制序列级别的访问控制，默认禁用。  
此时创建序列仅需用户拥有超级用户权限，绕过详细的 RBAC 检查。  
启用后，将在创建序列时执行细粒度权限验证。  

该功能为实验性质，未来可能默认开启。

:::

## 示例

### 基本序列

使用默认设置创建序列（从 1 开始，步长为 1）：

```sql
CREATE SEQUENCE staff_id_seq;

CREATE TABLE staff (
    staff_id INT,
    name VARCHAR(50),
    department VARCHAR(50)
);

INSERT INTO staff (staff_id, name, department)
VALUES (NEXTVAL(staff_id_seq), 'John Doe', 'HR');

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

### 自定义起始值与步长

创建从 1000 开始、步长为 10 的序列：

```sql
CREATE SEQUENCE order_id_seq START = 1000 INCREMENT = 10;

CREATE TABLE orders (
    order_id BIGINT,
    order_name VARCHAR(100)
);

INSERT INTO orders (order_id, order_name)
VALUES (NEXTVAL(order_id_seq), 'Order A');

INSERT INTO orders (order_id, order_name)
VALUES (NEXTVAL(order_id_seq), 'Order B');

SELECT * FROM orders;

┌──────────────────────────────────┐
│    order_id    │    order_name   │
├────────────────┼─────────────────┤
│           1000 │ Order A         │
│           1010 │ Order B         │
└──────────────────────────────────┘
```