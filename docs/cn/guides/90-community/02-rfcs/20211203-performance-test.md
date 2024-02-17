---
title: 性能测试的测试基础设施
description:
  性能测试的测试基础设施RFC
---

当前，我们已经支持在`tests/perfs`目录下本地运行性能测试，现在我们需要支持在CI中进行性能测试

计算与存储的解耦使得databend能够轻松集成到kubernetes中。
有了kubernetes平台的支持，databend的基准测试能够实现以下优势：
1. 稳定的基准测试结果，通过容器化和cgroup，易于测试的实例可以具有幂等的计算资源
2. 弹性，可以根据需求扩展或缩小测试，并且也支持在本地（minikube + DinD）或云上运行测试
3. 对于后续的测试，我们需要在TPC基准上进行测试，并将databend-dfs存储层集成到测试基础设施中，到目前为止，kubernetes可以轻松帮助实例扩展

## 目标

1. 期望快速的CI速度，设计上一次性能测试不应超过两小时（包括docker构建时间和性能测试运行时间）
2. 可扩展性：支持按规模部署性能测试，并且也支持在单台机器上部署以实现可负担的CI
3. 云原生环境支持：应能够在不同的云提供商上部署整个平台，如GKE、EKS
4. 高可用性：webhook和runner都应支持自我修复，且不具有单点故障
5. 可观察性：整个过程应该是可观察的，应该收集性能运行实例的日志并收集比较报告结果

## 非目标

1. alpha版本不支持混合云
2. 针对github action部分的网络优化（通常CI失败是由网络问题引起的
3. 仪表板（当前，原型已实现，但这里的优先级较低）

## 性能测试API

支持三种语义

```bash
/run-perf <branch-name>
```

比较当前拉取请求的最新SHA构建与给定分支名称之间的性能差异

Branch-name支持：
1. 主分支：main（一些仓库是main）
2. 发布标签分支：例如v1.1.1-nightly
3. 最新标签：获取github仓库中的最新标签

```bash
/rerun-perf <branch-name>
```

与run-perf部分类似，唯一的区别是它会绕过docker构建部分，并假设性能docker构建镜像已准备好进行测试

示例：
```bash
/run-perf main
```

它将比较当前PR的最新提交和main分支之间的性能
```bash
/run-perf v1.1.1-nightly
```

它将比较当前PR的最新提交和发布标签v1.1.1-nightly之间的性能
```bash
/run-perf latest
```

它将比较当前PR的最新提交和最新发布标签之间的性能
```bash
/rerun-perf main
```

做与`/run-perf main`相同的事情，但会跳过docker镜像构建步骤

更多信息请查看 [test-infra](https://github.com/datafuselabs/test-infra)