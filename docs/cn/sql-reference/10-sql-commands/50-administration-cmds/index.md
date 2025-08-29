---
title: 管理命令
---

本页面提供 Databend 中系统管理命令的参考信息。

## 系统监控

| 命令 | 说明 |
|---------|-------------|
| **[SHOW PROCESSLIST](07-show-processlist.md)** | 显示活动查询和连接 |
| **[SHOW METRICS](08-show-metrics.md)** | 查看系统性能指标 |
| **[KILL](01-kill.md)** | 终止正在运行的查询或连接 |
| **[RUST BACKTRACE](rust-backtrace.md)** | 调试 Rust 堆栈跟踪 |

## 配置管理

| 命令 | 说明 |
|---------|-------------|
| **[SET](02-set-global.md)** | 设置全局配置参数 |
| **[UNSET](02-unset.md)** | 移除配置设置 |
| **[SET VARIABLE](03-set-var.md)** | 管理用户定义变量 |
| **[SHOW SETTINGS](03-show-settings.md)** | 显示当前系统设置 |

## 函数管理

| 命令 | 说明 |
|---------|-------------|
| **[SHOW FUNCTIONS](04-show-functions.md)** | 列出内置函数 |
| **[SHOW USER FUNCTIONS](05-show-user-functions.md)** | 列出用户定义函数 |
| **[SHOW TABLE FUNCTIONS](06-show-table-functions.md)** | 列出表值函数（Table-Valued Function） |

## 存储维护

| 命令 | 说明 |
|---------|-------------|
| **[VACUUM TABLE](09-vacuum-table.md)** | 回收表的存储空间 |
| **[VACUUM DROP TABLE](09-vacuum-drop-table.md)** | 清理已删除表的数据 |
| **[VACUUM TEMP FILES](09-vacuum-temp-files.md)** | 移除临时文件 |
| **[SHOW INDEXES](show-indexes.md)** | 显示表索引（Index） |

## 动态执行

| 命令 | 说明 |
|---------|-------------|
| **[EXECUTE IMMEDIATE](execute-immediate.md)** | 执行动态构造的 SQL 语句 |