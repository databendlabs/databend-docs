---
title: Sandbox Python UDF
description: Sandbox Python UDF RFC
---

# 动机

当前 Python UDF 的实现存在以下问题：

- **GIL（全局解释器锁）** 导致 Python UDF 无法充分利用多核 CPU。
- **共享执行环境** 使同一节点上不同 Python UDF 之间容易产生依赖冲突。
- **进程级不稳定性**：Python 层面的段错误（segfault）可能导致整个查询进程崩溃。
- **资源消耗不可控**：Python 的内存占用可能干扰 SQL 引擎的内存管理。

本 RFC 提出将 Python UDF 的执行与资源管理迁移到云端环境，以解决上述问题。

# 用户视角说明

从用户角度来看，UDF 语法保持不变。未启用 SandboxUDF 时，现有 ScriptUDF 的行为不受影响。启用 SandboxUDF 后，用户无需自行部署和维护 Python UDF 服务器，执行与资源管理均由云端负责。

# 技术实现说明

整体架构分为三层：

- **控制平面（Cloud Control Plane）**
  - 负责资源调度、权限校验以及 Sandbox 生命周期管理。

- **执行平面（Databend Query）**
  - 作为客户端，通过 Arrow Flight 协议发起计算请求。

- **计算平面（Sandbox Workers）**
  - 提供由 gVisor 隔离的轻量级 Python 环境，运行 databend-udf 服务。

```
------------------------+   ApplyResource   +------------------------+
|   Databend Query       | ----------------> |   Cloud Controller      |
|  (Execution Plane)     | <---------------- |  Resource Manager       |
|  - UDF Planner         |    Endpoint+Token |  Image Cache/Warm Pool  |
+-----------+------------+                   +-----------+------------+
            |   Arrow Flight (DoExchange)                |
            |                                            | Provision
            v                                            v
+------------------------+                   +------------------------+
|   Sandbox Worker Pod   | <---------------  |   K8s + runsc (gVisor)  |
|  (Compute Plane)       |                   +------------------------+
|  databend-udf service  |
+------------------------+
```

### UDF 资源申请接口

系统提供一个远程 RPC 服务，用于提交 `ApplyUdfResourceRequest` 以申请 UDF 资源。

RPC 调用在请求被接受后立即返回，但资源的实际分配是异步进行的，因此调用完成时返回的 endpoint 不保证立即可用。

分配好的资源随后由 Query 模块通过现有的 Server UDF 机制访问。

```proto
syntax = "proto3";
option go_package = "databend.com/cloudcontrol/proto";

package udfproto;

message UdfImport {
  string location = 1;
  string url = 2;
  // 用于缓存的内容标识（如 etag 或内容长度），与预签名 URL 无关。
  string tag = 3;
}

message ApplyUdfResourceRequest {
  // JSON 格式的运行时规格（包含代码/handler/类型/依赖包），控制平面据此构建 Dockerfile。
  string spec = 1;
  repeated UdfImport imports = 2;
}

message ApplyUdfResourceResponse {
  string endpoint = 1;
  map<string, string> headers = 2;
}

service UdfService {
  rpc ApplyUdfResource(ApplyUdfResourceRequest) returns (ApplyUdfResourceResponse);
}
```

### 查询执行流程

在 Query 侧，当配置项 `enable_udf_sandbox` 启用后，执行 Script UDF 的流程如下：

1. 将 Python 代码及元数据打包为 JSON 格式的运行时规格。
2. 检查所有导入模块。对于位于 Stage 中的导入，生成预签名 URL 及对应的内容标识（如 etag），以便在多次执行间复用规格。
3. Query 模块调用 `ApplyUdfResource` RPC，将运行时规格和已解析的导入信息一并提交给云端控制平面。
4. Query 模块阻塞等待，直到云端控制平面完成资源分配并返回执行 endpoint。
5. 随后通过现有的 Server UDF 执行路径调用 UDF。

### 云端资源管理器（Broker）

资源管理器作为 Query 与 Sandbox Worker 之间的中间层，负责以下工作：

- **租户隔离**
  - 确保不同租户的 UDF 在隔离环境中执行，例如独立的 VPC 或 Kubernetes namespace。

- **运行时镜像管理**
  - 当提交的 Dockerfile 未发生变化时，复用已有的 Docker 镜像构建结果，降低构建开销，缩短资源分配延迟。

- **安全加固**
  - 强制使用 `RuntimeClass: runsc` 提供基于 gVisor 的隔离，限制系统调用，并禁止访问敏感网络资源。

## 配置项

在 `[query]` 配置段下新增两个配置项：

```toml
[query]
enable_udf_sandbox = true
cloud_control_grpc_server_address = "http://0.0.0.0:50051"
```

- `enable_udf_sandbox`
  - 启用后，Script UDF 将通过云端控制平面执行。UDF 会被打包并在隔离的 Sandbox 环境中运行，而非本地运行时。

- `cloud_control_grpc_server_address`
  - 指定云端控制平面的 gRPC 地址，用于 UDF 资源申请。

# 缺点

### 冷启动延迟较高

Docker 镜像构建以及通过 `uv sync` 安装依赖的过程较慢，导致首次执行或缓存失效时延迟较高。

# 设计理由与备选方案

目前尚无基于 RPC 动态资源分配的工程实践先例，但有一篇相关研究论文探讨了这一方向：

- https://dl.acm.org/doi/10.14778/3551793.3551860

# 现有基础

云端返回 endpoint 后，复用了现有 Server UDF 的执行逻辑。

# 待解决问题

首次构建过程可能耗时较长，导致 UDF 执行超时。

# 未来展望
