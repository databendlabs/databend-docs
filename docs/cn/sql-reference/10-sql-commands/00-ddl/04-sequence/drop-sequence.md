---
title: DROP SEQUENCE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.426"/>

从Databend中删除一个现有的序列。

## 语法

```sql
DROP SEQUENCE [IF EXISTS] <sequence>
```

| 参数          | 描述                                 |
|--------------|------------------------------------|
| `<sequence>` | 要删除的序列的名称。                 |

## 示例

```sql
-- 删除名为staff_id_seq的序列
DROP SEQUENCE staff_id_seq;
```