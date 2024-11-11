---
title: CREATE NETWORK POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.341"/>

在Databend中创建一个新的网络策略。

## 语法

```sql
CREATE [ OR REPLACE ] NETWORK POLICY [ IF NOT EXISTS ] <policy_name>
    ALLOWED_IP_LIST = ( 'allowed_ip1', 'allowed_ip2', ... )
    [ BLOCKED_IP_LIST = ( 'blocked_ip1', 'blocked_ip2', ...) ]
    [ COMMENT = 'comment' ]
```

| 参数           	| 描述                                                                                                                                                                                      	|
|-----------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| policy_name     	| 指定要创建的网络策略的名称。                                                                                                                                          	|
| ALLOWED_IP_LIST 	| 指定策略允许的IP地址范围的逗号分隔列表。与此策略关联的用户可以使用指定的IP范围访问网络。                    	|
| BLOCKED_IP_LIST 	| 指定策略阻止的IP地址范围的逗号分隔列表。与此策略关联的用户仍然可以从ALLOWED_IP_LIST访问网络，但BLOCKED_IP_LIST中指定的IP将被限制访问。 	|
| COMMENT         	| 用于为网络策略添加描述或注释的可选参数。                                                                                                               	|

## 示例

此示例演示了创建一个具有指定允许和阻止IP地址的网络策略，然后将此策略与用户关联以控制网络访问。该网络策略允许192.168.1.0到192.168.1.255范围内的所有IP地址，但特定的IP地址192.168.1.99除外。

```sql
-- 创建网络策略
CREATE NETWORK POLICY sample_policy
    ALLOWED_IP_LIST=('192.168.1.0/24')
    BLOCKED_IP_LIST=('192.168.1.99')
    COMMENT='Sample';

SHOW NETWORK POLICIES;

Name         |Allowed Ip List          |Blocked Ip List|Comment    |
-------------+-------------------------+---------------+-----------+
sample_policy|192.168.1.0/24           |192.168.1.99   |Sample     |

-- 创建用户
CREATE USER sample_user IDENTIFIED BY 'databend';

-- 将网络策略与用户关联
ALTER USER sample_user WITH SET NETWORK POLICY='sample_policy';
```