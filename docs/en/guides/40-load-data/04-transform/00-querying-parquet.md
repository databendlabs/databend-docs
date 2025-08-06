---
title: Querying Parquet Files in Stage
sidebar_label: Parquet
---

# Querying Parquet Files in Stage

## Overview

Parquet is a columnar storage file format optimized for analytics workloads. It provides efficient compression and encoding schemes, making it ideal for storing and querying large datasets. Parquet files contain embedded schema information, which allows Databend to understand the structure and data types of your data without additional configuration.

**Why Query Parquet Files in Stages?**

Querying Parquet files directly from stages (external storage locations like S3, Azure Blob, or GCS) offers several advantages:

- **No Data Movement**: Query data where it lives without importing it into Databend tables
- **Cost Efficiency**: Avoid storage duplication and reduce data transfer costs
- **Flexibility**: Analyze data from multiple sources without permanent storage commitment
- **Schema Preservation**: Leverage Parquet's embedded schema for accurate data type handling
- **Performance**: Take advantage of Parquet's columnar format for analytical queries

## Query Parquet Files in Stage

## Syntax

```sql
SELECT [<alias>.]<column> [, <column> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ],
  [ CASE_SENSITIVE => true | false ]
)]
```

### Parameters Explained

**Data Source Options:**
- `@<stage_name>[/<path>]`: Reference to a named stage with optional subdirectory path
- `'<uri>'`: Direct URI to storage location (e.g., `'s3://bucket/path/'`)
- `<table_alias>`: Optional alias for the data source in your query

**Query Options:**
- `<connection_parameters>`: Authentication and connection settings for the storage service
- `PATTERN => '<regex_pattern>'`: Regular expression to filter files by name (e.g., `'.*\.parquet$'`)
- `FILE_FORMAT => 'PARQUET | <custom_format_name>'`: Specify built-in PARQUET format or custom format name
- `FILES => ( '<file_name>' [, ...] )`: Explicitly list specific files to query instead of using pattern matching
- `CASE_SENSITIVE => true | false`: Control whether column name matching is case-sensitive (default: true)

**When to Use Each Parameter:**
- Use `PATTERN` when you want to query multiple files matching a naming convention
- Use `FILES` when you need to query specific files by name
- Use `CASE_SENSITIVE => false` when your Parquet files have inconsistent column name casing

### Parquet Query Behavior

**Schema and Data Type Handling:**

Parquet files differ from other formats (like CSV or JSON) because they contain embedded schema information. This provides several advantages when querying:

* **Native Data Types**: Column values are returned in their original data types (INTEGER, VARCHAR, TIMESTAMP, etc.) rather than as generic VARIANT types
* **Direct Column Access**: Reference columns directly by name: `SELECT id, name, age FROM @stage_name`
* **No Type Conversion**: No need for explicit type casting or path expressions like `$1:name::VARCHAR`
* **Schema Validation**: Databend automatically validates that your query columns exist in the Parquet schema

**Example Comparison:**
```sql
-- Parquet (simple and type-safe)
SELECT customer_id, order_date, total_amount FROM @parquet_stage

-- JSON equivalent (requires path expressions and casting)
SELECT $1:customer_id::INTEGER, $1:order_date::DATE, $1:total_amount::DECIMAL FROM @json_stage
```

## Step-by-Step Tutorial

This tutorial demonstrates how to set up and query Parquet files stored in an external S3 bucket. The process involves creating a stage (connection to external storage), defining a file format, and executing queries.

### Step 1. Create an External Stage

**Purpose**: A stage in Databend acts as a named connection to external storage, allowing you to reference your S3 bucket easily in queries without repeating connection details.

**What this step accomplishes:**
- Creates a reusable connection named `parquet_query_stage`
- Points to the S3 location `s3://load/parquet/` where your Parquet files are stored
- Stores authentication credentials securely within Databend

```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

**Configuration Notes:**
- Replace `<your-access-key-id>` and `<your-secret-access-key>` with your actual AWS credentials
- The URL should point to the directory containing your Parquet files
- You can include subdirectories in the URL or specify them later in queries
- The stage name (`parquet_query_stage`) will be referenced in subsequent queries

### Step 2. Create Custom Parquet File Format

**Purpose**: While Databend has built-in Parquet support, creating a named file format allows you to:
- Reuse format settings across multiple queries
- Customize Parquet-specific options if needed
- Make queries more readable and maintainable

**What this step accomplishes:**
- Creates a named file format called `parquet_query_format`
- Explicitly specifies the format type as PARQUET
- Provides a reusable reference for consistent file processing

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```

**Alternative Approach:**
You can also use the built-in format directly in queries without creating a custom format:
```sql
-- Using built-in format (simpler for one-time queries)
SELECT * FROM @parquet_query_stage (FILE_FORMAT => 'PARQUET')

-- Using custom format (better for repeated queries)
SELECT * FROM @parquet_query_stage (FILE_FORMAT => 'parquet_query_format')
```

