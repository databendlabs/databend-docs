---
title: DESC MASKING POLICY
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

显示有关 Databend 中特定 masking policy 的详细信息。

## 语法

```sql
DESC MASKING POLICY <policy_name>
```

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| APPLY MASKING POLICY | 描述脱敏策略时需要具备的权限；拥有该策略的 OWNERSHIP 亦可满足要求。 |

只要具备全局 `APPLY MASKING POLICY` 权限，或对指定策略拥有 APPLY/OWNERSHIP，即可查看策略定义。

## 示例

```sql
CREATE MASKING POLICY email_mask
AS
  (val string)
  RETURNS string ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = 'hide_email';

DESC MASKING POLICY email_mask;

Name       |Value                                                                |
-----------+---------------------------------------------------------------------+
Name       |email_mask                                                           |
Created On |2023-08-09 02:29:16.177898 UTC                                       |
Signature  |(val STRING)                                                         |
Return Type|STRING                                                               |
Body       |CASE WHEN current_role() IN('MANAGERS') THEN VAL ELSE '*********' END|
Comment    |hide_email                                                           |
```
