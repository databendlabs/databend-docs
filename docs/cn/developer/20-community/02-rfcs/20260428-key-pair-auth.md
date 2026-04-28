---
title: 密钥对认证
description: 基于公钥密码学的用户密钥对认证 RFC。
---

- Tracking Issue: TBD

## 概述

为 Databend 添加用户级密钥对认证，允许用户通过私钥签名 JWT 进行身份验证，而无需使用密码。服务端存储用户的公钥并验证 JWT 签名。支持 RSA、ECDSA（ES256/ES384）和 Ed25519 密钥类型，每个用户可配置多个公钥以实现无缝轮换。

## 动机

密码认证在程序化访问场景中存在已知局限：

- 密码需要存储或传输，增加了攻击面。
- 密码轮换需要协调更新所有客户端。
- 自动化系统（CI/CD 流水线、ETL 任务、连接器）需要更安全的凭证管理方式。

密钥对认证解决了这些问题：

- 私钥始终留在客户端，服务端只存储公钥。
- 密钥轮换无缝进行 — 添加新密钥、更新客户端、移除旧密钥。
- 认证过程不传输共享密钥，客户端通过签名短期 JWT 证明身份。

这是一种被广泛采用的模式（Snowflake、SSH、mTLS），Databend 用户已在生产环境中提出了此需求。

## 用户指南

### 生成密钥对

用户使用标准工具在本地生成密钥对。例如，使用 OpenSSL 生成 RSA 2048 位密钥：

```bash
# 生成私钥（可选使用密码短语加密）
openssl genrsa -out rsa_private_key.pem 2048

# 提取公钥
openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
```

Ed25519：

```bash
openssl genpkey -algorithm ed25519 -out ed25519_private_key.pem
openssl pkey -in ed25519_private_key.pem -pubout -out ed25519_public_key.pem
```

ECDSA（ES256）：

```bash
openssl ecparam -genkey -name prime256v1 -noout -out ec_private_key.pem
openssl ec -in ec_private_key.pem -pubout -out ec_public_key.pem
```

### 为用户分配公钥

```sql
-- 创建使用密钥对认证的新用户
CREATE USER service_account IDENTIFIED WITH key_pair BY '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----';

-- 添加额外的公钥用于轮换
ALTER USER service_account WITH ADD PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----';

-- 通过 SHA256 指纹移除密钥
ALTER USER service_account WITH REMOVE PUBLIC_KEY = 'SHA256:abc123...';

-- 查看密钥指纹
DESC USER service_account;
```

### 使用密钥对认证

客户端生成一个用私钥签名的短期 JWT，通过 Bearer token 发送，并附带自定义 header 以区分 JWKS JWT 认证：

```
Authorization: Bearer <jwt_token>
X-DATABEND-AUTH-METHOD: keypair
```

`X-DATABEND-AUTH-METHOD: keypair` header 是必需的。如果没有该 header，服务端会将 Bearer token 路由到现有的 JWKS JWT 验证流程。

JWT 必须包含：
- `sub`（主题）：用户名
- `iat`（签发时间）：当前时间戳
- `exp`（过期时间）：短 TTL（建议 60 秒）

服务端从 `sub` 声明中提取用户名，查找用户存储的公钥，并验证 JWT 签名。如果任何存储的公钥验证签名成功，则认证通过。

### 密码短语支持

如果私钥使用密码短语加密，客户端负责在签名 JWT 之前解密。服务端不会看到或存储密码短语 — 它只存储公钥并用于验证。

## 详细设计

### 存储

新增 `AuthInfo` 变体：

```rust
pub enum AuthInfo {
    None,
    Password { hash_value: Vec<u8>, hash_method: PasswordHashMethod, need_change: bool },
    JWT,
    KeyPair { public_keys: Vec<String> },  // PEM 编码的公钥
}
```

PEM 格式自描述密钥类型（RSA、EC、Ed25519），因此不需要单独的密钥类型字段。密钥类型在验证时检测。

### Protobuf Schema

```protobuf
message AuthInfo {
  // ... 现有字段 ...
  message KeyPair {
    repeated string public_keys = 1;
  }

  oneof info {
    None none = 1;
    Password password = 2;
    JWT jwt = 3;
    KeyPair key_pair = 4;  // 新增
  }
}
```

