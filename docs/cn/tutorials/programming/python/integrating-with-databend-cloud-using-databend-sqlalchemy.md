---
title: 集成 (SQLAlchemy)
---

本教程介绍如何使用 `databend-sqlalchemy` 连接 Databend Cloud，并使用 Python 进行数据操作。

## 在开始之前

开始前，请确保已成功创建计算集群（Warehouse）并获取连接信息。具体操作请参阅[连接计算集群（Warehouse）](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 第一步：使用 pip 安装依赖项

```shell
pip install databend-sqlalchemy
```

## 第二步：使用 databend_sqlalchemy 连接

1. 复制以下代码至文件 `main.py`：

```python
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Connection, Engine

# Connecting to Databend Cloud with your credentials (replace PASSWORD, HOST, DATABASE, and WAREHOUSE_NAME)
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

2. 运行 `python main.py`：

```bash
python main.py
[(1, 'zz')]
```