---
title: DESC ROW ACCESS POLICY
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

显示指定 Row Access Policy 的详细信息。

## 语法

```sql
DESC ROW ACCESS POLICY <policy_name>
```

同时支持 `DESCRIBE ROW ACCESS POLICY`。

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| APPLY ROW ACCESS POLICY | 描述行访问策略所需权限；如果当前角色拥有该策略则不需要额外授权。 |

拥有全局 `APPLY ROW ACCESS POLICY`，或拥有指定策略的 APPLY/OWNERSHIP，均可满足该要求。

## 示例

```sql
SET enable_experimental_row_access_policy = 1;

CREATE ROW ACCESS POLICY rap_engineering
AS (dept STRING)
RETURNS BOOLEAN ->
  CASE
    WHEN current_role() = 'admin' THEN true
    WHEN dept = 'Engineering' THEN true
    ELSE false
  END
  COMMENT = 'show engineering rows';

DESC ROW ACCESS POLICY rap_engineering;

Name            | Created On                  | Signature     | Return Type | Body                                                       | Comment
----------------+-----------------------------+---------------+-------------+------------------------------------------------------------+----------------------
rap_engineering | 2026-05-15 08:42:10.949 UTC | (dept STRING) | BOOLEAN     | CASE WHEN current_role() = 'admin' THEN true WHEN...       | show engineering rows
```
