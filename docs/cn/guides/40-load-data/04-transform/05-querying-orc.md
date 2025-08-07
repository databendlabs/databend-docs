---
title: 查询暂存区（Stage）中的 ORC 文件
sidebar_label: ORC
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

## 语法

- [将行作为 Variant 查询](./index.md#query-rows-as-variants)
- [按名称查询列](./index.md#query-columns-by-name)
- [查询元数据](./index.md#query-metadata)

## 教程

在本教程中，我们将带你完成以下步骤：下载 ORC 格式的 Iris 数据集、将其上传到 Amazon S3 存储桶、创建外部暂存区（Stage），并直接从 ORC 文件查询数据。

<StepsWrap>
<StepContent number="1">

### 下载 Iris 数据集

从 https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc 下载 iris 数据集，然后上传到你的 Amazon S3 存储桶。

iris 数据集包含 3 个类别，每个类别 50 条记录，每个类别对应一种鸢尾花。数据集共有 4 个属性：（1）花萼长度，（2）花萼宽度，（3）花瓣长度，（4）花瓣宽度；最后一列为类别标签。

</StepContent>
<StepContent number="2">

### 创建外部暂存区（Stage）

使用存放 iris 数据集文件的 Amazon S3 存储桶创建外部暂存区（Stage）。

```sql
CREATE STAGE orc_query_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        ACCESS_KEY_ID = '<your-key-id>',
        SECRET_ACCESS_KEY = '<your-secret-key>'
    );
```

</StepContent>
<StepContent number="3">

### 查询 ORC 文件

按列查询：

```sql
SELECT *
FROM @orc_query_stage
(
    FILE_FORMAT => 'orc',
    PATTERN => '.*[.]orc'
);

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│    sepal_length   │    sepal_width    │    petal_length   │    petal_width    │      species     │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┤
│               5.1 │               3.5 │               1.4 │               0.2 │ setosa           │
│                 · │                 · │                 · │                 · │ ·                │
│               5.9 │                 3 │               5.1 │               1.8 │ virginica        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

使用路径表达式查询：

```sql
SELECT $1
FROM @orc_query_stage
(
    FILE_FORMAT => 'orc',
    PATTERN => '.*[.]orc'
    
);
```

你也可以直接查询远程 ORC 文件：

```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format => 'orc');
```

</StepContent>
<StepContent number="4">

### 查询元数据

直接从暂存区（Stage）查询 ORC 文件，并包含 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    *
FROM @orc_query_stage
(
    FILE_FORMAT => 'orc',
    PATTERN => '.*[.]orc'
);
```

</StepContent>
</StepsWrap>