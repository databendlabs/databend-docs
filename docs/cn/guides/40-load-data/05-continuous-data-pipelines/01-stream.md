---
title: 通过流（Stream）跟踪和转换数据
sidebar_label: 流（Stream）
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 中的流（Stream）是表变更的动态实时表示，用于捕获和跟踪关联表的修改，支持持续消费和分析实时数据变更。

### 流（Stream）工作原理

流（Stream）支持两种运行模式：**标准（Standard）** 和 **仅追加（Append-Only）**。通过 [CREATE STREAM](/sql/sql-commands/ddl/stream/create-stream) 命令的 `APPEND_ONLY` 参数指定模式（默认值 `true`）。

- **标准（Standard）**：捕获所有数据变更类型，包括插入、更新和删除
- **仅追加（Append-Only）**：仅包含数据插入记录，不捕获更新或删除操作

Databend 流（Stream）的设计理念是聚焦数据最终状态。例如插入值后多次更新时，流（Stream）仅保留消费前的最新值状态。以下示例展示两种模式下流（Stream）的表现和工作原理。

<StepsWrap>
<StepContent number="1">

#### 创建流（Stream）捕获变更

首先创建两个表，然后为每个表创建不同模式的流（Stream）来捕获变更：

```sql
-- 创建表并插入值
CREATE TABLE t_standard(a INT);
CREATE TABLE t_append_only(a INT);

-- 创建两种模式的流：标准和仅追加
CREATE STREAM s_standard ON TABLE t_standard APPEND_ONLY=false;
CREATE STREAM s_append_only ON TABLE t_append_only APPEND_ONLY=true;
```

使用 [SHOW FULL STREAMS](/sql/sql-commands/ddl/stream/show-streams) 命令查看流（Stream）及其模式：

```sql
SHOW FULL STREAMS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         created_on         │      name     │ database │ catalog │        table_on       │       owner      │ comment │     mode    │ invalid_reason │
├────────────────────────────┼───────────────┼──────────┼─────────┼───────────────────────┼──────────────────┼─────────┼─────────────┼────────────────┤
│ 2024-02-18 16:39:58.996763 │ s_append_only │ default  │ default │ default.t_append_only │ NULL             │         │ append_only │                │
│ 2024-02-18 16:39:58.966942 │ s_standard    │ default  │ default │ default.t_standard    │ NULL             │         │ standard    │                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

向每个表插入两个值并观察流（Stream）捕获结果：

```sql
-- 插入新值
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

