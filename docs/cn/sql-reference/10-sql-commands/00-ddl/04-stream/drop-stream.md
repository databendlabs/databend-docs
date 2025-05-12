---
title: DROP STREAM
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.223"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

删除现有的 stream。

## 语法

```sql
DROP STREAM [ IF EXISTS ] [ <database_name>. ]<stream_name>
```

## 示例

```sql
DROP STREAM books_stream_2023;
```