---
title: 通过流跟踪和转换数据
sidebar_label: 流
---

在 Databend 中，流是对表更改的动态和实时表示。创建流是为了捕获并跟踪与表相关的修改，允许持续消费和分析数据变化，随着它们的发生。

### 流是如何工作的

本节提供了一个快速示例，说明流是什么样子以及它是如何工作的。假设我们有一个名为 't' 的表，并且我们创建一个流来捕获表的变化。一旦创建，流开始捕获表的数据变化：

![Alt text](@site/static/public/img/sql/stream-insert.png)

**Databend 流目前以仅追加模式运行**。在此模式下，流仅包含数据插入记录，反映了表的最新变化。尽管数据更新和删除不会直接记录，但它们仍然被考虑在内。

例如，如果添加了一行，后来用新值更新了，流记录了插入以及更新的值。类似地，如果添加了一行然后随后被删除，流相应地反映了这些变化：

![Alt text](@site/static/public/img/sql/stream-update.png)

**流可以被 DML（数据操纵语言）操作消费**。消费后，流不包含任何数据，但可以继续捕获新的变化（如果有的话）。

![Alt text](@site/static/public/img/sql/stream-consume.png)

### 流消费的事务支持

在 Databend 中，流消费在单语句事务中是事务性的。这意味着：

**成功的事务**：如果事务提交，流被消费。例如：
```sql
INSERT INTO table SELECT * FROM stream;
```
如果这个 `INSERT` 事务提交，流被消费。

**失败的事务**：如果事务失败，流保持不变，可供将来消费。

**并发访问**：*一次只能有一个事务成功消费流*。如果多个事务尝试消费同一个流，只有第一个提交的事务成功，其他的失败。

### 流的表元数据

**流不存储表的任何数据**。为表创建流后，Databend 为了跟踪变化目的，向表中引入了特定的隐藏元数据列。这些列包括：

| 列                      | 描述                                                                       |
|-------------------------|----------------------------------------------------------------------------|
| _origin_version         | 标识此行最初创建时的表版本。                                               |
| _origin_block_id        | 标识此行之前所属的块 ID。                                                  |
| _origin_block_row_num   | 标识此行之前所属的块内的行号。                                             |

要显示这些列的值，请使用 SELECT 语句：

```sql title='示例：'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);
SELECT *, _origin_version, _origin_block_id, _origin_block_row_num 
FROM t;
┌───────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┤
│               1 │             NULL │ NULL                     │                  NULL │
│               2 │             NULL │ NULL                     │                  NULL │
└───────────────────────────────────────────────────────────────────────────────────────┘

UPDATE t SET a = 3 WHERE a = 2;
SELECT *, _origin_version, _origin_block_id, _origin_block_row_num 
FROM t;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │            _origin_block_id            │ _origin_block_row_num │
├─────────────────┼──────────────────┼────────────────────────────────────────┼───────────────────────┤
│               1 │             NULL │ NULL                                   │                  NULL │
│               3 │            10930 │ 44506450595794391199934376694987431316 │                     0 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 流的列

您可以使用 SELECT 语句直接查询流并检索跟踪的更改。查询流时，考虑合并这些隐藏列以获取有关更改的更多细节：

| 列                | 描述                                                                                                                                                                         |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| change$action     | 变更类型：INSERT 或 DELETE。                                                                                                                                                 |
| change$is_update  | 表示 `change$action` 是否是 UPDATE 的一部分。在流中，UPDATE 由 DELETE 和 INSERT 操作的组合表示，此字段设置为 `true`。                                                         |
| change$row_id     | 每行的唯一标识符，用于跟踪变更。                                                                                                                                             |

```sql title='示例：'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);

SELECT a, change$action, change$is_update, change_row_id 
FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

-- 如果你添加一个新行然后更新它，
-- 流将更改视为一个带有更新值的 INSERT。
UPDATE t SET a = 3 WHERE a = 2;
SELECT a, change$action, change$is_update, change_row_id 
FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 管理流

要在 Databend 中管理流，请使用以下命令：

<IndexOverviewList />

### 示例：实时跟踪和转换数据

以下示例演示了如何使用流来实时捕获和跟踪用户活动。

#### 1. 创建表

示例使用三个表：
* `user_activities` 表记录用户活动。
* `user_profiles` 表存储用户档案。
* `user_activity_profiles` 表是两个表的组合视图。

