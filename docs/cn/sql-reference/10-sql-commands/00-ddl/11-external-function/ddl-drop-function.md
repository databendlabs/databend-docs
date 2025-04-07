---
title: DROP FUNCTION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.116"/>

删除一个外部函数。

## 语法

```sql
DROP FUNCTION [ IF EXISTS ] <function_name>
```

## 示例

```sql
DROP FUNCTION a_plus_3;

SELECT a_plus_3(2);
ERROR 1105 (HY000): Code: 2602, Text = Unknown Function a_plus_3 (while in analyze select projection).
```