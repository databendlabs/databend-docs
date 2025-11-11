---
title: CONVERT_TIMEZONE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新：v1.2.680"/>

`CONVERT_TIMEZONE()` 用于将时间戳从当前会话时区（默认 `UTC`）转换为第一个参数指定的目标时区。目标时区必须是有效的 [IANA 时区名称](https://docs.rs/chrono-tz/latest/chrono_tz/enum.Tz.html)。

## 语法

```sql
CONVERT_TIMEZONE(<target_timezone>, <timestamp_expr>)
```

| 参数 | 说明 |
|------|------|
| `<target_timezone>` | 区分大小写的时区名称，例如 `'America/Los_Angeles'` 或 `'UTC'`。 |
| `<timestamp_expr>`  | 可解析为 TIMESTAMP 的表达式，按照当前会话时区进行解释。 |

## 返回类型

返回目标时区下等价时刻的 TIMESTAMP。

## 行为说明

- 源时区始终等于当前会话时区（默认 `UTC`）。如果存储的数据使用其他时区，请先在会话或连接层面做好设置。
- 无效的时区名称会报错；任一参数为 `NULL` 时返回 `NULL`。
- 夏令时缺口可能导致部分时间戳无效，可在会话或租户级别开启 `enable_dst_hour_fix = 1` 让 Databend 自动调整。

## 示例

### 默认 UTC 会话下的单次转换

```sql
SELECT CONVERT_TIMEZONE('America/Los_Angeles', '2024-11-01 11:36:10');
```

```
┌──────────────────────────────────────────────────────┐
│ convert_timezone('America/Los_Angeles', '2024-11-01… │
├──────────────────────────────────────────────────────┤
│ 2024-11-01 04:36:10.000000                           │
└──────────────────────────────────────────────────────┘
```

### 按用户偏好转换多行数据

```sql
SELECT
    user_tz,
    event_time,
    CONVERT_TIMEZONE(user_tz, event_time) AS local_time
FROM (
    VALUES
        ('America/Los_Angeles', '2024-10-31 22:21:15'::TIMESTAMP),
        ('Asia/Shanghai',       '2024-10-31 22:21:15'::TIMESTAMP),
        (NULL,                  '2024-10-31 22:21:15'::TIMESTAMP)
) AS v(user_tz, event_time)
ORDER BY user_tz NULLS LAST;
```

```
┌──────────────────────┬──────────────────────────────┬──────────────────────────────┐
│ user_tz              │ event_time                   │ local_time                   │
├──────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ America/Los_Angeles  │ 2024-10-31 22:21:15.000000   │ 2024-10-31 15:21:15.000000   │
│ Asia/Shanghai        │ 2024-10-31 22:21:15.000000   │ 2024-11-01 06:21:15.000000   │
│ NULL                 │ 2024-10-31 22:21:15.000000   │ NULL                         │
└──────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

### 处理落在夏令时缺口内的时间戳

本示例的会话已配置为 Asia/Shanghai 并开启 `enable_dst_hour_fix = 1`。由于 1947 年 4 月 15 日 00:00:00 在该时区并不存在（时钟向前跳一小时），Databend 会先调整后再返回其对应的 UTC 时间。

```sql
SELECT CONVERT_TIMEZONE('UTC', '1947-04-15 00:00:00');
```

```
┌──────────────────────────────────────────────┐
│ convert_timezone('UTC', '1947-04-15 00:00:00')│
├──────────────────────────────────────────────┤
│ 1947-04-14 15:00:00.000000                   │
└──────────────────────────────────────────────┘
```

## 另请参阅

- [TIMEZONE](timezone.md)
- [TO_TIMESTAMP_TZ](to-timestamp-tz.md)
- [TO_TIMESTAMP](to-timestamp.md)
