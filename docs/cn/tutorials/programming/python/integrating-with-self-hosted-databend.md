<think>
好的，我需要处理用户提供的关于如何将Python程序与自托管Databend集成的文档翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调必须保留Markdown结构，不添加或删除链接，不更改URL。这意味着我需要检查每个段落和代码块，确保它们的格式与原文档一致。例如，代码块中的SQL语句和Python代码必须保持原样，即使有错误也不能修改。

接下来，用户提到要保留原始换行和空行。这需要我在翻译时注意段落之间的换行，避免不必要的合并或拆分。同时，不能删除任何内容，包括HTML标签如<Notes>和permalink如{/*examples*/}，这些都需要保留在原来的位置。

关于术语翻译，用户有特定的要求：'time travel'译为'时间回溯'，'warehouse'或'warehouses'译为'计算集群'，'Data Warehouse'译为'数仓'，'Self-Hosted'译为'私有化部署'，而'Databend Cloud'、'Vector'、'Stage'等保持不译。我需要特别注意这些术语，在翻译过程中准确替换，避免遗漏或错误。

在处理JSON文件时，用户指出_category_.json中的键不需要翻译。因此，在遇到类似情况时，我需要确保只翻译值部分，而键保持原样。

用户还特别指出，如果遇到描述'Personal'计划时，应翻译为'基础版'。我需要检查文档中是否有提及该计划，并正确替换。

现在，具体到提供的文档内容，标题是“Integrating with Self-Hosted Databend”，需要将“Self-Hosted”翻译为“私有化部署”，因此标题应为“与私有化部署的Databend集成”。接下来的段落需要逐句翻译，同时注意术语的正确替换。

在代码块部分，例如SQL语句和Python代码，必须保持原样，不进行任何修改。例如，CREATE USER和GRANT语句中的内容不需要翻译，但周围的注释需要翻译成中文，同时保留代码结构。

在Tabs组件中，每个TabItem的标签也需要翻译，例如“databend-driver”保持不译，但标签名称如“databend-sqlalchemy with Object”需要翻译为“databend-sqlalchemy（连接器）”。同时，确保Tabs的groupId和value属性不变。

在翻译过程中，还需要注意保持技术术语的一致性，例如“cursor”可能不需要翻译，但相关操作如“创建游标”需要准确表达。此外，用户提供的示例输出结果，如“Readings in Database Systems Michael Stonebraker 2004”，必须保持原样，不进行任何改动。

最后，检查所有Markdown标记是否正确保留，例如标题的#号、代码块的```符号，以及HTML标签如<Tabs>和<TabItem>是否未被修改。确保没有添加或删除任何空行，保持文档结构与原文档一致。

完成翻译后，再次通读整个文档，确认所有规则都被正确应用，术语替换准确，格式无误。特别是检查是否有误删或误加的<think>标签，确保输出完全符合用户的要求。
</think>

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