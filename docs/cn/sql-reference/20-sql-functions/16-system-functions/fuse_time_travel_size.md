Here's the documentation for the `fuse_time_travel_size` function in a professional format:

---

# fuse_time_travel_size

<FunctionDescription description="Introduced or updated: v1.2.684"/>

The `fuse_time_travel_size` function calculates the storage size of historical data (for Time Travel) for tables in Databend.

## Syntax

```sql
-- Calculate historical data size for all tables in all databases
SELECT * FROM fuse_time_travel_size();

-- Calculate historical data size for all tables in a specified database
SELECT * FROM fuse_time_travel_size('<database_name>');

-- Calculate historical data size for a specific table
SELECT * FROM fuse_time_travel_size('<database_name>', '<table_name>');
```

## Output Columns

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| `database_name` | String | Name of the database containing the table |
| `table_name` | String | Name of the table |
| `is_dropped` | Boolean | `true` if the table has been dropped, `false` otherwise |
| `time_travel_size` | UInt64 | Total size of historical data (Time Travel) in bytes |
| `latest_snapshot_size` | UInt64 | Size of the latest table snapshot in bytes |
| `data_retention_period_in_hours` | Nullable(UInt64) | Retention period for Time Travel data in hours (NULL means using default policy) |
| `error` | Nullable(String) | Error message if any occurred during calculation |

## Examples

### Calculate Time Travel size for all tables in the 'default' database

```sql
SELECT * FROM fuse_time_travel_size('default');
```

Result:
```
┌───────────────┬────────────┬────────────┬──────────────────┬──────────────────────┬────────────────────────────────┬───────┐
│ database_name │ table_name │ is_dropped │ time_travel_size │ latest_snapshot_size │ data_retention_period_in_hours │ error │
├───────────────┼────────────┼────────────┼──────────────────┼──────────────────────┼────────────────────────────────┼───────┤
│ default       │ books      │ true       │             2810 │                 1490 │                           NULL │ NULL  │
└───────────────┴────────────┴────────────┴──────────────────┴──────────────────────┴────────────────────────────────┴───────┘
```

### Calculate Time Travel size for a specific table

```sql
SELECT * FROM fuse_time_travel_size('default', 'books');
```

## Notes

- The function requires appropriate privileges to access table metadata
- The `time_travel_size` includes all historical versions of the table data
- A NULL `data_retention_period_in_hours` indicates the table inherits the system default retention policy
- Dropped tables will still appear in results with `is_dropped` set to true