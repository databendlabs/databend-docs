```
---
title: Node.js
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 使您能够开发使用 Databend Driver Node.js Binding 与 Databend 交互的 Node.js 程序。该驱动程序提供了一个接口，用于连接到 Databend 并执行 SQL 查询和检索结果等操作。借助 Databend 驱动程序，您可以利用 Databend 强大的分布式计算能力，并构建可扩展的数据处理应用程序。访问 https://www.npmjs.com/package/databend-driver 了解有关该驱动程序的更多信息。

要安装 Node.js 的 Databend 驱动程序：

```shell
npm install --save databend-driver
```

:::note
在安装驱动程序之前，请确保满足以下先决条件：

- 必须已在要安装驱动程序的环境中安装 Node.js。
- 确保可以运行 `node` 和 `npm` 命令。
- 根据您的环境，您可能需要 sudo 权限才能安装驱动程序。
  :::

## 数据类型映射

下表说明了 Databend 常规数据类型与其对应的 Node.js 等效项之间的对应关系：

| Databend  | Node.js |
| --------- | ------- |
| BOOLEAN   | Boolean |
| TINYINT   | Number  |
| SMALLINT  | Number  |
| INT       | Number  |
| BIGINT    | Number  |
| FLOAT     | Number  |
| DOUBLE    | Number  |
| DECIMAL   | String  |
| DATE      | Date    |
| TIMESTAMP | Date    |
| VARCHAR   | String  |
| BINARY    | Buffer  |

下表说明了 Databend 半结构化数据类型与其对应的 Node.js 等效项之间的对应关系：

| Databend | Node.js |
| -------- | ------- |
| ARRAY    | Array   |
| TUPLE    | Array   |
| MAP      | Object  |
| VARIANT  | String  |
| BITMAP   | String  |
| GEOMETRY | String  |

## Databend Node.js 驱动程序行为摘要

Node.js 驱动程序提供与 Rust Driver 绑定类似的功能，具有相同名称的函数具有相同的逻辑和功能。

下表总结了 Node.js Driver 的主要行为和函数及其用途：

| 函数名称         | 描述                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `info`         | 返回客户端的连接信息。                                                                                                             |
| `version`      | 返回执行 `SELECT VERSION()` 语句的结果。                                                                                              |
| `exec`         | 执行 SQL 语句并返回受影响的行数。                                                                                                        |
| `query_iter`   | 执行 SQL 查询并返回一个迭代器，用于逐行处理结果。                                                                                                  |
| `query_iter_ext` | 执行 SQL 查询并返回一个迭代器，其中包含有关结果的统计信息。                                                                                              |
| `query_row`    | 执行 SQL 查询并返回单个行结果。                                                                                                        |
| `stream_load`  | 将数据上传到内置的 Stage 并使用 [stage attachment](/developer/apis/http#stage-attachment) 执行插入/替换。 |

## 教程 1：使用 Node.js 与 Databend 集成

在开始之前，请确保已成功安装本地 Databend。有关详细说明，请参阅 [本地和 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

### 步骤 1. 准备一个 SQL 用户帐户

要将您的程序连接到 Databend 并执行 SQL 操作，您必须在代码中提供具有适当权限的 SQL 用户帐户。如果需要，在 Databend 中创建一个，并确保 SQL 用户仅具有必要的权限以确保安全。

本教程使用名为“user1”且密码为“abc123”的 SQL 用户作为示例。由于该程序会将数据写入 Databend，因此该用户需要 ALL 权限。有关如何管理 SQL 用户及其权限，请参阅 [用户 & 角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤 2. 编写一个 Node.js 程序

<StepsWrap>

<StepContent number="1">

### 将以下代码复制并粘贴到名为 databend.js 的文件中：

```js title='databend.js'
const { Client } = require("databend-driver");

// Connecting to a local Databend with a SQL user named 'user1' and password 'abc123' as an example.
// Feel free to use your own values while maintaining the same format.
const dsn = process.env.DATABEND_DSN ? process.env.DATABEND_DSN : "databend://user1:abc123@localhost:8000/default?sslmode=disable";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("Connected to Databend Server!");
}

async function select_books() {
  var sql = "CREATE DATABASE IF NOT EXISTS book_db";
  await this.conn.exec(sql);
  console.log("Database created");

  var sql = "USE book_db";
  await this.conn.exec(sql);
  console.log("Database used");

  var sql = "CREATE TABLE IF NOT EXISTS books(title VARCHAR, author VARCHAR, date VARCHAR)";
  await this.conn.exec(sql);
  console.log("Table created");

  var sql = "INSERT INTO books VALUES('Readings in Database Systems', 'Michael Stonebraker', '2004')";
  await this.conn.exec(sql);
  console.log("1 record inserted");

  var sql = "SELECT * FROM books";
  const rows = await this.conn.queryIter(sql);
  const ret = [];
  let row = await rows.next();
  while (row) {
    ret.push(row.values());
    row = await rows.next();
  }
  console.log(ret);
}

create_conn().then(conn => {
  select_books();
});
```

</StepContent>

<StepContent number="2">

### 运行 node databend.js

```text
Connected to Databend Server!
Database created
Database used
Table created
1 record inserted
[ [ 'Readings in Database Systems', 'Michael Stonebraker', '2004' ] ]
```

</StepContent>

</StepsWrap>

## 教程 2：使用 Node.js 与 Databend Cloud 集成

在开始之前，请确保已成功创建计算集群并获取连接信息。有关如何执行此操作，请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 创建一个 Node.js 包

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

### 步骤 2. 添加依赖项

安装 Node.js 的 Databend 驱动程序：

```bash
$ npm install --save databend-driver
```

将新的 NPM 脚本添加到 `package.json`：

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

### 步骤 3. 使用 databend-driver 连接

创建一个名为 `index.js` 的文件，其中包含以下代码：

```javascript
const { Client } = require("databend-driver");

const dsn = process.env.DATABEND_DSN ? process.env.DATABEND_DSN : "databend://{USER}:{PASSWORD}@${HOST}:443/{DATABASE}?&warehouse={WAREHOUSE_NAME}";

async function create_conn() {
  this.client = new Client(dsn);
  this.conn = await this.client.getConn();
  console.log("Connected to Databend Server!");
}

async function select_data() {
  let sql_table_create = `CREATE TABLE IF NOT EXISTS data (
		i64 Int64,
		u64 UInt64,
		f64 Float64,
		s   String,
		s2  String,
		d   Date,
		t   DateTime)`;

  await this.conn.exec(sql_table_create);

  let sql_insert = "INSERT INTO data VALUES ('1234', '2345', '3.1415', 'test', 'test2', '2021-01-01', '2021-01-01 00:00:00');";
  await this.conn.exec(sql_insert);

  let sql_select = "SELECT * FROM data";
  const rows = await this.conn.queryIter(sql_select);
  const ret = [];
  let row = await rows.next();
  while (row) {
    ret.push(row.values());
    row = await rows.next();
  }
  console.log(ret);
}

create_conn().then(conn => {
  select_data();
});
```

:::tip
将代码中的 `{USER}, {PASSWORD}, {HOST}, {WAREHOUSE_NAME} and {DATABASE}` 替换为您的连接信息。有关如何
获取连接信息，
请参阅 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 步骤 4. 使用 NPM 运行示例

```shell
$ npm run run-example
```