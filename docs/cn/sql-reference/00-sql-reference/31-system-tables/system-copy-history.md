---
title: system.copy_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.823"/>

包含 COPY 历史的相关信息。

```sql
select * from copy_history('abc');

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                          file_name                          │ content_length │        last_modified       │       etag       │
│                            String                           │     UInt64     │     Nullable(Timestamp)    │ Nullable(String) │
├─────────────────────────────────────────────────────────────┼────────────────┼────────────────────────────┼──────────────────┤
│ data_0199db4c843a70b2b81f115f01c8de97_0000_00000000.parquet │          10531 │ 2025-10-13 02:00:49.083208 │ NULL             │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

请注意，`system.copy_history` 的结果受 `load_file_metadata_expire_hours` 设置影响，默认值为 24 小时。
