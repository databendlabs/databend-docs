```markdown
---
title: CREATE MASKING POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.341"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

在 Databend 中创建一个新的 masking policy。

## 语法

```sql
CREATE [ OR REPLACE ] MASKING POLICY [ IF NOT EXISTS ] <policy_name> AS 
    ( <arg_name_to_mask> <arg_type_to_mask> [ , <arg_1> <arg_type_1> ... ] )
    RETURNS <arg_type_to_mask> -> <expression_on_arg_name>
    [ COMMENT = '<comment>' ]
```

| Parameter              	| Description                                                                                                                           	|
|------------------------	|---------------------------------------------------------------------------------------------------------------------------------------	|
| policy_name              	| 要创建的 masking policy 的名称。                                                                                                       	|
| arg_name_to_mask       	| 需要被 mask 的原始数据参数的名称。                                                                                                   	|
| arg_type_to_mask       	| 需要被 mask 的原始数据参数的数据类型。                                                                                                 	|
| expression_on_arg_name 	| 一个表达式，用于确定如何处理原始数据以生成 mask 后的数据。                                                                             	|
| comment                   | 一个可选的注释，提供关于 masking policy 的信息或说明。                                                                                  	|

:::note
确保 *arg_type_to_mask* 与将应用 masking policy 的列的数据类型相匹配。
:::

## 示例

此示例说明了如何设置 masking policy，以根据用户角色选择性地显示或 mask 敏感数据的过程。

```sql
-- 创建一个表并插入示例数据
CREATE TABLE user_info (
    id INT,
    email STRING
);

INSERT INTO user_info (id, email) VALUES (1, 'sue@example.com');
INSERT INTO user_info (id, email) VALUES (2, 'eric@example.com');

-- 创建一个角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建一个用户并将角色授予该用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建一个 masking policy
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

-- 将 masking policy 与 'email' 列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```