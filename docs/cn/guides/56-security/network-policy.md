---
title: 网络策略
---

在Databend中，网络策略是一种配置机制，旨在管理和执行系统内用户的网络访问控制。它允许您定义一组规则，管理特定用户允许和阻止的IP地址范围，从而有效地控制他们在网络层面的访问。

例如，设想一个场景，您希望定义一个特定的IP地址范围，某个用户可以通过这些IP地址访问Databend。在这种情况下，如果用户尝试从预定义范围之外的IP地址建立与Databend的连接，即使登录凭据准确，Databend也会拒绝该连接。这一机制确保访问仅限于指定的IP范围，从而增强安全性并在网络层面实施控制。

### 实施网络策略

要在Databend中实施网络策略，您需要创建一个网络策略，在其中指定您想要允许或限制的IP地址。之后，使用[ALTER USER](/sql/sql-commands/ddl/user/user-alter-user)命令将此网络策略与特定用户关联。需要注意的是，只要它们符合相同的策略标准，单个网络策略可以与多个用户关联。有关在Databend中管理网络策略的命令，请参阅[网络策略](/sql/sql-commands/ddl/network-policy/)。

### 使用示例

此示例展示了如何创建一个网络策略，指定允许和阻止的IP地址，然后将此策略与用户关联以控制网络访问。该网络策略允许所有IP地址范围从192.168.1.0到192.168.1.255，但特别排除了IP地址192.168.1.99。

```sql
-- 创建网络策略
CREATE NETWORK POLICY sample_policy
    ALLOWED_IP_LIST=('192.168.1.0/24')
    BLOCKED_IP_LIST=('192.168.1.99')
    COMMENT='示例';

SHOW NETWORK POLICIES;

名称             |允许的IP列表          |阻止的IP列表    |注释      |
---------------+---------------------+---------------+-----------+
sample_policy  |192.168.1.0/24       |192.168.1.99   |示例      |

-- 创建用户
CREATE USER sample_user IDENTIFIED BY 'databend';

-- 将网络策略与用户关联
ALTER USER sample_user WITH SET NETWORK POLICY='sample_policy';
```