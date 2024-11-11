---
title: UPDATE
---

修改表中的行以使用新值。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

## 语法

```sql
UPDATE <table_name>
SET <col_name> = <value> [ , <col_name> = <value> , ... ]
    [ WHERE <condition> ]
```

## 示例

```sql
-- 创建一个表
CREATE TABLE bookstore (
  book_id INT,
  book_name VARCHAR
);

-- 插入值
INSERT INTO bookstore VALUES (101, 'After the death of Don Juan');
INSERT INTO bookstore VALUES (102, 'Grown ups');
INSERT INTO bookstore VALUES (103, 'The long answer');
INSERT INTO bookstore VALUES (104, 'Wartime friends');
INSERT INTO bookstore VALUES (105, 'Deconstructed');

-- 更新前的表
SELECT * FROM bookstore;

101|After the death of Don Juan
102|Grown ups
103|The long answer
104|Wartime friends
105|Deconstructed

-- 更新一本书 (Id: 103)
UPDATE bookstore SET book_name = 'The long answer (2nd)' WHERE book_id = 103;

-- 更新后的表
SELECT * FROM bookstore;

101|After the death of Don Juan
102|Grown ups
103|The long answer (2nd)
104|Wartime friends
105|Deconstructed
```