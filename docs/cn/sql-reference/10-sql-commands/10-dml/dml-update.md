---
title: UPDATE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.699"/>

使用新值更新表中的行，可选择使用其他表中的值。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除操作要么完全成功，要么完全失败。
:::

## 语法

```sql
UPDATE <目标表>
       SET <列名> = <值> [ , <列名> = <值> , ... ] -- 设置新值  
        [ FROM <其他表> ] -- 使用其他表中的值  
        [ WHERE <条件> ] -- 过滤行
```

## 示例

以下示例演示了如何直接更新表中的行，以及如何使用另一个表中的值来更新行。

我们将首先创建一个 **bookstore** 表并插入一些示例数据，然后直接更新特定行。之后，我们将使用第二个表 **book_updates**，根据 **book_updates** 中的值更新 **bookstore** 表中的行。

#### 步骤 1：创建 bookstore 表并插入初始数据

在此步骤中，我们创建一个名为 **bookstore** 的表，并填充一些示例书籍数据。

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

#### 步骤 2：查看更新前的 bookstore 表

我们现在可以检查 **bookstore** 表的内容，查看初始数据。

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

#### 步骤 3：直接更新单行

接下来，让我们更新 book_id 为 `103` 的书籍，更改其名称。

```sql
UPDATE bookstore 
SET book_name = 'The long answer (2nd)' 
WHERE book_id = 103;
```

#### 步骤 4：查看更新后的 bookstore 表

现在，让我们再次检查表，查看直接更新的结果。

```sql
SELECT book_name FROM bookstore WHERE book_id=103;

┌───────────────────────┐
│       book_name       │
├───────────────────────┤
│ The long answer (2nd) │
└───────────────────────┘
```

#### 步骤 5：创建新表以存储更新值

在此步骤中，我们创建第二个表 **book_updates**，其中包含我们将用于更新 **bookstore** 表的更新书籍名称。

```sql
CREATE TABLE book_updates (
  book_id INT,
  new_book_name VARCHAR
);

INSERT INTO book_updates VALUES (103, 'The long answer (Revised)');
INSERT INTO book_updates VALUES (104, 'Wartime friends (Expanded Edition)');
```

#### 步骤 6：使用 book_updates 中的值更新 bookstore 表

现在，我们将使用 **book_updates** 表中的值更新 **bookstore** 表。

```sql
UPDATE bookstore
SET book_name = book_updates.new_book_name
FROM book_updates
WHERE bookstore.book_id = book_updates.book_id;
```

#### 步骤 7：查看更新后的 bookstore 表

最后，我们再次检查 **bookstore** 表，确认已使用 **book_updates** 中的值更新了名称。

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