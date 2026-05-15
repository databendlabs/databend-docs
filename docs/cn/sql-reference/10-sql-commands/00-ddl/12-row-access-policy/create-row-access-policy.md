---
title: CREATE ROW ACCESS POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

在 Databend 中创建新的行访问策略。行访问策略定义一个布尔谓词，绑定到表后，Databend 会在查询和 DML 目标行匹配时应用该谓词。

## 语法

```sql
CREATE ROW ACCESS POLICY [ IF NOT EXISTS ] <policy_name> AS
    ( <arg_name> <arg_type> [ , <arg_name> <arg_type> ... ] )
    RETURNS BOOLEAN -> <predicate_expression>
    [ COMMENT = '<comment>' ]
```

| 参数 | 描述 |
|------|------|
| `policy_name` | 要创建的行访问策略名称。行访问策略与脱敏策略共用安全策略命名空间。 |
| `arg_name` | 在策略表达式中使用的参数名。参数名不需要与表列名一致。 |
| `arg_type` | 参数的数据类型。绑定策略时，每个表列都必须与对应参数的数据类型匹配。 |
| `predicate_expression` | 决定行是否可见的布尔表达式。只有表达式返回 `TRUE` 的行才会被返回。 |
| `comment` | 可选注释，用于补充策略说明。 |

:::note
- Row Access Policy 当前为实验性功能。可通过 `SET enable_experimental_row_access_policy = 1` 或 `SET GLOBAL enable_experimental_row_access_policy = 1` 启用。
- 策略必须返回 `BOOLEAN`。
- `ALTER TABLE ... ADD ROW ACCESS POLICY ... ON (...)` 中列出的列，会按位置绑定到策略参数。
- 当前行访问策略定义不支持子查询谓词。
:::

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| CREATE ROW ACCESS POLICY | 创建行访问策略所需权限（通常授予 `*.*`）。 |

策略创建成功后，Databend 会自动将该策略的 OWNERSHIP 授予当前角色，方便与其他角色协同管理。

## 示例

下面的示例创建一个策略：除当前角色为 `admin` 外，只允许查看 `Engineering` 部门的行。

```sql
SET enable_experimental_row_access_policy = 1;

CREATE TABLE employees (
    id INT,
    name STRING,
    department STRING
);

INSERT INTO employees VALUES
    (1, 'Alice', 'Engineering'),
    (2, 'Bob', 'Sales'),
    (3, 'Charlie', 'Engineering');

CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN ->
  CASE
    WHEN current_role() = 'admin' THEN true
    WHEN dept = 'Engineering' THEN true
    ELSE false
  END
  COMMENT = 'show engineering rows';

ALTER TABLE employees
ADD ROW ACCESS POLICY rap_engineering ON (department);

SELECT id, name, department FROM employees ORDER BY id;

┌────┬─────────┬─────────────┐
│ id │ name    │ department  │
├────┼─────────┼─────────────┤
│  1 │ Alice   │ Engineering │
│  3 │ Charlie │ Engineering │
└────┴─────────┴─────────────┘
```

`ON (department)` 会将表列 `department` 映射到策略参数 `dept`。
