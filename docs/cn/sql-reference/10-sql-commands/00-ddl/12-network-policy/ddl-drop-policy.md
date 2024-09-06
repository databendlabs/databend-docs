---
title: DROP NETWORK POLICY
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.26"/>

从Databend中删除一个现有的网络策略。当你删除一个网络策略时，它将从Databend中移除，并且其关联的允许和阻止IP地址列表的规则将不再生效。请注意，在删除网络策略之前，确保该策略没有与任何用户关联。

## 语法

```sql
DROP NETWORK POLICY [ IF EXISTS ] <policy_name>
```

## 示例

```sql
DROP NETWORK POLICY test_policy
```