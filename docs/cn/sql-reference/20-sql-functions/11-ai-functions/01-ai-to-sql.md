---
title: "AI_TO_SQL"
---

将自然语言指令转换为 SQL 查询（Query），使用最新的 `text-davinci-003` 模型。

Databend 通过结合 OLAP 和 AI 技术，提供高效的 SQL 查询构建方案。该函数可将自然语言指令转换为符合表结构的 SQL 查询语句。例如，输入"获取所有价格不超过 10 美元的商品"指令时，会生成对应的 SQL 查询 `SELECT * FROM items WHERE price <= 10`。

主要代码实现参见[此链接](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/query/service/src/table_functions/openai/ai_to_sql.rs)。

:::note
生成的 SQL 查询语句遵循 PostgreSQL 标准，可能需要手动调整以适配 Databend 语法。
:::

:::info
自 Databend v1.1.47 起，支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供更强的数据隐私保护。

使用 Azure OpenAI 需在 `[query]` 配置段添加：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
`AI_TO_SQL` 依赖 (Azure) OpenAI，但仅发送表结构（不发送数据）。

仅在配置 `openai_api_key` 时生效，否则功能不可用。

[Databend Cloud](https://databend.com) 默认使用我们的 Azure OpenAI 密钥提供此功能。使用即表示同意我们将您的表结构发送至 Azure OpenAI。
:::

## 语法

```sql
USE <your-database>;
SELECT * FROM ai_to_sql('<natural-language-instruction>');
```

:::tip 获取并配置 OpenAI API 密钥

- 访问 https://platform.openai.com/account/api-keys 生成 API 密钥
- 在 **databend-query.toml** 中配置 openai_api_key：

```toml
[query]
... ...
openai_api_key = "<your-key>"
```

:::

## 示例

本示例展示如何通过 AI_TO_SQL 生成 SQL 语句并执行：

1. 准备数据

```sql
CREATE DATABASE IF NOT EXISTS openai;
USE openai;

CREATE TABLE users(
    id INT,
    name VARCHAR,
    age INT,
    country VARCHAR
);

CREATE TABLE orders(
    order_id INT,
    user_id INT,
    product_name VARCHAR,
    price DECIMAL(10,2),
    order_date DATE
);

-- 向 users 表插入示例数据
INSERT INTO users VALUES (1, 'Alice', 31, 'USA'),
                         (2, 'Bob', 32, 'USA'),
                         (3, 'Charlie', 45, 'USA'),
                         (4, 'Diana', 29, 'USA'),
                         (5, 'Eva', 35, 'Canada');

-- 向 orders 表插入示例数据
INSERT INTO orders VALUES (1, 1, 'iPhone', 1000.00, '2022-03-05'),
                          (2, 1, 'OpenAI Plus', 20.00, '2022-03-06'),
                          (3, 2, 'OpenAI Plus', 20.00, '2022-03-07'),
                          (4, 2, 'MacBook Pro', 2000.00, '2022-03-10'),
                          (5, 3, 'iPad', 500.00, '2022-03-12'),
                          (6, 3, 'AirPods', 200.00, '2022-03-14');
```

2. 执行 AI_TO_SQL 函数

```sql
SELECT * FROM ai_to_sql(
    'List the total amount spent by users from the USA who are older than 30 years, grouped by their names, along with the number of orders they made in 2022');
```

生成 SQL 语句：

```sql
*************************** 1. row ***************************
     database: openai
generated_sql: SELECT name, SUM(price) AS total_spent, COUNT(order_id) AS total_orders
               FROM users
                        JOIN orders ON users.id = orders.user_id
               WHERE country = 'USA' AND age > 30 AND order_date BETWEEN '2022-01-01' AND '2022-12-31'
               GROUP BY name;
```

3. 执行生成语句获取结果

```sql
+---------+-------------+-------------+
| name    | order_count | total_spent |
+---------+-------------+-------------+
| Bob     |           2 |     2020.00 |
| Alice   |           2 |     1020.00 |
| Charlie |           2 |      700.00 |
+---------+-------------+-------------+
```