### SQL 语法

**认证类型**：在现有类型（`no_password`、`sha256_password`、`double_sha1_password`、`jwt`）基础上新增 `key_pair` 认证类型。

**CREATE USER**：

```sql
CREATE USER <username> IDENTIFIED WITH key_pair BY '<public_key_pem>';
```

创建用户时设置单个公钥。`BY` 子句携带 PEM 编码的公钥。

**ALTER USER**（通过用户选项管理密钥）：

```sql
-- 向用户的密钥列表添加公钥
ALTER USER <username> WITH ADD PUBLIC_KEY = '<public_key_pem>';

-- 通过 SHA256 指纹移除公钥
ALTER USER <username> WITH REMOVE PUBLIC_KEY = '<sha256_fingerprint>';
```

在 ALTER USER 中使用 `IDENTIFIED WITH key_pair BY '<pem>'` 会替换所有现有密钥。

**DESCRIBE USER**：显示所有存储公钥的 SHA256 指纹。

### 认证流程

当 HTTP handler 收到 Bearer JWT token 时：

1. 检查是否为 Databend 会话 token（`bend-v1-*`）。如果是，按原有方式处理。
2. 检查 `X-DATABEND-AUTH-METHOD` header：
   - 如果为 `keypair`：路由到密钥对认证流程。
   - 否则：路由到现有的 JWKS JWT 验证流程（不变）。
3. 密钥对流程：
   a. 不验证签名，解码 JWT payload 提取 `sub`（用户名）声明。
   b. 通过用户名在 meta 中查找用户。
   c. 验证用户的 `auth_info` 为 `AuthInfo::KeyPair`。
   d. 遍历存储的公钥，尝试用每个公钥验证 JWT 签名。首次匹配即接受。
   e. 验证标准 JWT 声明：`exp` 不能过期，`iat` 必须存在且不能在未来。
   f. 执行网络策略，设置已认证用户会话。

### 密钥验证

通过 CREATE USER 或 ALTER USER 为用户分配公钥时，服务端验证：

- PEM 格式正确且包含公钥（非私钥或证书）。
- 密钥类型为以下之一：RSA、ECDSA（P-256/P-384）或 Ed25519。
- RSA 密钥最小长度为 2048 位。

无效密钥会被拒绝并返回描述性错误信息。

### 密钥指纹

密钥指纹计算方式为 `SHA256:<base64>`，基于 DER 编码的公钥字节（与 OpenSSH 约定相同）。用于：

- `DESC USER` 输出中标识密钥，无需暴露完整 PEM。
- `REMOVE PUBLIC_KEY` 指定要移除的密钥。

### 支持的算法

| 算法 | 密钥类型 | JWT `alg` Header |
|------|----------|-----------------|
| RSA  | RSA 2048+ 位 | RS256 |
| ECDSA | P-256   | ES256 |
| ECDSA | P-384   | ES384 |
| Ed25519 | Ed25519 | EdDSA |

服务端从 PEM 密钥类型和 JWT `alg` header 检测算法。存储的密钥类型与 JWT 算法不匹配会导致验证失败。

### 协议支持

- **HTTP**：通过 Bearer JWT token 完全支持。
- **MySQL 协议**：不支持。密钥对用户尝试通过 MySQL 协议连接时会收到明确的错误信息。这是根本性限制 — MySQL 线协议不支持基于 JWT 的认证。
- **FlightSQL**：通过 authorization header 中的 Bearer JWT token 支持。

### JWT Token 格式

客户端生成的 JWT 必须遵循以下结构：

**Header**：
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**：
```json
{
  "sub": "service_account",
  "iat": 1714300000,
  "exp": 1714300060
}
```

- `sub`（必需）：Databend 用户名。
- `iat`（必需）：签发时间戳。
- `exp`（必需）：过期时间戳。建议 TTL 为 60 秒。

token 使用用户的私钥签名，算法与密钥类型匹配。

### 向后兼容性

新的 `KeyPair` 变体作为字段编号 4 添加到 protobuf `AuthInfo.oneof info` 中。兼容性行为：

