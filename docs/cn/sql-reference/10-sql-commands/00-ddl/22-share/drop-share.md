---
title: DROP SHARE
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在提供方租户中删除 Share。

## 语法

```sql
DROP SHARE [ IF EXISTS ] <share_name>
```

## 使用说明

- 此语句不删除提供方的数据库、表或连接。
- 消费方的共享数据库保留，但读取会失败。
- 同名的新 Share 是不同的 Share，不能修复共享数据库。
- 删除共享数据库时，在消费方租户中使用 `DROP DATABASE`。

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
DROP SHARE IF EXISTS sales_share;
```
