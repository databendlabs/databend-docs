---
title: 性能测试的测试基础设施
description:
  性能测试的测试基础设施 RFC
---

目前，我们已经支持在 tests/perfs 目录下本地运行性能测试，这里我们需要在 CI 中支持性能测试。

计算和存储的解耦使得 databend 能够轻松集成到 kubernetes 中。
借助 kubernetes 平台的支持，databend 基准测试可以实现以下优势：
1. 稳定的基准测试结果，通过容器化和 cgroup，易于测试的实例可以具有幂等的计算资源
2. 弹性，可以根据需求扩展或缩减测试，并且还支持在本地（minikube + DinD）或云上运行测试
3. 对于后续测试，我们需要在 TPC 基准测试上进行测试，并将 databend-dfs 存储层集成到测试基础设施中，到目前为止，kubernetes 可以帮助轻松实现实例扩展

## 目标

1. 期望快速的 CI 速度，设计一个性能测试不应超过两小时（包括 docker 构建时间和性能测试运行时间）
2. 可扩展：支持在规模上部署性能测试，并且还支持在单台机器上部署以实现可负担的 CI
3. 云原生环境支持：应该能够在不同的云提供商（如 GKE、EKS）上部署整个平台
4. 高可用性：webhook 和 runner 都应该支持自愈，并且没有单点故障
5. 可观测性：整个过程应该是可观测的，应该收集性能运行实例的日志并收集比较报告结果

## 非目标

1. 混合云在 alpha 版本中不支持
2. 针对 github action 部分的网络优化（通常 CI 失败是由网络问题引起的）
3. 仪表盘（目前原型已实现，但这里的优先级较低）

## 性能测试 API

支持三种语义

```bash
/run-perf <branch-name>
```

比较当前 pull requests 的最新 SHA 构建与给定分支名称之间的性能差异

Branch-name 支持：
1. 主分支：main（某些仓库是 main）
2. 发布标签分支：例如 v1.1.1-nightly
3. 最新标签：获取 github 仓库中的最新标签

```bash
/rerun-perf <branch-name>
```

与 run-perf 部分类似，唯一的区别是它会绕过 docker 构建部分，并假设性能 docker 构建镜像已准备好进行测试

示例：
```bash
/run-perf main
```

它将比较当前 PR 的最新提交与主分支之间的性能
```bash
/run-perf v1.1.1-nightly
```

它将比较当前 PR 的最新提交与发布标签 v1.1.1-nightly 之间的性能
```bash
/run-perf latest
```

它将比较当前 PR 的最新提交与最新发布标签之间的性能
```bash
/rerun-perf main
```

与 `/run-perf main` 做同样的事情，但会跳过 docker 镜像构建步骤

更多信息请查看 [test-infra](https://github.com/datafuselabs/test-infra)