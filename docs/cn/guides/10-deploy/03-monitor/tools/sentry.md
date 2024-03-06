---
title: Sentry
---

[Sentry](https://sentry.io/welcome/) 是一个面向开发者的错误跟踪和性能监控平台，帮助开发者看到真正重要的信息，更快地解决问题，并持续学习他们的应用程序。

Databend 提供了与云端和自托管 Sentry 解决方案的集成。以下教程将指导您完成集成过程。

## 教程：使用 Sentry 监控 Databend

### 步骤 1. 部署 Sentry

要部署一个本地的 Sentry，请按照说明操作：https://develop.sentry.dev/self-hosted/

本教程使用云服务上的 Sentry。要为 Cloud Sentry 注册一个账户，请访问 https://sentry.io

### 步骤 2. 创建一个 Sentry 项目

登录 Sentry 后，为 `Rust` 平台创建一个 Sentry 项目以开始。关于如何在 Sentry 上创建项目的信息，请参见 https://docs.sentry.io/product/sentry-basics/integrate-frontend/create-new-project/

![Alt text](@site/docs/public/img/tracing/sentry-rust.png)

### 步骤 3. 设置环境变量

1. 获取项目的 DSN（数据源名称）。关于 DSN 是什么以及在哪里找到它的信息，请参见 https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/

2. 设置环境变量。

  - 要启用错误跟踪功能，请运行以下命令：

```bash
export DATABEND_SENTRY_DSN="<your-DSN>"
```

  - 要启用性能监控功能，请运行以下命令：

```bash
export DATABEND_SENTRY_DSN="<your-DSN>"
export SENTRY_TRACES_SAMPLE_RATE=1.0 LOG_LEVEL=DEBUG
```
:::tip
在生产环境中，将 `SENTRY_TRACES_SAMPLE_RATE` 设置为较小的值。
:::

### 步骤 4. 部署 Databend

按照[部署指南](/guides/deploy)来部署 Databend。

现在一切都设置好了。检查 Sentry 上的警报和性能信息页面。

![Alt text](@site/docs/public/img/tracing/sentry-done.png)