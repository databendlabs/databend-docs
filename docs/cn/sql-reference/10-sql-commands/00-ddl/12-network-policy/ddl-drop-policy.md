---
title: DROP NETWORK POLICY
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.26"/>

从 Databend 中删除现有的网络策略。删除网络策略后，它将从 Databend 中移除，并且其关联的允许和阻止 IP 地址列表的规则将不再生效。请注意，在删除网络策略之前，请确保此策略未与任何用户关联。

## 语法

```sql
DROP NETWORK POLICY [ IF EXISTS ] <policy_name>
```

## 示例

```sql
DROP NETWORK POLICY test_policy
```