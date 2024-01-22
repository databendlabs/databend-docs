---
title: 网络策略
---

Databend中的网络策略是一种配置机制，旨在为系统内的用户管理和执行网络访问控制。它允许您定义一组规则，以控制特定用户允许和阻止的IP地址范围，有效地控制他们的网络级别访问权限。

例如，想象一种情况，您希望为特定用户定义一个独特的IP地址范围，该用户可以使用这个范围来访问Databend。在这种情况下，如果用户尝试从预定义范围之外的IP地址与Databend建立连接，即使使用准确的登录凭据，Databend也会拒绝连接。这种机制保证了访问仅限于指定的IP范围内，从而提高了安全性，并在网络级别执行了控制。

### 实施网络策略

要在Databend中实施网络策略，您需要创建一个网络策略，在其中指定您想要允许或限制的IP地址。之后，您可以使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将这个网络策略与特定用户关联起来。需要注意的是，单个网络策略可以与多个用户关联，只要它们符合相同的策略标准。有关在Databend中管理屏蔽策略的命令，请参见 [网络策略](/sql/sql-commands/ddl/network-policy/)。

### 使用示例

此示例演示了创建一个指定允许和阻止的IP地址的网络策略，并将此策略与用户关联起来以控制网络访问。网络策略允许所有从192.168.1.0到192.168.1.255的IP地址，除了特定的IP地址192.168.1.99。

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