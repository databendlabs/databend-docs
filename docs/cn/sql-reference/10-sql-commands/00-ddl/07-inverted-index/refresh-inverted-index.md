---
title: REFRESH INVERTED INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

倒排索引在默认的 `SYNC` 模式下会随着新数据写入自动刷新。仅在创建索引前表中已有数据、需要回填历史行时才需要执行 `REFRESH INVERTED INDEX`。

## 语法

```sql
REFRESH INVERTED INDEX <index> ON [<database>.]<table> [LIMIT <limit>]
```

| 参数      | 描述                                                                                                                             |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| `<limit>` | 指定索引刷新期间要处理的最大行数。如果未指定，将处理表中的所有行。                                                                                                 |

## 示例

```sql
-- 表中已有在创建索引之前写入的数据
CREATE TABLE IF NOT EXISTS customer_feedback(id INT, body STRING);
INSERT INTO customer_feedback VALUES
  (1, 'Great coffee beans'),
  (2, 'Needs fresh roasting');

-- 之后才创建倒排索引
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(body);

-- 通过 REFRESH 回填历史数据
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;

-- 之后的新写入会在 SYNC 模式下自动刷新
```
