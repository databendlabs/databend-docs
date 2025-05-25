---
title: 查询 Stage 中的 ORC 文件
sidebar_label: ORC
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

## 语法

```sql
SELECT [<alias>.]<column> [, <column> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'ORC | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```

:::info 提示
ORC 文件包含 schema 信息，因此可以直接查询列 `<column> [, <column> ...]`。
:::

## 教程

本教程将指导您完成下载 ORC 格式的 Iris 数据集、上传至 Amazon S3 存储桶、创建外部 stage 以及直接从 ORC 文件查询数据的过程。

<StepsWrap>
<StepContent number="1">

### 下载 Iris 数据集

从 https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc 下载 iris 数据集，然后上传至您的 Amazon S3 存储桶。

该数据集包含 3 类各 50 个样本，每类代表一种鸢尾花植物。它有 4 个特征：(1) 花萼长度，(2) 花萼宽度，(3) 花瓣长度，(4) 花瓣宽度，最后一列是类别标签。

</StepContent>
<StepContent number="2">

### 创建外部 Stage

在存储 iris 数据集文件的 Amazon S3 存储桶上创建外部 stage。

```sql
CREATE STAGE orc_query_stage
    URL = 's3://databend-doc'
    CONNECTION = (
        AWS_KEY_ID = '<your-key-id>',
        AWS_SECRET_KEY = '<your-secret-key>'
    );
```

</StepContent>
<StepContent number="3">

### 查询 ORC 文件

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

您也可以直接查询远程 ORC 文件：

```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format => 'orc');
```

</StepContent>
<StepContent number="4">

### 带元数据的查询

从 stage 直接查询 ORC 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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