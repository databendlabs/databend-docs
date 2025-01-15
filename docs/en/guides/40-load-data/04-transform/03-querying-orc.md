---
title: Querying Staged ORC Files in Stage
sidebar_label: ORC
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

## Syntax

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

## Tutorial

In this tutorial, we will walk you through the process of downloading the Iris dataset in ORC format, uploading it to an Amazon S3 bucket, creating an external stage, and querying the data directly from the ORC file.

<StepsWrap>
<StepContent number="1">

### Download Iris Dataset

Download the iris dataset from https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc then upload it to your Amazon S3 bucket.

The iris dataset contains 3 classes of 50 instances each, where each class refers to a type of iris plant. It has 4 attributes: (1) sepal length, (2) sepal width, (3) petal length, (4) petal width, and the last column contains the class label.

</StepContent>
<StepContent number="2">

### Create External Stage

Create an external stage with your Amazon S3 bucket where your iris dataset file is stored.

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

### Query ORC File

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

You can also query the remote ORC file directly:

```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format = > 'orc');
```

</StepContent>
</StepsWrap>