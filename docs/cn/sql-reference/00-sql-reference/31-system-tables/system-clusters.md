---
title: system.clusters
---

包含有关集群节点的信息。

:::note
你可以通过配置选项 `disable_system_table_load` 禁用对 `clusters` 表的访问。

例如，DatabendCloud 用户将无法查看此表。
:::

```sql
SELECT * FROM system.clusters;
+------------------------+---------+------+
| name                   | host    | port |
+------------------------+---------+------+
| 2KTgGnTDuKHw3wu9CCVIf6 | 0.0.0.0 | 9093 |
| bZTEWpQGLwRgcRyHre1xL3 | 0.0.0.0 | 9092 |
| plhQlHvVfT0p1T5QdnvhC4 | 0.0.0.0 | 9091 |
+------------------------+---------+------+
```