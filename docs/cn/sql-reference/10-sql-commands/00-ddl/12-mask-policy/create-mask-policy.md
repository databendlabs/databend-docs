---
title: 创建数据脱敏策略
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.341"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='数据脱敏策略'/>

在 Databend 中创建一个新的数据脱敏策略。

## 语法

```sql
CREATE [ OR REPLACE ] MASKING POLICY [ IF NOT EXISTS ] <policy_name> AS 
    ( <arg_name_to_mask> <arg_type_to_mask> [ , <arg_1> <arg_type_1> ... ] )
    RETURNS <arg_type_to_mask> -> <expression_on_arg_name>
    [ COMMENT = '<comment>' ]
```

| 参数              	| 描述                                                                                                                           	|
|------------------------	|---------------------------------------------------------------------------------------------------------------------------------------	|
| policy_name              	| 要创建的数据脱敏策略的名称。                                                                                          	|
| arg_name_to_mask       	| 需要脱敏的原始数据参数的名称。                                                                      	|
| arg_type_to_mask       	| 需要脱敏的原始数据参数的数据类型。                                                                            	|
| expression_on_arg_name 	| 决定如何对原始数据进行处理以生成脱敏数据的表达式。                                    	|
| comment                   | 提供有关数据脱敏策略信息或注释的可选注释。                                                          	|

:::note
确保 *arg_type_to_mask* 与将应用数据脱敏策略的列的数据类型匹配。
:::

## 示例

此示例演示了如何设置数据脱敏策略，以根据用户角色选择性地显示或隐藏敏感数据。

```sql
-- 创建表并插入示例数据
CREATE TABLE user_info (
    id INT,
    email STRING
);

INSERT INTO user_info (id, email) VALUES (1, 'sue@example.com');
INSERT INTO user_info (id, email) VALUES (2, 'eric@example.com');

-- 创建角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建用户并将角色授予用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建数据脱敏策略
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

-- 将数据脱敏策略与 'email' 列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```