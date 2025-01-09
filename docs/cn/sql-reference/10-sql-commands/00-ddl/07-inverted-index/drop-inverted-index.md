---
title: DROP INVERTED INDEX
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

删除 Databend 中的倒排索引。

## 语法

```sql
DROP INVERTED INDEX [IF EXISTS] <index> ON [<database>.]<table>
```

## 示例

```sql
-- 删除 'customer_feedback' 表上的倒排索引 'customer_feedback_idx'
DROP INVERTED INDEX customer_feedback_idx ON customer_feedback;
```