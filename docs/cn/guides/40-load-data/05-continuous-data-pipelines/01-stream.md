---
title: 通过 Stream 追踪与转换数据
sidebar_label: Stream
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 中的 Stream 是一种动态实时记录表变更的机制。通过创建 Stream 可以捕获并跟踪关联表的修改，实现对数据变更的持续消费与分析。

### Stream 工作原理

Stream 支持两种工作模式：**标准模式** 和 **仅追加模式**。在 [CREATE STREAM](/sql/sql-commands/ddl/stream/create-stream) 时通过 `APPEND_ONLY` 参数指定（默认为 `true`）。

- **标准模式**：捕获所有类型的数据变更，包括插入、更新和删除。
- **仅追加模式**：此模式下 Stream 仅包含数据插入记录，不捕获更新或删除操作。

Databend Stream 的设计哲学是专注于捕获数据的最终状态。例如，如果您插入一个值然后多次更新它，Stream 只会保留该值在被消费前的最新状态。以下示例展示了两种模式下 Stream 的表现形式和工作原理。

<StepsWrap>
<StepContent number="1">

#### 创建 Stream 捕获变更

首先创建两个表，然后分别为它们创建不同模式的 Stream 来捕获表变更。

```sql
-- 创建表并插入初始值
CREATE TABLE t_standard(a INT);
CREATE TABLE t_append_only(a INT);

-- 创建两种模式的 Stream：标准模式和仅追加模式
CREATE STREAM s_standard ON TABLE t_standard APPEND_ONLY=false;
CREATE STREAM s_append_only ON TABLE t_append_only APPEND_ONLY=true;
```

使用 [SHOW FULL STREAMS](/sql/sql-commands/ddl/stream/show-streams) 命令可以查看已创建的 Stream 及其模式：

```sql
SHOW FULL STREAMS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │      name     │ database │ catalog │        table_on       │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────┼──────────┼─────────┼───────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2024-02-18 16:39:58.996763 │ s_append_only │ default  │ default │ default.t_append_only │ NULL             │         │ append_only │                │
│ 2024-02-18 16:39:58.966942 │ s_standard    │ default  │ default │ default.t_standard    │ NULL             │         │ standard    │                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

现在向每个表插入两个值，观察 Stream 捕获的内容：

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

以上结果表明两个 Stream 都成功捕获了新插入的记录。关于结果中 Stream 列的含义，请参阅 [Stream 列结构](#stream-columns) 。现在让我们更新并删除一个新插入的值，观察 Stream 捕获的差异。

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

到目前为止，由于我们尚未处理 Stream，两种模式之间没有显著差异。所有变更都被整合并表现为 INSERT 操作。**Stream 可以通过任务、DML (数据操作语言) 操作或使用 [WITH CONSUME](/sql/sql-commands/query-syntax/with-consume) 和 [WITH Stream Hints](/sql/sql-commands/query-syntax/with-stream-hints) 的查询来消费**。消费后 Stream 将不包含数据，但可以继续捕获新的变更（如果有）。为了进一步分析差异，让我们继续消费 Stream 并检查输出。

</StepContent>
<StepContent number="2">

#### 消费 Stream

创建两个新表，并将 Stream 捕获的内容插入其中。

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

如果现在查询 Stream，会发现它们已为空，因为已被消费。

```sql
-- 空结果
SELECT * FROM s_standard;

-- 空结果
SELECT * FROM s_append_only;
```

</StepContent>
<StepContent number="3">

#### 捕获新变更

现在将每个表中的值从 `3` 更新为 `4`，然后再次检查它们的 Stream：

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

以上结果表明，标准模式 Stream 将 UPDATE 操作处理为两个动作的组合：一个 DELETE 动作移除旧值 (`3`)，一个 INSERT 动作添加新值 (`4`)。当将 `3` 更新为 `4` 时，必须首先删除现有值 `3`，因为它已不在最终状态中，然后插入新值 `4`。这种行为反映了标准模式 Stream 如何仅捕获最终变更，将更新表示为同一行的删除（移除旧值）和插入（添加新值）序列。

另一方面，仅追加模式 Stream 没有捕获任何内容，因为它设计为仅记录新数据添加（INSERT）而忽略更新或删除。

如果现在删除值 `4`，可以得到以下结果：

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

我们可以看到，两种模式的 Stream 都能够捕获插入操作，以及在 Stream 被消费前对插入值所做的任何更新和删除。但在消费后，如果对先前插入的数据进行更新或删除，只有标准模式 Stream 能够捕获这些变更，并将其记录为 DELETE 和 INSERT 操作。

</StepContent>
</StepsWrap>

### 流式消费的事务支持

在 Databend 中，流式消费在单语句事务中具有事务性保障。这意味着：

**事务成功**：如果事务提交，则流被消费。例如：

```sql
INSERT INTO table SELECT * FROM stream;
```

若该 `INSERT` 事务提交成功，则流数据被消费。

**事务失败**：若事务失败，流数据保持不变且可供后续消费。

**并发访问**：_同一时间只有一个事务能成功消费流数据_。若多个事务尝试消费同一流，仅首个提交的事务会成功，其他事务将失败。

### 流的表元数据

**流本身不存储表的任何数据**。为表创建流后，Databend 会为该表添加特定的隐藏元数据列用于变更追踪，包括：

| 列名                   | 描述                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| \_origin_version       | 标识该行最初创建时的表版本。             |
| \_origin_block_id      | 标识该行先前所属的数据块 ID。                    |
| \_origin_block_row_num | 标识该行在先前所属数据块中的行号。 |
| \_row_version          | 标识行版本号，从 0 开始，每次更新递增 1。 |

要查看这些列的值，可使用 SELECT 语句：

```sql title='示例：'
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

