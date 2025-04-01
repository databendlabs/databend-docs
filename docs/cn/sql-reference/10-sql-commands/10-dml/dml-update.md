Here's a well-structured documentation article for the `UPDATE` command in Databend, based on the provided content:

# UPDATE Command

## Overview

The `UPDATE` command modifies existing rows in a table with new values, with the option to use values from other tables. Databend ensures data integrity by performing these operations atomically - updates either complete successfully or fail entirely without partial changes.

## Syntax

```sql
UPDATE <target_table>
       SET <col_name> = <value> [ , <col_name> = <value> , ... ]  -- Set new values
        [ FROM <additional_tables> ]                              -- Use values from other tables
        [ WHERE <condition> ]                                     -- Filter rows
```

## Configuration Settings

### error_on_nondeterministic_update

This setting controls behavior when an UPDATE statement attempts to modify a target row that matches multiple source rows:

- **Default (true)**: Returns an error if a target row joins with multiple source rows without a clear update rule
- **false**: Allows the update to proceed, potentially with non-deterministic results

Example usage:
```sql
SET error_on_nondeterministic_update = false;  -- Allow non-deterministic updates
```

## Examples

### Basic Update Example

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

3. Update a single row:
```sql
UPDATE bookstore 
SET book_name = 'The long answer (2nd)' 
WHERE book_id = 103;
```

4. Verify the update:
```sql
SELECT book_name FROM bookstore WHERE book_id=103;
```

### Update Using Another Table

1. Create a table with updates:
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

## Important Notes

- Databend performs UPDATE operations atomically to ensure data integrity
- When updating from multiple source rows, use `error_on_nondeterministic_update` to control behavior
- Always test UPDATE statements with SELECT first to verify the affected rows