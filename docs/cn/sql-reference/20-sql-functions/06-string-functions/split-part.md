---
title: SPLIT_PART
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.164"/>

使用指定的分隔符分割字符串并返回指定部分。

另请参阅: [SPLIT](split.md)

## 语法

```sql
SPLIT_PART('<input_string>', '<delimiter>', '<position>')
```

*position* 参数指定要返回的部分。它使用基于1的索引，但也可以接受正数、负数或零值：

- 如果 *position* 是正数，则从左到右返回该位置的部分，如果不存在则返回 NULL。
- 如果 *position* 是负数，则从右到左返回该位置的部分，如果不存在则返回 NULL。
- 如果 *position* 是 0，则视为 1，实际上返回字符串的第一部分。

## 返回类型

字符串。当输入字符串、分隔符或位置为 NULL 时，SPLIT_PART 返回 NULL。

## 示例

```sql
-- 使用空格作为分隔符
-- SPLIT_PART 返回特定部分。
SELECT SPLIT_PART('Databend Cloud', ' ', 1);

split_part('databend cloud', ' ', 1)|
------------------------------------+
Databend                            |

-- 使用空字符串作为分隔符或分隔符在输入字符串中不存在
-- SPLIT_PART 返回整个输入字符串。
SELECT SPLIT_PART('Databend Cloud', '', 1);

split_part('databend cloud', '', 1)|
-----------------------------------+
Databend Cloud                     |

SELECT SPLIT_PART('Databend Cloud', ',', 1);

split_part('databend cloud', ',', 1)|
------------------------------------+
Databend Cloud                      |

-- 使用 '    ' (制表符) 作为分隔符
-- SPLIT_PART 返回各个字段。
SELECT SPLIT_PART('2023-10-19 15:30:45   INFO   Log message goes here', '   ', 3);

split_part('2023-10-19 15:30:45   info   log message goes here', '   ', 3)|
--------------------------------------------------------------------------+
Log message goes here                                                     |

-- SPLIT_PART 返回空字符串，因为指定的部分根本不存在。
SELECT SPLIT_PART('2023-10-19 15:30:45   INFO   Log message goes here', '   ', 4);

split_part('2023-10-19 15:30:45   info   log message goes here', '   ', 4)|
--------------------------------------------------------------------------+
                                                                          |
```