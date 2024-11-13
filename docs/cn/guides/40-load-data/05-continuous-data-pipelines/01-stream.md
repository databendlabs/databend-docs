---
title: 通过流跟踪和转换数据
sidebar_label: 流
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在 Databend 中，流是对表更改的动态和实时表示。流被创建以捕获和跟踪关联表的修改，允许在数据更改发生时进行持续的消费和分析。

### 流的工作原理

流可以以两种模式运行：**标准**和**仅追加**。在创建流时使用 `APPEND_ONLY` 参数（默认为 `false`）指定模式。

- **标准**：捕获所有类型的数据更改，包括插入、更新和删除。
- **仅追加**：在此模式下，流仅包含数据插入记录；数据更新或删除不会被捕获。

以下示例说明了流的样子以及它在两种模式下的工作方式。

<StepsWrap>
<StepContent number="1">

#### 创建流以捕获更改

首先创建两个表，然后为每个表创建一个具有不同模式的流以捕获表的更改。

```sql
-- 创建一个表并插入一个值
CREATE TABLE t_standard(a INT);
CREATE TABLE t_append_only(a INT);

-- 创建两个具有不同模式的流：标准和仅追加
CREATE STREAM s_standard ON TABLE t_standard APPEND_ONLY=false;
CREATE STREAM s_append_only ON TABLE t_append_only APPEND_ONLY=true;
```

您可以使用 [SHOW FULL STREAMS](/sql/sql-commands/ddl/stream/show-streams) 命令查看创建的流及其模式：

```sql
SHOW FULL STREAMS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │      name     │ database │ catalog │        table_on       │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────┼──────────┼─────────┼───────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2024-02-18 16:39:58.996763 │ s_append_only │ default  │ default │ default.t_append_only │ NULL             │         │ append_only │                │
│ 2024-02-18 16:39:58.966942 │ s_standard    │ default  │ default │ default.t_standard    │ NULL             │         │ standard    │                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

现在，向每个表插入两个值并观察流捕获的内容：

```sql
-- 插入两个新值
INSERT INTO t_standard VALUES(2), (3);
INSERT INTO t_append_only VALUES(2), (3);

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               2 │ INSERT           │ 8cd000827f8140d9921f897016e5a88e000000 │ false            │
│               3 │ INSERT           │ 8cd000827f8140d9921f897016e5a88e000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000000 │
│               3 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

