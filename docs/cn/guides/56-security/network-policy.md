---
title: 网络策略
---

Databend 中的网络策略是一种配置机制，旨在管理和实施系统中用户的网络访问控制。它允许您定义一组规则，用于管理特定用户允许和阻止的 IP 地址范围，从而有效地控制其网络级访问。

例如，假设您希望定义一个特定用户可用于访问 Databend 的不同 IP 地址范围。在这种情况下，如果用户尝试从超出预定义范围的 IP 地址与 Databend 建立连接，即使具有准确的登录凭据，Databend 也会拒绝该连接。这种机制保证了访问权限保持在指定的 IP 范围内，从而提高了安全性并在网络级别强制实施控制。

### 实施网络策略

要在 Databend 中实施网络策略，您需要创建一个网络策略，在其中指定要允许或限制的 IP 地址。之后，使用 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令将此网络策略与特定用户关联。重要的是要注意，单个网络策略可以与多个用户关联，只要它们符合相同的策略标准即可。有关用于管理 Databend 中掩码策略的命令，请参阅 [网络策略](/sql/sql-commands/ddl/network-policy/)。

### 使用示例

此示例演示了如何创建具有指定允许和阻止的 IP 地址的网络策略，然后将此策略与用户关联以控制网络访问。该网络策略允许 192.168.1.0 到 192.168.1.255 范围内的所有 IP 地址，但特定 IP 地址 192.168.1.99 除外。

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