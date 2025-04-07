---
title: 查询 Stage 中的 Staged ORC 文件
sidebar_label: ORC
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

## 语法

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'ORC | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```

## 教程

在本教程中，我们将引导您完成以下过程：下载 ORC 格式的 Iris 数据集，将其上传到 Amazon S3 bucket，创建外部 Stage，以及直接从 ORC 文件查询数据。

<StepsWrap>
<StepContent number="1">

### 下载 Iris 数据集

从 https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc 下载 iris 数据集，然后将其上传到您的 Amazon S3 bucket。

iris 数据集包含 3 个类别，每个类别有 50 个实例，其中每个类别都指一种鸢尾植物。它有 4 个属性：（1）萼片长度，（2）萼片宽度，（3）花瓣长度，（4）花瓣宽度，最后一列包含类别标签。

</StepContent>
<StepContent number="2">

### 创建外部 Stage

使用存储 iris 数据集文件的 Amazon S3 bucket 创建一个外部 Stage。

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
```

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│    sepal_length   │    sepal_width    │    petal_length   │    petal_width    │      species     │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┤
│               5.1 │               3.5 │               1.4 │               0.2 │ setosa           │
│               4.9 │                 3 │               1.4 │               0.2 │ setosa           │
│               4.7 │               3.2 │               1.3 │               0.2 │ setosa           │
│               4.6 │               3.1 │               1.5 │               0.2 │ setosa           │
│                 5 │               3.6 │               1.4 │               0.2 │ setosa           │
│               5.4 │               3.9 │               1.7 │               0.4 │ setosa           │
│               4.6 │               3.4 │               1.4 │               0.3 │ setosa           │
│                 5 │               3.4 │               1.5 │               0.2 │ setosa           │
│               4.4 │               2.9 │               1.4 │               0.2 │ setosa           │
│               4.9 │               3.1 │               1.5 │               0.1 │ setosa           │
│               5.4 │               3.7 │               1.5 │               0.2 │ setosa           │
│               4.8 │               3.4 │               1.6 │               0.2 │ setosa           │
│               4.8 │                 3 │               1.4 │               0.1 │ setosa           │
│               4.3 │                 3 │               1.1 │               0.1 │ setosa           │
│               5.8 │                 4 │               1.2 │               0.2 │ setosa           │
│               5.7 │               4.4 │               1.5 │               0.4 │ setosa           │
│               5.4 │               3.9 │               1.3 │               0.4 │ setosa           │
│               5.1 │               3.5 │               1.4 │               0.3 │ setosa           │
│               5.7 │               3.8 │               1.7 │               0.3 │ setosa           │
│               5.1 │               3.8 │               1.5 │               0.3 │ setosa           │
│                 · │                 · │                 · │                 · │ ·                │
│                 · │                 · │                 · │                 · │ ·                │
│                 · │                 · │                 · │                 · │ ·                │
│               7.4 │               2.8 │               6.1 │               1.9 │ virginica        │
│               7.9 │               3.8 │               6.4 │                 2 │ virginica        │
│               6.4 │               2.8 │               5.6 │               2.2 │ virginica        │
│               6.3 │               2.8 │               5.1 │               1.5 │ virginica        │
│               6.1 │               2.6 │               5.6 │               1.4 │ virginica        │
│               7.7 │                 3 │               6.1 │               2.3 │ virginica        │
│               6.3 │               3.4 │               5.6 │               2.4 │ virginica        │
│               6.4 │               3.1 │               5.5 │               1.8 │ virginica        │
│                 6 │                 3 │               4.8 │               1.8 │ virginica        │
│               6.9 │               3.1 │               5.4 │               2.1 │ virginica        │
│               6.7 │               3.1 │               5.6 │               2.4 │ virginica        │
│               6.9 │               3.1 │               5.1 │               2.3 │ virginica        │
│               5.8 │               2.7 │               5.1 │               1.9 │ virginica        │
│               6.8 │               3.2 │               5.9 │               2.3 │ virginica        │
│               6.7 │               3.3 │               5.7 │               2.5 │ virginica        │
│               6.7 │                 3 │               5.2 │               2.3 │ virginica        │
│               6.3 │               2.5 │                 5 │               1.9 │ virginica        │
│               6.5 │                 3 │               5.2 │                 2 │ virginica        │
│               6.2 │               3.4 │               5.4 │               2.3 │ virginica        │
│               5.9 │                 3 │               5.1 │               1.8 │ virginica        │
│          150 rows │                   │                   │                   │                  │
│        (40 shown) │                   │                   │                   │                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

您还可以直接查询远程 ORC 文件：


```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format = > 'orc');
```