### 流专用列

可直接通过 SELECT 语句查询流以获取变更记录。查询时可包含以下隐藏列获取变更详情：

| 列名            | 描述                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change$action    | 变更类型：INSERT 或 DELETE。                                                                                                                                                  |
| change$is_update | 标识该变更是否为 UPDATE 操作的一部分。在流中，UPDATE 操作会分解为 DELETE 和 INSERT 操作，此字段将标记为 `true`。 |
| change$row_id    | 用于追踪变更的每行唯一标识符。                                                                                                                                   |

```sql title='示例：'
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

-- 若新增行后更新该行
-- 流会将变更合并为包含更新值的 INSERT 操作
UPDATE t SET a = 3 WHERE a = 2;
SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例：实时数据追踪与转换

以下示例展示如何使用流实时捕获和追踪用户活动。

#### 1. 创建表结构

示例使用三个表：

- `user_activities` 表记录用户活动
- `user_profiles` 表存储用户档案
- `user_activity_profiles` 表是前两者的合并视图

创建 `activities_stream` 流用于捕获 `user_activities` 表的实时变更，随后通过查询消费该流来更新 `user_activity_profiles` 表。

```sql
-- 创建用户活动记录表
CREATE TABLE user_activities (
    user_id INT,
    activity VARCHAR,
    timestamp TIMESTAMP
);

-- 创建用户档案表
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR
);

-- 向用户档案表插入数据
INSERT INTO user_profiles VALUES (101, 'Alice', 'New York');
INSERT INTO user_profiles VALUES (102, 'Bob', 'San Francisco');
INSERT INTO user_profiles VALUES (103, 'Charlie', 'Los Angeles');
INSERT INTO user_profiles VALUES (104, 'Dana', 'Chicago');

-- 创建用户活动与档案的合并视图表
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

向 `user_activities` 表插入数据以产生变更：

```sql
INSERT INTO user_activities VALUES (102, 'logout', '2023-12-19 09:00:00');
INSERT INTO user_activities VALUES (103, 'view_profile', '2023-12-19 09:15:00');
INSERT INTO user_activities VALUES (104, 'edit_profile', '2023-12-19 10:00:00');
INSERT INTO user_activities VALUES (101, 'purchase', '2023-12-19 10:30:00');
INSERT INTO user_activities VALUES (102, 'login', '2023-12-19 11:00:00');
```

#### 4. 消费流数据更新目标表

消费流数据更新 `user_activity_profiles` 表：

```sql
-- 向合并视图表插入数据
INSERT INTO user_activity_profiles
SELECT
    a.user_id, p.username, p.location, a.activity, a.timestamp
FROM
    -- 变更数据源表
    activities_stream AS a
JOIN
    -- 关联用户档案数据
    user_profiles AS p
ON
    a.user_id = p.user_id

-- a.change$action 是标识变更类型的列（当前 Databend 仅支持 INSERT）
WHERE a.change$action = 'INSERT';
```

查看更新后的 `user_activity_profiles` 表：

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

#### 5. 实时数据处理任务更新

为使 `user_activity_profiles` 表保持最新，需定期与 `activities_stream` 流同步数据。同步频率应与 `user_activities` 表更新间隔一致，确保合并视图能准确反映最新的用户活动和档案数据。

可使用 Databend 的 `TASK` 命令（当前为私有预览功能）定义每分钟或每秒更新 `user_activity_profiles` 表的任务。

```sql
-- 在 Databend 中定义定时任务
CREATE TASK user_activity_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
-- 当 activities_stream 有新数据时触发任务
WHEN stream_status('activities_stream') AS
    -- 向合并视图表插入新记录
    INSERT INTO user_activity_profiles
    SELECT
        -- 基于 user_id 关联流数据和用户档案
        a.user_id, p.username, p.location, a.activity, a.timestamp
    FROM
        activities_stream AS a
        JOIN user_profiles AS p
            ON a.user_id = p.user_id
    -- 仅包含 INSERT 类型的变更行
    WHERE a.change$action = 'INSERT';
```