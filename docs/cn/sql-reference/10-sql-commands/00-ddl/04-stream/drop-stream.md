---
title: 删除流
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.223"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

删除一个已存在的流。

## 语法

```sql
DROP STREAM [ IF EXISTS ] [ <database_name>. ]<stream_name>
```

## 示例

```sql
DROP STREAM books_stream_2023;
```