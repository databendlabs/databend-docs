---
title: SIPHASH
---

生成一个 64 位的 [SipHash](https://en.wikipedia.org/wiki/SipHash) 哈希值。

## 语法 {/*syntax*/}

```sql
SIPHASH(<expr>)
```

## 示例 {/*examples*/}

```sql
SELECT SIPHASH('1234567890');

┌───────────────────────┐
│ siphash('1234567890') │
├───────────────────────┤
│  18110648197875983073 │
└───────────────────────┘
```