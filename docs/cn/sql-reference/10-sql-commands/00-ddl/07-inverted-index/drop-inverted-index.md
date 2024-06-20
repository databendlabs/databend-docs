---
title: 删除倒排索引
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='倒排索引'/>

在 Databend 中移除一个倒排索引。

## 语法

```sql
DROP INVERTED INDEX [IF EXISTS] <索引名> ON [<数据库名>:]<表名>
```

## 示例

```sql
-- 删除'customer_feedback'表上的'customer_feedback_idx'倒排索引
DROP INVERTED INDEX customer_feedback_idx ON customer_feedback;
```
