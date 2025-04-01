The `FUSE_TIME_TRAVEL_SIZE` function in Databend allows you to calculate the storage size of historical data (for Time Travel) for tables. Here's a comprehensive explanation of its usage:

## Syntax Options

1. **All tables in all databases**:
```sql
SELECT * FROM fuse_time_travel_size();
```

2. **All tables in a specific database**:
```sql
SELECT * FROM fuse_time_travel_size('<database_name>');
```

3. **Specific table in a specific database**:
```sql
SELECT * FROM fuse_time_travel_size('<database_name>', '<table_name>');
```

## Output Columns

| Column | Description |
|--------|-------------|
| `database_name` | Database where the table is located |
| `table_name` | Name of the table |
| `is_dropped` | Whether the table has been dropped (`true`/`false`) |
| `time_travel_size` | Total size of historical data in bytes |
| `latest_snapshot_size` | Size of latest snapshot in bytes |
| `data_retention_period_in_hours` | Retention period for Time Travel data (NULL means default policy) |
| `error` | Any error encountered (NULL if no error) |

## Example Usage

```sql
-- Check historical data for all tables in 'default' database
SELECT * FROM fuse_time_travel_size('default');

-- Results might look like:
┌───────────────┬────────────┬────────────┬──────────────────┬──────────────────────┬────────────────────────────────┬───────┐
│ database_name │ table_name │ is_dropped │ time_travel_size │ latest_snapshot_size │ data_retention_period_in_hours │ error │
├───────────────┼────────────┼────────────┼──────────────────┼──────────────────────┼────────────────────────────────┼───────┤
│ default       │ books      │ true       │             2810 │                 1490 │                           NULL │ NULL  │
│ default       │ customers  │ false      │             5120 │                 2048 │                             24 │ NULL  │
└───────────────┴────────────┴────────────┴──────────────────┴──────────────────────┴────────────────────────────────┴───────┘
```

## Key Points

1. The function helps monitor storage usage for Time Travel features
2. You can identify dropped tables (`is_dropped = true`)
3. The `data_retention_period_in_hours` shows custom retention settings (NULL means using default)
4. Errors during calculation will appear in the `error` column

This function is particularly useful for database administrators to manage storage costs and understand historical data retention patterns.