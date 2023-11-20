---
title: Node.js
---

本主题介绍如何使用 [databend-driver](https://www.npmjs.com/package/databend-driver) 建立从 Node.js 应用程序到 Databend Cloud 的连接。

## 准备工作

在开始之前，请确保您已经成功创建计算集群并获得连接信息。欲了解如何做到这一点，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。

## 第一步：创建 Node.js 包

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

## 第二步：安装依赖

安装 `databend-driver` 作为程序依赖项：

```bash
$ npm install --save databend-driver
```

向 `package.json` 文件添加一个新的 NPM 脚本:

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

## 第三步：用 databend-driver 建立连接

创建名为 `index.js` 的文件，并写入像下面这样的代码：

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
请使用您的连接信息替换代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 。了解如何获取连接信息，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。
:::

## 第四步：通过 NPM 运行示例程序

```shell
$ npm run run-example
```
