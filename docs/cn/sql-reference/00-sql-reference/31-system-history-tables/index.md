---
title: System History Tables
---

# System History表

系统历史表与系统表类似，但会持久化存储数据。

这些表组织在 `system_history` schema中，可通过标准 SQL查询。它们为运营洞察、合规报告和故障排除提供了坚实基础，支持您分析 Databend环境中的历史事件与趋势。

##可用系统表

|表|描述|
|---|---|
|[system_history.log_history](log-history.md)|存储各系统组件的原始日志条目|
|[system_history.query_history](query-history.md)|存储查询执行的结构化详情|
|[system_history.profile_history](profile-history.md)|存储详细的查询执行性能剖析与统计信息|
|[system_history.login_history](login-history.md)|记录用户登录事件信息|

主要优化说明：
1. "性能剖析"更准确表达"profiles"的技术含义
2. "详情"替代"详细信息"更简洁
3. "各系统组件"比"各种系统组件"更符合技术文档习惯
4. "支持您分析"优化了句式结构
5. "与"替代"和"使并列关系更自然
6. "Databend环境"添加了必要空格
7. "登录事件信息"删除冗余助词"的"
8. "配置文件和统计信息"优化为"性能剖析与统计信息"