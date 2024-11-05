---
title: CHANGES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.410"/>

CHANGES 子句允许在定义的时间间隔内查询表的变更跟踪元数据。请注意，时间间隔必须落在数据保留期内（默认为 24 小时）。要定义时间间隔，使用 `AT` 关键字指定一个时间点作为间隔的开始，当前时间作为默认的间隔结束。如果希望将过去的时间指定为间隔的结束，请结合使用 `AT` 和 `END` 关键字来设置间隔。

![alt text](/img/sql/changes.png)

## 语法

```sql
SELECT ...
FROM ...
   CHANGES ( INFORMATION => { DEFAULT | APPEND_ONLY } )
   AT ( { TIMESTAMP => <timestamp> |
          OFFSET => <time_interval> |
          SNAPSHOT => '<snapshot_id>' |
          STREAM => <stream_name> } )

    [ END ( { TIMESTAMP => <timestamp> |
             OFFSET => <time_interval> |
             SNAPSHOT => '<snapshot_id>' } ) ]
```

| 参数        | 描述                                                                                                                                                                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INFORMATION | 指定要检索的变更跟踪元数据的类型。可以是 `DEFAULT` 或 `APPEND_ONLY`。`DEFAULT` 返回所有 DML 变更，包括插入、更新和删除。当设置为 `APPEND_ONLY` 时，仅返回追加的行。                                                                              |
| AT          | 指定查询变更跟踪元数据的时间间隔的起点。                                                                                                                                                                                                                                              |
| END         | 可选参数，指定查询变更跟踪元数据的时间间隔的终点。如果未提供，则默认使用当前时间作为终点。                                                                                                                                                           |
| TIMESTAMP   | 指定一个特定的时间戳作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                          |
| OFFSET      | 指定相对于当前时间的时间间隔（以秒为单位）作为查询变更跟踪元数据的参考点。它应为负整数形式，绝对值表示时间差异的秒数。例如，`-3600` 表示回溯 1 小时（3,600 秒）。 |
| SNAPSHOT    | 指定一个快照 ID 作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                                 |
| STREAM      | 指定一个流名称作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                                 |

## 启用变更跟踪

CHANGES 子句要求表上的 Fuse 引擎选项 `change_tracking` 必须设置为 `true`。有关 `change_tracking` 选项的更多信息，请参阅 [Fuse 引擎选项](/sql/sql-reference/table-engines/fuse#options)。

```sql title='示例:'
-- 为表 't' 启用变更跟踪
ALTER TABLE t SET OPTIONS(change_tracking = true);
```

## 示例

此示例演示了 CHANGES 子句的使用，允许跟踪和查询对表所做的变更：

1. 创建一个表来存储用户配置文件信息并启用变更跟踪。

```sql
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR(255),
    bio TEXT
) change_tracking = true;


INSERT INTO user_profiles VALUES (1, 'john_doe', 'Software Engineer');
INSERT INTO user_profiles VALUES (2, 'jane_smith', 'Marketing Specialist');
```

2. 创建一个流来捕获配置文件更新，然后更新现有配置文件并插入新配置文件。

```sql
CREATE STREAM profile_updates ON TABLE user_profiles APPEND_ONLY = TRUE;


UPDATE user_profiles SET bio = 'Data Scientist' WHERE user_id = 1;
INSERT INTO user_profiles VALUES (3, 'alex_wong', 'Data Analyst');
```

3. 通过流查询用户配置文件的变更。

```sql
-- 返回流中捕获的用户配置文件的所有变更
SELECT *
FROM user_profiles
CHANGES (INFORMATION => DEFAULT)
AT (STREAM => profile_updates);

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │        bio        │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼───────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               1 │ john_doe         │ Data Scientist    │ INSERT           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               3 │ alex_wong        │ Data Analyst      │ INSERT           │ 59f315c8655c49eab35ba1959e269430000000 │ false            │
│               1 │ john_doe         │ Software Engineer │ DELETE           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 返回流中捕获的用户配置文件的追加行
SELECT *
FROM user_profiles
CHANGES (INFORMATION => APPEND_ONLY)
AT (STREAM => profile_updates);

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │        bio       │ change$action │ change$is_update │              change$row_id             │
├─────────────────┼──────────────────┼──────────────────┼───────────────┼──────────────────┼────────────────────────────────────────┤
│               3 │ alex_wong        │ Data Analyst     │ INSERT        │ false            │ 59f315c8655c49eab35ba1959e269430000000 │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

4. 使用 `AT` 和 `END` 关键字在快照和时间戳之间查询变更。

```sql
-- 步骤 6: 对用户配置文件数据进行快照。
SELECT snapshot_id, timestamp
FROM FUSE_SNAPSHOT('default', 'user_profiles');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 6a11c94433714970895edd38577ac8b0 │ 2024-04-10 02:51:39.422832 │
│ 53dc4750af92423da91c50dcee547cfb │ 2024-04-10 02:51:39.399568 │
│ 910af7424f764891b0c6fa60aa99fc3a │ 2024-04-10 02:50:14.522416 │
│ 1225000916f44819a0d23178b2d0d1af │ 2024-04-10 02:50:14.500417 │
└───────────────────────────────────────────────────────────────┘

SELECT *
FROM user_profiles
CHANGES (INFORMATION => DEFAULT)
AT (SNAPSHOT => '1225000916f44819a0d23178b2d0d1af')
END (TIMESTAMP => '2024-04-10 02:51:39.399568'::TIMESTAMP);
```

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │          bio         │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼──────────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               1 │ john_doe         │ 数据科学家           │ INSERT           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               1 │ john_doe         │ 软件工程师           │ DELETE           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               2 │ jane_smith       │ 市场专员             │ INSERT           │ 3db484ac18174223851dc9de22f6bfec000000 │ false            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```