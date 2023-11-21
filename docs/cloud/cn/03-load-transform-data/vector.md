---
title: Vector
---


[Vector](https://vector.dev/) 是一个高性能观测数据管道，使各组织能够控制其观测数据管道。搜集、转换和路由您所有的日志、计量和痕迹到您今天想要的任何供应商和您明天可能想要的任何其他供应商。Vector 允许大幅降低成本，进行新的数据丰富，以及在您需要的地方进行数据安全，而不是在对您的供应商最方便的地方。开源，最多比每个替代品快 10x。

Vector 本来支持将数据传输到 [数据端作为 sink](https://vector.dev/docs/reference/configuration/sinks/databend/)这意味着 Vector 可以发送数据到 Databend 以便存储或进一步处理。Databend 是 Vector 收集和处理数据的目的地。配置 Vector 作为汇来使用 Databend，您可以将数据从 Vector 传输到 Databend，启用高效数据分析、存储和检索。

## 与 Vector 集成

要集成 Databend 和 Vector, 首先在 Databend 中创建一个 SQL 帐户并分配适当的权限。此帐户将用于 Vector 和 Databend 之间的通信和数据传输。然后在 Vector 配置中，将 Databend 设置为一个硬拷贝。

### 第 1 步：在 Databend 中创建 SQL 用户

关于如何在 Databend 中创建 SQL 用户并授予适当权限的指示，请参阅 [创建用户](/sql/sql-commands/ddl/user/user-create-user)。下面是一个用密码 *abc123*创建用户名为 *用户 1* 的示例：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE DATABASE nginx;

GRANT INSERT ON nginx.* TO user1;
```

### 步骤 2：在 Vector 中配置 Databend

在这个步骤中，通过指定诸如输入源等必要的设置，将 Databend 设为 Vector 中的汇。Databend 集成压缩、数据库、端点、表和身份验证凭据 (用户名和密码)。下面是一个将 Databend 设置为汇的简单例子。关于配置参数的全面列表，请在 https://vector.dev/docs/reference/configuration/sinks/databend/ 上查阅 Vector 文档

```toml title='vector.toml'
...

[sinks.databend_sink]
type = "databend"
inputs = [ "my-source-or-transform-id" ] # input source
compression = "none"
database = "nginx" #Your database
endpoint = "http://localhost:8000"
table = "mytable" #Your table

...

[sinks.databend_sink.auth]
strategy = "basic"
user = "user1" #Databend username
password = "abc123" #Databend password

...
```