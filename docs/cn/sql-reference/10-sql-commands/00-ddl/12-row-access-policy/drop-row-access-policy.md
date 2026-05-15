---
title: DROP ROW ACCESS POLICY
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

删除 Databend 中已有的行访问策略。删除前，需要先将该策略从所有引用它的表上解除绑定。

## 语法

```sql
DROP ROW ACCESS POLICY [ IF EXISTS ] <policy_name>
```

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| APPLY ROW ACCESS POLICY | 删除行访问策略所需权限；如果当前角色拥有该策略则不需要额外授权。 |

必须拥有全局 `APPLY ROW ACCESS POLICY`，或拥有目标策略的 APPLY/OWNERSHIP。策略删除后，Databend 会自动回收创建者角色对该策略的 OWNERSHIP。

## 示例

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN -> dept = 'Engineering';

CREATE TABLE employees(id INT, department STRING);
ALTER TABLE employees ADD ROW ACCESS POLICY rap_engineering ON (department);

-- 删除策略前先从表上解除绑定。
ALTER TABLE employees DROP ROW ACCESS POLICY rap_engineering;

DROP ROW ACCESS POLICY rap_engineering;
```
