---
title: 显示网络策略
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.26"/>

显示Databend中所有现有网络策略的列表。它提供了有关可用网络策略的信息，包括它们的名称以及是否配置了任何允许或阻止的IP地址列表。

## 语法

```sql
SHOW NETWORK POLICIES
```

## 示例

```sql
SHOW NETWORK POLICIES;

Name        |Allowed Ip List   |Blocked Ip List|Comment     |
------------+------------------+---------------+------------+
test_policy |192.168.1.0/24    |192.168.1.99   |test comment|
test_policy1|192.168.100.0/24  |               |            |
```