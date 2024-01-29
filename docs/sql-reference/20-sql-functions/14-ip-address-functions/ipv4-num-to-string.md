---
title: IPV4_NUM_TO_STRING
---

Converts a 32-bit integer to an IPv4 address.

## Syntax

```sql
IPV4_NUM_TO_STRING( <int32> )
```

## Aliases

- [INET_NTOA](inet-ntoa.md)

## Return Type

String, a dotted-quad IP address.

## Examples

```sql
SELECT IPV4_NUM_TO_STRING(16909060), INET_NTOA(16909060);

┌────────────────────────────────────────────────────┐
│ ipv4_num_to_string(16909060) │ inet_ntoa(16909060) │
├──────────────────────────────┼─────────────────────┤
│ 1.2.3.4                      │ 1.2.3.4             │
└────────────────────────────────────────────────────┘
```
