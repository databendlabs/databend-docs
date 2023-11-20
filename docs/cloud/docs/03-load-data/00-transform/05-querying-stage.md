---
title: Querying Staged Files
---


Databend allows you to directly query data in the files stored in one of the following locations without loading them into a table:

- User stage, internal stage, or external stage.
- Bucket or container created within your object storage, such as Amazon S3, Google Cloud Storage, and Microsoft Azure.
- Remote servers accessible via HTTPS.

This feature can be particularly useful for inspecting or viewing the contents of staged files, whether it's before or after loading data.

## Syntax and Parameters

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] FROM
{@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} [(
  [ PATTERN => '<regex_pattern>']
  [ FILE_FORMAT => '<format_name>']
  [ FILES => ( 'file_name' [ , 'file_name' ... ] ) ]
  [ ENDPOINT_URL => <'url'> ]
  [ AWS_KEY_ID => <'aws_key_id'> ]
  [ AWS_KEY_SECRET => <'aws_key_secret'> ]
  [ ACCESS_KEY_ID => <'access_key_id'> ]
  [ ACCESS_KEY_SECRET => <'access_key_secret'> ]
  [ SECRET_ACCESS_KEY => <'secret_access_key'> ]
  [ SESSION_TOKEN => <'session_token'> ]
  [ REGION => <'region'> ]
  [ ENABLE_VIRTUAL_HOST_STYLE => true|false ]
)]
```

### FILE_FORMAT

The file format must be one of the following:

- Built-in file format, see [Input & Output File Formats](/sql/sql-reference/file-format-options).
- Named file format created by [CREATE FILE FORMAT](/sql/sql-commands/ddl/file-format/ddl-create-file-format).

Please note that when you need to query or perform a COPY INTO operation from a staged file, it is necessary to explicitly specify the file format during the creation of the stage. Otherwise, the default format, Parquet, will be applied. See an example below:

```sql
CREATE STAGE my_stage FILE_FORMAT = (TYPE = CSV);
```
In cases where you have staged a file in a format different from the specified stage format, you can explicitly specify the file format within the SELECT or COPY INTO statement. Here are examples:

```sql
SELECT * FROM @my_stage (FILE_FORMAT=>'NDJSON');

COPY INTO my_table FROM (SELECT * SELECT @my_stage t) FILE_FORMAT = (TYPE = NDJSON);
```

### PATTERN

The PATTERN option allows you to specify a [PCRE2](https://www.pcre.org/current/doc/html/)-based regular expression pattern enclosed in single quotes to match file names. It is used to filter and select files based on the provided pattern. For example, you can use a pattern like '.*parquet' to match all file names ending with "parquet". For detailed information on the PCRE2 syntax, you can refer to the documentation available at http://www.pcre.org/current/doc/html/pcre2syntax.html.

### FILES

The FILES option, on the other hand, enables you to explicitly specify one or more file names separated by commas. This option allows you to directly filter and query data from specific files within a folder. For example, if you want to query data from the Parquet files "books-2023.parquet", "books-2022.parquet", and "books-2021.parquet", you can provide these file names within the FILES option.

### table_alias

When working with staged files in a SELECT statement where no table name is available, you can assign an alias to the files. This allows you to treat the files as a table, with its fields serving as columns within the table. This is useful when working with multiple tables within the SELECT statement or when selecting specific columns. Here's an example:

```sql
-- The alias 't1' represents the staged file, while 't2' is a regular table
SELECT t1.$1, t2.$2 FROM @my_stage t1, t2;
```

### $<col_position>

When selecting from a staged file, you can use column positions, and these positions start from 1. At present, the feature to utilize column positions for SELECT operations from staged files is limited to Parquet, NDJSON, CSV, and TSV formats. 

```sql
SELECT $2 FROM @my_stage (FILES=>('sample.csv')) ORDER BY $1;
```

It is important to note that when working with NDJSON, only $1 is allowed, representing the entire row and having the data type Variant. To select a specific field, use `$1:<field_name>`.

```sql
-- Select the entire row using column position:
SELECT $1 FROM @my_stage (FILE_FORMAT=>'NDJSON')

