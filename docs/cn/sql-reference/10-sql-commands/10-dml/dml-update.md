---
title: UPDATE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.705"/>

使用新值更新表中的行，可以选择使用其他表中的值。

:::tip atomic operations
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

## Syntax

```sql
UPDATE <target_table>
       SET <col_name> = <value> [ , <col_name> = <value> , ... ] -- 设置新值
        [ FROM <additional_tables> ] -- 使用其他表中的值
        [ WHERE <condition> ] -- 筛选行
```

## 配置 `error_on_nondeterministic_update` 设置

`error_on_nondeterministic_update` 设置控制当 UPDATE 语句尝试更新一个目标行，该目标行在没有确定性更新规则的情况下连接多个源行时，是否返回错误。

- 当 `error_on_nondeterministic_update` = `true` (默认): 如果一个目标行匹配多个源行，并且没有明确的规则来选择使用哪个值，Databend 将返回一个错误。
- 当 `error_on_nondeterministic_update` = `false`: 即使一个目标行连接多个源行，UPDATE 语句也会继续执行，但最终的更新结果可能是不确定的。

示例:

考虑以下表:

```sql
CREATE OR REPLACE TABLE target (
    id INT,
    price DECIMAL(10, 2)
);

INSERT INTO target VALUES
(1, 299.99),
(2, 399.99);

CREATE OR REPLACE TABLE source (
    id INT,
    price DECIMAL(10, 2)
);

INSERT INTO source VALUES
(1, 279.99),
(2, 399.99),
(2, 349.99);  -- 源中有重复的 id
```

执行以下 UPDATE 语句:

```sql
UPDATE target
SET target.price = source.price
FROM source
WHERE target.id = source.id;
```

- 当 `error_on_nondeterministic_update = true` 时，此查询将失败，因为目标中的 id = 2 匹配源中的多个行，从而使更新不明确。

  ```sql
  SET error_on_nondeterministic_update = 1;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  error: APIError: QueryFailed: [4001]multi rows from source match one and the same row in the target_table multi times
  ```

- 当 `error_on_nondeterministic_update = false` 时，更新成功，但 id = 2 的 target.price 可能会更新为 399.99 或 349.99，具体取决于执行顺序。

  ```sql
  SET error_on_nondeterministic_update = 0;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  ┌────────────────────────┐
  │ number of rows updated │
  ├────────────────────────┤
  │                      2 │
  └────────────────────────┘

  SELECT * FROM target;

  ┌────────────────────────────────────────────┐
  │        id       │           price          │
  ├─────────────────┼──────────────────────────┤
  │               1 │ 279.99                   │
  │               2 │ 399.99                   │
  └────────────────────────────────────────────┘
  ```



## Examples

以下示例演示如何更新表中的行，包括直接更新和使用另一个表中的值进行更新。

我们将首先创建一个 **bookstore** 表并插入一些示例数据，然后直接更新特定行。之后，我们将使用第二个表 **book_updates**，根据 **book_updates** 中的值更新 **bookstore** 表中的行。

#### Step 1: 创建 bookstore 表并插入初始数据

在此步骤中，我们创建一个名为 **bookstore** 的表，并使用一些示例图书数据填充它。

```sql
CREATE TABLE bookstore (
  book_id INT,
  book_name VARCHAR
);

INSERT INTO bookstore VALUES (101, 'After the death of Don Juan');
INSERT INTO bookstore VALUES (102, 'Grown ups');
INSERT INTO bookstore VALUES (103, 'The long answer');
INSERT INTO bookstore VALUES (104, 'Wartime friends');
INSERT INTO bookstore VALUES (105, 'Deconstructed');
```

#### Step 2: 查看更新前的 bookstore 表

现在，我们可以检查 **bookstore** 表的内容，以查看初始数据。

```sql
SELECT * FROM bookstore;

┌───────────────────────────────────────────────┐
│     book_id     │          book_name          │
├─────────────────┼─────────────────────────────┤
│             102 │ Grown ups                   │
│             103 │ The long answer             │
│             101 │ After the death of Don Juan │
│             105 │ Deconstructed               │
│             104 │ Wartime friends             │
└───────────────────────────────────────────────┘
```

#### Step 3: 直接更新单行

接下来，让我们更新 book_id 为 `103` 的书，以更改其名称。

```sql
UPDATE bookstore 
SET book_name = 'The long answer (2nd)' 
WHERE book_id = 103;
```

#### Step 4: 查看更新后的 bookstore 表

现在，让我们再次检查该表，以查看直接更新的结果。

```sql
SELECT book_name FROM bookstore WHERE book_id=103;

┌───────────────────────┐
│       book_name       │
├───────────────────────┤
│ The long answer (2nd) │
└───────────────────────┘
```

#### Step 5: 创建一个新表用于存储更新后的值

在此步骤中，我们创建第二个表，名为 **book_updates**，其中包含更新后的书名，我们将使用这些书名来更新 **bookstore** 表。

```sql
CREATE TABLE book_updates (
  book_id INT,
  new_book_name VARCHAR
);

INSERT INTO book_updates VALUES (103, 'The long answer (Revised)');
INSERT INTO book_updates VALUES (104, 'Wartime friends (Expanded Edition)');
```

#### Step 6: 使用 book_updates 中的值更新 bookstore 表

现在，我们将使用 **book_updates** 表中的值更新 **bookstore** 表。

```sql
UPDATE bookstore
SET book_name = book_updates.new_book_name
FROM book_updates
WHERE bookstore.book_id = book_updates.book_id;
```

#### Step 7: 查看更新后的 bookstore 表

最后，我们再次检查 **bookstore** 表，以确认已使用 **book_updates** 中的值更新了名称。

```sql
SELECT * FROM bookstore;

┌──────────────────────────────────────────────────────┐
│     book_id     │              book_name             │
├─────────────────┼────────────────────────────────────┤
│             105 │ Deconstructed                      │
│             101 │ After the death of Don Juan        │
│             102 │ Grown ups                          │
│             104 │ Wartime friends (Expanded Edition) │
│             103 │ The long answer (Revised)          │
└──────────────────────────────────────────────────────┘
```