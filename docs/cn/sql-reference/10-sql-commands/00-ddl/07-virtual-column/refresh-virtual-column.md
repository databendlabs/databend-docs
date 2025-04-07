---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

刷新表的 virtual columns。在以下情况下，virtual columns 需要刷新：

- 在为已包含 Variant 数据的表创建 virtual columns 后，需要刷新 virtual columns。
- 修改表的 virtual columns 时，在修改后刷新它们。
- 如果 `enable_refresh_virtual_column_after_write` 设置为 1（默认），则在数据更新后会自动刷新表的 virtual columns。但是，如果未启用此设置，则需要手动刷新 virtual columns。

## 语法

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## 示例

此示例刷新名为“test”的表的 virtual columns：

```sql
REFRESH VIRTUAL COLUMN FOR test;
```