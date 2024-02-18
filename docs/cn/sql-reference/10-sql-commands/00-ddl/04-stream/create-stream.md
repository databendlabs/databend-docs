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
    [ COMMENT = '<comment>' ]
```

- `CREATE STREAM` 命令允许流和关联表之间使用不同的数据库名称。在Databend中，流被视为属于特定数据库的对象，类似于表或视图。如果没有明确指定数据库，则假定当前数据库为流的默认上下文。

- `AT (STREAM => <stream_name>)` 子句建立了新创建的流和一个现有流之间的依赖关系。这种链接表明，新流旨在捕获并反映现有流的变化。

## 示例

此示例为 `books_total` 表创建一个名为 `books_stream_2023` 的流：

```sql
CREATE STREAM books_stream_2023 
    ON TABLE books_total;
```