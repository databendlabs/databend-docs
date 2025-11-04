---
title: REFRESH INVERTED INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

刷新 Databend 中的倒排索引。在以下情况下，倒排索引需要刷新：

- 当在创建倒排索引之前将数据插入到表中时，创建后需要手动刷新倒排索引，才能有效地索引插入的数据。
- 当倒排索引遇到问题或损坏时，需要刷新。如果由于某些块的倒排索引文件损坏而导致倒排索引中断，则诸如 `where match(body, 'wiki')` 之类的查询将返回错误。在这种情况下，您需要刷新倒排索引以解决此问题。

## 语法

```sql
REFRESH INVERTED INDEX <index> ON [<database>.]<table> [LIMIT <limit>]
```

| 参数      | 描述                                                                                                                             |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `<limit>` | 指定索引刷新期间要处理的最大行数。如果未指定，将处理表中的所有行。                                                                                                 |

## 示例

```sql
-- 刷新表 "customer_feedback" 的名为 "customer_feedback_idx" 的倒排索引
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```
