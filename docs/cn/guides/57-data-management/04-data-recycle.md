---
title: 数据清理与回收
sidebar_label: 数据回收
---

在 Databend 中，当你执行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据并不会被真正删除，这使得你可以通过时间回溯功能恢复到之前的状态。

数据分为两种类型：

- **历史数据**：由时间回溯功能使用，用于存储历史数据或已删除表的数据。
- **临时数据**：由系统使用，用于存储溢出数据。

如果数据量较大，你可以运行以下命令（[企业版功能](/guides/products/dee/enterprise-features)）来删除这些数据并释放存储空间。

## 溢出数据存储

私有化部署的 Databend 支持在内存使用超过可用限制时将中间查询结果溢出到磁盘。用户可以配置溢出数据的存储位置，选择本地磁盘存储或远程 S3 兼容存储桶。

### 溢出存储选项

Databend 提供以下溢出存储配置：

- **本地磁盘存储**：溢出数据写入查询节点指定的本地目录。请注意，本地磁盘存储仅支持 [窗口函数](/sql/sql-functions/window-functions/)。
- **远程 S3 兼容存储**：溢出数据存储在外部存储桶。
- **默认存储**：如果未配置溢出存储，Databend 会将溢出数据与表数据一起存储到默认存储桶。

### 溢出优先级

如果同时配置了本地和 S3 兼容溢出存储，Databend 按以下顺序处理：

1. 优先溢出到本地磁盘（如果已配置）。
2. 当本地磁盘空间不足时，溢出到远程 S3 兼容存储。
3. 如果未配置本地或外部 S3 兼容存储，则溢出到 Databend 的默认存储桶。

### 配置溢出存储

要配置溢出存储，请更新 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件。

以下示例配置 Databend 使用最多 1 TB 本地磁盘空间进行溢出操作，同时保留 40% 的磁盘空间供系统使用：

```toml
[spill]
spill_local_disk_path = "/data1/databend/databend_spill"
spill_local_disk_reserved_space_percentage = 40
spill_local_disk_max_bytes = 1099511627776
```

以下示例配置 Databend 使用 MinIO 作为 S3 兼容存储服务进行溢出操作：

```toml
[spill]
[spill.storage]
type = "s3"
[spill.storage.s3]
bucket = "databend"
root = "admin"
endpoint_url = "http://127.0.0.1:9900"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
allow_insecure = true
```

## 清理已删除表数据

删除所有已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE;
```

详见 [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)。

## 清理表历史数据

移除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name>;
```

详见 [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table)。

## 清理临时数据

清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

详见 [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files)。
