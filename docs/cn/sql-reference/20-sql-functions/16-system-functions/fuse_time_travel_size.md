The `FUSE_TIME_TRAVEL_SIZE` function in Databend allows you to calculate the storage size of historical data (for Time Travel) for tables. Here's a comprehensive explanation:

## Syntax

```sql
-- All tables in all databases
SELECT * FROM fuse_time_travel_size();

-- All tables in a specific database
SELECT * FROM fuse_time_travel_size('<database_name>');

-- Specific table in a specific database
SELECT * FROM fuse_time_travel_size('<database_name>', '<table_name>');
```

## Output Columns

| Column                           | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `database_name`                  | Database name containing the table                                          |
| `table_name`                     | Name of the table                                                           |
| `is_dropped`                     | Whether the table has been dropped (`true`/`false`)                         |
| `time_travel_size`               | Total size of historical Time Travel data (bytes)                           |
| `latest_snapshot_size`           | Size of the latest table snapshot (bytes)                                   |
| `data_retention_period_in_hours` | Retention period for Time Travel data (NULL = default policy)               |
| `error`                          | Error message if any occurred (NULL if successful)                          |

## Example Usage

1. Check Time Travel data size for all tables in the 'default' database:

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

2. Check Time Travel data for a specific table:

```sql
SELECT * FROM fuse_time_travel_size('default', 'books');
```

## Notes

- Introduced or updated in version v1.2.684
- For dropped tables (`is_dropped=true`), the function still returns their historical data size
- `NULL` in `data_retention_period_in_hours` means the default retention policy applies
- The function helps monitor storage usage for Time Travel features