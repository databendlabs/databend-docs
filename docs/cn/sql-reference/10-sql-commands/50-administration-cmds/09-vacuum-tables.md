---
title: VACUUM TABLES
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.940"/>

<EEFeature featureName='VACUUM TABLES'/>

对当前 Catalog 中一个或多个数据库的可写 FUSE 表执行 [VACUUM TABLE](09-vacuum-table.md) 清理，回收存储空间。命令保留表的当前数据，并遵循与单表清理相同的保留期及快照标签保护规则。

## 语法

```sql
VACUUM TABLES [FROM <database>]
```

| 范围 | 行为 | 所需权限 |
|------|------|----------|
| `FROM <database>` | 清理指定数据库中符合条件的表。 | 对该数据库具有 `SUPER` 访问权限 |
| 不指定 `FROM` | 清理当前 Catalog 中所有非系统数据库内符合条件的表，而非仅清理当前数据库。 | 全局 `SUPER` |

命令跳过非 FUSE 表和只读表。普通的单表清理错误会被记录到日志中，并继续处理其他表。取消操作会中止执行；列出数据库或表时发生的错误也可能中止执行。命令完成并不保证所有表都清理成功。

命令不返回结果集，也不清理已删除对象或临时文件。若需包含这些操作，请使用 [VACUUM ALL](09-vacuum-all.md)。

## 示例

```sql
VACUUM TABLES FROM default;
```

清理当前 Catalog 所有非系统数据库中符合条件的表：

```sql
VACUUM TABLES;
```
