---
title: DROP VIRTUAL COLUMN
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

删除为表创建的 virtual column。

## 语法

```sql
DROP VIRTUAL COLUMN [ IF EXISTS ] FOR <table>
```

## 示例

以下示例删除为名为“test”的表创建的 virtual column：

```sql
DROP VIRTUAL COLUMN FOR test;
```