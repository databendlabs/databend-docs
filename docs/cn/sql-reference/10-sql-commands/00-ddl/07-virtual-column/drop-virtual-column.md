---
title: DROP VIRTUAL COLUMN
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='虚拟列'/>

删除为表创建的虚拟列。

## 语法

```sql
DROP VIRTUAL COLUMN [ IF EXISTS ] FOR <table>
```

## 示例

此示例删除为名为 'test' 的表创建的虚拟列：

```sql
DROP VIRTUAL COLUMN FOR test;
```