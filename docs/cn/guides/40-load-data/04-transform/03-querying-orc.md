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

在本教程中，我们将引导您完成以下步骤：下载Iris数据集（ORC格式），将其上传至Amazon S3桶，创建外部Stage，并直接从ORC文件查询数据。

<StepsWrap>
<StepContent number="1">

### 下载Iris数据集

从https://github.com/tensorflow/io/raw/master/tests/test_orc/iris.orc下载Iris数据集，然后将其上传至您的Amazon S3桶。

Iris数据集包含3类，每类50个实例，每类代表一种鸢尾植物。它有4个属性：(1) 萼片长度，(2) 萼片宽度，(3) 花瓣长度，(4) 花瓣宽度，最后一列包含类别标签。

</StepContent>
<StepContent number="2">

### 创建外部Stage

创建一个外部Stage，指向存储您的Iris数据集文件的Amazon S3桶。

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

### 查询ORC文件

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