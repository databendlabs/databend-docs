---
title: 刷新倒排索引
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='倒排索引'/>

刷新 Databend 中的倒排索引。在以下情况下需要刷新倒排索引：

- 在创建倒排索引之前向表中插入数据时，需要在创建后手动刷新倒排索引，以便有效地索引插入的数据。
- 当倒排索引遇到问题或损坏时，需要进行刷新。如果由于某些块的倒排索引文件损坏导致倒排索引中断，例如执行查询 `where match(body, 'wiki')` 将返回错误。在这种情况下，您需要刷新倒排索引以解决问题。

## 语法

```sql
REFRESH INVERTED INDEX <索引名> ON [<数据库名>.]<表名> [LIMIT <限制数>]
```

| 参数       | 描述                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `<限制数>` | 指定在索引刷新期间要处理的最大行数。如果未指定，将处理表中的所有行。 |

## 示例

```sql
-- 刷新名为 "customer_feedback_idx" 的倒排索引，针对表 "customer_feedback"
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```
