---
title: Data Management
---

# Data Management

| Category | Description | Key Features | Common Operations | Documentation |
|----------|-------------|--------------|------------------|---------------|
| **Data Lifecycle** | Create and manage objects | • Database & Table <br/>• External Tables<br/>• Streams & Views<br/>• Indexes & Stages | • CREATE/DROP/ALTER<br/>• SHOW TABLES<br/>• DESCRIBE TABLE | [Details](./01-data-lifecycle.md) |
| **Data Recovery** | Access and restore past data | • Time Travel<br/>• Flashback Tables<br/>• Backup & Restore<br/>• AT & UNDROP | • SELECT ... AT<br/>• FLASHBACK TABLE<br/>• BENDSAVE BACKUP | [Details](./02-data-recovery.md) |
| **Data Protection** | Secure access and prevent loss | • Network Policies<br/>• Access Control<br/>• Time Travel & Fail-safe<br/>• Data Encryption | • NETWORK POLICY<br/>• GRANT/REVOKE<br/>• CREATE USER/ROLE | [Details](./03-data-protection.md) |
| **Data Purge** | Free up storage space | • VACUUM Commands<br/>• Retention Policies<br/>• Orphan File Cleanup<br/>• Temporary File Management | • VACUUM TABLE<br/>• VACUUM DROP TABLE<br/>• DATA_RETENTION_TIME | [Details](./04-data-recycle.md) |
