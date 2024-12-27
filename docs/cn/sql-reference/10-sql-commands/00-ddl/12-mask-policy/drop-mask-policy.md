---
title: DROP MASKING POLICY
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.45"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

从 Databend 中删除现有的数据脱敏策略。当你删除一个数据脱敏策略时，它将从 Databend 中移除，并且其关联的脱敏规则将不再生效。请注意，在删除数据脱敏策略之前，请确保该策略未与任何列关联。

## 语法

```sql
DROP MASKING POLICY [ IF EXISTS ] <policy_name>
```

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