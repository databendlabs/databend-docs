---
title: 表函数 (Table Functions)
---

本页面提供 Databend 中表函数的参考信息。表函数返回一组行（类似于表），可在查询的 `FROM` 子句中使用。

## 数据探索函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [INFER_SCHEMA](./01-infer-schema.md) | 检测文件元数据模式并获取列定义 | `SELECT * FROM INFER_SCHEMA(LOCATION => '@mystage/data/')` |
| [INSPECT_PARQUET](./02-inspect-parquet.md) | 检查 Parquet 文件结构 | `SELECT * FROM INSPECT_PARQUET(LOCATION => '@mystage/data.parquet')` |
| [LIST_STAGE](./03-list-stage.md) | 列出 Stage 中的文件 | `SELECT * FROM LIST_STAGE(LOCATION => '@mystage/data/')` |
| [RESULT_SCAN](./result-scan.md) | 检索历史查询的结果集 | `SELECT * FROM RESULT_SCAN(LAST_QUERY_ID())` |

## 数据生成函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [GENERATE_SERIES](./05-generate-series.md) | 生成数值序列 | `SELECT * FROM GENERATE_SERIES(1, 10, 2)` |

## 系统管理函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [SHOW_GRANTS](./show-grants.md) | 显示已授予权限 | `SELECT * FROM SHOW_GRANTS()` |
| [SHOW_VARIABLES](./show-variables.md) | 显示系统变量 | `SELECT * FROM SHOW_VARIABLES()` |
| [STREAM_STATUS](./stream-status.md) | 显示流状态信息 | `SELECT * FROM STREAM_STATUS('mystream')` |
| [TASK_HISTORY](./task_histroy.md) | 显示任务执行历史 | `SELECT * FROM TASK_HISTORY('mytask')` |
| [POLICY_REFERENCES](./policy-references.md) | 返回安全策略与表/视图之间的关联关系 | `SELECT * FROM POLICY_REFERENCES(POLICY_NAME => 'mypolicy')` |
| [FUSE_VACUUM_TEMPORARY_TABLE](./fuse-vacuum-temporary-table.md) | 清理临时表 | `SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE()` |
| [FUSE_AMEND](./fuse-amend.md) | 执行数据修正操作 | `SELECT * FROM FUSE_AMEND()` |

## Iceberg 集成函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [ICEBERG_MANIFEST](iceberg-manifest) | 显示 Iceberg 表清单信息 | `SELECT * FROM ICEBERG_MANIFEST('mytable')` |
| [ICEBERG_SNAPSHOT](iceberg-snapshot) | 显示 Iceberg 表快照信息 | `SELECT * FROM ICEBERG_SNAPSHOT('mytable')` |

## 匿名化

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [OBFUSCATE](../19-data-anonymization-functions/obfuscate.md) | 生成匿名化的数据 | `SELECT * FROM OBFUSCATE(users)` |