--Select a specific field named "a" using column position:
SELECT $1:a FROM @my_stage (FILE_FORMAT=>'NDJSON')
```

When using COPY INTO to copy data from a staged file, Databend matches the field names at the top level of the NDJSON file with the column names in the destination table, rather than relying on column positions. In the example below, the table *my_table* should have identical column definitions as the top-level field names in the NDJSON files:

```sql
COPY INTO my_table FROM (SELECT $1 SELECT @my_stage t) FILE_FORMAT = (type = NDJSON)
```

### Others

To query data files in a bucket or container, provide necessary connection information with the following parameters:

- ENDPOINT_URL
- AWS_KEY_ID
- AWS_SECRET_KEY
- ACCESS_KEY_ID
- ACCESS_KEY_SECRET
- SECRET_ACCESS_KEY
- SESSION_TOKEN
- REGION
- ENABLE_VIRTUAL_HOST_STYLE

They are explained in [Create Stage](/sql/sql-commands/ddl/stage/ddl-create-stage).

:::tip
If you're using S3 storage and your bucket has public read access, you can access and query an external stage associated with the bucket anonymously without providing credentials. To enable this feature, add the **allow_anonymous** parameter to the [storage.s3] section in the *databend-query.toml* configuration file and set it to **true**.
:::

## Limitations

When querying a staged file, the following limitations are applicable in terms of format-specific constraints:

- Selecting all fields with the symbol * is only supported for Parquet files.
- When selecting from a CSV or TSV file, all fields are parsed as strings, and the SELECT statement only allows the use of column positions. Additionally, there is a restriction on the number of fields in the file, which must not exceed max.N+1000. For example, if the statement is `SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`, the sample.csv file can have a maximum of 1,002 fields.

## Examples

### Example 1: Querying Data in a Parquet File

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This example shows how to query data in a Parquet file stored in different locations. Click the tabs below to see details.

<Tabs groupId="query2stage">
<TabItem value="Stages" label="Stages">

Let's assume you have a sample file named [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) and you have uploaded it to your user stage, an internal stage named *my_internal_stage*, and an external stage named *my_external_stage*. To upload files to a stage, use the [PRESIGN](/sql/sql-commands/ddl/presign/presign) method.

```sql
-- Query file in user stage
SELECT * FROM @~/books.parquet;

-- Query file in internal stage
SELECT * FROM @my_internal_stage/books.parquet;

-- Query file in external stage
SELECT * FROM @my_external_stage/books.parquet;
```
</TabItem>
<TabItem value="Bucket" label="Bucket">

Let's assume you have a sample file named [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) stored in a bucket named *databend-toronto* on Amazon S3 in the region *us-east-2*. You can query the data by specifying the connection parameters:

```sql
SELECT *  FROM 's3://databend-toronto' 
(
 access_key_id => '<your-access-key-id>', 
 secret_access_key => '<your-secret-access-key>',
 endpoint_url => 'https://databend-toronto.s3.us-east-2.amazonaws.com',
 region => 'us-east-2',
 files => ('books.parquet')
);  
```
</TabItem>
<TabItem value="Remote" label="Remote">

Let's assume you have a sample file named [books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet) stored in a remote server. You can query the data by specifying the file URI:

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```
</TabItem>
</Tabs>

### Example 2: Filtering Files

Let's assume you have the following Parquet files with the same schema, as well as some files of other formats, stored in a bucket named *databend-toronto* on Amazon S3 in the region *us-east-2*. 

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

To query data from all Parquet files in the folder, you can use the PATTERN option:

```sql
SELECT * FROM 's3://databend-toronto' 
(
 access_key_id => '<your-access-key-id>', 
 secret_access_key => '<your-secret-access-key>',
 endpoint_url => 'https://databend-toronto.s3.us-east-2.amazonaws.com',
 region => 'us-east-2', 
 pattern => '.*parquet'
); 
```

To query data from the Parquet files "books-2023.parquet", "books-2022.parquet", and "books-2021.parquet" in the folder, you can use the FILES option:

```sql
SELECT * FROM 's3://databend-toronto' 
(
 access_key_id => '<your-access-key-id>', 
 secret_access_key => '<your-secret-access-key>',
 endpoint_url => 'https://databend-toronto.s3.us-east-2.amazonaws.com',
 region => 'us-east-2',
 files => ('books-2023.parquet','books-2022.parquet','books-2021.parquet')
); 
```