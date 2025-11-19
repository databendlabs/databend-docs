---
title: CREATE MASKING POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

在 Databend 中创建新的脱敏策略。

## 语法

```sql
CREATE [ OR REPLACE ] MASKING POLICY [ IF NOT EXISTS ] <policy_name> AS 
    ( <arg_name_to_mask> <arg_type_to_mask> [ , <arg_1> <arg_type_1> ... ] )
    RETURNS <arg_type_to_mask> -> <expression_on_arg_name>
    [ COMMENT = '<comment>' ]
```

| 参数 | 描述 |
|------|------|
| `policy_name` | 要创建的脱敏策略名称。 |
| `arg_name_to_mask` | 表示被脱敏列的参数。该参数必须放在第一位，并自动绑定到 `SET MASKING POLICY` 中指向的列。 |
| `arg_type_to_mask` | 被脱敏列的数据类型，必须与实际列一致。 |
| `arg_1 ... arg_n` | 策略逻辑需要的可选额外列参数。绑定策略时，通过 `USING` 子句提供这些列。 |
| `arg_type_1 ... arg_type_n` | 每个额外参数对应的数据类型，需要与 `USING` 子句中的列匹配。 |
| `expression_on_arg_name` | 描述如何处理输入列以生成脱敏结果的表达式。 |
| `comment` | 可选注释，用于补充策略说明。 |

:::note
确保 *arg_type_to_mask* 与将应用脱敏策略的列的数据类型匹配。当策略包含多个参数时，必须在 `ALTER TABLE ... SET MASKING POLICY` 的 `USING` 子句中按相同顺序列出对应列。
:::

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| CREATE MASKING POLICY | 创建或替换脱敏策略时所需的权限（通常授予 `*.*`）。 |

策略创建成功后，Databend 会自动将该策略的 OWNERSHIP 授予当前角色，方便与其他角色协同管理该策略。

## 示例

此示例演示了如何结合 `USING` 子句引用额外列，根据用户角色或其他列的值选择性地显示或脱敏敏感数据。

```sql
-- 创建表并插入示例数据
CREATE TABLE user_info (
    user_id INT,
    phone  VARCHAR,
    email VARCHAR
);

INSERT INTO user_info (user_id, phone, email) VALUES (1, '91234567', 'sue@example.com');
INSERT INTO user_info (user_id, phone, email) VALUES (2, '81234567', 'eric@example.com');

-- 创建角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建用户并将角色授予用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建需要额外列参与判断的脱敏策略
CREATE MASKING POLICY contact_mask
AS
  (contact_val nullable(string), phone_ref nullable(string))
  RETURNS nullable(string) ->
  CASE
    WHEN current_role() IN ('MANAGERS') THEN contact_val
    WHEN phone_ref LIKE '91%' THEN contact_val
    ELSE '*********'
  END
  COMMENT = 'mask contact data with phone check';

-- 将脱敏策略与 'email' 列关联，并通过 USING 传入额外列
ALTER TABLE user_info
MODIFY COLUMN email SET MASKING POLICY contact_mask USING (email, phone);

-- 将脱敏策略与 'phone' 列关联（此处同样传递自身和参考列）
ALTER TABLE user_info
MODIFY COLUMN phone SET MASKING POLICY contact_mask USING (phone, phone);

-- 使用 Root 用户查询
SELECT user_id, phone, email FROM user_info ORDER BY user_id;

     user_id     │        phone     │       email      │
 Nullable(Int32) │ Nullable(String) │ Nullable(String) │
─────────────────┼──────────────────┼──────────────────┤
               1 │ 91234567         │ sue@example.com  │
               2 │ *********        │ *********        │

```
