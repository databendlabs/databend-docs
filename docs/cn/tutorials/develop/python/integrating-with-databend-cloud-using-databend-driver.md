---
title: "Python Driver 开发 (Cloud)"
sidebar_label: "Python Driver (Cloud)"
---

本教程将演示如何使用 `databend-driver` 连接 Databend Cloud，并通过 Python 创建表、插入数据与查询结果。

## 开始之前

请确保已创建 Warehouse 并获取连接信息，参考 [连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 步骤 1：使用 pip 安装依赖

```shell
pip install databend-driver
```

## 步骤 2：用 databend-driver 建立连接

1. 将以下代码保存为 `main.py`：

```python
from databend_driver import BlockingDatabendClient

# 使用你的凭证连接 Databend Cloud（替换 PASSWORD、HOST、DATABASE 与 WAREHOUSE_NAME）
client = BlockingDatabendClient(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}")

# 获取 cursor 执行查询
cursor = client.cursor()

# 如果存在，则先删除表
cursor.execute('DROP TABLE IF EXISTS data')

# 创建表（若不存在）
cursor.execute('CREATE TABLE IF NOT EXISTS data (x Int32, y String)')          

# 插入数据
cursor.execute("INSERT INTO data (x, y) VALUES (1, 'yy'), (2, 'xx')")

# 查询全表
cursor.execute('SELECT * FROM data')

# 读取所有结果
rows = cursor.fetchall()

# 打印结果
for row in rows:
    print(row.values())
```

2. 执行 `python main.py`：

```bash
python main.py
(1, 'yy')
(2, 'xx')
```
