---
title: Kafka - Credentials (Beta)
---

本页介绍如何创建 `Kafka - Credentials` 数据源。该数据源用于保存访问 Kafka 集群所需的 broker 地址、认证方式和连接凭据，可供 Kafka Consumer 任务复用。

`Kafka - Credentials` 只保存 Kafka 连接信息，不会直接消费消息。实际读取 Kafka topic 消息并写入 Databend 内部对象存储的操作由 [Kafka Consumer 集成任务 (Beta)](../task/05-kafka.md) 执行。

## 使用场景

- 统一管理 Kafka broker 地址和认证信息
- 为多个 Kafka Consumer 任务复用同一套 Kafka 连接配置
- 在 Kafka 地址、认证方式或账号信息变更后统一更新引用它的任务

## 创建 Kafka - Credentials

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 将服务类型选择为 **Kafka - Credentials**，然后填写连接信息：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 当前数据源的描述性名称 |
| **Brokers** | 是 | Kafka broker 地址列表，多个地址用英文逗号分隔，例如 `broker-1:9092,broker-2:9093,broker-3:9092` |
| **Authentication** | 是 | Kafka 认证方式，可选 **None** 或 **SASL/PLAIN** |
| **TLS encryption** | 否 | 是否启用 TLS 加密 |
| **Username** | 条件必填 | 选择 **SASL/PLAIN** 时填写 Kafka 用户名 |
| **Password** | 条件必填 | 选择 **SASL/PLAIN** 时填写 Kafka 密码 |

3. 点击 **Test Connectivity** 验证连接；如果测试成功，点击 **OK** 保存数据源。

## 配置建议

- 建议为 Databend Cloud 创建专用 Kafka 用户，避免与业务应用共享账号。
- 如果 Kafka 集群要求加密连接，请启用 **TLS encryption**。
- 如果选择 **SASL/PLAIN**，请确认 Kafka 集群已允许该用户访问后续任务需要消费的 topic。
- 建议在保存数据源前先执行 **Test Connectivity**，以确认 broker 地址、网络访问和认证信息配置正确。

## 后续操作

创建完成后，您可以基于该数据源创建 [Kafka Consumer 集成任务 (Beta)](../task/05-kafka.md)。
