---
title: CREATE NGRAM INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.726"/>

为表的某一列创建 Ngram 索引（Index）。

## 语法

```sql
-- 在现有表上创建 Ngram 索引
CREATE [OR REPLACE] NGRAM INDEX [IF NOT EXISTS] <index_name>
ON [<database>.]<table_name>(<column>)
[gram_size = <number>] [bloom_size = <number>]

-- 在创建表时创建 Ngram 索引
CREATE [OR REPLACE] TABLE <table_name> (
    <column_definitions>,
    NGRAM INDEX <index_name> (<column>)
        [gram_size = <number>] [bloom_size = <number>]
)...
```

- `gram_size`（默认为 3）指定为列文本建立索引时，每个基于字符的子串（n-gram）的长度。例如当 `gram_size = 3` 时，文本 "hello world" 会被分割为以下重叠子串：

  ```text
  "hel", "ell", "llo", "lo ", "o w", " wo", "wor", "orl", "rld"
  ```

- `bloom_size` 指定用于加速数据块内字符串匹配的布隆过滤器（Bloom filter）位图大小（单位：字节），控制索引精度与内存占用的平衡：
  - 更大的 `bloom_size` 可减少字符串查找的误报，提升查询精度但增加内存消耗
  - 更小的 `bloom_size` 节省内存但可能增加误报
  - 未显式设置时，默认每索引列每数据块占用 1,048,576 字节（1m），有效范围为 512 字节至 10,485,760 字节（10m）

## 示例

### 创建带 NGRAM 索引的表

```sql
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content STRING,
    NGRAM INDEX idx_content (content)
);
```

### 在现有表上创建 NGRAM 索引

```sql
CREATE TABLE products (
    id INT,
    name VARCHAR,
    description STRING
);

CREATE NGRAM INDEX idx_description
ON products(description);
```

### 查看索引

```sql
SHOW INDEXES;
```

结果：
```
┌─────────────────┬───────┬──────────┬─────────────────────────┬──────────────────────────┐
│ name            │ type  │ original │ definition              │ created_on               │
├─────────────────┼───────┼──────────┼─────────────────────────┼──────────────────────────┤
│ idx_content     │ NGRAM │          │ articles(content)       │ 2025-05-13 01:22:34.123  │
│ idx_description │ NGRAM │          │ products(description)   │ 2025-05-13 01:23:45.678  │
└─────────────────┴───────┴──────────┴─────────────────────────┴──────────────────────────┘
```

### 使用 NGRAM 索引

```sql
-- 创建带 NGRAM 索引的表
CREATE TABLE phrases (
    id INT,
    text STRING,
    NGRAM INDEX idx_text (text)
);

-- 插入示例数据
INSERT INTO phrases VALUES
(1, 'apple banana cherry'),
(2, 'banana date fig'),
(3, 'cherry elderberry fig'),
(4, 'date grape kiwi');

-- 使用 NGRAM 索引进行模糊匹配查询
SELECT * FROM phrases WHERE text LIKE '%banana%';
```

结果：
```
┌────┬─────────────────────┐
│ id │ text                │
├────┼─────────────────────┤
│  1 │ apple banana cherry │
│  2 │ banana date fig     │
└────┴─────────────────────┘
```

### 删除 NGRAM 索引

```sql
DROP NGRAM INDEX idx_text ON phrases;
```
