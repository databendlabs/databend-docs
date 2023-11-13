---
title: Table
---

This page compiles crucial insights into table operations, serving as a comprehensive guide for you navigating the intricacies of working with tables in Databend. It strings together essential table-related commands to provide a cohesive understanding of key considerations in table management.

## Table Creation Essentials

It is a good idea to to familiarize yourself with the following topics before proceeding to create a table.

### 1. Understanding Table Types

Databend supports two types of tables based on their Time Travel support:

- **General Tables (Default)**: These tables inherently support Time Travel, allowing you to trace and retrieve historical data. This feature is valuable for data analysis and auditing.

- **Transient Tables**: In contrast, transient tables do not support Time Travel. They are designed for scenarios where historical data tracking is not necessary. To create a transient table, you must explicitly specify the keyword TRANSIENT in the [CREATE TABLE](10-ddl-create-table.md) command. For more information, see [CREATE TRANSIENT TABLE](10-ddl-create-table.md#create-transient-table).

### 2. Selecting Table Storage

Databend defaults to storing table data in the location configured in the [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file. Additionally, it provides the flexibility to store table data in a different bucket, deviating from the default setting. For more information, see [CREATE TABLE ... EXTERNAL_LOCATION](10-ddl-create-table.md#create-table--external_location).

### 3. Defining Table Structure

The primary method to define columns in a table is through the [CREATE TABLE](10-ddl-create-table.md#create-table) command, where you list your columns one by one. Please note that Computed Columns are supported as an Enterprise Edition feature in Databend. For more information, see [Computed Columns](10-ddl-create-table.md#computed-columns).

Databend also offers convenient methods for creating tables by copying column structures and even data from existing tables:

- [CREATE TABLE ... LIKE](10-ddl-create-table.md#create-table--like): Creates a table with the same column definitions as an existing one.
- [CREATE TABLE ... AS](10-ddl-create-table.md#create-table--as): Creates a table and inserts data based on the results of a SELECT query.
- [ATTACH TABLE](92-attach-table.md): Creates a table by associating it with an existing table.

### 4. Setting Cluster Key for Big Tables

[Cluster Key](../70-clusterkey/index.md) is designed to enhance query performance by physically organizing data in proximity. Databend recommends configuring cluster keys, especially for large tables encountering sluggish query performance. For the syntax to set a cluster key during table creation, see [SET CLUSTER KEY](../70-clusterkey/dml-set-cluster-key.md).

## Routine Table Maintenance

Once your table is created, you gain the foundation for organizing and managing your data effectively. With this structure in place, you can seamlessly execute various commands to enhance, modify, or extract information from your table. Whether it's adjusting column properties, fine-tuning configurations, or querying data, Databend provides a versatile set of tools to meet your evolving needs.

- [DESCRIBE TABLE](50-describe-table.md), [SHOW FIELDS](show-fields.md): Shows information about the columns in a given table.
- [SHOW FULL COLUMNS](show-full-columns.md): Retrieves comprehensive details about the columns in a given table.
- [SHOW CREATE TABLE](show-create-table.md): Shows the CREATE TABLE statement that creates the named table.
- [SHOW DROP TABLES](show-drop-tables.md): Lists the dropped tables in the current or a specified database.
- [SHOW TABLE STATUS](show-table-status.md): Shows the status of the tables in a database.
- [SHOW TABLES](show-tables.md): Lists the tables in the current or a specified database.
- [ALTER TABLE COLUMN](90-alter-table-column.md): Modifies the structure of a table by making changes to its columns. 
- [ALTER TABLE OPTION](90-alter-table-option.md): Modifies the Fuse engine [Options](../../../13-sql-reference/30-table-engines/00-fuse.md#options) of a table.
- [RENAME TABLE](30-ddl-rename-table.md): Changes the name of a table.

## Table Deletion & Recovery Strategies

Databend provides a variety of commands for deleting a table or vacuuming the table data. The table below compares these commands, which may initially seem complex, outlining any associated recovery options for each operation.

| Command           | Enterprise Edition? | Description                                                        | Recovery        |
|-------------------|---------------------|--------------------------------------------------------------------|-----------------|
| [TRUNCATE TABLE](40-ddl-truncate-table.md)   | No                  | Removes all data from a table while preserving the table's schema. | [FLASHBACK TABLE](70-flashback-table.md) |
| [DROP TABLE](20-ddl-drop-table.md)        | No                  | Deletes a table.                                                   | [UNDROP TABLE](21-ddl-undrop-table.md)    |
| [VACUUM TABLE](91-vacuum-table.md)      | Yes                 | Permanently removes historical data files of a table.              | Not applicable. |
| [VACUUM DROP TABLE](91-vacuum-drop-table.md) | Yes                 | Permanently removes data files of dropped tables.                  | Not applicable. |


## Advanced Table Optimization Techniques

Tables in Databend might need optimizations over time to ensure efficient performance and storage utilization. In this case, the following commands can help you out:

:::note
Table Optimization is an advanced-level operation. Databend recommends carefully reading the links below and understanding the optimization process before proceeding to avoid potential data loss.
:::

- [ANALYZE TABLE](80-analyze-table.md): Calculates table statistics.
- [OPTIMIZE TABLE](60-optimize-table.md): Involves compacting or purging historical data to save storage space and enhance query performance.