上述结果表明，两个流都成功捕获了新的插入。有关结果中流列的详细信息，请参见 [流列](#stream-columns)。现在，让我们更新然后删除一个新插入的值，并检查流捕获是否有差异。

```sql
UPDATE t_standard SET a = 4 WHERE a = 2;
UPDATE t_append_only SET a = 4 WHERE a = 2;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
|               4 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000000 │ false            |
│               3 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               4 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000000 │
│               3 │ INSERT        │ false            │ 63dc9b84fe0a43528808c3304969b317000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

DELETE FROM t_standard WHERE a = 4;
DELETE FROM t_append_only WHERE a = 4;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM s_append_only;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ bfed6c91f3e4402fa477b6853a2d2b58000001 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

到目前为止，我们还没有注意到两种模式之间的显著差异，因为我们还没有处理流。所有更改都已合并并表现为 INSERT 操作。**流可以通过任务、DML（数据操作语言）操作或带有 [WITH CONSUME](/sql/sql-commands/query-syntax/with-consume) 或 [WITH Stream Hints](/sql/sql-commands/query-syntax/with-stream-hints) 的查询来消费**。消费后，流不包含数据，但可以继续捕获新的更改（如果有）。为了进一步分析差异，让我们继续消费流并检查输出。

</StepContent>
<StepContent number="2">

#### 消费流

让我们创建两个新表并将流捕获的内容插入其中。

```sql
CREATE TABLE t_consume_standard(b INT);
CREATE TABLE t_consume_append_only(b INT);

INSERT INTO t_consume_standard SELECT a FROM s_standard;
INSERT INTO t_consume_append_only SELECT a FROM s_append_only;

SELECT * FROM t_consume_standard;

┌─────────────────┐
│        b        │
├─────────────────┤
│               3 │
└─────────────────┘

SELECT * FROM t_consume_append_only;

┌─────────────────┐
│        b        │
├─────────────────┤
│               3 │
└─────────────────┘
```

如果您现在查询流，您会发现它们是空的，因为它们已经被消费。

```sql
-- 空结果
SELECT * FROM s_standard;

-- 空结果
SELECT * FROM s_append_only;
```

</StepContent>
<StepContent number="3">

#### 捕获新更改

现在，让我们将每个表中的值从 `3` 更新为 `4`，然后再次检查它们的流：

```sql
UPDATE t_standard SET a = 4 WHERE a = 3;
UPDATE t_append_only SET a = 4 WHERE a = 3;


SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ DELETE           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ true             │
│               4 │ INSERT           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ true             │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 空结果
SELECT * FROM s_append_only;
```

上述结果表明，标准流将 UPDATE 操作转换为 DELETE (`3`) 和 INSERT (`4`) 的组合，而仅追加流没有捕获任何内容。如果我们现在删除值 `4`，我们可以得到以下结果：

```sql
DELETE FROM t_standard WHERE a = 4;
DELETE FROM t_append_only WHERE a = 4;

SELECT * FROM s_standard;

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │   change$action  │              change$row_id             │ change$is_update │
│ Nullable(Int32) │ Nullable(String) │            Nullable(String)            │      Boolean     │
├─────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               3 │ DELETE           │ 1dd5cab0b1b64328a112db89d602ca04000001 │ false            │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 空结果
SELECT * FROM s_append_only;
```

我们可以看到，两种流模式都能够捕获插入，以及在流被消费之前对插入值进行的任何后续更新和删除。然而，在消费之后，如果对之前插入的数据进行更新或删除，只有标准流能够捕获这些更改，并将它们记录为 DELETE 和 INSERT 操作。

</StepContent>
</StepsWrap>

### 流消费的事务支持

在 Databend 中，流消费在单语句事务中是事务性的。这意味着：

**成功的事务**：如果事务提交，流被消费。例如：

```sql
INSERT INTO table SELECT * FROM stream;
```

如果此 `INSERT` 事务提交，流被消费。

**失败的事务**：如果事务失败，流保持不变并可用于未来的消费。

**并发访问**：_一次只能有一个事务成功消费一个流_。如果多个事务尝试消费同一个流，只有第一个提交的事务成功，其他事务失败。

### 流的表元数据



**流不会为表存储任何数据**。在为表创建流之后，Databend会为该表引入特定的隐藏元数据列，用于变更追踪。这些列包括：

| 列                     | 描述                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| \_origin_version       | 标识此行最初创建时的表版本。             |
| \_origin_block_id      | 标识此行之前所属的块ID。                    |
| \_origin_block_row_num | 标识此行之前所属块中的行号。 |
| \_row_version          | 标识行版本，从0开始，每次更新递增1。 |

要显示这些列的值，请使用SELECT语句：

```sql title='示例:'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);
SELECT
  *,
  _origin_version,
  _origin_block_id,
  _origin_block_row_num,
  _row_version
FROM
  t;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │     _origin_block_id     │ _origin_block_row_num │ _row_version │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────────┼──────────────┤
│               1 │             NULL │ NULL                     │                  NULL │            0 │
│               2 │             NULL │ NULL                     │                  NULL │            0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘

UPDATE t SET a = 3 WHERE a = 2;
SELECT
  *,
  _origin_version,
  _origin_block_id,
  _origin_block_row_num,
  _row_version
FROM
  t;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │  _origin_version │             _origin_block_id            │ _origin_block_row_num │ _row_version │
