---
title: db-archiver
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.70"/>

[db-archiver](https://github.com/databendcloud/db-archiver) 是一个 Databend 自研的开箱即用的归档工具，用于将数据库或者其他数据源的数据归档到 Databend。

## 支持的数据源

| 数据源     | 支持状态 |
| :--------- | :------: |
| MySQL      |   支持   |
| PostgreSQL |   支持   |
| TiDB       |   支持   |
| Oracle     |   支持   |
| CSV        | 即将支持 |
| NDJSON     | 即将支持 |

## 安装

```bash
go install github.com/databend/db-archiver@latest
```

或者从 [release](https://github.com/databendcloud/db-archiver/releases) 下载对应的可执行文件。

## 使用方法

在 `config/conf.json` 中配置数据源信息和 Databend 连接：

```json
{
  "sourceHost": "127.0.0.1",
  "sourcePort": 3306,
  "sourceUser": "root",
  "sourcePass": "123456",
  "sourceDB": "mydb",
  "sourceTable": "my_table",
  "sourceDbTables": ["mydb.*@table.*"],
  "sourceQuery": "select * from mydb.my_table",
  "sourceWhereCondition": "id < 100",
  "sourceSplitKey": "id",
  "databendDSN": "https://cloudapp:password@host.databend.com:443",
  "databendTable": "testSync.my_table",
  "batchSize": 2,
  "batchMaxInterval": 30,
  "workers": 1,
  "copyPurge": false,
  "copyForce": false,
  "disableVariantCheck": false,
  "userStage": "~",
  "deleteAfterSync": false
}
```

运行工具并开始同步：

```bash
./db-archiver -f config/conf.json
```

日志输出：

```shell
INFO[0000] Starting worker              
2024/06/25 11:35:37 ingest 2 rows (0.565646 rows/s), 64 bytes (18.100678 bytes/s)
2024/06/25 11:35:38 ingest 1 rows (0.556652 rows/s), 33 bytes (17.812853 bytes/s)
2024/06/25 11:35:38 ingest 2 rows (0.551906 rows/s), 65 bytes (17.660995 bytes/s)
2024/06/25 11:35:38 ingest 2 rows (0.531644 rows/s), 64 bytes (17.012600 bytes/s)
2024/06/25 11:35:38 ingest 2 rows (0.531768 rows/s), 64 bytes (17.016584 bytes/s)
```

## 参数参考

| 参数                 | 描述                           | 默认值 | 示例                          | 必填 |
| -------------------- | ------------------------------ | ------ | ----------------------------- | ---- |
| sourceHost           | 源主机                         |        |                               | 是   |
| sourcePort           | 源端口                         | 3306   | 3306                          | 是   |
| sourceUser           | 源用户                         |        |                               | 是   |
| sourcePass           | 源密码                         |        |                               | 是   |
| sourceDB             | 源数据库                       |        |                               | 是   |
| sourceTable          | 源表                           |        |                               | 是   |
| sourceDbTables       | 源数据库表(支持正则表达式匹配) | []     | [db.*@table.*,mydb.*.table.*] | 否   |
| sourceQuery          | 源查询                         |        |                               | 是   |
| sourceWhereCondition | 源条件                         |        |                               | 否   |
| sourceSplitKey       | 源分割键                       | 无     | "id"                          | 否   |
| sourceSplitTimeKey   | 源分割时间键                   | 无     | "t1"                          | 否   |
| timeSplitUnit        | 时间分割单位                   | "分钟" | "天"                          | 否   |
| databendDSN          | Databend 数据源名称            | 无     | "http://localhost:8000"       | 是   |
| databendTable        | Databend 表                    | 无     | "db1.tbl"                     | 是   |
| batchSize            | 批量大小                       | 1000   | 1000                          | 否   |
| copyPurge            | 复制清除                       | false  | false                         | 否   |
| copyForce            | 强制复制                       | false  | false                         | 否   |
| DisableVariantCheck  | 禁用变体检查                   | false  | false                         | 否   |
| userStage            | 用户外部 stage                 | ~      | ~                             | 否   |
| deleteAfterSync      | 同步成功后删除源数据           | false  | false                         | 否   |

注意：

1. 为了减少服务器负载，我们设置了 `sourceSplitKey`，它是源表的主键。工具将根据 `sourceSplitKey` 分割数据，并并行同步数据到 Databend。
   `sourceSplitTimeKey` 用于按时间列分割数据。`sourceSplitTimeKey` 和 `sourceSplitKey` 至少必须设置一个。
2. `sourceDbTables` 用于从多个表同步数据。格式为 `db.*@table.*` 或 `db.table.*`。`.*` 是正则表达式模式。`db.*@table.*` 表示匹配数据库中所有匹配正则表达式 `db.*` 的表和匹配正则表达式 `table.*` 的表。
3. `sourceDbTables` 的优先级高于 `sourceTable` 和 `sourceDB`。如果设置了 `sourceDbTables`，则会忽略 `sourceTable`。
4. `database` 和 `table` 都支持正则表达式模式。

## 两种模式

### 根据 `sourceSplitKey` 同步数据

如果您的源表有一个主键，您可以设置 `sourceSplitKey` 来并行同步数据。工具将根据 `sourceSplitKey` 分割数据，并并行同步数据到 Databend。
这是性能最高的模式。
`conf.json` 的示例：

```json
{
  "sourceHost": "0.0.0.0",
  "sourcePort": 3306,
  "sourceUser": "root",
  "sourcePass": "123456",
  "sourceDB": "mydb",
  "sourceTable": "my_table",
  "sourceQuery": "select * from mydb.my_table",
  "sourceWhereCondition": "id < 100",
  "sourceSplitKey": "id",
  "databendDSN": "https://cloudapp:password@host.databend.com:443",
  "databendTable": "testSync.my_table",
  "batchSize": 2,
  "batchMaxInterval": 30,
  "workers": 1,
  "copyPurge": false,
  "copyForce": false,
  "disableVariantCheck": false,
  "userStage": "~",
  "deleteAfterSync": false,
  "maxThread": 10
}
```

### 根据 `sourceSplitTimeKey` 同步数据

如果您的源表有一个时间列，您可以设置 `sourceSplitTimeKey` 来并行同步数据。工具将根据 `sourceSplitTimeKey` 分割数据，并并行同步数据到 Databend。
`sourceSplitTimeKey` 必须与 `timeSplitUnit` 一起设置。`timeSplitUnit` 可以是 `minute`、`hour`、`day`。`timeSplitUnit` 用于按时间列分割数据。
`conf.json` 的示例：

```json
{
  "sourceHost": "127.0.0.1",
  "sourcePort": 3306,
  "sourceUser": "root",
  "sourcePass": "12345678",
  "sourceDB": "mydb",
  "sourceTable": "test_table1",
  "sourceQuery": "select * from mydb.test_table1",
  "sourceWhereCondition": "t1 >= '2024-06-01' and t1 < '2024-07-01'",
  "sourceSplitKey": "",
  "sourceSplitTimeKey": "t1",
  "timeSplitUnit": "hour",
  "databendDSN": "https://cloudapp:password@tn3ftqihs--medium-p8at.gw.aws-us-east-2.default.databend.com:443",
  "databendTable": "default.test_table1",
  "batchSize": 2,
```