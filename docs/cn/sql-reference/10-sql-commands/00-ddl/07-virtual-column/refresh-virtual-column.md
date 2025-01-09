---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

刷新表的虚拟列。在以下场景中需要刷新虚拟列：

- 在为已包含 Variant 数据的表创建虚拟列后，需要刷新虚拟列。
- 当修改表的虚拟列时，修改后需要刷新虚拟列。
- 如果 `enable_refresh_virtual_column_after_write` 设置为 1（默认值），则在数据更新后会自动刷新表的虚拟列。但是，如果未启用此设置，则需要手动刷新虚拟列。

## 语法

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## 示例

以下示例刷新名为 'test' 的表的虚拟列：

```sql
REFRESH VIRTUAL COLUMN FOR test;
```