---
title: 比较运算符
---

| 运算符（Operator） | 描述（Description）                               | 示例（Example）           | 结果（Result） |
| ------------------ | ------------------------------------------------- | ------------------------- | -------------- |
| `=`                | a 等于 b                                          | `2 = 2`                   | TRUE           |
| `!=`               | a 不等于 b                                        | `2 != 3`                  | TRUE           |
| `<>`               | a 不等于 b                                        | `2 <> 2`                  | FALSE          |
| `>`                | a 大于 b                                          | `2 > 3`                   | FALSE          |
| `>=`               | a 大于或等于 b                                    | `4 >= NULL`               | NULL           |
| `<`                | a 小于 b                                          | `2 < 3`                   | TRUE           |
| `<=`               | a 小于或等于 b                                    | `2 <= 3`                  | TRUE           |
| `IS NULL`          | 表达式为 NULL 时返回 TRUE，否则返回 FALSE         | `(4 >= NULL) IS NULL`     | TRUE           |
| `IS NOT NULL`      | 表达式为 NULL 时返回 FALSE，否则返回 TRUE         | `(4 >= NULL) IS NOT NULL` | FALSE          |