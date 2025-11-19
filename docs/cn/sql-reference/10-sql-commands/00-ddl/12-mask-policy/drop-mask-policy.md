---
title: DROP MASKING POLICY
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

从 Databend 中删除现有的 masking policy。当你删除一个 masking policy 时，它会从 Databend 中移除，并且其相关的 masking 规则不再生效。请注意，在删除 masking policy 之前，请确保此 policy 未与任何列相关联。

## 语法

```sql
DROP MASKING POLICY [ IF EXISTS ] <policy_name>
```

## 访问控制要求

| 权限 | 描述 |
|:-----|:-----|
| APPLY MASKING POLICY | 删除脱敏策略时需要具备的权限；如果拥有该策略的 OWNERSHIP 也可以删除。 |

需要全局 `APPLY MASKING POLICY` 权限，或对目标策略拥有 APPLY/OWNERSHIP。策略删除后，Databend 会自动回收之前授予的 OWNERSHIP。

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

DROP MASKING POLICY email_mask;
```
