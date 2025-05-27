---
title: CREATE MASKING POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.341"/>

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

| 参数              	| 描述                                                                                                                           	|
|------------------------	|---------------------------------------------------------------------------------------------------------------------------------------	|
| policy_name              	| 要创建的脱敏策略的名称。                                                                                          	|
| arg_name_to_mask       	| 需要脱敏的原始数据参数的名称。                                                                      	|
| arg_type_to_mask       	| 要脱敏的原始数据参数的数据类型。                                                                            	|
| expression_on_arg_name 	| 一个表达式，用于确定如何处理原始数据以生成脱敏数据。                                    	|
| comment                   | 提供有关脱敏策略信息或说明的可选注释。                                                          	|

:::note
确保 *arg_type_to_mask* 与将应用脱敏策略的列的数据类型匹配。
:::

## 示例

此示例演示了设置脱敏策略以根据用户角色选择性地显示或脱敏敏感数据的过程。

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

-- 创建脱敏策略
CREATE MASKING POLICY email_mask
AS
  (val nullable(string))
  RETURNS nullable(string) ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = 'hide_email';

CREATE MASKING POLICY phone_mask AS (val nullable(string)) RETURNS nullable(string) -> CASE
  WHEN current_role() IN ('MANAGERS') THEN val
  ELSE '*********'
END COMMENT = 'hide_phone';

-- 将脱敏策略与 'email' 列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 将脱敏策略与 'phone' 列关联
ALTER TABLE user_info MODIFY COLUMN phone SET MASKING POLICY phone_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

     user_id     │        phone     │       email      │
 Nullable(Int32) │ Nullable(String) │ Nullable(String) │
─────────────────┼──────────────────┼──────────────────┤
               2 │ *********        │ *********        │
               1 │ *********        │ *********        │

```