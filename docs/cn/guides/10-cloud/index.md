---
title: Databend Cloud
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# Databend Cloud

基于开源 [Databend](https://github.com/databendlabs/databend) 内核打造的全托管云数仓。

Databend Cloud 不是简单地把 Databend 部署到云上，而是一个从架构层重新设计的云原生数据平台。我们在开源内核之上构建了完整的多租户 Serverless 服务层，提供类似 Snowflake 的产品体验——弹性伸缩、按量付费、开箱即用。

## 为什么选择 Databend Cloud？

### 🏗️ 云原生架构

| 能力 | 说明 |
|------|------|
| **Serverless** | 无需管理集群，毫秒级启动，空闲自动释放 |
| **存算分离** | 计算存储独立扩展，冷热分层极致优化成本 |
| **多租户** | 安全隔离，共享基础设施效率 |
| **Snowflake 兼容** | 熟悉的 SQL 语法，平滑迁移 |

### ⚡ 开箱即用，秒级响应

| 亮点 | 数据 | 详情 |
|------|------|------|
| **极速启动** | < 500ms | 无状态架构，告别冷启动 |
| **降本增效** | > 50% | 较 Snowflake Standard 成本更低 |
| **稳定可靠** | 99.95% SLA | 多可用区部署，自动容灾 |

### 🔐 安全无忧

| 能力 | 详情 |
|------|------|
| **权限管控** | 细粒度授权、RBAC + DAC、数据脱敏、网络隔离 |
| **数据加密** | 全链路 TLS 1.2、存储加密、AWS PrivateLink |
| **合规认证** | SOC 2 Type II、GDPR、定期安全审计 |
| **全面可观测** | 查询审计、实时监控、智能告警 |

## 快速开始

| 步骤 | 操作 |
|------|------|
| 1 | [**注册账号**](01-getting-started.md) — 几分钟搞定 |
| 2 | [**熟悉功能**](02-resources/) — 计算集群、工作区、仪表盘 |
| 3 | [**连接使用**](/guides/connect/) — BendSQL、Python、Go、Java、Node.js |

## 了解更多

<IndexOverviewList />
