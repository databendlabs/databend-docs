---
title: 表版本管理
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

表版本管理允许您为 FUSE 表的特定快照创建命名引用。这些引用不受自动保留清理的影响，为您提供稳定、可读的历史表状态指针。

:::note
表版本管理是一个实验性功能，使用前需要启用：

```sql
SET enable_experimental_table_ref = 1;
```
:::

## 快照标签

快照标签通过名称固定表的某个时间点状态。您可以随时通过 [AT](../../20-query-syntax/03-query-at.md) 子句查询标签对应的状态，无需记录快照 ID 或时间戳。

| 命令 | 说明 |
|------|------|
| [CREATE SNAPSHOT TAG](01-create-snapshot-tag.md) | 在表快照上创建命名标签 |
| [DROP SNAPSHOT TAG](02-drop-snapshot-tag.md) | 删除快照标签 |
