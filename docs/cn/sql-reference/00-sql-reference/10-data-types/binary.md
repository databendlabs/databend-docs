---
title: Binary
description: 可变长度的原始字节序列。
sidebar_position: 2
---

## 概览

`BINARY`（别名 `VARBINARY`）存储可变长度的字节序列。与 `STRING` 不同，该值不会被解释为 UTF-8 文本，因此适合用于存储摘要、压缩数据或序列化对象等负载。在读取或写入数据时，使用 [UNHEX](../../20-sql-functions/06-string-functions/unhex.md)、[FROM_BASE64](../../20-sql-functions/06-string-functions/from-base64.md) 和 [TO_HEX](../../20-sql-functions/02-conversion-functions/to-hex.md) 等转换函数对值进行编码或解码。

## 示例

### 插入原始字节

```sql
CREATE TABLE binary_samples (
  id INT,
  raw BINARY
);

INSERT INTO binary_samples VALUES
  (1, UNHEX('68656c6c6f')),             -- "hello"
  (2, FROM_BASE64('ZGF0YWJlbmQ='));     -- "databend"
```

```sql
SELECT
  id,
  HEX(raw)     AS hex_value,
  LENGTH(raw)  AS byte_len
FROM binary_samples
ORDER BY id;
```

结果：
```
┌────┬──────────────┬──────────┐
│ id │ hex_value    │ byte_len │
├────┼──────────────┼──────────┤
│  1 │ 68656c6c6f   │        5 │
│  2 │ 6461746162656e64 │     8 │
└────┴──────────────┴──────────┘
```

### 转换回文本

如果需要，可以将二进制值转换为字符串：

```sql
SELECT
  id,
  TO_VARCHAR(raw) AS text_value
FROM binary_samples
ORDER BY id;
```

结果：
```
┌────┬─────────────┐
│ id │ text_value  │
├────┼─────────────┤
│  1 │ hello       │
│  2 │ databend    │
└────┴─────────────┘
```

Binary 列接受 NULL 值，也可以嵌套在 ARRAY、MAP 或 TUPLE 结构中，以便在需要时将字节负载与其他数据一起存储。
