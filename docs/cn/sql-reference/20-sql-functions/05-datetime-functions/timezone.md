---
title: TIMEZONE
---

返回当前连接的时区。

Databend 默认使用 UTC（协调世界时）作为时区，并允许您将时区更改为当前地理位置。有关可以分配给 `timezone` 设置的可用值，请参阅 https://docs.rs/chrono-tz/latest/chrono_tz/enum.Tz.html。详情请参见下面的示例。

## 语法

```
SELECT TIMEZONE();
```

## 示例

```sql
-- 返回当前时区
SELECT TIMEZONE();

┌────────────┐
│ timezone() │
├────────────┤
│ UTC        │
└────────────┘

-- 设置时区为中国标准时间
SET timezone='Asia/Shanghai';

SELECT TIMEZONE();

┌───────────────┐
│   timezone()  │
├───────────────┤
│ Asia/Shanghai │
└───────────────┘
```