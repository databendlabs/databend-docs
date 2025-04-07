---
title: ASSUME_NOT_NULL
---

将 Nullable 类型转换为等效的非 `Nullable` 值。如果原始值为 `NULL`，则结果不确定。

## 语法

```sql
ASSUME_NOT_NULL(<x>)
```

## 别名

- [REMOVE_NULLABLE](remove-nullable.md)

## 返回类型

从非 `Nullable` 类型返回原始数据类型；为 `Nullable` 类型返回嵌入的非 `Nullable` 数据类型。

## 示例

```sql
CREATE TABLE default.t_null ( x int,  y int null);

INSERT INTO default.t_null values (1, null), (2, 3);

SELECT ASSUME_NOT_NULL(y), REMOVE_NULLABLE(y) FROM t_null;

┌─────────────────────────────────────────┐
│ assume_not_null(y) │ remove_nullable(y) │
├────────────────────┼────────────────────┤
│                  0 │                  0 │
│                  3 │                  3 │
└─────────────────────────────────────────┘
```