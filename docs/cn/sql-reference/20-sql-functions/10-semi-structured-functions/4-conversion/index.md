---
title: 类型转换函数
---

本节提供 Databend 中类型转换函数的参考信息。这些函数能够将 VARIANT 值严格转换为其他 SQL 数据类型。

## 类型转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [AS_BOOLEAN](as-boolean) | 将 VARIANT 值转换为布尔值（BOOLEAN） | `AS_BOOLEAN(PARSE_JSON('true'))` → `true` |
| [AS_INTEGER](as-integer) | 将 VARIANT 值转换为大整数（BIGINT） | `AS_INTEGER(PARSE_JSON('42'))` → `42` |
| [AS_FLOAT](as-float) | 将 VARIANT 值转换为双精度浮点数（DOUBLE） | `AS_FLOAT(PARSE_JSON('3.14'))` → `3.14` |
| [AS_DECIMAL](as-decimal) | 将 VARIANT 值转换为定点数（DECIMAL） | `AS_DECIMAL(PARSE_JSON('12.34'))` → `12.34` |
| [AS_STRING](as-string) | 将 VARIANT 值转换为字符串（STRING） | `AS_STRING(PARSE_JSON('"hello"'))` → `'hello'` |
| [AS_BINARY](as-binary) | 将 VARIANT 值转换为二进制（BINARY） | `AS_BINARY(TO_BINARY('abcd')::VARIANT)` → `61626364` |
| [AS_DATE](as-date) | 将 VARIANT 值转换为日期（DATE） | `AS_DATE(TO_DATE('2025-10-11')::VARIANT)` → `2025-10-11` |
| [AS_ARRAY](as-array) | 将 VARIANT 值转换为数组（ARRAY） | `AS_ARRAY(PARSE_JSON('[1,2,3]'))` → `[1,2,3]` |
| [AS_OBJECT](as-object) | 将 VARIANT 值转换为对象（OBJECT） | `AS_OBJECT(PARSE_JSON('{"a":1}'))` → `{"a":1}` |

## 重要说明

- 这些函数对 VARIANT 值执行**严格转换**
- 如果输入的数据类型不是 VARIANT，则输出为 NULL
- 如果 VARIANT 中的值类型与预期的输出类型不匹配，则输出为 NULL
- 所有 AS_* 函数通过在不兼容的转换中返回 NULL 来确保类型安全