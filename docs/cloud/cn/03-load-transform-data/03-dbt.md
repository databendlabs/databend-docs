---
title: 使用转换工具 dbt
---

[dbt](https://www.getdbt.com/)（数据构建工具）是一个现代开发框架，它使数据分析师和数据工程师能够通过编写 SELECT 语句来转换数据。dbt 负责将这些选择语句转换为表和视图。dbt 的 Databend Cloud 适配器汇集了 dbt 最先进的开发工具和 Databend 的下一代分析性能。

## 教程 - 如何将 dbt 与 Databend Cloud 一起使用

这是关于如何使用 dbt-databend-cloud 的初级教程。这里我们以 dbt 官方教程为例，一起介绍 dbt 中 Databend 的使用。本例中使用的软件及其版本要求：

- dbt 1.01 - 1.3.x
- dbt-databend-cloud 0.0.1

### 先决条件

1. 安装 dbt
```shell
pip3 install dbt-core==1.3.0
```
请参考[官方安装指南](https://docs.getdbt.com/dbt-cli/install/overview)。

2. 安装 dbt apater `dbt-databend-cloud`

```shell
pip3 install dbt-databend-cloud
```

### 第一步：创建 jaffle_shop 项目

jaffle_shop 是 dbt-lab 提供的一个项目，用于演示 dbt 功能。您可以直接从 GitHub 获取它。

```shell
$ git clone https://github.com/dbt-labs/jaffle_shop
$ cd jaffle_shop
```

jaffle_shop 项目目录下的所有文件如下：
- dbt_project.yml 是 dbt 项目配置文件，里面保存了项目名称、数据库配置文件路径信息等。
- models 目录包含项目的 SQL 模型和表模式。注意这部分是数据分析师自己写的。
- seed 目录存储 CSV 文件。此类 CSV 文件可以从数据库导出工具中转储。在 jaffle shop 项目中，这些 CSV 文件被用作待处理的原始数据。

### 第二步：配置项目

1. 全局配置

dbt 有一个默认的全局配置文件：`~/.dbt/profiles.yml`，我们首先在用户目录下设置，配置 Databend 数据库的连接信息。如果您没有`~/.dbt/profiles.yml`，请先创建它。

```
jaffle_shop_databend:
  target: dev
  outputs:
    dev:
      type: databend
      host: tnc7yee14--query-perf.ch.datafusecloud.com
      port: 443
      schema: sjh_dbt // 对应 databend 中的 database name
      user: cloudapp
      pass: ********
```

了解如何获取连接信息，请参考[连接到计算集群](../02-using-databend-cloud/00-warehouses.md#connecting)。

2. 项目配置

在 jaffle_shop 项目目录中，项目配置文件 dbt_project.yml 可用。将 profile 配置项改为 `jaffle_shop_databend`，即 `profiles.yml` 中的工程名。然后，项目会查询 `~/.dbt/profiles.yml` 文件中的数据库连接配置。

```
cat dbt_project.yml
name: 'jaffle_shop_databend'

config-version: 2
version: '0.1'

profile: 'jaffle_shop_databend'

model-paths: ["models"]
seed-paths: ["seeds"]
test-paths: ["tests"]
analysis-paths: ["analysis"]
macro-paths: ["macros"]

target-path: "target"
clean-targets:
    - "target"
    - "dbt_modules"
    - "logs"

require-dbt-version: [">=1.0.0", "<2.0.0"]

models:
  jaffle_shop:
      materialized: table
      staging:
        materialized: view
```

3. 验证配置

您可以在项目目录下运行 `dbt debug` 来检查数据库和项目配置是否正确。

![](@site/static/img/documents/loading-data/dbt-debug.png)

### 第三步：导入 CSV 文件

导入 CSV 数据并将 CSV 实现为目标数据库中的表。
注意：一般情况下，dbt 项目不需要这一步，因为您的 pending 项目的数据在数据库中。

```
dbt seed
03:04:20  Running with dbt=1.3.0
03:04:20  Unable to do partial parsing because profile has changed
03:04:20  [WARNING]: Configuration paths exist in your dbt_project.yml file which do not apply to any resources.
There are 2 unused configuration paths:
- models.jaffle_shop
- models.jaffle_shop.staging

03:04:20  Found 5 models, 20 tests, 0 snapshots, 0 analyses, 282 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics
03:04:20
03:04:29  Concurrency: 1 threads (target='dev')
03:04:29
03:04:29  1 of 3 START seed file sjh_dbt.raw_customers ................................... [RUN]
sync ec1e4a32-9eb6-4f8c-88d7-35c40cfa89d1.csv duration:9s
03:04:42  1 of 3 OK loaded seed file sjh_dbt.raw_customers ............................... [INSERT 100 in 12.85s]
03:04:42  2 of 3 START seed file sjh_dbt.raw_orders ...................................... [RUN]
sync 3fd97eae-d20b-4d92-9dd7-9926e3ae4c86.csv duration:9s
03:04:55  2 of 3 OK loaded seed file sjh_dbt.raw_orders .................................. [INSERT 99 in 12.54s]
03:04:55  3 of 3 START seed file sjh_dbt.raw_payments .................................... [RUN]
sync 8da2b4b5-78c7-4230-b8c6-c1f030bdcb8f.csv duration:9s
03:05:07  3 of 3 OK loaded seed file sjh_dbt.raw_payments ................................ [INSERT 113 in 12.77s]
03:05:07
03:05:07  Finished running 3 seeds in 0 hours 0 minutes and 47.17 seconds (47.17s).
03:05:07
03:05:07  Completed successfully
03:05:07
03:05:07  Done. PASS=3 WARN=0 ERROR=0 SKIP=0 TOTAL=3
```

在上面的结果中，执行了三个任务并导入了三个表（sjh_dbt.raw_customers、sjh_dbt.raw_orders、sjh_dbt.raw_payments）。
接下来，转到 Databend Cloud 数据库，看看会发生什么。
我们发现多了一个 sjh_dbt 数据库，就是 dbt 为我们创建的工程数据库。

![](@site/static/img/documents/loading-data/show-database-dbt.png)

sjh_dbt 数据库中有三张表，分别对应以上三个任务结果。

![](@site/static/img/documents/loading-data/show-tables-dbt.png)

### 第四步：模块

在跳到下一步之前，了解模型在 dbt 中扮演什么角色很重要。

在 dbt 中，模型用于描述一组表或视图的结构，主要有两种文件类型：SQL 和 YML。另请注意，根据 [materialization configuration](https://github.com/dbt-labs/jaffle_shop/blob/main/dbt_project.yml)，在 jaffle_shop 项目中，表结构保存在 models/ 目录下，视图结构保存在 models/staging/ 目录下。

例如，models/orders.sql 是一条语法为 [jinja](https://jinja.palletsprojects.com/en/3.1.x/) 的 SQL 查询语句。我们将通过这个查询语句创建一个表。

```
$ cat models/orders.sql
{% set payment_methods = ['credit_card', 'coupon', 'bank_transfer', 'gift_card'] %}

with orders as (

    select * from {{ ref('stg_orders') }}

),

payments as (

    select * from {{ ref('stg_payments') }}

),

order_payments as (

    select
        order_id,

        {% for payment_method in payment_methods -%}
        sum(case when payment_method = '{{ payment_method }}' then amount else 0 end) as {{ payment_method }}_amount,
        {% endfor -%}

        sum(amount) as total_amount

    from payments

    group by order_id

),

final as (

    select
        orders.order_id,
        orders.customer_id,
        orders.order_date,
        orders.status,

        {% for payment_method in payment_methods -%}

        order_payments.{{ payment_method }}_amount,

        {% endfor -%}

        order_payments.total_amount as amount

    from orders


    left join order_payments
        on orders.order_id = order_payments.order_id

)

select * from final
```

此外，与此 SQL 一起使用的约束信息位于 models/schema.yml 文件中。
schema.yml 是当前目录中所有模型的注册表。所有模型都组织成树状结构，描述每个字段的描述和属性。tests 项表示该字段的约束条件，可以使用 dbt test 命令进行测试。有关详细信息，请参阅[官方文档](https://docs.getdbt.com/docs/building-a-dbt-project/tests)。

### 第五步：运行

结果显示三个视图（sjh_dbt.stg_customers、sjh_dbt.stg_orders、sjh_dbt.stg_payments）和两个表（sjh_dbt.customers、sjh_dbt.orders）。

```
dbt seed
03:04:20  Running with dbt=1.3.0
03:04:20  Unable to do partial parsing because profile has changed
03:04:20  [WARNING]: Configuration paths exist in your dbt_project.yml file which do not apply to any resources.
There are 2 unused configuration paths:
- models.jaffle_shop
- models.jaffle_shop.staging

03:04:20  Found 5 models, 20 tests, 0 snapshots, 0 analyses, 282 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics
03:04:20
03:04:29  Concurrency: 1 threads (target='dev')
03:04:29
03:04:29  1 of 3 START seed file sjh_dbt.raw_customers ................................... [RUN]
sync ec1e4a32-9eb6-4f8c-88d7-35c40cfa89d1.csv duration:9s
03:04:42  1 of 3 OK loaded seed file sjh_dbt.raw_customers ............................... [INSERT 100 in 12.85s]
03:04:42  2 of 3 START seed file sjh_dbt.raw_orders ...................................... [RUN]
sync 3fd97eae-d20b-4d92-9dd7-9926e3ae4c86.csv duration:9s
03:04:55  2 of 3 OK loaded seed file sjh_dbt.raw_orders .................................. [INSERT 99 in 12.54s]
03:04:55  3 of 3 START seed file sjh_dbt.raw_payments .................................... [RUN]
sync 8da2b4b5-78c7-4230-b8c6-c1f030bdcb8f.csv duration:9s
03:05:07  3 of 3 OK loaded seed file sjh_dbt.raw_payments ................................ [INSERT 113 in 12.77s]
03:05:07
03:05:07  Finished running 3 seeds in 0 hours 0 minutes and 47.17 seconds (47.17s).
03:05:07
03:05:07  Completed successfully
03:05:07
03:05:07  Done. PASS=3 WARN=0 ERROR=0 SKIP=0 TOTAL=3
❯ dbt run
03:29:28  Running with dbt=1.3.0
03:29:28  [WARNING]: Configuration paths exist in your dbt_project.yml file which do not apply to any resources.
There are 2 unused configuration paths:
- models.jaffle_shop.staging
- models.jaffle_shop

03:29:28  Found 5 models, 20 tests, 0 snapshots, 0 analyses, 282 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics
03:29:28
03:29:38  Concurrency: 1 threads (target='dev')
03:29:38
03:29:38  1 of 5 START sql view model sjh_dbt.stg_customers .............................. [RUN]
03:29:52  1 of 5 OK created sql view model sjh_dbt.stg_customers ......................... [OK in 13.76s]
03:29:52  2 of 5 START sql view model sjh_dbt.stg_orders ................................. [RUN]
03:30:08  2 of 5 OK created sql view model sjh_dbt.stg_orders ............................ [OK in 16.28s]
03:30:08  3 of 5 START sql view model sjh_dbt.stg_payments ............................... [RUN]
03:30:22  3 of 5 OK created sql view model sjh_dbt.stg_payments .......................... [OK in 13.62s]
03:30:22  4 of 5 START sql view model sjh_dbt.customers .................................. [RUN]
03:30:35  4 of 5 OK created sql view model sjh_dbt.customers ............................. [OK in 13.29s]
03:30:35  5 of 5 START sql view model sjh_dbt.orders ..................................... [RUN]
03:30:48  5 of 5 OK created sql view model sjh_dbt.orders ................................ [OK in 13.32s]
03:30:48
03:30:48  Finished running 5 view models in 0 hours 1 minutes and 19.96 seconds (79.96s).
03:30:48
03:30:48  Completed successfully
03:30:48
03:30:48  Done. PASS=5 WARN=0 ERROR=0 SKIP=0 TOTAL=5
```

进入 Databend Cloud 数据库验证是否创建成功。
结果说明又增加了 5 个表或视图，如 `customers`，表或视图中的数据已经转换。

![](@site/static/img/documents/loading-data/show-tables-dbt-2.png)

### 第六步：生成文档

dbt 还支持可视化文档的生成，步骤如下：

1. 生成文档

```
 dbt docs generate
04:01:20  Running with dbt=1.3.0
04:01:20  Unable to do partial parsing because profile has changed
04:01:20  [WARNING]: Configuration paths exist in your dbt_project.yml file which do not apply to any resources.
There are 2 unused configuration paths:
- models.jaffle_shop
- models.jaffle_shop.staging

04:01:20  Found 5 models, 20 tests, 0 snapshots, 0 analyses, 282 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics
04:01:20
04:01:26  Concurrency: 1 threads (target='dev')
04:01:26
04:01:26  Done.
04:01:26  Building catalog
04:01:33  Catalog written to /Users/hanshanjie/git-works/jaffle_shop/target/catalog.json
```

2. 启动服务器

运行 `dbt docs serve`。
该文档包含 jaffle_shop 项目的总体结构以及所有表和视图的描述，可以在浏览器中查看。

![](@site/static/img/documents/loading-data/dbt-server.png)