---
title: Jaeger
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.199"/>

[Jaeger](https://github.com/jaegertracing/jaeger) 是一个开源的端到端分布式追踪工具，起源于 [Uber](https://www.uber.com/)。它有助于监控和故障排查基于微服务的应用程序。

Databend 通过集成 [OpenTelemetry](https://opentelemetry.io/) SDK，具备将追踪数据导出到 Jaeger 的能力。以下教程展示了如何部署和使用 Jaeger 来追踪 Databend。

## 教程: 使用 Jaeger 追踪 Databend

### 步骤 1. 部署 Jaeger

本教程使用 All In One 镜像在 Docker 中部署 Jaeger。如果您已有运行的 Jaeger 实例，可以跳过此步骤。

```bash
docker run --rm -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

### 步骤 2. 部署 Databend

1. 按照 [部署指南](/guides/deploy) 部署 Databend。

2. 在配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中启用追踪。更多信息，请参阅 [通过配置文件启用](../30-tracing.md#enabling-with-configuration-file)。

```toml title='databend-query.toml'
...
[log.tracing]
capture_log_level = "DEBUG"
on = "true"
otlp_endpoint = "http://127.0.0.1:4317"
...
```

3. 启动 Databend，并运行以下 SQL 语句：

```sql
CREATE TABLE t1(a INT);
INSERT INTO t1 VALUES(1);
INSERT INTO t1 SELECT * FROM t1;
```

### 步骤 3. 在 Jaeger 上检查追踪信息

1. 访问 http://127.0.0.1:16686/ 并选择 **Search** 标签页。

2. 在 **Service** 下拉列表中选择一个服务。例如，选择 databend-query 服务。

3. 点击 **Find Traces** 以显示追踪信息。

![](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/jaeger-tracing-show.png)