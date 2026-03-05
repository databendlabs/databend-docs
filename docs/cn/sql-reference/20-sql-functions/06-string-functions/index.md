---
title: 字符串函数
---

本页面全面概述了 Databend 中的字符串函数，并按功能进行组织，方便参考。

## 字符串拼接与操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [CONCAT](concat.md) | 拼接字符串 | `CONCAT('data', 'bend')` → `'databend'` |
| [CONCAT_WS](concat-ws.md) | 使用分隔符拼接字符串 | `CONCAT_WS('-', 'data', 'bend')` → `'data-bend'` |
| [INSERT](insert.md) | 在指定位置插入字符串 | `INSERT('databend', 5, 0, 'cloud')` → `'databcloudbend'` |
| [REPLACE](replace.md) | 替换子字符串 | `REPLACE('databend', 'bend', 'cloud')` → `'datacloud'` |
| [TRANSLATE](translate.md) | 将字符替换为映射字符 | `TRANSLATE('databend', 'abn', '123')` → `'d1t12e3d'` |

## 字符串提取

| 函数 | 描述 | 示例 |
|-------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [LEFT](left.md) | 返回最左侧字符 | `LEFT('databend', 4)` → `'data'` |
| [RIGHT](right.md) | 返回最右侧字符 | `RIGHT('databend', 4)` → `'bend'` |
| [SUBSTR](substr.md) / [SUBSTRING](substring.md) | 提取子字符串 | `SUBSTR('databend', 5, 4)` → `'bend'` |
| [MID](mid.md) | 提取子字符串（SUBSTRING 别名） | `MID('databend', 5, 4)` → `'bend'` |
| [SPLIT](split.md) | 将字符串拆分为数组 | `SPLIT('data,bend', ',')` → `['data', 'bend']` |
| [SPLIT_PART](split-part.md) | 返回拆分后的指定部分 | `SPLIT_PART('data,bend', ',', 2)` → `'bend'` |
| [REGEXP_SPLIT_TO_ARRAY](regexp-split-array.md) | 使用正则表达式将字符串拆分为子字符串数组 | `regexp_split_to_array('apple,banana,orange', ',');` → `'['apple','banana','orange']'` |
| [REGEXP_SPLIT_TO_TABLE](regexp-split-table.md) | 使用正则表达式将字符串拆分为行组成的表 | `regexp_split_to_table('data,bend', ',', 2)` |

## 字符串填充与格式化

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [LPAD](lpad.md) | 向左填充字符串至指定长度 | `LPAD('bend', 8, 'data')` → `'databend'` |
| [RPAD](rpad.md) | 向右填充字符串至指定长度 | `RPAD('data', 8, 'bend')` → `'databend'` |
| [REPEAT](repeat.md) | 重复字符串 n 次 | `REPEAT('data', 2)` → `'datadata'` |
| [SPACE](space.md) | 返回空格组成的字符串 | `SPACE(4)` → `'    '` |
| [REVERSE](reverse.md) | 反转字符串 | `REVERSE('databend')` → `'dnebtad'` |

## 字符串修剪

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [TRIM](trim.md) | 移除首尾空格 | `TRIM('  databend  ')` → `'databend'` |
| [TRIM_BOTH](trim-both.md) | 移除两端指定字符 | `TRIM_BOTH('xxdatabendxx', 'x')` → `'databend'` |
| [TRIM_LEADING](trim-leading.md) | 移除开头指定字符 | `TRIM_LEADING('xxdatabend', 'x')` → `'databend'` |
| [TRIM_TRAILING](trim-trailing.md) | 移除末尾指定字符 | `TRIM_TRAILING('databendxx', 'x')` → `'databend'` |
| [LTRIM](ltrim.md) | 移除开头空格 | `LTRIM('  databend')` → `'databend'` |
| [RTRIM](rtrim.md) | 移除末尾空格 | `RTRIM('databend  ')` → `'databend'` |

