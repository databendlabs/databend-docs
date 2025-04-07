---
title: 获取服务器日志
---

如果您从客户端收到错误，例如：

```sql
ERROR 2013 (HY000): Lost connection to MySQL server during query
No connection. Trying to reconnect...
```

您可以从 `system.tracing` 表中获取服务器日志（level=50 仅显示 ERROR 日志）：

:::note
Databend 使用 [tokio-tracing](https://github.com/tokio-rs/tracing) 跟踪日志，其中默认时区为 UTC，无法通过 Databend 时区设置进行更改，因此跟踪日志中的时间将始终为 UTC，不会反映您的本地时间。
:::

```sql
SELECT * FROM system.tracing WHERE level=50;
+------+----------------+----------------------------------------------------------------------------------------------------------------------------------+-------+----------+--------+-------------------------------------+
| v    | name           | msg                                                                                                                              | level | hostname | pid    | time                                |
+------+----------------+----------------------------------------------------------------------------------------------------------------------------------+-------+----------+--------+-------------------------------------+
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:27.656710495+00:00 |
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:27.703538995+00:00 |
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:27.755246715+00:00 |
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:51.861038285+00:00 |
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:51.912497882+00:00 |
|    0 | databend-query | [EXECUTE - EVENT] panicked at 'index out of bounds: the len is 1 but the index is 1', common/datablocks/src/data_block.rs:104:17 |    50 | thinkpad | 646495 | 2021-11-17T03:31:51.956650623+00:00 |
+------+----------------+----------------------------------------------------------------------------------------------------------------------------------+-------+----------+--------+-------------------------------------+
```