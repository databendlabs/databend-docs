---
title: "基于 Python Driver 开发 (自建)"
---

本教程介绍如何通过 Python 连接本地部署的 Databend，并分别使用 `databend-driver`、`databend-sqlalchemy` Connector 以及 Engine 三种方式完成建库、建表、写入、查询与清理等操作。

## 开始之前

请确认已成功安装本地 Databend，详见 [本地与 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

## 步骤 1：准备 SQL 账号

要让程序连接 Databend 并执行 SQL，需要在代码中提供具备相应权限的 SQL 用户。请在 Databend 中创建账号并授予必要权限。本教程示例使用用户名 `user1`、密码 `abc123`，由于程序会写入数据，因此用户需要 ALL 权限。关于 SQL 用户与权限管理，参见 [User & Role](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## 步骤 2：编写 Python 程序

接下来编写一段简单程序与 Databend 交互，完成建表、插数与查询等操作。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="python">
<TabItem value="databend-driver" label="databend-driver">

1. 安装 databend-driver。

```shell
pip install databend-driver
```

2. 将以下代码保存为 `main.py`：

```python title='main.py'
from databend_driver import BlockingDatabendClient

# 示例：使用 SQL 用户 user1/abc123 连接本地 Databend。
client = BlockingDatabendClient('databend://user1:abc123@127.0.0.1:8000/?sslmode=disable')

# 创建游标与 Databend 交互
cursor = client.cursor()

# 创建数据库并切换
cursor.execute("CREATE DATABASE IF NOT EXISTS bookstore")
cursor.execute("USE bookstore")

# 创建表
cursor.execute("CREATE TABLE IF NOT EXISTS booklist(title VARCHAR, author VARCHAR, date VARCHAR)")

# 插入数据
cursor.execute("INSERT INTO booklist VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')")

# 查询数据
cursor.execute("SELECT * FROM booklist")
rows = cursor.fetchall()

# 打印结果
for row in rows:
    print(f"{row[0]} {row[1]} {row[2]}")

# 清理资源
cursor.execute('DROP TABLE booklist')
cursor.execute('DROP DATABASE bookstore')

cursor.close()
```

3. 执行 `python main.py`：

```bash
python main.py
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Object" label="databend-sqlalchemy (Connector)">

该方式使用 databend-sqlalchemy 提供的 connector 对象，再通过 cursor 执行 SQL。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码保存为 `main.py`：

```python title='main.py'
from databend_sqlalchemy import connector

# 示例：使用 SQL 用户 user1/abc123 连接本地 Databend。
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

conn.close()
```

3. 执行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>

<TabItem value="databend-sqlalchemy with Engine" label="databend-sqlalchemy (Engine)">

该方式使用 databend-sqlalchemy 创建 Engine，通过 `connect()` 获取连接并执行 SQL。

1. 安装 databend-sqlalchemy。

```shell
pip install databend-sqlalchemy
```

2. 将以下代码保存为 `main.py`：

```python title='main.py'
from sqlalchemy import create_engine, text

# 示例：使用 SQL 用户 user1/abc123 连接本地 Databend。
# secure=False 表示通过 HTTP（非 HTTPS）连接。
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

connection1.close()
connection2.close()
engine.dispose()
```

3. 执行 `python main.py`：

```text
Readings in Database Systems Michael Stonebraker 2004
```

</TabItem>
</Tabs>
