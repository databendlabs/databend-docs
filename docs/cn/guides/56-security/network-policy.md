---
title: 网络策略
---

Databend中的网络策略是一种配置机制，旨在管理和执行系统内用户的网络访问控制。它允许您定义一组规则，用于管理特定用户的允许和阻止的IP地址范围，从而有效控制其网络级别的访问。

例如，假设您希望定义一个特定的IP地址范围，供特定用户访问Databend。在这种情况下，如果用户尝试从预定义范围之外的IP地址连接到Databend，即使使用准确的登录凭据，Databend也会拒绝连接。此机制确保访问仅限于指定的IP范围，从而提高安全性并在网络级别实施控制。

### 实施网络策略

要在Databend中实施网络策略，您需要创建一个网络策略，在其中指定您希望允许或限制的IP地址。然后，使用[ALTER USER](/sql/sql-commands/ddl/user/user-alter-user)命令将此网络策略与特定用户关联。需要注意的是，单个网络策略可以与多个用户关联，只要它们符合相同的策略标准。有关用于管理Databend中掩码策略的命令，请参阅[网络策略](/sql/sql-commands/ddl/network-policy/)。

### 使用示例

此示例演示了创建一个具有指定允许和阻止IP地址的网络策略，然后将此策略与用户关联以控制网络访问。该网络策略允许从192.168.1.0到192.168.1.255范围内的所有IP地址，但特定的IP地址192.168.1.99除外。

```sql
-- 创建网络策略
CREATE NETWORK POLICY sample_policy
    ALLOWED_IP_LIST=('192.168.1.0/24')
    BLOCKED_IP_LIST=('192.168.1.99')
    COMMENT='示例';

SHOW NETWORK POLICIES;

Name         |Allowed Ip List          |Blocked Ip List|Comment    |
-------------+-------------------------+---------------+-----------+
sample_policy|192.168.1.0/24           |192.168.1.99   |示例       |

-- 创建用户
CREATE USER sample_user IDENTIFIED BY 'databend';

-- 将网络策略与用户关联
ALTER USER sample_user WITH SET NETWORK POLICY='sample_policy';
```