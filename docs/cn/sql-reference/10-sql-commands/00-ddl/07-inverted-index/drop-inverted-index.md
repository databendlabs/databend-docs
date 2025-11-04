---
title: DROP INVERTED INDEX
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

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
