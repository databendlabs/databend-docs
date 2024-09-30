---
title: DESC NETWORK POLICY
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.26"/>

显示Databend中特定网络策略的详细信息。它提供了与该策略相关的允许和阻止IP地址列表的信息，以及描述该策略目的或功能的注释（如果有）。

## 语法

```sql
DESC NETWORK POLICY <policy_name>
```

## 示例

```sql
DESC NETWORK POLICY test_policy;

Name       |Allowed Ip List          |Blocked Ip List|Comment    |
-----------+-------------------------+---------------+-----------+
test_policy|192.168.10.0,192.168.20.0|               |new comment|
```