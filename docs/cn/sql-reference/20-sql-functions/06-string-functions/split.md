---
title: SPLIT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.164"/>

使用指定的分隔符分割字符串，并将结果部分作为数组返回。

另请参阅: [SPLIT_PART](split-part)

## 语法

```sql
SPLIT('<input_string>', '<delimiter>')
```

## 返回类型

字符串数组。当输入字符串或分隔符为NULL时，SPLIT返回NULL。

## 示例

```sql
-- 使用空格作为分隔符
-- SPLIT返回一个包含两个部分的数组。
SELECT SPLIT('Databend Cloud', ' ');

split('databend cloud', ' ')|
----------------------------+
['Databend','Cloud']        |

-- 使用空字符串作为分隔符或输入字符串中不存在的分隔符
-- SPLIT返回一个包含整个输入字符串作为单一部分的数组。
SELECT SPLIT('Databend Cloud', '');

split('databend cloud', '')|
---------------------------+
['Databend Cloud']         |

SELECT SPLIT('Databend Cloud', ',');

split('databend cloud', ',')|
----------------------------+
['Databend Cloud']          |

-- 使用'	'（制表符）作为分隔符
-- SPLIT返回一个包含时间戳、日志级别和消息的数组。

SELECT SPLIT('2023-10-19 15:30:45	INFO	Log message goes here', '	');

split('2023-10-19 15:30:45\tinfo\tlog message goes here', '\t')|
---------------------------------------------------------------+
['2023-10-19 15:30:45','INFO','Log message goes here']         |
```