- **旧版 query 读取非 KeyPair 用户**：完全不受影响。Protobuf 静默忽略不属于反序列化消息的未知字段。
- **旧版 query 读取 KeyPair 用户**：`oneof info` 字段解析为 `None`（未知变体被 protobuf 跳过）。`AuthInfo::from_pb()` 返回 `Incompatible` 错误。这只影响该特定用户的操作（登录、DESC USER 等）— 所有其他用户保持完全正常。
- **无需全局版本升级**：`MIN_READER_VER` 不需要增加，因为旧版本仍然可以处理所有现有的认证类型。

这满足了要求：如果存在 KeyPair 用户，旧版本只对该用户报错；如果不存在 KeyPair 用户，旧版本完全不受影响。

## 缺点

- 为认证系统增加了复杂性，包括新的认证类型和密钥管理 SQL。
- 基于 JWT 的 HTTP 认证每次请求增加了解码 + 验证步骤（通过短期 token 和高效签名验证来缓解）。
- MySQL 协议不支持此认证方式，可能会让期望跨协议统一行为的用户感到困惑。

## 理由和替代方案

### 为什么使用新的 `AuthInfo` 变体而不是 `UserOption` 字段？

认证方式从根本上是关于*用户如何证明身份*。将其存储在 `AuthInfo` 中保持了认证模型的一致性 — `AuthInfo` 是唯一的事实来源。将密钥分散到 `AuthInfo` 和 `UserOption` 中会产生不一致的状态（例如，密码用户在 options 中有 RSA 密钥）。

### 为什么使用密钥列表而不是固定的 key_1/key_2 槽位？

列表更灵活，不会人为限制活跃密钥的数量。这支持渐进式推广等场景，每个客户端可以有自己的密钥。通过指纹移除密钥无论列表大小都很简单。

### 为什么从 PEM 检测密钥类型而不是显式存储？

PEM 格式已经在其 header 和 ASN.1 结构中编码了密钥类型。存储冗余的密钥类型字段增加了一致性风险（存储的类型与实际密钥类型不匹配）。验证时检测既可靠又简单。

### 为什么存储完整 PEM 而不是像 Snowflake 那样去掉 header？

Snowflake 去掉 PEM header/footer 是因为它只支持 RSA，使用 `SET RSA_PUBLIC_KEY='MIIBIj...'`。我们支持多种密钥类型，存储完整 PEM 有实际好处：`jwt-simple` 的 `from_pem()` 直接接受完整 PEM（无需重新拼接 header），用户可以直接复制粘贴 `openssl` 输出而无需手动编辑，存储开销可以忽略不计（几十字节）。

### 依次检测密钥类型是否有性能开销？

几乎没有。`from_pem()` 内部解析 DER AlgorithmIdentifier OID（几个字节的比较），不匹配时立即返回 — 微秒级。而实际的 JWT 签名验证（RSA/ECDSA）是毫秒级的，差了三个数量级。如果将来需要优化，可以先解析一次 DER OID 来确定类型，但目前没有必要。

### 替代方案：mTLS

双向 TLS 是另一种基于证书的认证方式。但它要求 TLS 终止在 Databend 服务器（而非负载均衡器），配置更困难，且不与 Databend 现有的用户管理集成。密钥对 JWT 认证更轻量，可以通过任何 HTTP 代理工作。

## 未解决的问题

- 每个用户的公钥数量是否应该有上限？合理的默认限制（例如 10 个）可以防止滥用而不限制合法使用。
- 是否应该验证 JWT `iss`（签发者）声明？Snowflake 使用 `<account>.<user>.SHA256:<fingerprint>` 作为签发者。我们可以采用类似的约定或初始阶段保持可选。
- 密钥对认证是否应该支持 `root` 用户，还是限制为非内置用户？

## 未来可能性

- **客户端 SDK 集成**：提供 Python、Go、Java 和 Rust 的辅助库，用于生成和签名密钥对 JWT。
- **自动密钥轮换**：允许用户设置密钥过期日期，在过期前发出警告。
- **基于证书的认证**：扩展支持 X.509 证书，服务端除了验证签名外还验证证书链。
- **`bendsql` 集成**：为 `bendsql` 添加 `--private-key` 和 `--passphrase` 参数以原生支持密钥对认证。
