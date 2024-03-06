---
title: 备份和恢复 Databend 架构数据
sidebar_label: 备份和恢复架构数据
description:
  如何备份和恢复架构数据
---

本指南将介绍如何使用 mydumper 工具备份和恢复存储在元服务中的架构数据。

## 开始之前

* **Databend :** 确保 Databend 正在运行且可访问，参见[如何部署 Databend](/guides/deploy)。
* **mydumper**: [如何安装 mydumper](https://github.com/mydumper/mydumper)。

:::caution

mydumper 仅导出存储在 Databend 元服务中的 Databend 架构（包括数据库和表），请不要使用它导出数据！

:::

如果您没有用于转储的 Databend 用户，请创建一个：

```shell
mysql -h127.0.0.1 -uroot -P3307
```

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

## 从 Databend 导出架构

```shell
mydumper --host 127.0.0.1 --user user1 --password abc123 --port 3307 \
--no-locks \
--no-data \
--database test_db \
--outputdir /tmp/test_db
```

:::tip
`--host`: 不要转储或导入表数据。

`--no-locks`: 不执行临时共享读锁。

`--no-data`: 不要转储或导入表数据。

`--database`: 要转储的数据库。

`--outputdir`: 输出文件的目录。
:::

`/tmp/test_db` 目录看起来像这样：
```shell
tree /tmp/test_db/ 
├── metadata
├── test_db-schema-create.sql
└── test_db.t1-schema.sql
```

## 将架构恢复到 Databend

要将架构恢复到新的 Databend 中，请使用 `myloader` 导入 `/tmp/test_db` 目录。

```shell
myloader --host 127.0.0.1 --user user1 --password abc123 --port 3307 \
--directory /tmp/test_db/
```
:::tip
`--directory`: 要导入的转储目录。
:::