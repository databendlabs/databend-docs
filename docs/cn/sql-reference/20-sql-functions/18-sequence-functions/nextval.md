---
title: NEXTVAL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.784"/>

从序列（Sequence）中获取下一个值。

## 语法

```sql
NEXTVAL(<sequence_name>)
```

## 返回类型

整数（Integer）。

## 访问控制要求

| 权限            | 对象类型    | 描述        |
|:----------------|:------------|:------------|
| ACCESS SEQUENCE | SEQUENCE    | 访问序列。  |

要访问序列，执行操作的用户或其角色必须拥有 ACCESS SEQUENCE [权限](/guides/security/access-control/privileges)。

:::note

`enable_experimental_sequence_rbac_check` 设置控制序列级访问控制，默认禁用。
创建序列仅需超级用户权限，跳过详细 RBAC 检查。
启用后，在创建序列时将强制执行细粒度权限验证。

此为实验性功能，未来可能默认启用。

:::

## 示例

以下示例展示 NEXTVAL 函数与序列的配合使用：

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

以下示例演示如何利用序列和 NEXTVAL 函数为表中的行自动生成并分配唯一标识符：

```sql
-- 创建名为 staff_id_seq 的新序列
CREATE SEQUENCE staff_id_seq;

-- 创建名为 staff 的新表，staff_id 自动递增
CREATE TABLE staff (
    staff_id INT DEFAULT NEXTVAL(staff_id_seq),
    name VARCHAR(50),
    department VARCHAR(50)
);

-- 向 staff 表插入新员工，staff_id 自动生成
INSERT INTO staff (name, department)
VALUES ('John Doe', 'HR');

-- 再插入一行
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