For advanced Parquet file format options, refer to [Parquet File Format Options](/sql/sql-reference/file-format-options#parquet-options)

### Step 3. Query Parquet Files

**Purpose**: Execute a query against all Parquet files in the stage that match the specified pattern.

**What this query does:**
- Selects all columns (`*`) from Parquet files in the stage
- Uses the custom file format created in Step 2
- Applies a pattern to match files ending with `.parquet`
- Returns data with proper data types preserved from the Parquet schema

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```

**Query Components Explained:**
- `@parquet_query_stage`: References the stage created in Step 1
- `FILE_FORMAT => 'parquet_query_format'`: Uses the custom format from Step 2
- `PATTERN => '.*[.]parquet'`: Regex pattern matching any file ending with `.parquet`
  - `.*` matches any characters
  - `[.]` matches a literal dot (escaped in regex)
  - `parquet` matches the file extension

**Query Variations:**
```sql
-- Query specific columns
SELECT customer_id, order_date, total_amount FROM @parquet_query_stage (...)

-- Query specific files
SELECT * FROM @parquet_query_stage (FILE_FORMAT => 'parquet_query_format', FILES => ('data1.parquet', 'data2.parquet'))

-- Query with subdirectory
SELECT * FROM @parquet_query_stage/2023/orders (...)
```
## Advanced Querying with Metadata

### Understanding Metadata Columns

When querying multiple Parquet files from a stage, Databend automatically provides metadata columns that help you understand the source and structure of your data. These virtual columns are especially useful when:

- **Data Auditing**: Track which file each row originated from
- **Debugging**: Identify problematic rows by file and line number
- **Data Processing**: Implement file-based processing logic
- **Monitoring**: Understand data distribution across files

### Available Metadata Columns

- `METADATA$FILENAME`: The name of the source Parquet file
- `METADATA$FILE_ROW_NUMBER`: The row number within the source file (1-based)

### Metadata Query Example

**Purpose**: Query Parquet files while capturing source file information for each row.

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```

**Query Results Structure:**
```
METADATA$FILENAME     | METADATA$FILE_ROW_NUMBER | customer_id | order_date | total_amount
--------------------- | ------------------------ | ----------- | ---------- | ------------
sales_2023_q1.parquet | 1                        | 1001        | 2023-01-15 | 299.99
sales_2023_q1.parquet | 2                        | 1002        | 2023-01-16 | 149.50
sales_2023_q2.parquet | 1                        | 1003        | 2023-04-10 | 599.00
```

**Practical Use Cases:**

```sql
-- Find all records from a specific file
SELECT * FROM @parquet_query_stage (...) 
WHERE METADATA$FILENAME = 'sales_2023_q1.parquet'

-- Group data by source file
SELECT METADATA$FILENAME, COUNT(*) as record_count
FROM @parquet_query_stage (...)
GROUP BY METADATA$FILENAME

-- Identify the first record from each file
SELECT * FROM @parquet_query_stage (...)
WHERE METADATA$FILE_ROW_NUMBER = 1
```

## Performance Considerations and Best Practices

### Query Optimization

**File Organization:**
- **Partition by Date**: Store files in date-based directories for efficient querying (`/year=2023/month=01/`)
- **Consistent Schema**: Ensure all Parquet files in a stage have compatible schemas
- **Appropriate File Size**: Aim for files between 128MB - 1GB for optimal performance

**Query Patterns:**
- **Column Selection**: Use specific column names instead of `SELECT *` to reduce data transfer
- **Pattern Optimization**: Use precise regex patterns to avoid scanning unnecessary files
- **File Filtering**: Use the `FILES` parameter when querying specific files rather than pattern matching

**Example Optimized Queries:**
```sql
-- Good: Specific columns and precise pattern
SELECT customer_id, total_amount 
FROM @parquet_query_stage 
(FILE_FORMAT => 'parquet_query_format', PATTERN => 'sales_2023_.*\.parquet$')

-- Better: Query specific files when known
SELECT customer_id, total_amount 
FROM @parquet_query_stage 
(FILE_FORMAT => 'parquet_query_format', FILES => ('sales_2023_q1.parquet', 'sales_2023_q2.parquet'))
```

### Storage Best Practices

**Parquet File Optimization:**
- Use appropriate compression (SNAPPY for speed, GZIP for size)
- Enable column pruning by storing related columns together
- Consider row group size based on your query patterns

**Stage Configuration:**
- Use the same AWS region for both Databend and your S3 bucket
- Configure appropriate IAM permissions for security
- Consider using S3 Transfer Acceleration for cross-region access

## Common Troubleshooting Scenarios

### Schema-Related Issues

**Problem**: "Column not found" errors
```
ERROR: Column 'customer_name' not found in parquet file
```
**Solutions:**
- Verify column names match exactly (check case sensitivity)
- Use `CASE_SENSITIVE => false` if column casing is inconsistent
- Check that all files in the pattern have the same schema

**Problem**: Data type mismatches between files
```
ERROR: Schema mismatch: column 'amount' has type DECIMAL in file1.parquet but INTEGER in file2.parquet
```
**Solutions:**
- Ensure consistent data types across all Parquet files
- Query files with compatible schemas separately
- Use explicit type casting in your queries when necessary

### File Access Issues

**Problem**: "Access denied" or "File not found" errors
```
ERROR: Access denied: s3://load/parquet/sales_2023.parquet
```
**Solutions:**
- Verify AWS credentials have proper S3 permissions
- Check that the bucket and file paths are correct
- Ensure the stage URL matches your actual S3 structure

**Problem**: Pattern matches no files
```
ERROR: No files match pattern '.*\.parquet$'
```
**Solutions:**
- List files in your S3 bucket to verify naming conventions
- Test your regex pattern with actual file names
- Use `FILES => (...)` to specify exact file names for testing

### Performance Issues

**Problem**: Slow query performance
**Solutions:**
- Reduce the number of files by using more specific patterns
- Select only required columns instead of using `SELECT *`
- Check if files are properly compressed
- Consider the network latency between Databend and your storage

**Problem**: Memory issues with large datasets
**Solutions:**
- Query smaller subsets of data using file patterns or date ranges
- Use `LIMIT` clauses for initial data exploration
- Consider breaking large queries into smaller chunks

### Best Practices for Debugging

1. **Start Simple**: Begin with a single file using the `FILES` parameter
2. **Test Patterns**: Use simple patterns first, then make them more specific
3. **Check Metadata**: Use metadata columns to understand file structure
4. **Verify Credentials**: Test stage connectivity with a simple `LIST @stage_name` command