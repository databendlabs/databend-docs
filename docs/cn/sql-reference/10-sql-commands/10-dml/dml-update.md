Here's a professional documentation page for the `UPDATE` statement in Databend, incorporating your provided content with improved organization and clarity:

# UPDATE Statement

## Overview

The `UPDATE` statement modifies existing rows in a table with new values, with the option to use values from other tables. Databend ensures data integrity by performing these operations atomically - updates either complete successfully or fail entirely without partial application.

<FunctionDescription description="Introduced or updated: v1.2.705"/>

## Syntax

```sql
UPDATE <target_table>
       SET <col_name> = <value> [ , <col_name> = <value> , ... ]  -- Assign new values
        [ FROM <additional_tables> ]                              -- Source tables for values
        [ WHERE <condition> ]                                     -- Row selection criteria
```

## Configuration Settings

### error_on_nondeterministic_update

This setting controls behavior when an UPDATE statement encounters ambiguous matches between source and target rows:

- **true (default)**: Returns an error if a target row matches multiple source rows without a deterministic update rule
- **false**: Allows the update to proceed, potentially with non-deterministic results

## Examples

### Basic Update Operation

1. Create and populate a sample table:

```sql
CREATE TABLE bookstore (
  book_id INT,
  book_name VARCHAR
);

INSERT INTO bookstore VALUES 
  (101, 'After the death of Don Juan'),
  (102, 'Grown ups'),
  (103, 'The long answer'),
  (104, 'Wartime friends'),
  (105, 'Deconstructed');
```

2. View initial data:

```sql
SELECT * FROM bookstore;
```

3. Update a single row directly:

```sql
UPDATE bookstore 
SET book_name = 'The long answer (2nd)' 
WHERE book_id = 103;
```

4. Verify the update:

```sql
SELECT book_name FROM bookstore WHERE book_id=103;
```

### Update Using Values from Another Table

1. Create a table with update values:

```sql
CREATE TABLE book_updates (
  book_id INT,
  new_book_name VARCHAR
);

INSERT INTO book_updates VALUES 
  (103, 'The long answer (Revised)'),
  (104, 'Wartime friends (Expanded Edition)');
```

2. Perform the update:

```sql
UPDATE bookstore
SET book_name = book_updates.new_book_name
FROM book_updates
WHERE bookstore.book_id = book_updates.book_id;
```

3. View the results:

```sql
SELECT * FROM bookstore;
```

### Handling Ambiguous Updates

1. With strict checking (default):

```sql
SET error_on_nondeterministic_update = true;

-- This will fail if multiple source rows match a target row
UPDATE target_table
SET column = source.column
FROM source_table
WHERE target_table.id = source_table.id;
```

2. With relaxed checking:

```sql
SET error_on_nondeterministic_update = false;

-- This will proceed but may have non-deterministic results
UPDATE target_table
SET column = source.column
FROM source_table
WHERE target_table.id = source_table.id;
```

## Best Practices

- Always include a WHERE clause to limit the scope of updates
- Test updates with SELECT statements first to verify affected rows
- Consider transactions for multi-statement updates
- Use the strict mode (`error_on_nondeterministic_update=true`) for production environments to ensure data consistency