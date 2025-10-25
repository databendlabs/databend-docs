---
title: 湖仓 ETL
---

> **场景：** CityDrive 的数据工程团队将每批行车记录仪数据导出为 Parquet（视频、帧事件、元数据 JSON、嵌入向量、GPS 轨迹、交通信号距离），并希望使用一条 COPY 流水线刷新 Databend 中的共享表。

加载循环非常直接：

```
对象存储 → Stage → COPY INTO 表 → （可选）STREAM/TASK
```

根据你的环境调整桶路径或格式，然后粘贴以下命令。语法与[加载数据指南](/guides/load-data/)一致。

---

## 1. 创建 Stage
将可复用的 Stage 指向保存 CityDrive 导出文件的桶。替换凭证/URL 为你自己的账户；这里使用 Parquet，但任何支持的格式只需更换 `FILE_FORMAT` 即可。

```sql
CREATE OR REPLACE CONNECTION citydrive_s3
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<AWS_ACCESS_KEY_ID>'
  SECRET_ACCESS_KEY = '<AWS_SECRET_ACCESS_KEY>';

CREATE OR REPLACE STAGE citydrive_stage
  URL = 's3://citydrive-lakehouse/raw/'
  CONNECTION = (CONNECTION_NAME = 'citydrive_s3')
  FILE_FORMAT = (TYPE = 'PARQUET');
```

> [!IMPORTANT]
> 将占位符 AWS 密钥和桶 URL 替换为你环境中的真实值。没有有效凭证时，`LIST`、`SELECT ... FROM @citydrive_stage` 和 `COPY INTO` 语句会因 S3 返回 `InvalidAccessKeyId`/403 错误而失败。

快速检查：

```sql
LIST @citydrive_stage/videos/;
LIST @citydrive_stage/frame-events/;
LIST @citydrive_stage/manifests/;
LIST @citydrive_stage/frame-embeddings/;
LIST @citydrive_stage/frame-locations/;
LIST @citydrive_stage/traffic-lights/;
```

---

## 2. 预览文件
在 Stage 上执行 `SELECT`，在加载前确认模式并抽样。

```sql
SELECT *
FROM @citydrive_stage/videos/capture_date=2025-01-01/videos.parquet
LIMIT 5;

SELECT *
FROM @citydrive_stage/frame-events/batch_2025_01_01.parquet
LIMIT 5;
```

Databend 会根据 Stage 定义推断格式，因此无需额外选项。

---

## 3. COPY INTO 统一表
每个导出对应指南中使用的共享表之一。内联类型转换保证即使上游列顺序变化，模式仍保持一致。

### `citydrive_videos`
```sql
COPY INTO citydrive_videos (video_id, vehicle_id, capture_date, route_name, weather, camera_source, duration_sec)
FROM (
  SELECT video_id::STRING,
         vehicle_id::STRING,
         capture_date::DATE,
         route_name::STRING,
         weather::STRING,
         camera_source::STRING,
         duration_sec::INT
  FROM @citydrive_stage/videos/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_events`
```sql
COPY INTO frame_events (frame_id, video_id, frame_index, collected_at, event_tag, risk_score, speed_kmh)
FROM (
  SELECT frame_id::STRING,
         video_id::STRING,
         frame_index::INT,
         collected_at::TIMESTAMP,
         event_tag::STRING,
         risk_score::DOUBLE,
         speed_kmh::DOUBLE
  FROM @citydrive_stage/frame-events/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_metadata_catalog`
```sql
COPY INTO frame_metadata_catalog (doc_id, meta_json, captured_at)
FROM (
  SELECT doc_id::STRING,
         meta_json::VARIANT,
         captured_at::TIMESTAMP
  FROM @citydrive_stage/manifests/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_embeddings`
```sql
COPY INTO frame_embeddings (frame_id, video_id, sensor_view, embedding, encoder_build, created_at)
FROM (
  SELECT frame_id::STRING,
         video_id::STRING,
         sensor_view::STRING,
         embedding::VECTOR(768), -- 替换为你的实际维度
         encoder_build::STRING,
         created_at::TIMESTAMP
  FROM @citydrive_stage/frame-embeddings/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `frame_geo_points`
```sql
COPY INTO frame_geo_points (video_id, frame_id, position_wgs84, solution_grade, source_system, created_at)
FROM (
  SELECT video_id::STRING,
         frame_id::STRING,
         position_wgs84::GEOMETRY,
         solution_grade::INT,
         source_system::STRING,
         created_at::TIMESTAMP
  FROM @citydrive_stage/frame-locations/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### `signal_contact_points`
```sql
COPY INTO signal_contact_points (node_id, signal_position, video_id, frame_id, frame_position, distance_m, created_at)
FROM (
  SELECT node_id::STRING,
         signal_position::GEOMETRY,
         video_id::STRING,
         frame_id::STRING,
         frame_position::GEOMETRY,
         distance_m::DOUBLE,
         created_at::TIMESTAMP
  FROM @citydrive_stage/traffic-lights/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

完成后，所有下游工作负载——SQL 分析、Elasticsearch `QUERY()`、向量相似度、地理空间过滤——都将读取同一份数据。

---

## 4. 增量响应 Stream（可选）
若希望下游作业仅消费上次批量后新增的行，可使用 Stream。

```sql
CREATE OR REPLACE STREAM frame_events_stream ON TABLE frame_events;

SELECT * FROM frame_events_stream;   -- 查看新复制的行
-- …处理行…
SELECT * FROM frame_events_stream WITH CONSUME;  -- 推进游标
```

`WITH CONSUME` 确保处理完后 Stream 游标前移。参考：[Streams](/guides/load-data/continuous-data-pipelines/stream)。

---

## 5. 定时加载 Task（可选）
Task 按调度执行**一条 SQL 语句**。可为每张表创建轻量级 Task，或将逻辑封装到存储过程统一入口。

```sql
CREATE OR REPLACE TASK task_load_citydrive_videos
  WAREHOUSE = 'default'
  SCHEDULE = 10 MINUTE
AS
  COPY INTO citydrive_videos (video_id, vehicle_id, capture_date, route_name, weather, camera_source, duration_sec)
  FROM (
    SELECT video_id::STRING,
           vehicle_id::STRING,
           capture_date::DATE,
           route_name::STRING,
           weather::STRING,
           camera_source::STRING,
           duration_sec::INT
    FROM @citydrive_stage/videos/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_citydrive_videos RESUME;

CREATE OR REPLACE TASK task_load_frame_events
  WAREHOUSE = 'default'
  SCHEDULE = 10 MINUTE
 AS
  COPY INTO frame_events (frame_id, video_id, frame_index, collected_at, event_tag, risk_score, speed_kmh)
  FROM (
    SELECT frame_id::STRING,
           video_id::STRING,
           frame_index::INT,
           collected_at::TIMESTAMP,
           event_tag::STRING,
           risk_score::DOUBLE,
           speed_kmh::DOUBLE
    FROM @citydrive_stage/frame-events/
  )
  FILE_FORMAT = (TYPE = 'PARQUET');

ALTER TASK task_load_frame_events RESUME;
```

按相同模式为 `frame_metadata_catalog`、嵌入或 GPS 数据添加更多 Task。完整选项见：[Tasks](/guides/load-data/continuous-data-pipelines/task)。

---

作业运行后，Unified Workloads 系列的所有指南都将从同一组 CityDrive 表读取数据——无需额外 ETL 层，也无重复存储。