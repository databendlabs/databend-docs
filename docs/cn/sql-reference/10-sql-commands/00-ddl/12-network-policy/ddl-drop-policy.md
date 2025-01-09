---
title: DROP NETWORK POLICY
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.26"/>

从 Databend 中删除一个现有的网络策略。当你删除一个网络策略时，它将被从 Databend 中移除，其关联的允许和阻止 IP 地址列表的规则也将不再生效。请注意，在删除网络策略之前，请确保该策略未与任何用户关联。

## 语法

```sql
DROP NETWORK POLICY [ IF EXISTS ] <policy_name>
```

## 示例

```sql
DROP NETWORK POLICY test_policy
```