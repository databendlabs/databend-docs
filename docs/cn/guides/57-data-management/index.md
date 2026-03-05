---
title: 数据管理
---

# 数据管理

| 类别 | 描述 | 主要功能 | 常用操作 |
|----------|-------------|--------------|------------------|
| **[数据生命周期](./01-data-lifecycle.md)** | 创建和管理对象 | • 数据库和表 <br/>• 外部表<br/>• Stream 和视图<br/>• 索引和 Stage | • CREATE/DROP/ALTER<br/>• SHOW TABLES<br/>• DESCRIBE TABLE |
| **[数据恢复](./02-data-recovery.md)** | 访问和恢复历史数据 | • 时间回溯<br/>• 闪回表<br/>• 备份和恢复<br/>• AT 和 UNDROP | • SELECT ... AT<br/>• FLASHBACK TABLE<br/>• BENDSAVE BACKUP |
| **[数据保护](./03-data-protection.md)** | 安全访问和防止数据丢失 | • 网络策略<br/>• 访问控制<br/>• 时间回溯和故障安全<br/>• 数据加密 | • NETWORK POLICY<br/>• GRANT/REVOKE<br/>• USER/ROLE |
| **[数据回收](./04-data-recycle.md)** | 释放存储空间 | • VACUUM 命令<br/>• 保留策略<br/>• 孤立文件清理<br/>• 临时文件管理 | • VACUUM TABLE<br/>• VACUUM DROP TABLE<br/>• DATA_RETENTION_TIME |