---
title: Node.js
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend使您能够使用Databend Driver Node.js绑定开发与Databend交互的Node.js程序。该驱动程序提供了一个接口，用于连接到Databend并执行操作，例如执行SQL查询和检索结果。使用Databend驱动程序，您可以利用Databend强大的分布式计算能力构建可扩展的数据处理应用程序。有关驱动程序的更多信息，请访问https://www.npmjs.com/package/databend-driver。

要安装Node.js的Databend驱动程序：

```shell
npm install --save databend-driver
```

:::note
在安装驱动程序之前，请确保满足以下先决条件：

- 在要安装驱动程序的环境中已经安装了Node.js。
- 确保您可以运行`node`和`npm`命令。
- 根据您的环境，您可能需要sudo权限来安装驱动程序。
:::

## 教程-1：使用Node.js集成Databend

在开始之前，请确保您已成功安装了本地Databend。有关详细说明，请参见[本地和Docker部署](/doc/deploy/deploying-local)。

### 步骤1. 准备SQL用户账户

要将程序连接到Databend并执行SQL操作，您必须在代码中提供具有适当权限的SQL用户账户。如果需要，请在Databend中创建一个用户，并确保SQL用户仅具有所需的权限以确保安全。

本教程使用一个名为'user1'，密码为'abc123'的SQL用户作为示例。由于程序将数据写入Databend，因此用户需要拥有ALL权限。有关如何管理SQL用户及其权限的详细信息，请参见[用户和角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤2. 编写Node.js程序

<StepsWrap>

<StepContent number="1" title="将以下代码复制并粘贴到名为databend.js的文件中：">

```js title='databend.js'
const { Client } = require('databend-driver');

const dsn = process.env.DATABEND_DSN
    ? process.env.DATABEND_DSN
    : "databend://user1:abc123@localhost:8000/default?sslmode=disable";

async function create_conn() {
    this.client = new Client(dsn);
    this.conn = await this.client.getConn();
    console.log('Connected to Databend Server!');
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
    select_books()
});
```

</StepContent>

<StepContent number="2" title="运行node databend.js">

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

## 教程-2：使用Node.js集成Databend Cloud

在开始之前，请确保您已成功创建了一个仓库并获取了连接信息。有关如何执行此操作，请参见[连接到仓库](/doc/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤1. 创建一个Node.js包

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

### 步骤2. 添加依赖项

安装Node.js的Databend驱动程序：

```bash
$ npm install --save databend-driver
```

在`package.json`中添加一个新的NPM脚本：

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

### 步骤3. 使用databend-driver连接

创建一个名为`index.js`的文件，并添加以下代码：

```javascript
const { Client } = require('databend-driver');

const dsn = process.env.DATABEND_DSN
    ? process.env.DATABEND_DSN
    : "databend://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}";

async function create_conn() {
    this.client = new Client(dsn);
    this.conn = await this.client.getConn();
    console.log('Connected to Databend Server!');
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
    select_data()
});
```

:::tip
将代码中的{USER}、{PASSWORD}、{WAREHOUSE_HOST}和{DATABASE}替换为您的连接信息。有关如何获取连接信息，请参见[连接到仓库](/doc/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 步骤4. 使用NPM运行示例

```shell
$ npm run run-example
```