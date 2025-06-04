---
title: 在存储阶段（Stage）中查询 ORC 文件
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
ORC 包含模式信息，因此可直接查询列 `<column> [, <column> ...]`。
:::

## 教程

本教程将指导您完成以下操作：下载 ORC 格式的鸢尾花数据集，上传至 Amazon S3 存储桶，创建外部存储阶段（Stage），并直接从 ORC 文件查询数据。

<StepsWrap>
<StepContent number="1">

### 下载鸢尾花数据集

从 https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc 下载数据集，并上传至您的 Amazon S3 存储桶。

该数据集包含 3 个类别，每类 50 个样本，对应不同鸢尾花品种。包含 4 个属性：(1) 萼片长度，(2) 萼片宽度，(3) 花瓣长度，(4) 花瓣宽度，最后一列为类别标签。

</StepContent>
<StepContent number="2">

### 创建外部存储阶段（Stage）

在存储数据集的 Amazon S3 存储桶上创建外部存储阶段：

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

您还可以直接查询远程 ORC 文件：

```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format => 'orc');
```

</StepContent>
<StepContent number="4">

### 使用元数据查询

直接从存储阶段查询 ORC 文件，包含元数据列 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER`：

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