创建 `activities_stream` 表作为流，以捕获 `user_activities` 表的实时变化。然后通过查询消费流，将最新数据更新到 `user_activity_profiles` 表。

```sql
-- 创建一个表来记录用户活动
CREATE TABLE user_activities (
    user_id INT,
    activity VARCHAR,
    timestamp TIMESTAMP
);

-- 创建一个表来存储用户档案
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR
);

-- 将数据插入到 user_profiles 表
INSERT INTO user_profiles VALUES (101, 'Alice', 'New York');
INSERT INTO user_profiles VALUES (102, 'Bob', 'San Francisco');
INSERT INTO user_profiles VALUES (103, 'Charlie', 'Los Angeles');
INSERT INTO user_profiles VALUES (104, 'Dana', 'Chicago');

-- 创建一个表，用于组合用户活动和档案的视图
CREATE TABLE user_activity_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR,
    activity VARCHAR,
    activity_timestamp TIMESTAMP
);
```

#### 2. 创建流

在 `user_activities` 表上创建流以捕获实时变化：
```sql
CREATE STREAM activities_stream ON TABLE user_activities;
```

#### 3. 向源表插入数据

向 `user_activities` 表插入数据以进行一些更改：
```sql
INSERT INTO user_activities VALUES (102, 'logout', '2023-12-19 09:00:00');
INSERT INTO user_activities VALUES (103, 'view_profile', '2023-12-19 09:15:00');
INSERT INTO user_activities VALUES (104, 'edit_profile', '2023-12-19 10:00:00');
INSERT INTO user_activities VALUES (101, 'purchase', '2023-12-19 10:30:00');
INSERT INTO user_activities VALUES (102, 'login', '2023-12-19 11:00:00');
```

#### 4. 消费流以更新目标表

消费流以更新 `user_activity_profiles` 表：
```sql
-- 将数据插入到 user_activity_profiles 表
INSERT INTO user_activity_profiles
SELECT
    a.user_id, p.username, p.location, a.activity, a.timestamp
FROM
    -- 变更数据的源表
    activities_stream AS a
JOIN
    -- 与用户档案数据连接
    user_profiles AS p
ON
    a.user_id = p.user_id

-- a.change$action 是一个指示变更类型的列（Databend 目前仅支持 INSERT）
WHERE a.change$action = 'INSERT';
```

然后，检查更新后的 `user_activity_profiles` 表：
```sql
SELECT
  *
FROM
  user_activity_profiles

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │     location     │     activity     │  activity_timestamp │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────────┤
│             103 │ Charlie          │ Los Angeles      │ view_profile     │ 2023-12-19 09:15:00 │
│             104 │ Dana             │ Chicago          │ edit_profile     │ 2023-12-19 10:00:00 │
│             101 │ Alice            │ New York         │ purchase         │ 2023-12-19 10:30:00 │
│             102 │ Bob              │ San Francisco    │ login            │ 2023-12-19 11:00:00 │
│             102 │ Bob              │ San Francisco    │ logout           │ 2023-12-19 09:00:00 │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 5. 实时数据处理的任务更新

为了保持 `user_activity_profiles` 表的最新状态，重要的是要定期将其与 `activities_stream` 中的数据同步。这种同步应与 `user_activities` 表的更新间隔保持一致，确保 user_activity_profiles 准确反映了最新的用户活动和档案，以便实时数据分析。

Databend 的 `TASK` 命令（目前处于私有预览阶段），可以用来定义一个任务，每分钟或每秒更新 `user_activity_profiles` 表。

```sql
-- 在 Databend 中定义一个任务
CREATE TASK user_activity_task 
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
-- 当 activities_stream 中有新数据到来时触发任务
WHEN system$stream_has_data('activities_stream') AS 
    -- 将新记录插入到 user_activity_profiles
    INSERT INTO user_activity_profiles
    SELECT
        -- 根据 user_id 将 activities_stream 与 user_profiles 进行连接
        a.user_id, p.username, p.location, a.activity, a.timestamp
    FROM
        activities_stream AS a
        JOIN user_profiles AS p
            ON a.user_id = p.user_id
    -- 仅包含动作为 'INSERT' 的行
    WHERE a.change$action = 'INSERT';
```

:::tip 任务处于私有预览阶段
`TASK` 命令目前处于私有预览阶段，因此语法和用法将来可能会有所变化。
:::