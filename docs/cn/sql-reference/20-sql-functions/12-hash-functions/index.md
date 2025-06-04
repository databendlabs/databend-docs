---
title: 哈希函数
---

本页面全面概述了 Databend 中的哈希函数，按功能分类编排以便查阅。

## 加密哈希函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MD5](md5.md) | 计算 MD5 128 位校验和 | `MD5('1234567890')` → `'e807f1fcf82d132f9bb018ca6738a19f'` |
| [SHA1](sha1.md) / [SHA](sha.md) | 计算 SHA-1 160 位校验和 | `SHA1('1234567890')` → `'01b307acba4f54f55aafc33bb06bbbf6ca803e9a'` |
| [SHA2](sha2.md) | 计算 SHA-2 系列哈希值（SHA-224、SHA-256、SHA-384、SHA-512） | `SHA2('1234567890', 256)` → `'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646'` |
| [BLAKE3](blake3.md) | 计算 BLAKE3 哈希值 | `BLAKE3('1234567890')` → `'e2cf6ae2a7e65c7b9e089da1ad582100a0d732551a6a07abb07f7a4a119ecc51'` |

## 非加密哈希函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [XXHASH32](xxhash32.md) | 计算 xxHash32 32 位哈希值 | `XXHASH32('1234567890')` → `3768853052` |
| [XXHASH64](xxhash64.md) | 计算 xxHash64 64 位哈希值 | `XXHASH64('1234567890')` → `12237639266330420150` |
| [SIPHASH64](siphash64.md) / [SIPHASH](siphash.md) | 计算 SipHash-2-4 64 位哈希值 | `SIPHASH64('1234567890')` → `2917646445633666330` |
| [CITY64WITHSEED](city64withseed.md) | 计算带种子的 CityHash64 哈希值 | `CITY64WITHSEED('1234567890', 42)` → `5210846883572933352` |

## 使用示例

### 数据完整性验证

```sql
-- 计算文件内容的 MD5 哈希
SELECT 
  filename,
  MD5(file_content) AS content_hash
FROM files
ORDER BY filename;
```

### 数据匿名化

```sql
-- 存储或处理前哈希敏感数据
SELECT 
  user_id,
  SHA2(email, 256) AS hashed_email,
  SHA2(phone_number, 256) AS hashed_phone
FROM users;
```

### 基于哈希的分区

```sql
-- 使用哈希函数实现数据分布
SELECT 
  XXHASH64(customer_id) % 10 AS partition_id,
  COUNT(*) AS records_count
FROM orders
GROUP BY partition_id;
```