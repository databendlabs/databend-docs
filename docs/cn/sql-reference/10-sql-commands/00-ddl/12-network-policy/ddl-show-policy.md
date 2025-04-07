```md
---
title: SHOW NETWORK POLICIES
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.26"/>

显示 Databend 中所有现有网络策略的列表。它提供有关可用网络策略的信息，包括它们的名称以及是否配置了任何允许或阻止的 IP 地址列表。

## 语法

```sql
SHOW NETWORK POLICIES
```

## 示例

```sql
SHOW NETWORK POLICIES;

Name        |Allowed Ip List |Blocked Ip List|Comment     |
------------+----------------+---------------+------------+
test_policy |192.168.1.0/24  |192.168.1.99   |test comment|
test_policy1|192.168.100.0/24|               |            |
```