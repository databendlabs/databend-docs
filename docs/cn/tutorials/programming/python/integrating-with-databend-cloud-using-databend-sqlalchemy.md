---
title: 使用 databend-sqlalchemy 与 Databend Cloud 集成
---

在本教程中，我们将指导您如何使用 `databend-sqlalchemy` 库连接 Databend Cloud，创建表，插入数据并使用 Python 查询结果。

## 开始之前

开始之前，请确保您已成功创建计算集群并获取连接信息。具体操作请参考[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 步骤 1：使用 pip 安装依赖

```shell
pip install databend-sqlalchemy
```

## 步骤 2：使用 databend_sqlalchemy 连接

1. 将以下代码复制粘贴到文件 `main.py` 中：

```python
from databend_sqlalchemy import connector

# 使用您的凭证连接 Databend Cloud（替换 PASSWORD, HOST, DATABASE 和 WAREHOUSE_NAME）
cursor = connector.connect(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}").cursor()
cursor.execute('DROP TABLE IF EXISTS data')
cursor.execute('CREATE TABLE IF NOT EXISTS  data( Col1 TINYINT, Col2 VARCHAR )')
cursor.execute("INSERT INTO data (Col1, Col2) VALUES (%s, %s), (%s, %s)", [1, 'yy', 2, 'xx'])
cursor.execute("SELECT * FROM data")
print(cursor.fetchall())
```

2. 运行 `python main.py`：

```bash
python main.py
[(1, 'yy'), (2, 'xx')]
```
