---
title: Monitor
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import FunctionDescription from '@site/src/components/FunctionDescription';

<IndexOverviewList />

<h2 id="node-local-cache-statistics">节点本地缓存统计</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

在自托管环境中，可以通过各 Query 节点内部 Admin API 的 `GET /v1/caches` 采集缓存统计。此请求不执行 SQL、不创建会话，也不联系其他节点。请将 Admin API 限制在可信内网中。不要将其作为公共查询端点开放。

在 Query 主机上执行以下请求。如有需要，请使用配置的 `admin_api_address` 替换地址。参见 [Query 配置](/guides/self-hosted/references/node-config/query-config)。

```bash
curl http://127.0.0.1:8080/v1/caches
```

响应为 JSON 数组，包含已禁用的缓存和缓存池汇总行。请分别采集每个节点；此端点不会发现或汇总计算集群中的节点。

| 字段 | 含义 |
|------|------|
| `node`, `name`, `pool`, `is_pool` | 节点标识、行名称、所属缓存池（或 `null`），以及该行是否为缓存池汇总。 |
| `enabled`, `num_items` | 缓存或缓存池是否启用，以及条目数量。 |
| `capacity`, `unit` | 以 `count` 或 `bytes` 表示的上限。`null` 容量表示缓存受所属池限制，而非无限容量。 |
| `size`, `in_cache_size` | 计入缓存用量的字节数和仍驻留缓存的字节数。前者可能包含已驱逐但仍由读取方持有的值。 |
| `access`, `hit`, `miss` | 累计计数器，而非速率。请比较采样值来衡量一段时间内的活动。 |

缓存池行与其缓存行存在重叠。计算内存使用量或缓存活动时，不要将两类行同时相加。如需通过 SQL 查看统计，参见 [system.caches](/sql/sql-reference/system-tables/system-caches)。