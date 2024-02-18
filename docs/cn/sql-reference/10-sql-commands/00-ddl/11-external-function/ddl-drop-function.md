---
title: 删除函数
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.116"/>

删除一个外部函数。

## 语法

```sql
DROP FUNCTION [ IF EXISTS ] <function_name>
```

## 示例

```sql
DROP FUNCTION a_plus_3;

SELECT a_plus_3(2);
ERROR 1105 (HY000): Code: 2602, Text = 未知函数 a_plus_3 (分析选择投影时)。
```