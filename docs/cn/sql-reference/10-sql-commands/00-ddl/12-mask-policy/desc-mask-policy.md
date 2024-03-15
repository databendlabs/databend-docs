---
title: DESC MASKING POLICY
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.45"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

显示 Databend 中特定掩码策略的详细信息。

## 语法

```sql
DESC MASKING POLICY <policy_name>
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