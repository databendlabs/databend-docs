---
title: Jaeger
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.199"/>

[Jaeger](https://github.com/jaegertracing/jaeger) is an open-source, end-to-end distributed tracing tool that originated from [Uber](https://www.uber.com/). It helps monitor and troubleshoot microservices-based applications.

Databend has the ability to export tracing data to Jaeger by integrating with the [OpenTelemetry](https://opentelemetry.io/) SDK. The following tutorial shows you how to deploy and use Jaeger to trace Databend.

## Tutorial: Trace Databend with Jaeger

### Step 1. Deploy Jaeger

This tutorial uses the All In One image to deploy Jaeger in Docker. If you already have a running Jaeger instance, you can skip this step.

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

### Step 2. Deploy Databend

1. Follow the [Deployment Guide](/guides/self-hosted) to deploy Databend.

2. Enable tracing in the configuration file [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml). For more information, see [Enabling with Configuration File](../30-tracing.md#enabling-with-configuration-file).

```toml title='databend-query.toml'
...
[log.tracing]
capture_log_level = "DEBUG"
on = true
otlp_endpoint = "http://127.0.0.1:4317"
...
```

3. Start Databend, and run the following SQL statements:

```sql
CREATE TABLE t1(a INT);
INSERT INTO t1 VALUES(1);
INSERT INTO t1 SELECT * FROM t1;
```

### Step 3. Check Tracing Information on Jaegar

1. Go to http://127.0.0.1:16686/ and select the **Search** tab.

2. Select a service in the **Service** drop-down list. For example, select the databend-query service.

3. Click **Find Traces** to show the traces.

![](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/jaeger-tracing-show.png)
