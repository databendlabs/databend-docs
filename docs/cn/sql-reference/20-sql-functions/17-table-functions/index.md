---
title: 表函数
---

本页面提供 Databend 中表函数的参考信息。表函数返回一组行（类似于表），可以在查询（Query）的 FROM 子句中使用。

## 数据模式与文件检查

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [INFER_SCHEMA](./01-infer-schema.md) | 检测文件元数据模式并检索列定义 | `SELECT * FROM INFER_SCHEMA(LOCATION => '@mystage/data/')` |
| [INSPECT_PARQUET](./02-inspect-parquet.md) | 检查 Parquet 文件的结构 | `SELECT * FROM INSPECT_PARQUET(LOCATION => '@mystage/data.parquet')` |

## 暂存区（Stage）与查询管理

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [LIST_STAGE](./03-list-stage.md) | 列出暂存区（Stage）中的文件 | `SELECT * FROM LIST_STAGE(LOCATION => '@mystage/data/')` |
| [RESULT_SCAN](./result-scan.md) | 检索先前查询的结果集 | `SELECT * FROM RESULT_SCAN(LAST_QUERY_ID())` |

## 数据生成

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [GENERATE_SERIES](./05-generate-series.md) | 生成值序列 | `SELECT * FROM GENERATE_SERIES(1, 10, 2)` |

## 数据转换与展开

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [FLATTEN](./flatten.md) | 将嵌套 JSON 或数组数据转换为表格格式 | `SELECT * FROM FLATTEN(INPUT => parse_json('[1,2,3]'))` |

## 系统信息与管理

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [SHOW_GRANTS](./show-grants.md) | 显示已授予的权限 | `SELECT * FROM SHOW_GRANTS()` |
| [SHOW_VARIABLES](./show-variables.md) | 显示系统变量 | `SELECT * FROM SHOW_VARIABLES()` |
| [STREAM_STATUS](./stream-status.md) | 显示流状态信息 | `SELECT * FROM STREAM_STATUS('mystream')` |
| [TASK_HISTROY](./task_histroy.md) | 显示任务执行历史 | `SELECT * FROM TASK_HISTROY('mytask')` |

## 存储引擎函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [FUSE_VACUUM_TEMPORARY_TABLE](./fuse-vacuum-temporary-table.md) | 清理临时表 | `SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE()` |
| [FUSE_AMEND](./fuse-amend.md) | 管理数据修正 | `SELECT * FROM FUSE_AMEND()` |

## Iceberg 集成

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ICEBERG_MANIFEST](./iceberg-manifest.md) | 显示 Iceberg 表清单信息 | `SELECT * FROM ICEBERG_MANIFEST('mytable')` |
| [ICEBERG_SNAPSHOT](./iceberg-snapshot.md) | 显示 Iceberg 表快照信息 | `SELECT * FROM ICEBERG_SNAPSHOT('mytable')` |