两个流（Stream）均成功捕获新插入记录（详见[流（Stream）列](#stream-columns)）。更新并删除新插入值后观察差异：

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

此时两种模式差异不明显，因为流（Stream）尚未被消费。所有变更已合并为 INSERT 操作。**流（Stream）可通过任务（Task）、DML 操作或 [WITH CONSUME](/sql/sql-commands/query-syntax/with-consume)/[WITH Stream Hints](/sql/sql-commands/query-syntax/with-stream-hints) 查询消费**。消费后流（Stream）清空但持续捕获新变更。下面通过消费流（Stream）分析差异。

</StepContent>
<StepContent number="2">

#### 消费流（Stream）

创建新表并插入流（Stream）捕获内容：

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

消费后查询流（Stream）将返回空结果：

```sql
-- 空结果
SELECT * FROM s_standard;

-- 空结果
SELECT * FROM s_append_only;
```

</StepContent>
<StepContent number="3">

#### 捕获新变更

将表中值 `3` 更新为 `4` 后检查流（Stream）：

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

标准流（Stream）将 UPDATE 处理为两个操作：DELETE 移除旧值 (`3`) + INSERT 添加新值 (`4`)。更新 `3` 到 `4` 时需先删除旧值（最终状态不存在），再插入新值。这体现标准流（Stream）仅捕获最终变更，将更新表示为同行的删除+插入序列。

仅追加流（Stream）无输出，因其仅记录新增数据（INSERT），忽略更新/删除。

删除值 `4` 后结果：

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

两种模式均能捕获插入操作及消费前的后续更新/删除。但消费后对已插入数据的更新/删除，仅标准流（Stream）能捕获并记录为 DELETE/INSERT 操作。

</StepContent>
</StepsWrap>

### 流（Stream）消费的事务支持

Databend 中流（Stream）消费在单语句事务中具有事务性：

**成功事务**：事务提交时流（Stream）被消费。例如：
```sql
INSERT INTO table SELECT * FROM stream;
```
当 `INSERT` 事务提交时，流（Stream）被消费。

**失败事务**：事务失败时流（Stream）保持不变，可供后续消费

**并发访问**：_同一时间仅一个事务能成功消费流（Stream）_。多事务尝试消费同个流（Stream）时，仅首个提交的事务成功

### 流（Stream）的表元数据

**流（Stream）不存储表数据**。创建流（Stream）后，Databend 为表添加以下隐藏元数据列用于变更跟踪：

| 列                     | 描述                                      |
| ---------------------- | ----------------------------------------- |
| \_origin_version       | 标识行创建时的表版本                      |
| \_origin_block_id      | 标识行原属数据块 ID                       |
| \_origin_block_row_num | 标识行在原数据块中的行号                  |
| \_row_version          | 行版本号（从 0 开始，每次更新递增 1）     |

使用 SELECT 语句查看列值：

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

### 流（Stream）列

使用 SELECT 查询流（Stream）时，可包含以下隐藏列获取变更详情：

| 列               | 描述                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| change$action    | 变更类型：INSERT 或 DELETE                                           |
| change$is_update | 标识 `change$action` 是否为 UPDATE 的一部分（UPDATE 由 DELETE+INSERT 表示） |
| change$row_id    | 行唯一标识符，用于变更跟踪                                           |

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

-- 新增行后更新
-- 流（Stream）将变更合并为含更新值的 INSERT
UPDATE t SET a = 3 WHERE a = 2;
SELECT * FROM s;

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│        a        │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ INSERT        │ false            │ a577745c6a404f3384fa95791eb43f22000000 │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例：实时跟踪转换数据

以下示例展示如何使用流（Stream）实时捕获跟踪用户活动。

#### 1. 创建表

使用三个表：
- `user_activities`：记录用户活动
- `user_profiles`：存储用户配置
- `user_activity_profiles`：两表组合视图

创建 `activities_stream` 流（Stream）捕获 `user_activities` 表实时变更，通过查询消费更新 `user_activity_profiles` 表。

```sql
-- 创建用户活动表
CREATE TABLE user_activities (
    user_id INT,
    activity VARCHAR,
    timestamp TIMESTAMP
);

-- 创建用户配置表
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR
);

-- 向用户配置表插入数据
INSERT INTO user_profiles VALUES (101, 'Alice', 'New York');
INSERT INTO user_profiles VALUES (102, 'Bob', 'San Francisco');
INSERT INTO user_profiles VALUES (103, 'Charlie', 'Los Angeles');
INSERT INTO user_profiles VALUES (104, 'Dana', 'Chicago');

-- 创建用户活动配置组合表
CREATE TABLE user_activity_profiles (
    user_id INT,
    username VARCHAR,
    location VARCHAR,
    activity VARCHAR,
    activity_timestamp TIMESTAMP
);
```

#### 2. 创建流（Stream）

在 `user_activities` 表创建流（Stream）捕获实时变更：

```sql
CREATE STREAM activities_stream ON TABLE user_activities;
```

#### 3. 向源表插入数据

向 `user_activities` 表插入变更数据：

```sql
INSERT INTO user_activities VALUES (102, 'logout', '2023-12-19 09:00:00');
INSERT INTO user_activities VALUES (103, 'view_profile', '2023-12-19 09:15:00');
INSERT INTO user_activities VALUES (104, 'edit_profile', '2023-12-19 10:00:00');
INSERT INTO user_activities VALUES (101, 'purchase', '2023-12-19 10:30:00');
INSERT INTO user_activities VALUES (102, 'login', '2023-12-19 11:00:00');
```

#### 4. 消费流（Stream）更新目标表

消费流（Stream）更新 `user_activity_profiles` 表：

```sql
-- 向目标表插入数据
INSERT INTO user_activity_profiles
SELECT
    a.user_id, p.username, p.location, a.activity, a.timestamp
FROM
    -- 变更数据源表
    activities_stream AS a
JOIN
    -- 关联用户配置
    user_profiles AS p
ON
    a.user_id = p.user_id

-- 筛选 INSERT 操作（当前仅支持此类型）
WHERE a.change$action = 'INSERT';
```

检查更新后的表：

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

需定期将 `user_activity_profiles` 表与 `activities_stream` 同步，保持与 `user_activities` 更新节奏一致，确保实时数据分析准确性。

使用 Databend `TASK` 命令（当前私有预览）可定义定时任务：

```sql
-- 创建定时任务
CREATE TASK user_activity_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
-- 流（Stream）有新数据时触发
WHEN stream_status('activities_stream') AS
    -- 插入新记录
    INSERT INTO user_activity_profiles
    SELECT
        -- 按 user_id 关联数据
        a.user_id, p.username, p.location, a.activity, a.timestamp
    FROM
        activities_stream AS a
        JOIN user_profiles AS p
            ON a.user_id = p.user_id
    -- 仅处理 INSERT 操作
    WHERE a.change$action = 'INSERT';
```