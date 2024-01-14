---
title: 删除网络策略
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.26"/>

从Databend中删除现有的网络策略。当你删除一个网络策略时，它将从Databend中移除，并且其关联的允许和阻止的IP地址列表规则将不再生效。请注意，在删除网络策略之前，确保没有任何用户与此策略关联。

## 语法

```sql
DROP NETWORK POLICY [IF EXISTS] <policy_name>
```

## 示例

```sql
DROP NETWORK POLICY test_policy
```