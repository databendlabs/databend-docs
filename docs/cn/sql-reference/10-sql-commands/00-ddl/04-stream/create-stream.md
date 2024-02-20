---
title: 创建流
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

创建一个流。

## 语法

```sql
CREATE [ OR REPLACE ] STREAM [ IF NOT EXISTS ] [ <database_name>. ]<stream_name> 
  ON TABLE [ <database_name>. ]<table_name> 
    [ AT (STREAM => <stream_name>) ] 
    [ APPEND_ONLY = true | false ]
    [ COMMENT = '<comment>' ]
```

- CREATE STREAM 命令允许流和关联表之间使用不同的数据库名称。在 Databend 中，流被视为属于特定数据库的对象，类似于表或视图。如果没有明确指定数据库，则假定当前数据库为流的默认上下文。

- `AT (STREAM => <stream_name>)` 子句建立了新创建的流和现有流之间的依赖关系。这种链接表明新流旨在捕获并反映现有流的变化。

- `APPEND_ONLY`：当设置为 `true` 时，流以 `仅追加` 模式运行；当设置为 `false` 时，它以 `标准` 模式运行。默认为 `false`。有关流操作模式的更多详情，请参见[流如何工作](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。

## 示例

此示例为 `books_total` 表创建一个名为 `books_stream_2023` 的流：

```sql
CREATE STREAM books_stream_2023 
    ON TABLE books_total;
```