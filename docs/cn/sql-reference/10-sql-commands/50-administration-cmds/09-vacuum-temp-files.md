---
title: VACUUM TEMPORARY FILES
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

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
| `LIMIT` | 首先用于溢出路径的软清理预算，再用剩余额度限制要清理的非活动临时表会话数量，而非这些会话中的单个文件数量。并发溢出清理任务可能超出此预算。省略时不设置显式上限。 |

需要全局 `SUPER` 权限。命令不返回结果集。

## 清理预算与进度

从 v1.2.953 开始，溢出清理并发执行。`LIMIT` 是软边界，不是删除文件数量的精确上限。预算耗尽时，调度器停止启动新任务。已经在途的任务可以完成，并使删除数量超出限制。

溢出清理会将已成功删除的路径计入预算。失败删除请求中的路径也会计入预算，因为后端可能已经删除了请求中的部分路径。这些不确定的删除不会增加报告的成功删除计数。临时表会话的剩余额度使用已扣减预算，而不只是进度计数。预算耗尽时，本轮不再有会话清理额度。

溢出删除失败会记录到日志。剩余工作可以在后续运行中重试。命令完成不保证所有符合条件的溢出路径均已删除。

命令运行时，请从另一个会话查看 `system.processes`：

```sql
SELECT current_query_id, status,
       scan_progress_read_rows, scan_progress_read_bytes
FROM system.processes;
```

请识别正在运行的 VACUUM 语句对应的行。在溢出清理阶段，`scan_progress_read_rows` 报告累计成功删除计数。它可以包含溢出元数据和目录标记路径，不是表数据行数，也不是已清理的临时表会话数。`scan_progress_read_bytes` 不报告已删除的字节大小。

状态可能显示 `[VACUUM] removed <count> temporary files`。状态更新有频率限制，因此文本可能落后于进度计数。较短的运行可能在此状态出现前就完成。命令仍不返回结果集。

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
