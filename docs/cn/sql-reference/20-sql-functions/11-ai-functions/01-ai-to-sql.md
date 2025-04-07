```markdown
---
title: "AI_TO_SQL"
---

使用最新模型 `text-davinci-003` 将自然语言指令转换为 SQL 查询。

Databend 通过整合 OLAP 和 AI，提供了一个高效的 SQL 查询构建方案。通过此功能，可以用自然语言编写的指令可以转换为与表模式对齐的 SQL 查询语句。例如，该函数可以接收诸如“Get all items that cost 10 dollars or less”之类的句子作为输入，并生成相应的 SQL 查询 `SELECT * FROM items WHERE price <= 10` 作为输出。

主要代码实现在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/query/service/src/table_functions/openai/ai_to_sql.rs)。

:::note
生成的 SQL 查询语句遵循 PostgreSQL 标准，因此可能需要手动修改以符合 Databend 的语法。
:::

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI service](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供了改进的数据隐私。

要使用 Azure OpenAI，请将以下配置添加到 `[query]` 部分：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖于 (Azure) OpenAI 来实现 `AI_TO_SQL`，但仅将表模式发送到 (Azure) OpenAI，而不是数据。

只有当 Databend 配置包含 `openai_api_key` 时，它们才会工作，否则它们将处于非活动状态。

此功能在 [Databend Cloud](https://databend.com) 上默认可用，使用我们的 Azure OpenAI 密钥。如果您使用它们，则表示您承认您的表模式将由我们发送到 Azure OpenAI。
:::

## 语法

```sql
USE <your-database>;
SELECT * FROM ai_to_sql('<natural-language-instruction>');
```

:::tip 获取并配置 OpenAI API 密钥

- 要获取您的 openAI API 密钥，请访问 https://platform.openai.com/account/api-keys 并生成一个新密钥。
- 使用 openai_api_key 设置配置 **databend-query.toml** 文件。

```toml
[query]
... ...
openai_api_key = "<your-key>"
```

:::

## 示例

在此示例中，SQL 查询语句由 AI_TO_SQL 函数从指令生成，并执行生成的语句以获得查询结果。

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

-- Insert sample data into the users table
INSERT INTO users VALUES (1, 'Alice', 31, 'USA'),
                         (2, 'Bob', 32, 'USA'),
                         (3, 'Charlie', 45, 'USA'),
                         (4, 'Diana', 29, 'USA'),
                         (5, 'Eva', 35, 'Canada');

-- Insert sample data into the orders table
INSERT INTO orders VALUES (1, 1, 'iPhone', 1000.00, '2022-03-05'),
                          (2, 1, 'OpenAI Plus', 20.00, '2022-03-06'),
                          (3, 2, 'OpenAI Plus', 20.00, '2022-03-07'),
                          (4, 2, 'MacBook Pro', 2000.00, '2022-03-10'),
                          (5, 3, 'iPad', 500.00, '2022-03-12'),
                          (6, 3, 'AirPods', 200.00, '2022-03-14');
```

2. 使用 AI_TO_SQL 函数，以英文编写的指令作为输入。

```sql
SELECT * FROM ai_to_sql(
    'List the total amount spent by users from the USA who are older than 30 years, grouped by their names, along with the number of orders they made in 2022');
```

函数生成一个 SQL 语句作为输出：

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
