---
title: 数据清理和回收
sidebar_label: 数据回收
---

在 Databend 中，当你运行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据并非真正被删除，从而允许时间回溯到之前的状态。

有两种类型的数据：

- **历史数据**: 被时间回溯用于存储历史数据或已删除表中的数据。
- **临时数据**: 被系统用于存储溢出数据。

如果数据量很大，您可以运行几个命令（[企业版功能](/guides/products/dee/enterprise-features)）来删除这些数据并释放存储空间。

## 溢出数据存储

私有化部署 Databend 支持在内存使用量超过可用限制时，将中间查询结果溢出到磁盘。用户可以配置溢出数据的存储位置，选择本地磁盘存储和远程 S3 兼容的存储桶。

### 溢出存储选项

Databend 提供以下溢出存储配置：

- 本地磁盘存储：溢出数据被写入查询节点中指定的本地目录。请注意，本地磁盘存储仅支持 [窗口函数](/sql/sql-functions/window-functions/)。
- 远程 S3 兼容存储：溢出数据存储在外部存储桶中。
- 默认存储：如果未配置溢出存储，Databend 会将数据溢出到默认存储桶以及您的表数据。

### 溢出优先级

如果同时配置了本地和 S3 兼容的溢出存储，Databend 遵循以下顺序：

1. 首先溢出到本地磁盘（如果已配置）。
2. 当本地磁盘空间不足时，溢出到远程 S3 兼容存储。
3. 如果未配置本地或外部 S3 兼容存储，则溢出到 Databend 的默认存储桶。

### 配置溢出存储

要配置溢出存储，请更新 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件。

此示例设置 Databend 使用最多 1 TB 的本地磁盘空间进行溢出操作，同时为系统使用保留 40% 的磁盘空间：

```toml
[spill]
spill_local_disk_path = "/data1/databend/databend_spill"
spill_local_disk_reserved_space_percentage = 40
spill_local_disk_max_bytes = 1099511627776
```

此示例设置 Databend 使用 MinIO 作为 S3 兼容的存储服务进行溢出操作：

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

## 清理删除表数据

删除所有已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE;
```

查看更多 [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)。

## 清理表历史数据

删除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name>;
```

查看更多 [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table)。

## 清理临时数据

清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

查看更多 [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files)。