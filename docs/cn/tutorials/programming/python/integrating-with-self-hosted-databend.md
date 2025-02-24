---
title: 与私有化部署的 Databend 集成
---

本教程演示如何使用 Python 连接到本地部署的 Databend 实例。我们将介绍三种方法——`databend-driver`、使用连接器的 `databend-sqlalchemy` 和使用引擎的 `databend-sqlalchemy`——来执行创建数据库、添加表、插入数据、查询和清理资源等基本操作。

## 开始前准备

开始前，请确保已成功在本地安装 Databend。详细说明请参阅[本地与 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

## 步骤 1：准备 SQL 用户账户

要将程序连接到 Databend 并执行 SQL 操作，必须在代码中提供一个具有适当权限的 SQL 用户账户。如需创建，请确保该 SQL 用户仅拥有必要的权限以保证安全。

本教程使用名为 'user1' 密码为 'abc123' 的 SQL 用户为例。由于程序将向 Databend 写入数据，用户需要 ALL 权限。有关管理 SQL 用户及其权限的详细信息，请参阅[用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## 步骤 2：编写 Python 程序

在此步骤中，您将创建一个与 Databend 通信的简单 Python 程序。程序将涉及创建表、插入数据和执行数据查询等任务。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-driver" label="databend-driver">

1. 安装 databend-driver。

```shell
pip install databend-driver
```

2. 将以下代码复制到文件 `main.py`：

```python title='main.py'
from databend_driver import BlockingDatabendClient

# 连接到本地 Databend，使用 SQL 用户 'user1' 和密码 'abc123' 为例。
client = BlockingDatabendClient('databend://user1:abc123@127.0.0.1:8000/?sslmode=disable')

# 创建游标以与 Databend 交互
cursor = client.cursor()

# 创建数据库并使用
cursor.execute("CREATE DATABASE IF NOT EXISTS bookstore")
cursor.execute("USE bookstore")

# 创建表
cursor.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")

# 向表中插入数据
cursor.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

# 从表中查询数据
cursor.execute("SELECT * FROM booklist")
rows = cursor.fetchall()

# 打印结果
for row in rows:
    print(f"{row[0]} {row[1]} {row[2]}")

# 删除表和数据库
cursor.execute('DROP TABLE booklist')
cursor.execute('DROP DATABASE bookstore')

# 关闭游标
cursor.close()
```

3. 运行 `python main.py`：

```bash
python main.py
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy（连接器）">

您将使用 databend-sqlalchemy 库创建连接器实例，并使用游标对象执行 SQL 查询。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制到文件 `main.py`：

```python title='main.py'
from databend_sqlalchemy import connector

# 连接到本地 Databend，使用 SQL 用户 'user1' 和密码 'abc123' 为例。
# 请根据实际情况替换值，但保持格式一致。
conn = connector.connect(f"http://user1:abc123@127.0.0.1:8000").cursor()
conn.execute("CREATE DATABASE IF NOT EXISTS bookstore")
conn.execute("USE bookstore")
conn.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")
conn.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")
conn.execute('SELECT * FROM booklist')

results = conn.fetchall()
for (title, author, date) in results:
  print("{} {} {}".format(title, author, date))
conn.execute('drop table booklist')
conn.execute('drop database bookstore')

# 关闭连接
conn.close()
```

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy（引擎）">

您将使用 databend-sqlalchemy 库创建引擎实例，并通过 connect 方法创建连接来执行查询。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码复制到文件 `main.py`：

```python title='main.py'
from sqlalchemy import create_engine, text

# 连接到本地 Databend，使用 SQL 用户 'user1' 和密码 'abc123' 为例。
# 请根据实际情况替换值，但保持格式一致。
# 设置 secure=False 表示客户端将使用 HTTP 而非 HTTPS 连接 Databend。
engine = create_engine("databend://user1:abc123@127.0.0.1:8000/default?secure=False")

connection1 = engine.connect()
connection2 = engine.connect()

with connection1.begin() as trans:
    connection1.execute(text("CREATE DATABASE IF NOT EXISTS bookstore"))
    connection1.execute(text("USE bookstore"))
    connection1.execute(text("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)"))
    connection1.execute(text("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')"))

result = connection2.execute(text("SELECT * FROM booklist"))
results = result.fetchall()

for (title, author, date) in results:
    print("{} {} {}".format(title, author, date))

# 关闭连接
connection1.close()
connection2.close()
engine.dispose()
```

3. 运行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>
</Tabs>
