---
title: What is Stage?
---

In Databend, a stage is a virtual location where data files reside. Files in a stage can be queried directly or loaded into a table. Alternatively, you can unload data from a table into a stage as a file. The beauty of using a stage is that you can access it for data loading and unloading as conveniently as you would with folders on your computer. Just as when you put a file in a folder, you don't necessarily need to know its exact location on your hard disk. When accessing a file in a stage, you only need to specify the stage name and the file name, such as `@mystage/mydatafile.csv`, rather than specifying its location in the bucket of your object storage. Similar to folders on your computer, you can create as many stages as you need in Databend. However, it's important to note that a stage cannot contain another stage. Each stage operates independently and does not encompass other stages. 

Utilizing a stage for loading data also improves the efficiency of uploading, managing, and filtering your data files. With [BendSQL](../../30-sql-clients/00-bendsql/index.md), you can easily upload or download files to or from a stage using a single command. When loading data into Databend, you can directly specify a stage in the COPY INTO command, allowing the command to read and even filter data files from that stage. Similarly, when exporting data from Databend, you can dump your data files into a stage.

## Stage Types

Based on the actual storage location and accessibility, stages can be categorized into these types: Internal Stage, External Stage, and User Stage. The following table summarizes the characteristics of different stage types in Databend, including their storage locations, accessibility, and recommended usage scenarios:

| Stage Type     | Storage Location                   | Accessibility                                   | When to Choose                                    |
|----------------|------------------------------------|-------------------------------------------------|---------------------------------------------------|
| Internal Stage | Object storage where Databend sits | Accessible to all users within the organization | Suitable for shared data within the organization  |
| External Stage | External object storage            | Accessible to all users within the organization | Ideal for integrating with external data sources  |
| User Stage     | Object storage where Databend sits | Accessible only to the respective user          | Perfect for personal data files or temporary data |

### Internal Stage

Files in an internal stage are actually stored in the object storage where Databend resides. An internal stage is accessible to all users within your organization, allowing each user to utilize the stage for their data loading or export tasks. Similar to creating a folder, specifying a name is necessary when creating a stage. Below is an example of creating an internal stage with the [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) command:

```sql
-- Create an internal stage named my_internal_stage
CREATE STAGE my_internal_stage;
```

### External Stage

An external stage enables you to specify an object storage location outside of where Databend resides. For instance, if you have datasets in a Google Cloud Storage container, you can create an external stage using that container. When creating an external stage, you must provide connection information for Databend to connect to the external location. 

Below is an example of creating an external stage. Let's say you have datasets in a bucket named `databend` in your object storage:

![alt text](@site/docs/public/img/guides/external-stage.png)

You can create an external stage with the [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) command to connect Databend to that bucket:

```sql
-- Create an external stage named my_external_stage
CREATE STAGE my_external_stage 
    URL = 's3://databend'
    CONNECTION = (
        ENDPOINT_URL = '<YOUR_STORAGE_ENDPOINT>',
        AWS_KEY_ID = '<YOUR-KEY-ID>',
        AWS_SECRET_KEY = '<YOUR-SECRET-KEY>'
    );
```

Once the external stage is created, you can access the datasets from Databend. For example, to list the files:

```sql
LIST @my_external_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         name        │    size   │                 md5                │         last_modified         │      creator     │
├─────────────────────┼───────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ UserBehavior.csv.gz │ 949805035 │ "604e9e2c1915732d66d36853e43c1a0d" │ 2023-10-29 03:28:49.853 +0000 │ NULL             │
│ books.parquet       │       998 │ "88432bf90aadb79073682988b39d461c" │ 2023-04-24 20:00:22.171 +0000 │ NULL             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Please note that the external storage must be one of the object storage solutions supported by Databend. The [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) command page provides examples on how to specify connection information for commonly used object storage solutions.

### User Stage

The user stage can be considered a special type of internal stage: Files in the user stage are stored in the object storage where Databend resides but cannot be accessed by other users. Each user has their own user stage out-of-the-box, and you do not need to create or name your user stage before use. Additionally, you cannot remove your user stage.

The user stage can serve as a convenient repository for your data files that do not need to be shared with others. To access your user stage, use `@~`. For example, to list all the files in your stage:

```sql
LIST @~;
```

## Managing Stages

Databend provides a variety of commands to assist you in managing stages and the files staged within them:

- [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage): Creates a stage. 
- [DROP STAGE](/sql/sql-commands/ddl/stage/ddl-drop-stage): Removes a stage.
- [DESC STAGE](/sql/sql-commands/ddl/stage/ddl-desc-stage): Shows the properties of a stage.
- [SHOW STAGES](/sql/sql-commands/ddl/stage/ddl-show-stages): Returns a list of the created stages.
- [LIST FILES](/sql/sql-commands/ddl/stage/ddl-list-stage): Returns a list of the staged files in a stage. Alternatively, the table function [LIST_STAGE](/sql/sql-functions/table-functions/list-stage) offers similar functionality with added flexibility to obtain specific file information.
- [REMOVE FILES](/sql/sql-commands/ddl/stage/ddl-remove-stage): Removes staged files from a stage.

Please note that some of the commands above do not apply to the user stage. See the table below for details:

| Stage          | CREATE STAGE | DROP STAGE | DESC STAGE | LIST FILES | REMOVE FILES | SHOW STAGES |
|----------------|--------------|------------|------------|------------|--------------|-------------|
| User Stage     | No           | No         | Yes        | Yes        | Yes          | No          |
| Internal Stage | Yes          | Yes        | Yes        | Yes        | Yes          | Yes         |
| External Stage | Yes          | Yes        | Yes        | Yes        | Yes          | Yes         |