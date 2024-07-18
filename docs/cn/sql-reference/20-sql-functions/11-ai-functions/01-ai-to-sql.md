---
title: "AI_TO_SQL"
---

将自然语言指令转换为SQL查询，使用最新的模型 `text-davinci-003`。

Databend通过结合OLAP和AI，提供了一种高效构建SQL查询的解决方案。通过此功能，可以用自然语言编写的指令转换为符合表结构的SQL查询语句。例如，可以提供一个句子如“获取所有价格为10美元或以下的商品”作为输入，并生成相应的SQL查询 `SELECT * FROM items WHERE price <= 10` 作为输出。

主要代码实现可以在[这里](https://github.com/datafuselabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/query/service/src/table_functions/openai/ai_to_sql.rs)找到。

:::note
生成的SQL查询语句遵循PostgreSQL标准，因此可能需要手动修改以符合Databend的语法。
:::

:::info
从Databend v1.1.47开始，Databend支持[Azure OpenAI服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供了改进的数据隐私。

要使用Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend依赖(Azure) OpenAI进行 `AI_TO_SQL`，但仅将表结构发送到(Azure) OpenAI，而非数据。

它们仅在Databend配置包含 `openai_api_key` 时有效，否则将处于非活动状态。

此功能默认在[Databend Cloud](https://databend.com)上使用我们的Azure OpenAI密钥提供。如果您使用它们，即表示您确认您的表结构将由我们发送至Azure OpenAI。
:::

## 语法

```sql
USE <your-database>;
SELECT * FROM ai_to_sql('<natural-language-instruction>');
```

:::tip 获取并配置OpenAI API密钥

- 要获取您的openAI API密钥，请访问 https://platform.openai.com/account/api-keys 并生成一个新密钥。
- 在 **databend-query.toml** 文件中配置openai_api_key设置。

```toml
[query]
... ...
openai_api_key = "<your-key>"
```

:::

## 示例

在此示例中，通过AI_TO_SQL函数从指令生成SQL查询语句，并执行生成的语句以获取查询结果。

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

-- 向users表插入示例数据
INSERT INTO users VALUES (1, 'Alice', 31, 'USA'),
                         (2, 'Bob', 32, 'USA'),
                         (3, 'Charlie', 45, 'USA'),
                         (4, 'Diana', 29, 'USA'),
                         (5, 'Eva', 35, 'Canada');

-- 向orders表插入示例数据
INSERT INTO orders VALUES (1, 1, 'iPhone', 1000.00, '2022-03-05'),
                          (2, 1, 'OpenAI Plus', 20.00, '2022-03-06'),
                          (3, 2, 'OpenAI Plus', 20.00, '2022-03-07'),
                          (4, 2, 'MacBook Pro', 2000.00, '2022-03-10'),
                          (5, 3, 'iPad', 500.00, '2022-03-12'),
                          (6, 3, 'AirPods', 200.00, '2022-03-14');
```

2. 使用英语编写的指令作为输入运行AI_TO_SQL函数。

```sql
SELECT * FROM ai_to_sql(
    '列出2022年来自美国的30岁以上用户按姓名分组的消费总额及订单数量');
```

函数生成SQL语句作为输出：

```sql
*************************** 1. row ***************************
     database: openai
generated_sql: SELECT name, SUM(price) AS total_spent, COUNT(order_id) AS total_orders
               FROM users
                        JOIN orders ON users.id = orders.user_id
               WHERE country = 'USA' AND age > 30 AND order_date BETWEEN '2022-01-01' AND '2022-12-31'
               GROUP BY name;
```

3. 运行生成的SQL语句以获取查询结果。

```sql
+---------+-------------+-------------+
| name    | order_count | total_spent |
+---------+-------------+-------------+
| Bob     |           2 |     2020.00 |
| Alice   |           2 |     1020.00 |
| Charlie |           2 |      700.00 |
+---------+-------------+-------------+
```