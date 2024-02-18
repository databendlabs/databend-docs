---
title: 修改网络策略
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.26"/>

修改Databend中现有的网络策略。

## 语法

```sql
ALTER NETWORK POLICY [ IF EXISTS ] <policy_name>
    SET [ ALLOWED_IP_LIST = ('allowed_ip1', 'allowed_ip2', ...) ]
    [ BLOCKED_IP_LIST = ('blocked_ip1', 'blocked_ip2', ...) ]
    [ COMMENT = 'comment' ]
```

| 参数              | 描述                                                                                                                                                                                                                                                      |
|-----------------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| policy_name     	| 指定要修改的网络策略的名称。                                                                                                                                                                                                                             |
| ALLOWED_IP_LIST 	| 指定要为策略更新的允许的IP地址范围的逗号分隔列表。这将用提供的新列表覆盖现有的允许IP地址列表。                                                                                                                                                          |
| BLOCKED_IP_LIST 	| 指定要为策略更新的阻止的IP地址范围的逗号分隔列表。这将用提供的新列表覆盖现有的阻止IP地址列表。如果此参数设置为空列表()，则会移除所有阻止的IP地址限制。                                                                                                  |
| COMMENT         	| 一个可选参数，用于更新与网络策略关联的描述或评论。                                                                                                                                                                                                      |

:::note
此命令提供了更新允许的IP列表或阻止的IP列表的灵活性，同时保留另一个列表不变。ALLOWED_IP_LIST 和 BLOCKED_IP_LIST 都是可选参数。
:::

## 示例

```sql
-- 修改网络策略 test_policy 以将阻止的IP地址列表从 ('192.168.1.99') 更改为 ('192.168.1.10'):
ALTER NETWORK POLICY test_policy SET BLOCKED_IP_LIST=('192.168.1.10')

-- 更新网络策略 test_policy 以允许IP地址范围 ('192.168.10.0', '192.168.20.0') 并移除任何阻止的IP地址限制。同时，将评论更改为 'new comment':

ALTER NETWORK POLICY test_policy SET ALLOWED_IP_LIST=('192.168.10.0', '192.168.20.0') BLOCKED_IP_LIST=() COMMENT='new comment'
```