---
title: Stream
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

### What is Stream?

A stream in Databend is a dynamic and real-time representation of changes to a table. Streams are created to capture and track modifications to the associated table, allowing continuous consumption and analysis of data changes as they occur. 

This is a quick example illustrating what a stream looks like. In the given scenario, a stream named 'my_first_st' is created for the 'test_stream' table and captures a data insertion:
 
```sql title='Example:'
CREATE TABLE test_stream(a INT);
INSERT INTO test_stream VALUES(1);
ALTER TABLE test_stream SET OPTIONS(change_tracking = TRUE);

CREATE STREAM my_first_st ON TABLE test_stream;
INSERT INTO test_stream VALUES(2);
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               2 │
└─────────────────┘
```

A Databend stream currently supports **Append-only** mode, allowing it to capture **both data insertion and deletion events**, as demonstrated in the following example:

```sql title='Example continued:'
INSERT INTO test_stream VALUES(3);
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               2 │
│               3 │
└─────────────────┘

DELETE FROM test_stream WHERE a = 2;
SELECT * FROM my_first_st;

┌─────────────────┐
│        a        │
├─────────────────┤
│               3 │
└─────────────────┘
```

### Enabling Change Tracking

Change tracking must be enabled for a table before creating a stream for it. To enable change tracking for a table, use the [ALTER TABLE OPTION](../20-table/90-alter-table-option.md) command. In the previous example, this statement enables change tracking for the table 'test_stream':

```sql
ALTER TABLE test_stream SET OPTIONS(change_tracking = TRUE);
```

A stream does NOT store any data for a table. Once change tracking is enabled, Databend adds the following hidden columns as change tracking metadata to the table for tracking the data changes of each row:

| Column                | Description                                                                       |
|-----------------------|-----------------------------------------------------------------------------------|
| _origin_version       | Identifies the table version in which this row was initially created.             |
| _origin_block_id      | Identifies the block ID to which this row belonged previously.                    |
| _origin_block_row_num | Identifies the row number within the block to which this row belonged previously. |

To display the values of these columns, use the SELECT statement:

```sql title='Example continued:'
SELECT *, _origin_version, _origin_block_id, _origin_block_row_num 
FROM test_stream;

┌───────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┤
│               1 │             NULL │ NULL                     │                  NULL │
│               3 │             3740 │ NULL                     │                  NULL │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Managing Streams

To manage streams in Databend, use the following commands:

<IndexOverviewList />

### Usage Examples

In this example, we assume the management of a book collection through the `books_total` table.

```sql
-- Create a table to store all books information
CREATE TABLE books_total (
    book_id INT,
    title VARCHAR(255),
    author VARCHAR(255),
    publication_year INT
);

-- Insert records for the year 2022
INSERT INTO books_total VALUES
    (1, 'The Song of Achilles', 'Madeline Miller', 2022),
    (2, 'The Night Circus', 'Erin Morgenstern', 2022),
    (3, 'Where the Red Fern Grows', 'Wilson Rawls', 2022);
```

After populating the table with 2022 data, we enable change tracking.

```sql
ALTER TABLE books_total SET OPTIONS (change_tracking = TRUE);
```

As we transition into 2023, we introduce the `books_stream_2023` stream to capture changes at the year's onset.

```sql
CREATE STREAM books_stream_2023 ON TABLE books_total;
```

New books for 2023 are seamlessly added to books_total, and the stream efficiently records these additions.

```sql
INSERT INTO books_total VALUES
    (4, 'The Silent Patient', 'Alex Michaelides', 2023),
    (5, 'Where the Crawdads Sing', 'Delia Owens', 2023),
    (6, 'Educated', 'Tara Westover', 2023);

-- View the changes in the stream for the year 2023
SELECT * FROM books_stream_2023;

┌─────────────────────────────────────────────────────────────────────────────────┐
│     book_id     │          title          │      author      │ publication_year │
├─────────────────┼─────────────────────────┼──────────────────┼──────────────────┤
│               4 │ The Silent Patient      │ Alex Michaelides │             2023 │
│               5 │ Where the Crawdads Sing │ Delia Owens      │             2023 │
│               6 │ Educated                │ Tara Westover    │             2023 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Subsequently, you can create another table `books_2023`to store information specifically for the year 2023 and populate it with the stream data.

```sql
CREATE TABLE books_2023 (
    book_id INT,
    title VARCHAR(255),
    author VARCHAR(255),
    publication_year INT
);

INSERT INTO books_2023
SELECT * FROM books_stream_2023;
```