---
title: Data Purge and Recycle
sidebar_label: Data Recycle
---

In Databend, the data is not truly deleted when you run `DROP`, `TRUNCATE`, or `DELETE` commands, allowing for time travel back to previous states.

There are two types of data:

- **History Data**: Used by Time Travel to store historical data or data from dropped tables.
- **Temporary Data**: Used by the system to store spilled data.

If the data size is significant, you can run several commands ([Enterprise Edition Features](/guides/overview/editions/dee/enterprise-features)) to delete these data and free up storage space.

## Purge Drop Table Data

Deletes data files of all dropped tables, freeing up storage space.

```sql
VACUUM DROP TABLE;
```

See more [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table).

## Purge Table History Data

Removes historical data for a specified table, clearing old versions and freeing storage.

```sql
VACUUM TABLE <table_name>;
```

See more [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table).

## Purge Temporary Data

Clears temporary spilled files used for joins, aggregates, and sorts, freeing up storage space.

```sql
VACUUM TEMPORARY FILES;
```

See more [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files).
