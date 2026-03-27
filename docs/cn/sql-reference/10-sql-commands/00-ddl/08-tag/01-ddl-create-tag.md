---
title: CREATE TAG
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.863"/>

创建新 Tag。Tag 是租户级别的元数据对象，可分配给数据库对象用于治理和分类。

另请参阅：[DROP TAG](02-ddl-drop-tag.md)、[SHOW TAGS](03-ddl-show-tags.md)、[SET TAG / UNSET TAG](04-ddl-set-tag.md)

## 语法

```sql
CREATE TAG [ IF NOT EXISTS ] <tag_name>
    [ ALLOWED_VALUES = ( '<value1>' [, '<value2>', ... ] ) ]
    [ COMMENT = '<string>' ]
```

| 参数              | 描述                                                                                                           |
|------------------|---------------------------------------------------------------------------------------------------------------|
| `tag_name`       | 要创建的 Tag 名称。                                                                                              |
| `ALLOWED_VALUES` | 可选的允许值列表。设置后，SET TAG 时只能使用这些值。重复值会自动去除。                                              |
| `COMMENT`        | 可选的 Tag 描述。                                                                                                |

## 示例

创建带有允许值和注释的 Tag：

```sql
CREATE TAG env ALLOWED_VALUES = ('dev', 'staging', 'prod') COMMENT = 'Environment classification';
```

创建接受任意值的 Tag：

```sql
CREATE TAG owner COMMENT = 'Data owner';
```

创建无限制的 Tag：

```sql
CREATE TAG cost_center;
```

验证 Tag 定义：

```sql
SELECT name, allowed_values, comment FROM system.tags ORDER BY name;

┌──────────────────────────────────────────────────────────────────────┐
│      name      │       allowed_values       │         comment        │
├────────────────┼────────────────────────────┼────────────────────────┤
│ cost_center    │ NULL                       │                        │
│ env            │ ['dev', 'staging', 'prod'] │ Environment classific… │
│ owner          │ NULL                       │ Data owner             │
└──────────────────────────────────────────────────────────────────────┘
```
