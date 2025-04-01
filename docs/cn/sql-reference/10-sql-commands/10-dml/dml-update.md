Here's the documentation for the `UPDATE` command in Databend, incorporating all the requested elements:

```markdown
---
title: UPDATE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.705"/>

Updates rows in a table with new values, optionally using values from other tables.

:::tip atomic operations
Databend ensures data integrity with atomic operations. Inserts, updates, replaces, and deletes either succeed completely or fail entirely.
:::

## Syntax

```sql
UPDATE <target_table>
       SET <col_name> = <value> [ , <col_name> = <value> , ... ] -- Set new values  
        [ FROM <additional_tables> ] -- Use values from other tables  
        [ WHERE <condition> ] -- Filter rows
```

## Configuring `error_on_nondeterministic_update` Setting

The `error_on_nondeterministic_update` setting controls whether an error is returned when an UPDATE statement attempts to update a target row that joins multiple source rows without a deterministic update rule.

- When `error_on_nondeterministic_update` = `true` (default): Databend returns an error if a target row matches multiple source rows and there is no clear rule for selecting which value to use.
- When `error_on_nondeterministic_update` = `false`: The UPDATE statement proceeds even if a target row joins multiple source rows, but the final update result may be non-deterministic.

## Examples

### Example 1: Basic Update with Direct Values

```sql
-- Create and populate a table
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

-- Update a single book title
UPDATE bookstore 
SET book_name = 'The long answer (2nd)' 
WHERE book_id = 103;

-- Verify the update
SELECT book_name FROM bookstore WHERE book_id=103;
```

### Example 2: Update Using Values from Another Table

```sql
-- Create a table with updates
CREATE TABLE book_updates (
  book_id INT,
  new_book_name VARCHAR
);

INSERT INTO book_updates VALUES 
  (103, 'The long answer (Revised)'),
  (104, 'Wartime friends (Expanded Edition)');

-- Apply updates from the book_updates table
UPDATE bookstore
SET book_name = book_updates.new_book_name
FROM book_updates
WHERE bookstore.book_id = book_updates.book_id;

-- View all updates
SELECT * FROM bookstore;
```

### Example 3: Handling Non-Deterministic Updates

```sql
-- Create tables with potential ambiguous updates
CREATE TABLE target (id INT, price DECIMAL(10, 2));
INSERT INTO target VALUES (1, 299.99), (2, 399.99);

CREATE TABLE source (id INT, price DECIMAL(10, 2));
INSERT INTO source VALUES (1, 279.99), (2, 399.99), (2, 349.99);

-- Default behavior (error_on_nondeterministic_update = true)
-- This will fail because id=2 matches multiple source rows
UPDATE target
SET target.price = source.price
FROM source
WHERE target.id = source.id;

-- Allow non-deterministic updates
SET error_on_nondeterministic_update = 0;

-- This will succeed but may produce inconsistent results
UPDATE target
SET target.price = source.price
FROM source
WHERE target.id = source.id;

-- View the potentially inconsistent results
SELECT * FROM target;
```

## Best Practices

1. Always include a WHERE clause to limit the scope of your updates
2. Test updates with SELECT statements first to verify which rows will be affected
3. Consider transactions for multiple related updates
4. Be cautious when disabling error_on_nondeterministic_update as it may lead to unpredictable results
```