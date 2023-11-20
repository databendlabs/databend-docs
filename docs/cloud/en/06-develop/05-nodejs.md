---
title: Node.js
---

This topic shows how to connect to Databend Cloud from a Node.js application
using [databend-driver](https://www.npmjs.com/package/databend-driver).

## Prerequisites

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

## Step 1. Create a Node.js Package

```shell
$ mkdir databend-sample
$ cd databend-sample
$ npm init -y
```

## Step 2. Add Dependencies

Install the Databend driver for Node.js:

```bash
$ npm install --save databend-driver
```

Add a new NPM script to `package.json` :

```diff
 "scripts": {
+  "run-example": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
```

## Step 3. Connect with databend-driver

Create a file named `index.js` with the following code:

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
Replace {USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE} in the code with your connection information. For how to
obtain the connection information,
see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).
:::

## Step 4. Run sample with NPM

```shell
$ npm run run-example
```
