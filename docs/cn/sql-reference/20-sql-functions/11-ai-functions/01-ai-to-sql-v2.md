---
title: "AI_TO_SQL"
---

使用最新的 `text-davinci-003` 模型将自然语言指令转换为 SQL 查询。

Databend 通过结合 OLAP 和 AI 技术，为构建 SQL 查询提供了高效的解决方案。通过此函数，用自然语言编写的指令可以转换为符合表结构的 SQL 查询语句。例如，该函数可以接收类似 "Get all items that cost 10 dollars or less" 的句子作为输入，并生成相应的 SQL 查询 `SELECT * FROM items WHERE price <= 10` 作为输出。

主要代码实现可以在 [这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/query/service/src/table_functions/openai/ai_to_sql.rs) 找到。

:::note
生成的 SQL 查询语句遵循 PostgreSQL 标准，因此可能需要手动修改以符合 Databend 的语法。
:::

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供了更好的数据隐私保护。

要使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 来实现 `AI_TO_SQL`，但只会将表结构发送给 (Azure) OpenAI，不会发送数据。

只有当 Databend 配置中包含 `openai_api_key` 时，这些功能才会工作，否则将处于非活动状态。

此功能在 [Databend Cloud](https://databend.com) 上默认可用，使用我们的 Azure OpenAI 密钥。如果您使用这些功能，即表示您同意我们将您的表结构发送给 Azure OpenAI。
:::

## 语法

```sql
USE <your-database>;
SELECT * FROM ai_to_sql('<natural-language-instruction>');
```

:::tip 获取和配置 OpenAI API 密钥

- 要获取您的 openAI API 密钥，请访问 https://platform.openai.com/account/api-keys 并生成新密钥。
- 在 **databend-query.toml** 文件中配置 openai_api_key 设置。

```toml
[query]
... ...
openai_api_key = "<your-key>"
```

:::

## 示例

在此示例中，使用 AI_TO_SQL 函数从指令生成 SQL 查询语句，然后执行生成的语句以获取查询结果。

1. 准备数据。

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

2. 运行 AI_TO_SQL 函数，以英文编写的指令作为输入。

```sql
SELECT * FROM ai_to_sql(
    'List the total amount spent by users from the USA who are older than 30 years, grouped by their names, along with the number of orders they made in 2022');
```

该函数生成一个 SQL 语句作为输出：

```sql
*************************** 1. row ***************************
     database: openai
generated_sql: SELECT name, SUM(price) AS total_spent, COUNT(order_id) AS total_orders
               FROM users
                        JOIN orders ON users.id = orders.user_id
               WHERE country = 'USA' AND age > 30 AND order_date BETWEEN '2022-01-01' AND '2022-12-31'
               GROUP BY name;
```

3. 运行生成的 SQL 语句以获取查询结果。

```sql
+---------+-------------+-------------+
| name    | order_count | total_spent |
+---------+-------------+-------------+
| Bob     |           2 |     2020.00 |
| Alice   |           2 |     1020.00 |
| Charlie |           2 |      700.00 |
+---------+-------------+-------------+
```