├─────────────────┼──────────────────┼─────────────────────────────────────────┼───────────────────────┼──────────────┤
│               3 │             2317 │ 132795849016460663684755265365603707394 │                     0 │            1 │
│               1 │             NULL │ NULL                                    │                  NULL │            0 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 流列

您可以使用SELECT语句直接查询流并检索跟踪的变更。在查询流时，考虑包含这些隐藏列以获取有关变更的更多详细信息：

| 列               | 描述                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change$action    | 变更类型：INSERT或DELETE。                                                                                                                                                  |
| change$is_update | 指示`change$action`是否是UPDATE的一部分。在流中，UPDATE由DELETE和INSERT操作的组合表示，此字段设置为`true`。 |
| change$row_id    | 用于跟踪变更的每一行的唯一标识符。                                                                                                                                   |

```sql title='示例:'
CREATE TABLE t(a int);
INSERT INTO t VALUES (1);
CREATE STREAM s ON TABLE t;
INSERT INTO t VALUES (2);

SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               2 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

-- 如果您添加新行然后更新它，
-- 流会将变更合并为带有更新值的INSERT。
UPDATE t SET a = 3 WHERE a = 2;
SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例：实时跟踪和转换数据

以下示例演示了如何使用流来捕获和跟踪实时用户活动。

#### 1. 创建表

该示例使用三个表：

- `user_activities` 表记录用户活动。
- `user_profiles` 表存储用户档案。
- `user_activity_profiles` 表是两个表的组合视图。

`activities_stream` 表作为流创建，以捕获 `user_activities` 表的实时变更。然后，流被查询消费，以使用最新数据更新 `user_activity_profiles` 表。

```sql
-- 创建表以记录用户活动
CREATE TABLE user_activities (
    user_id INT,
    activity VARCHAR,
    timestamp TIMESTAMP
);

-- 创建表以存储用户档案
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR
);

-- 向 user_profiles 表插入数据
INSERT INTO user_profiles VALUES (101, 'Alice', 'New York');
INSERT INTO user_profiles VALUES (102, 'Bob', 'San Francisco');
INSERT INTO user_profiles VALUES (103, 'Charlie', 'Los Angeles');
INSERT INTO user_profiles VALUES (104, 'Dana', 'Chicago');

-- 创建表以存储用户活动和档案的组合视图
CREATE TABLE user_activity_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR,
    activity VARCHAR,
    activity_timestamp TIMESTAMP
);
```

#### 2. 创建流

在 `user_activities` 表上创建流以捕获实时变更：

```sql
CREATE STREAM activities_stream ON TABLE user_activities;
```

#### 3. 向源表插入数据

向 `user_activities` 表插入数据以进行一些变更：

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
-- 向 user_activity_profiles 表插入数据
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

-- a.change$action 是表示变更类型的列（Databend目前仅支持INSERT）
WHERE a.change$action = 'INSERT';
```

然后，检查更新的 `user_activity_profiles` 表：

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

为了保持 `user_activity_profiles` 表的最新状态，重要的是定期将其与 `activities_stream` 中的数据同步。此同步应与 `user_activities` 表的更新间隔一致，确保 `user_activity_profiles` 准确反映最新的用户活动和档案，以进行实时数据分析。

Databend的 `TASK` 命令（目前处于私有预览阶段），可以用于定义每分钟或每秒更新 `user_activity_profiles` 表的任务。

```sql
-- 在Databend中定义任务
CREATE TASK user_activity_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
-- 当 activities_stream 中有新数据到达时触发任务
WHEN stream_status('activities_stream') AS
    -- 向 user_activity_profiles 插入新记录
    INSERT INTO user_activity_profiles
    SELECT
        -- 基于 user_id 将 activities_stream 与 user_profiles 连接
        a.user_id, p.username, p.location, a.activity, a.timestamp
    FROM
        activities_stream AS a
        JOIN user_profiles AS p
            ON a.user_id = p.user_id
    -- 仅包含 action 为 'INSERT' 的行
    WHERE a.change$action = 'INSERT';
```