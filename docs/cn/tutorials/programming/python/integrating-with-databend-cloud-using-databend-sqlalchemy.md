<think>
好的，我现在需要处理用户提供的关于如何将Databend Cloud与databend-sqlalchemy集成的教程翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调必须保留Markdown的结构，不能添加或删除链接，也不能改变URL。这意味着在翻译过程中，我需要确保所有的代码块、标题层级以及超链接都保持原样。例如，原文中的链接`/guides/cloud/using-databend-cloud/warehouses#connecting`在翻译后的中文文档中必须保持不变。

接下来，用户提到不能修改代码块的内容，即使看起来有错误。因此，在翻译示例代码时，我需要确保代码部分完全不变，只翻译周围的注释或说明文字。例如，Python代码中的`cursor.execute('DROP TABLE IF EXISTS data')`必须保留原样，而周围的注释可能需要翻译。

保持原始换行符和空白行也是关键。这意味着在翻译过程中，我需要特别注意段落之间的换行，避免合并或拆分段落，以免影响文档的格式。例如，原文中的每个步骤之间的空行在翻译后也应保留。

关于permalink如`{/*examples*/}`，用户要求不进行任何修改。这部分通常是用于文档内部链接或锚点，因此需要保持原样，不翻译或调整。

HTML标签如`<Notes>`也需要保留，不进行翻译或修改。在翻译过程中，我需要确保这些标签及其内容不被改动，只处理标签外的文本内容。

在术语翻译方面，用户提供了具体的指导。例如，“time travel”要翻译为“时间回溯”，“warehouse”或“warehouses”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等术语则保持英文不译。这需要我在翻译时特别注意这些关键词的正确转换，确保一致性。

对于JSON文件中的键，用户明确指出不翻译。例如，在`_category_.json`中的键名需要保留英文，而值可能需要根据情况进行翻译。但在这个具体的任务中，用户提供的示例是Markdown内容，所以暂时不需要处理JSON文件，但需要记住这一规则以备后续可能的任务。

用户还特别提到，如果遇到描述“Personal”计划时，应翻译为“基础版”。虽然当前提供的示例中没有出现这个词，但需要留意后续内容中是否涉及，确保正确替换。

在处理实际翻译时，我会逐段对照原文，按照规则进行转换。例如，标题“Before You Start”翻译为“开始之前”，并确保链接保持不变。代码块中的注释如“# Connecting to Databend Cloud...”中的注释部分需要翻译，但代码本身保留原样。

在翻译步骤说明时，如“Step 1: Install Dependencies with pip”转换为“步骤 1：使用 pip 安装依赖”，同时确保代码示例中的命令`pip install databend-sqlalchemy`不被修改。

最后，用户强调输出中不能包含任何`</think>`的标签或内容，因此在完成翻译后，我需要仔细检查输出，确保没有遗漏或误加任何标记。

总结来说，整个翻译过程需要严格遵守用户提供的格式和术语规则，确保技术术语准确无误，同时保持文档结构完整，代码和链接不变。这需要细致的逐句对照和多次校对，以确保最终的中文文档既准确又符合格式要求。
</think>

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