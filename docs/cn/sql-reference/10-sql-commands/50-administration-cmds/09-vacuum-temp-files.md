---
title: VACUUM TEMPORARY FILES
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.940"/>

<EEFeature featureName='VACUUM TEMPORARY FILES'/>

删除查询执行期间生成的临时溢出文件，并清理租户的非活动临时表会话。

另请参阅：[system.temp_files](../../00-sql-reference/31-system-tables/system-temp-files.md)、[VACUUM ALL](09-vacuum-all.md)。

## 语法

```sql
VACUUM TEMPORARY FILES [RETAIN <number> {SECONDS | DAYS}] [LIMIT <limit>]
```

| 参数 | 说明 |
|------|------|
| `RETAIN` | 临时溢出文件的保留期，默认为 3 天。该设置独立于 `data_retention_time_in_days`，不设置临时表会话的存活时间。 |
| `LIMIT` | 首先限制删除的溢出文件数量，再用剩余额度限制要清理的非活动临时表会话数量，而非这些会话中的单个文件数量。省略时不设置显式上限。 |

需要全局 `SUPER` 权限。命令不返回结果集。

## 示例

查看临时文件：

```sql
SELECT * FROM system.temp_files;
```

使用默认保留期清理：

```sql
VACUUM TEMPORARY FILES;
```

保留 2 天内的溢出文件，并限制清理数量：

```sql
VACUUM TEMPORARY FILES RETAIN 2 DAYS LIMIT 1000;
```
