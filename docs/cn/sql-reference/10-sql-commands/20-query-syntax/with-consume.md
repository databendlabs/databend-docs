---
title: WITH CONSUME
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.469"/>

在 SELECT 查询中从流中消费数据。

另请参阅：[WITH Stream Hints](with-stream-hints.md)

## 语法

```sql
SELECT ...
FROM <stream_name> WITH CONSUME [ AS <alias> ]
[ WHERE <conditions> ]
```

:::note
只要查询成功执行，即使仅使用 WHERE 条件查询了流捕获的部分数据，WITH CONSUME 子句也会消费流捕获的所有数据。
:::

## 示例

假设我们有一个名为 's' 的流，它捕获了以下数据：

```sql
SELECT * FROM s;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ INSERT           │ 4942372d864147e98188f3b486ec18d2000000 │ false            │
│               1 │ DELETE           │ 3df95ad8552e4967a704e1c7209d3dff000000 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

如果现在我们使用 `WITH CONSUME` 查询流，我们将得到以下结果：

```sql
SELECT
  a
FROM
  s WITH CONSUME AS ss
WHERE
  ss.change$action = 'INSERT';

┌─────────────────┐
│        a        │
├─────────────────┤
│               3 │
└─────────────────┘
```

该流现在为空，因为上面的查询已经消费了流中存在的所有数据。

```sql
-- 空结果
SELECT * FROM s;
```