## 字符串信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [LENGTH](length.md) | 返回字符长度 | `LENGTH('databend')` → `8` |
| [CHAR_LENGTH](char-length.md) / [CHARACTER_LENGTH](character-length.md) | 返回字符长度 | `CHAR_LENGTH('databend')` → `8` |
| [BIT_LENGTH](bit-length.md) | 返回比特长度 | `BIT_LENGTH('databend')` → `64` |
| [OCTET_LENGTH](octet-length.md) | 返回字节长度 | `OCTET_LENGTH('databend')` → `8` |
| [INSTR](instr.md) | 返回首次出现位置 | `INSTR('databend', 'bend')` → `5` |
| [LOCATE](locate.md) | 返回首次出现位置 | `LOCATE('bend', 'databend')` → `5` |
| [POSITION](position.md) | 返回首次出现位置 | `POSITION('bend' IN 'databend')` → `5` |
| [STRCMP](strcmp.md) | 比较两个字符串 | `STRCMP('databend', 'datacloud')` → `-1` |
| [JARO_WINKLER](jaro-winkler.md) | 返回字符串相似度 | `JARO_WINKLER('databend', 'databand')` → `0.9619047619047619` |

## 大小写转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [LOWER](lower.md) / [LCASE](lcase.md) | 转换为小写 | `LOWER('DataBend')` → `'databend'` |
| [UPPER](upper.md) / [UCASE](ucase.md) | 转换为大写 | `UPPER('databend')` → `'DATABEND'` |

## 模式匹配

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [LIKE](like.md) | 使用通配符匹配模式 | `'databend' LIKE 'data%'` → `true` |
| [NOT_LIKE](not-like.md) | LIKE 的否定形式 | `'databend' NOT LIKE 'cloud%'` → `true` |
| [REGEXP](regexp.md) / [RLIKE](rlike.md) | 使用正则表达式匹配 | `'databend' REGEXP '^data'` → `true` |
| [NOT_REGEXP](not-regexp.md) / [NOT_RLIKE](not-rlike.md) | 正则匹配的否定形式 | `'databend' NOT REGEXP '^cloud'` → `true` |
| [REGEXP_LIKE](regexp-like.md) | 返回正则匹配结果 | `REGEXP_LIKE('databend', '^data')` → `true` |
| [REGEXP_INSTR](regexp-instr.md) | 返回正则匹配位置 | `REGEXP_INSTR('databend', 'bend')` → `5` |
| [REGEXP_SUBSTR](regexp-substr.md) | 返回正则匹配的子字符串 | `REGEXP_SUBSTR('databend', 'bend')` → `'bend'` |
| [REGEXP_REPLACE](regexp-replace.md) | 替换正则匹配项 | `REGEXP_REPLACE('databend', 'bend', 'cloud')` → `'datacloud'` |
| [GLOB](glob.md) | Unix 风格模式匹配 | `'databend' GLOB 'data*'` → `true` |

## 编码与解码

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ASCII](ascii.md) | 返回首字符 ASCII 值 | `ASCII('D')` → `68` |
| [ORD](ord.md) | 返回首字符 Unicode 码点 | `ORD('D')` → `68` |
| [CHAR](char.md) / [CHR](char.md) | 根据 Unicode 码点返回字符串 | `CHAR(68,97,116,97)` → `'Data'` |
| [BIN](bin.md) | 返回二进制表示 | `BIN(5)` → `'101'` |
| [OCT](oct.md) | 返回八进制表示 | `OCT(8)` → `'10'` |
| [HEX](hex.md) | 返回十六进制表示 | `HEX('ABC')` → `'414243'` |
| [UNHEX](unhex.md) | 将十六进制转换为字符串 | `UNHEX('414243')` → `'ABC'` |
| [TO_BASE64](to-base64.md) | 编码为 base64 | `TO_BASE64('databend')` → `'ZGF0YWJlbmQ='` |
| [FROM_BASE64](from-base64.md) | 从 base64 解码 | `FROM_BASE64('ZGF0YWJlbmQ=')` → `'databend'` |

## 其他

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [QUOTE](quote.md) | SQL 转义字符串 | `QUOTE('databend')` → `'"databend"'` |
| [SOUNDEX](soundex.md) | 返回 Soundex 编码 | `SOUNDEX('databend')` → `'D315'` |
| [SOUNDSLIKE](soundslike.md) | 比较 Soundex 值 | `SOUNDSLIKE('databend', 'databand')` → `true` |