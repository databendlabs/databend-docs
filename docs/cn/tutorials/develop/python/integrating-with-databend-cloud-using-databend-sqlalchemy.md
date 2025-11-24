---
title: "SQLAlchemy 开发 (Cloud)"
sidebar_label: "SQLAlchemy 开发 (Cloud)"
---

本教程将演示如何借助 `databend-sqlalchemy` 连接 Databend Cloud，并使用 Python 创建表、插入数据与查询结果。

## 开始之前

请确保已创建 Warehouse 并获取连接信息，参考 [连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 步骤 1：使用 pip 安装依赖

```shell
pip install databend-sqlalchemy
```

## 步骤 2：通过 databend_sqlalchemy 连接

1. 将以下代码保存为 `main.py`：

```python
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Connection, Engine

# 使用你的凭证连接 Databend Cloud（替换 PASSWORD、HOST、DATABASE 与 WAREHOUSE_NAME）
engine = create_engine(
    f"databend://{username}:{password}@{host_port_name}/{database_name}?sslmode=disable"
)
cursor = engine.connect()
cursor.execute(text('DROP TABLE IF EXISTS data'))
cursor.execute(text('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )'))
cursor.execute(text("INSERT INTO data VALUES (1,'zz')"))
res = cursor.execute(text("SELECT * FROM data"))
print(res.fetchall())
```

2. 执行 `python main.py`：

```bash
python main.py
[(1, 'zz')]
```
