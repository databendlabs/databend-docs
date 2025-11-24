---
title: 集成 (databend-driver)
---

本教程介绍如何使用 `databend-driver` 连接 Databend Cloud，并使用 Python 进行数据操作。

## 开始之前

在开始之前，请确保您已成功创建计算集群并获得了连接信息。 有关如何执行此操作，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

## 步骤 1：使用 pip 安装依赖项

```shell
pip install databend-driver
```

## 步骤 2：使用 databend-driver 连接

1. 复制以下代码并粘贴到文件 `main.py` 中：

```python
from databend_driver import BlockingDatabendClient

# 使用您的凭据连接到 Databend Cloud（替换 PASSWORD、HOST、DATABASE 和 WAREHOUSE_NAME）
client = BlockingDatabendClient(f"databend://cloudapp:{PASSWORD}@{HOST}:443/{DATABASE}?warehouse={WAREHOUSE_NAME}")

# 从客户端获取游标以执行查询
cursor = client.cursor()

# 如果表存在则删除表
cursor.execute('DROP TABLE IF EXISTS data')

# 如果表不存在则创建表
cursor.execute('CREATE TABLE IF NOT EXISTS data (x Int32, y String)')          

# 将数据插入表
cursor.execute("INSERT INTO data (x, y) VALUES (1, 'yy'), (2, 'xx')")

# 从表中选择所有数据
cursor.execute('SELECT * FROM data')

# 从结果中获取所有行
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