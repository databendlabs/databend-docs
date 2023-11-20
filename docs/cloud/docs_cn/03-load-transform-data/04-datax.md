---
title: 使用 DataX 迁移数据
---

[DataX](https://github.com/alibaba/DataX) 是阿里巴巴集团内被广泛使用的离线数据同步工具/平台，实现包括 MySQL、Oracle、SqlServer、Postgre、HDFS、Hive、ADS、HBase、TableStore(OTS)、MaxCompute(ODPS)、DRDS 等各种异构数据源之间高效的数据同步功能。

[Databend Writer](https://github.com/alibaba/DataX/blob/2ebc1bb447af8856d6cbf359f202e9bf53e1635a/databendwriter/doc/databendwriter-CN.md) 是一个 DataX 的插件，用于从 DataX 中写入数据到 Databend 表中。该插件基于 Databend JDBC driver，它使用 RESTful HTTP 协议在开源的 Databend 和 Databend Cloud 上执行查询。

## 部署 DataX

### 系统要求

部署 DataX 的系统要求请参考：https://github.com/alibaba/DataX/blob/master/userGuid.md#system-requirements

### 下载 & 编译 DataX 源码

```shell
# 下载 DataX 源码：
git clone git@github.com:alibaba/DataX.git

# 通过 Maven 打包:
cd  {DataX_source_code_home}
mvn -U clean package assembly:assembly -Dmaven.test.skip=true
```



## 教程 - 使用 DataX 从 MySQL 迁移到 Databend

在这个教程中，您将从 MySQL Server 中创建一个表格并插入一些数据，然后再使用 DataX 将数据迁移到 Databend。开始之前，请确认已经成功部署 MySQL Server、Databend 和 DataX。

### 第一步：创建迁移的数据库和表格

1. 在 MySQL Server 中创建一个 SQL 用户和需要迁移的表格。

```sql
create user 'mysqlu1'@'%' identified by 'databend';
grant all on *.* to 'mysqlu1'@'%';
create database db;
create table db.tb01(id int, d double, t TIMESTAMP,  col1 varchar(10));
insert into db.tb01 values(1, 3.1,now(), 'test1'), (1, 4.1,now(), 'test2'), (1, 4.1,now(), 'test2');
```

2. 在 Databend 中创建对应的表结构。

```sql
create database migrate_db;
create table migrate_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

### 第二步：创建 DataX 配置文件

1. 复制以下代码创建一个 JSON 文件，命名为`mysql_demo.json`:

```json
{
  "job": {
    "content": [
      {
        "reader": {
          "name": "mysqlreader",
          "parameter": {
            "username": "mysqlu1",
            "password": "databend",
            "column": [
              "id", "d", "t", "col1"
            ],
            "connection": [
              {
                "jdbcUrl": [
                  "jdbc:mysql://127.0.0.1:3307/db"
                ],
                "driver": "com.mysql.jdbc.Driver",
                "table": [
                  "tb01"
                ]
              }
            ]
          }
        },
        "writer": {
          "name": "databendwriter",
          "parameter": {
            "username": "databend",
            "password": "databend",
            "column": [
              "id", "d", "t", "col1"
            ],
            "preSql": [
            ],
            "postSql": [
            ],
            "connection": [
              {
                "jdbcUrl": "jdbc:databend://localhost:8000/migrate_db",
                "table": [
                  "tb01"
                ]
              }
            ]
          }
        }
      }
    ],
    "setting": {
      "speed": {
        "channel": 1
       }
    }
  }
}
```

2. 运行 DataX:

```shell
$ cd {YOUR_DATAX_DIR_BIN}
python datax.py ./mysql_demo.json
```

3. 在 Databend 查看同步的数据：

```sql
select * from migrate_db.tb01;
+------+------+----------------------------+-------+
| id   | d    | t                          | col1  |
+------+------+----------------------------+-------+
|    1 |  3.1 | 2023-02-01 07:11:08.500000 | test1 |
|    1 |  4.1 | 2023-02-01 07:11:08.501000 | test2 |
|    1 |  4.1 | 2023-02-01 07:11:08.501000 | test2 |
+------+------+----------------------------+-------+
```