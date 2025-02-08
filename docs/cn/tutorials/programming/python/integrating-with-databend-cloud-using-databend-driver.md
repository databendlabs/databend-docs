<think>
好的，我需要将用户提供的关于如何使用databend-driver连接Databend Cloud的教程翻译成简体中文。首先，我要仔细阅读用户提供的规则，确保翻译过程中不违反任何要求。

首先，用户强调必须保持Markdown结构不变，不能添加或删除链接，也不能改变URL。因此，在翻译过程中，我需要确保所有的标题、代码块、链接都原样保留，只翻译文本内容。例如，文档中的链接`/guides/cloud/using-databend-cloud/warehouses#connecting`应该保持原样，不进行任何修改。

接下来，用户提到不能更改代码块的内容，即使有错误。因此，代码部分如pip安装命令、Python代码示例等，必须保持原样，只翻译注释部分。例如，注释“# Connecting to Databend Cloud with your credentials...”需要翻译，但代码本身不能改动。

保持原始换行和空白行也很重要，不能添加或删除。这需要我在翻译时注意段落的分行，确保与原文档一致。例如，Python代码中的每个空行都应保留。

关于permalink如`{/*examples*/}`，用户要求不处理，所以这部分直接保留，不翻译也不修改。同样，HTML标签如`<Notes>`也要保留原样。

在术语翻译方面，用户提供了具体指导。例如，“time travel”翻译为“时间回溯”，“warehouse”或“warehouses”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”则保持不译。此外，提到如果遇到描述“Personal”计划时，要翻译为“基础版”。因此，在翻译过程中需要特别注意这些术语的正确使用，确保一致性。

在处理JSON文件时，用户指出`_category_.json`中的键不翻译，因此这部分内容需要保持原样，只翻译值部分。

用户还特别强调，输出中不能包含任何`</think>`标签或其内容，也不能生成新的`</think>`标签。因此，在翻译过程中，我需要确保最终的输出完全去除这些部分，只保留翻译后的内容。

现在，具体到用户提供的文档内容：

标题需要翻译，但保持Markdown结构。例如，“Integrating with Databend Cloud using databend-driver”翻译为“使用 databend-driver 连接 Databend Cloud”。

“Before You Start”部分需要翻译，同时确保其中的链接和术语正确。例如，“warehouse”翻译为“计算集群”，链接保持不变。

步骤一中的代码块保持原样，注释部分翻译。例如，“Install Dependencies with pip”翻译为“使用 pip 安装依赖”。

步骤二的代码示例中，注释需要翻译，但代码本身不变。例如，“# Connecting to Databend Cloud with your credentials...”翻译为“# 使用您的凭据连接到 Databend Cloud（替换 PASSWORD、HOST、DATABASE 和 WAREHOUSE_NAME）”。

最后的运行结果示例中的输出保持原样，不翻译。

需要特别注意术语替换，例如“warehouse”在文档中多次出现，必须统一翻译为“计算集群”。同时，确保“Databend Cloud”不翻译，保持原样。

最后，检查整个翻译后的文档，确保没有遗漏任何规则，结构完整，术语正确，代码块和链接未改动，并且没有添加或删除任何内容。
</think>

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