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

:::info Tips
ORC 包含 schema 信息，因此我们可以直接查询列 `<column> [, <column> ...]`。
:::

## 教程

在本教程中，我们将引导你完成以下步骤：下载 ORC 格式的 Iris 数据集，将其上传到 Amazon S3 存储桶，创建外部 Stage，并直接从 ORC 文件中查询数据。

<StepsWrap>
<StepContent number="1">

### 下载 Iris 数据集

从 https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc 下载 iris 数据集，然后将其上传到你的 Amazon S3 存储桶。

iris 数据集包含 3 个类别，每个类别有 50 个实例，每个类别代表一种鸢尾花。它有 4 个属性：（1）萼片长度，（2）萼片宽度，（3）花瓣长度，（4）花瓣宽度，最后一列包含类别标签。

</StepContent>
<StepContent number="2">

### 创建外部 Stage

使用存储 iris 数据集文件的 Amazon S3 存储桶创建外部 Stage。

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

直接从 Stage 查询 ORC 文件，包括 `metadata$filename` 和 `metadata$file_row_number` 等元数据列：

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    *
FROM @orc_query_stage
(
    FILE_FORMAT => 'orc',
    PATTERN => '.*[.]orc'
);
```

</StepContent>
</StepsWrap>