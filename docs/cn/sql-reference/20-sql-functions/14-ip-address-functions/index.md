---
title: IP 地址函数
---

本页面提供 Databend 中 IP 地址相关函数的参考信息。这些函数用于在 IP 地址的字符串和数字表示形式之间进行转换。

## IP 地址转换函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [INET_ATON](inet-aton.md) / [IPV4_STRING_TO_NUM](ipv4-string-to-num.md) | 将 IPv4 地址字符串转换为 32 位整数 | `INET_ATON('192.168.1.1')` → `3232235777` |
| [INET_NTOA](inet-ntoa.md) / [IPV4_NUM_TO_STRING](ipv4-num-to-string.md) | 将 32 位整数转换为 IPv4 地址字符串 | `INET_NTOA(3232235777)` → `'192.168.1.1'` |

## 安全 IP 地址转换函数

这些函数通过返回 NULL 而非报错的方式安全处理无效输入。

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [TRY_INET_ATON](try-inet-aton.md) / [TRY_IPV4_STRING_TO_NUM](try-ipv4-string-to-num.md) | 安全地将 IPv4 地址字符串转换为 32 位整数 | `TRY_INET_ATON('invalid')` → `NULL` |
| [TRY_INET_NTOA](try-inet-ntoa.md) / [TRY_IPV4_NUM_TO_STRING](try-ipv4-num-to-string.md) | 安全地将 32 位整数转换为 IPv4 地址字符串 | `TRY_INET_NTOA(-1)` → `NULL` |