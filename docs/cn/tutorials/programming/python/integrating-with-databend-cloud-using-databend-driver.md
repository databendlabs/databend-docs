---
title: 使用 databend-driver 连接 Databend Cloud
---

本教程将指导您如何使用 `databend-driver` 连接 Databend Cloud，并通过 Python 创建表、插入数据并查询结果。

## 开始前准备

开始前，请确保您已成功创建计算集群并获取连接信息。具体操作请参考[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 步骤一：使用 pip 安装依赖

```shell
pip install databend-driver
```

## 步骤二：使用 databend-driver 连接

1. 将以下代码复制到文件 `main.py` 中：

```python
from databend_driver import BlockingDatabendClient

# 使用您的凭据连接到 Databend Cloud（替换 PASSWORD、HOST、DATABASE 和 WAREHOUSE_NAME）
client = BlockingDatabendClient(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}")

# 从客户端获取游标以执行查询
cursor = client.cursor()

# 如果表存在则删除
cursor.execute('DROP TABLE IF EXISTS data')

# 如果表不存在则创建
cursor.execute('CREATE TABLE IF NOT EXISTS data (x Int32, y String)')          

# 向表中插入数据
cursor.execute("INSERT INTO data (x, y) VALUES (1, 'yy'), (2, 'xx')")

# 查询表中所有数据
cursor.execute('SELECT * FROM data')

# 获取结果集中的所有行
rows = cursor.fetchall()

# 打印结果
for row in rows:
    print(row.values())
```

2. 运行 `python main.py`：

```bash
python main.py
(1, 'yy')
(2, 'xx')
```
