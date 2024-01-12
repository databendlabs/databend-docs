---
title: 创建网络策略
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.26"/>

在Databend中创建一个新的网络策略。

## 语法

```sql
CREATE NETWORK POLICY [IF NOT EXISTS] <policy_name>
    ALLOWED_IP_LIST=('allowed_ip1', 'allowed_ip2', ...)
    [BLOCKED_IP_LIST=('blocked_ip1', 'blocked_ip2', ...)]
    [COMMENT='comment']
```

| 参数              | 描述                                                                                                                                                                                                 |
|-----------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| policy_name     	| 指定要创建的网络策略的名称。                                                                                                                                                                         |
| ALLOWED_IP_LIST 	| 指定策略允许的IP地址范围的逗号分隔列表。与此策略关联的用户可以使用指定的IP范围访问网络。                                                                                                             |
| BLOCKED_IP_LIST 	| 指定策略阻止的IP地址范围的逗号分隔列表。与此策略关联的用户仍然可以从ALLOWED_IP_LIST访问网络，但是在BLOCKED_IP_LIST中指定的IP将被限制访问。                                                            |
| COMMENT         	| 一个可选参数，用于为网络策略添加描述或注释。                                                                                                                                                         |

## 示例

此示例演示了创建一个指定允许和阻止IP地址的网络策略，并将此策略与用户关联以控制网络访问。网络策略允许从192.168.1.0到192.168.1.255的所有IP地址，除了特定的IP地址192.168.1.99。

```sql
-- 创建一个网络策略
CREATE NETWORK POLICY sample_policy
    ALLOWED_IP_LIST=('192.168.1.0/24')
    BLOCKED_IP_LIST=('192.168.1.99')
    COMMENT='示例';

SHOW NETWORK POLICIES;

Name         |Allowed Ip List          |Blocked Ip List|Comment    |
-------------+-------------------------+---------------+-----------+
sample_policy|192.168.1.0/24           |192.168.1.99   |示例       |

-- 创建一个用户
CREATE USER sample_user IDENTIFIED BY 'databend';

-- 将网络策略与用户关联
ALTER USER sample_user WITH SET NETWORK POLICY='sample_policy';
```