---
title: LIST STAGE FILES
sidebar_position: 4
---

Lists files in a stage.

See also:

- [LIST_STAGE](../../../20-sql-functions/17-table-functions/03-list-stage.md): This function lists files in a stage and allows you to filter files in a stage based on their extensions and obtain comprehensive details about each file.
- [PRESIGN](presign.md): Databend recommends using the Presigned URL method to upload files to the stage.
- [REMOVE STAGE FILES](05-ddl-remove-stage.md): Removes files from a stage.

## Syntax

```sql
LIST { userStage | internalStage | externalStage } [ PATTERN = '<regex_pattern>' ]
```

## Examples

The stage below contains a file named **books.parquet** and a folder named **2023**.

![Alt text](/img/sql/list-stage.png)

And the folder **2023** contains the following files:

![Alt text](/img/sql/list-stage-2.png)

The LIST command lists all the files in a stage by default:

```sql
LIST @my_internal_stage;
+-----------------+------+------------------------------------+-------------------------------+---------+
|      name       | size |                md5                 |         last_modified         | creator |
+-----------------+------+------------------------------------+-------------------------------+---------+
| 2023/meta.log   |  475 | "4208ff530b252236e14b3cd797abdfbd" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/query.log  | 1348 | "1c6654b207472c277fc8c6207c035e18" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/readme.txt | 1193 | "8c0fbbebfedf26f93324541f97f5ac14" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| books.parquet   |  998 | "88432bf90aadb79073682988b39d461c" | 2023-04-19 20:08:42.000 +0000 | NULL    |
+-----------------+------+------------------------------------+-------------------------------+---------+
```

To list the files in the folder **2023**, run the following command:

:::note
It is necessary to add a slash "/" at the end of the path in the command, otherwise, the command may not work as expected and may result in an error.
:::

```sql
LIST @my_internal_stage/2023/;
+-----------------+------+------------------------------------+-------------------------------+---------+
|      name       | size |                md5                 |         last_modified         | creator |
+-----------------+------+------------------------------------+-------------------------------+---------+
| 2023/meta.log   |  475 | "4208ff530b252236e14b3cd797abdfbd" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/query.log  | 1348 | "1c6654b207472c277fc8c6207c035e18" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/readme.txt | 1193 | "8c0fbbebfedf26f93324541f97f5ac14" | 2023-04-19 20:23:24.000 +0000 | NULL    |
+-----------------+------+------------------------------------+-------------------------------+---------+
```

To list all the files with the extension *.log in the stage, run the following command:

```sql
LIST @my_internal_stage PATTERN = '.log';
+----------------+------+------------------------------------+-------------------------------+---------+
|      name      | size |                md5                 |         last_modified         | creator |
+----------------+------+------------------------------------+-------------------------------+---------+
| 2023/meta.log  |  475 | "4208ff530b252236e14b3cd797abdfbd" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/query.log | 1348 | "1c6654b207472c277fc8c6207c035e18" | 2023-04-19 20:23:24.000 +0000 | NULL    |
+----------------+------+------------------------------------+-------------------------------+---------+
```