---
title: 刷新虚拟列
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

刷新表的虚拟列。在以下情况下需要刷新虚拟列：

- 在已经包含Variant数据的表上创建虚拟列后，需要刷新虚拟列。
- 修改表的虚拟列后，刷新它们。
- 如果`enable_refresh_virtual_column_after_write`设置为1（默认），则在数据更新后自动刷新表的虚拟列。但是，如果未启用此设置，则需要手动刷新虚拟列。

## 语法

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## 示例

此示例刷新名为'test'的表的虚拟列：

```sql
REFRESH VIRTUAL COLUMN FOR test;
```