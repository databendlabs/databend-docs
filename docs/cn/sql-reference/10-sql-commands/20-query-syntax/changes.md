---
title: CHANGES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.410"/>

`CHANGES` 子句允许在定义的时间间隔内查询表的变更跟踪元数据。请注意，时间间隔必须在数据保留期内（默认为 24 小时）。要定义时间间隔，请使用 `AT` 关键字指定一个时间点作为间隔的开始，当前时间将用作间隔的默认结束。如果您希望指定过去的时间作为间隔的结束，请结合使用 `END` 关键字和 `AT` 关键字来设置间隔。

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

| 参数          | 描述                                                                                                                                                                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INFORMATION | 指定要检索的变更跟踪元数据的类型。可以设置为 `DEFAULT` 或 `APPEND_ONLY`。`DEFAULT` 返回所有 DML 更改，包括插入、更新和删除。当设置为 `APPEND_ONLY` 时，仅返回追加的行。                                                                                                                                                           |
| AT          | 指定查询变更跟踪元数据的时间间隔的起始点。                                                                                                                                                                                                                                                                                         |
| END         | 可选参数，指定查询变更跟踪元数据的时间间隔的结束点。如果未提供，则当前时间用作默认结束点。                                                                                                                                                                                                                                                   |
| TIMESTAMP   | 指定一个特定的时间戳作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                                                                       |
| OFFSET      | 指定相对于当前时间的以秒为单位的时间间隔，作为查询变更跟踪元数据的参考点。它应该采用负整数的形式，其中绝对值表示以秒为单位的时间差。例如，`-3600` 表示回溯 1 小时（3,600 秒）。                                                                                                                                                           |
| SNAPSHOT    | 指定一个快照 ID 作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                                                                       |
| STREAM      | 指定一个流名称作为查询变更跟踪元数据的参考点。                                                                                                                                                                                                                                                                                       |

## 启用变更跟踪

`CHANGES` 子句要求在表上将 Fuse 引擎选项 `change_tracking` 设置为 `true`。有关 `change_tracking` 选项的更多信息，请参见 [Fuse 引擎选项](/sql/sql-reference/table-engines/fuse#options)。

```sql title='Example:'
-- 启用表 't' 的变更跟踪
ALTER TABLE t SET OPTIONS(change_tracking = true);
```

## 示例

此示例演示了 `CHANGES` 子句的用法，允许跟踪和查询对表所做的更改：

1. 创建一个表来存储用户个人资料信息并启用变更跟踪。

```sql
CREATE TABLE user_profiles (
    user_id INT,
    username VARCHAR(255),
    bio TEXT
) change_tracking = true;


INSERT INTO user_profiles VALUES (1, 'john_doe', 'Software Engineer');
INSERT INTO user_profiles VALUES (2, 'jane_smith', 'Marketing Specialist');
```

2. 创建一个流来捕获个人资料更新，然后更新一个现有的个人资料并插入一个新的个人资料。

```sql
CREATE STREAM profile_updates ON TABLE user_profiles APPEND_ONLY = TRUE;


UPDATE user_profiles SET bio = 'Data Scientist' WHERE user_id = 1;
INSERT INTO user_profiles VALUES (3, 'alex_wong', 'Data Analyst');
```

3. 按流查询用户个人资料中的更改。

```sql
-- 返回流中捕获的用户个人资料中的所有更改
SELECT *
FROM user_profiles
CHANGES (INFORMATION => DEFAULT)
AT (STREAM => profile_updates);

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │        bio        │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼───────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               1 │ john_doe         │ Data Scientist    │ INSERT           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               3 │ alex_wong        │ Data Analyst      │ INSERT           │ 59f315c8655c49eab35ba1959e26943000000 │ false            │
│               1 │ john_doe         │ Software Engineer │ DELETE           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 返回流中捕获的用户个人资料中的追加行
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

4. 使用 `AT` 和 `END` 关键字查询快照和时间戳之间的更改。

```sql
-- 步骤 6：获取用户个人资料数据的快照。
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

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     user_id     │     username     │          bio         │   change$action  │              change$row_id             │ change$is_update │
├─────────────────┼──────────────────┼──────────────────────┼──────────────────┼────────────────────────────────────────┼──────────────────┤
│               1 │ john_doe         │ Data Scientist       │ INSERT           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               1 │ john_doe         │ Software Engineer    │ DELETE           │ 69cffb02264144c384d56f7b6cedee41000000 │ true             │
│               2 │ jane_smith       │ Marketing Specialist │ INSERT           │ 3db484ac18174223851dc9de22f6bfec000000 │ false            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```