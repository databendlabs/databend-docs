---
title: DROP SEQUENCE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.426"/>

从 Databend 中删除一个已存在的 sequence。

## 语法

```sql
DROP SEQUENCE [IF EXISTS] <sequence>
```

| 参数         | 描述                                  |
|--------------|---------------------------------------|
| `<sequence>` | 要删除的 sequence 的名称。              |

## 示例

```sql
-- 删除名为 staff_id_seq 的 sequence
DROP SEQUENCE staff_id_seq;
```