The `FUSE_TIME_TRAVEL_SIZE` function in Databend allows you to calculate the storage size of historical data (for Time Travel) for tables. Here's a detailed explanation of its usage:

## Syntax

```sql
-- All tables in all databases
SELECT * FROM fuse_time_travel_size();

-- All tables in a specific database
SELECT * FROM fuse_time_travel_size('<database_name>');

-- Specific table in a database
SELECT * FROM fuse_time_travel_size('<database_name>', '<table_name>');
```

## Output Columns

| Column                           | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `database_name`                  | Database name where the table is located                                    |
| `table_name`                     | Name of the table                                                           |
| `is_dropped`                     | Whether the table has been dropped (`true`/`false`)                         |
| `time_travel_size`               | Total size of historical data in bytes                                      |
| `latest_snapshot_size`           | Size of the latest table snapshot in bytes                                  |
| `data_retention_period_in_hours` | Retention period for Time Travel data (NULL means default policy)           |
| `error`                          | Error message if any occurred (NULL if no errors)                           |

## Example Usage

1. Check historical data size for all tables in the 'default' database:

```sql
SELECT * FROM fuse_time_travel_size('default');
```

Sample output:
```
┌───────────────┬────────────┬────────────┬──────────────────┬──────────────────────┬────────────────────────────────┬───────┐
│ database_name │ table_name │ is_dropped │ time_travel_size │ latest_snapshot_size │ data_retention_period_in_hours │ error │
├───────────────┼────────────┼────────────┼──────────────────┼──────────────────────┼────────────────────────────────┼───────┤
│ default       │ books      │ true       │             2810 │                 1490 │                           NULL │ NULL  │
└───────────────┴────────────┴────────────┴──────────────────┴──────────────────────┴────────────────────────────────┴───────┘
```

2. Check historical data for a specific table:

```sql
SELECT * FROM fuse_time_travel_size('default', 'books');
```

## Notes

- Introduced or updated in version v1.2.684
- Helps monitor storage usage for Time Travel feature
- Useful for managing data retention policies and storage costs
- The function returns one row per table with detailed storage information