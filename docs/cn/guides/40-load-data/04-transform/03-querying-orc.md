---
title: 在Stage中查询ORC文件
sidebar_label: 查询ORC文件
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

在本教程中，我们将引导您完成以下步骤：下载 Iris 数据集（ORC 格式），将其上传至 Amazon S3 桶，创建外部 Stage，并直接从 ORC 文件查询数据。

<StepsWrap>
<StepContent number="1">

### 下载 Iris 数据集

从https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc下载Iris数据集，然后将其上传至您的Amazon S3 桶。

Iris 数据集包含 3 类，每类 50 个实例，每类代表一种鸢尾植物。它有 4 个属性：(1) 萼片长度，(2) 萼片宽度，(3) 花瓣长度，(4) 花瓣宽度，最后一列包含类别标签。

</StepContent>
<StepContent number="2">

### 创建外部 Stage

创建一个外部 Stage，指向存储您的 Iris 数据集文件的 Amazon S3 桶。

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

```sql
SELECT * FROM orc_table;
```

这将直接从远程的 ORC 文件中检索数据。

```sql
SELECT
  *
FROM
  'https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc' (file_format => 'orc');
```

</StepContent>
</StepsWrap>
