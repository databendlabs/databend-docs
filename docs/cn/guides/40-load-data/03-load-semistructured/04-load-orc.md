---
title: 将 ORC 文件加载到 Databend
sidebar_label: ORC
---

## 什么是 ORC？

ORC (Optimized Row Columnar) 是一种列式存储格式，常用于数据分析。

## 加载 ORC 文件

加载 ORC 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = ORC)
```

- 更多 ORC 文件格式选项请参考 [ORC 文件格式选项](/sql/sql-reference/file-format-options#orc-options)
- 更多 COPY INTO 表选项请参考 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从 ORC 文件加载数据

本教程演示如何将 S3 存储桶中的 ORC 文件数据加载到 Databend 表中。

### 步骤 1. 创建外部阶段

创建指向 S3 存储桶中 ORC 文件的外部阶段：

```sql
CREATE OR REPLACE CONNECTION aws_s3
    STORAGE_TYPE='s3'
    ACCESS_KEY_ID='your-ak'
    SECRET_ACCESS_KEY='your-sk';

CREATE OR REPLACE STAGE orc_data_stage
    URL='s3://wizardbend/sample-data/orc/'
    CONNECTION=(CONNECTION_NAME='aws_s3');
```

列出阶段中的文件：

```sql
LIST @orc_data_stage;
```

结果：

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │                 md5                │         last_modified         │      creator     │
├───────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ README.txt    │    494 │ "72529dd37b12faf08b090f941507a4f4" │ 2024-06-05 03:05:02.000 +0000 │ NULL             │
│ userdata1.orc │  47448 │ "1595b4de335ac1825af2b846e82fbf48" │ 2024-06-05 03:05:36.000 +0000 │ NULL             │
│ userdata2.orc │  46545 │ "8a8a1db8475a46365fcb3bcf773fa703" │ 2024-06-05 03:06:47.000 +0000 │ NULL             │
│ userdata3.orc │  47159 │ "fb8a92554f90c9385388bd91eb1a25f1" │ 2024-06-05 03:12:52.000 +0000 │ NULL             │
│ userdata4.orc │  47219 │ "222b1fbde459fd9233f5da5613dbcfa1" │ 2024-06-05 03:13:05.000 +0000 │ NULL             │
│ userdata5.orc │  47206 │ "f12d768b5d210f488dcf55ed86ceaca6" │ 2024-06-05 03:13:16.000 +0000 │ NULL             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 2：查询阶段文件

创建 ORC 文件格式并查询阶段数据及结构：

```sql
-- 创建 ORC 文件格式
CREATE OR REPLACE FILE FORMAT orc_ff TYPE = 'ORC';

SELECT *
FROM @orc_data_stage (
    FILE_FORMAT => 'orc_ff',
    PATTERN => '.*[.]orc'
) t
LIMIT 10;
```

结果：

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        _col0        │      _col1      │       _col2      │       _col3      │           _col4          │       _col5      │       _col6      │       _col7      │          _col8         │       _col9      │       _col10      │          _col11          │      _col12      │
├─────────────────────┼─────────────────┼──────────────────┼──────────────────┼──────────────────────────┼──────────────────┼──────────────────┼──────────────────┼────────────────────────┼──────────────────┼───────────────────┼──────────────────────────┼──────────────────┤
│ 2016-02-03 07:55:29 │               1 │ Amanda           │ Jordan           │ ajordan0@com.com         │ Female           │ 1.197.201.2      │ 6759521864920116 │ Indonesia              │ 3/8/1971         │          49756.53 │ Internal Auditor         │ 1E+02            │
│ 2016-02-03 17:04:03 │               2 │ Albert           │ Freeman          │ afreeman1@is.gd          │ Male             │ 218.111.175.34   │                  │ Canada                 │ 1/16/1968        │         150280.17 │ Accountant IV            │                  │
│ 2016-02-03 01:09:31 │               3 │ Evelyn           │ Morgan           │ emorgan2@altervista.org  │ Female           │ 7.161.136.94     │ 6767119071901597 │ Russia                 │ 2/1/1960         │         144972.51 │ Structural Engineer      │                  │
│ 2016-02-03 00:36:21 │               4 │ Denise           │ Riley            │ driley3@gmpg.org         │ Female           │ 140.35.109.83    │ 3576031598965625 │ China                  │ 4/8/1997         │          90263.05 │ Senior Cost Accountant   │                  │
│ 2016-02-03 05:05:31 │               5 │ Carlos           │ Burns            │ cburns4@miitbeian.gov.cn │                  │ 169.113.235.40   │ 5602256255204850 │ South Africa           │                  │              NULL │                          │                  │
│ 2016-02-03 07:22:34 │               6 │ Kathryn          │ White            │ kwhite5@google.com       │ Female           │ 195.131.81.179   │ 3583136326049310 │ Indonesia              │ 2/25/1983        │          69227.11 │ Account Executive        │                  │
│ 2016-02-03 08:33:08 │               7 │ Samuel           │ Holmes           │ sholmes6@foxnews.com     │ Male             │ 232.234.81.197   │ 3582641366974690 │ Portugal               │ 12/18/1987       │          14247.62 │ Senior Financial Analyst │                  │
│ 2016-02-03 06:47:06 │               8 │ Harry            │ Howell           │ hhowell7@eepurl.com      │ Male             │ 91.235.51.73     │                  │ Bosnia and Herzegovina │ 3/1/1962         │         186469.43 │ Web Developer IV         │                  │
│ 2016-02-03 03:52:53 │               9 │ Jose             │ Foster           │ jfoster8@yelp.com        │ Male             │ 132.31.53.61     │                  │ South Korea            │ 3/27/1992        │         231067.84 │ Software Test Engineer I │ 1E+02            │
│ 2016-02-03 18:29:47 │              10 │ Emily            │ Stewart          │ estewart9@opensource.org │ Female           │ 143.28.251.245   │ 3574254110301671 │ Nigeria                │ 1/28/1997        │          27234.28 │ Health Coach IV          │                  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4：创建目标表

在 Databend 中创建目标表存储 ORC 文件数据，并选取部分列：

```sql
CREATE OR REPLACE TABLE orc_test_table (
    firstname STRING,
    lastname STRING,
    email STRING,
    gender STRING,
    country STRING
);
```

### 步骤 5. 使用 SELECT 复制数据

将外部阶段中的 ORC 文件数据复制到目标表：

```sql
COPY INTO orc_test_table
FROM (
    SELECT _col2, _col3, _col4, _col5, _col8
    FROM @orc_data_stage
)
PATTERN = '.*[.]orc'
FILE_FORMAT = (TYPE = ORC);
```

结果：

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│      File     │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├───────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ userdata1.orc │        1000 │           0 │ NULL             │             NULL │
│ userdata2.orc │        1000 │           0 │ NULL             │             NULL │
│ userdata3.orc │        1000 │           0 │ NULL             │             NULL │
│ userdata4.orc │        1000 │           0 │ NULL             │             NULL │
│ userdata5.orc │        1000 │           0 │ NULL             │             NULL │
└─────────────────────────────────────────────────────────────────────────────────┘
```