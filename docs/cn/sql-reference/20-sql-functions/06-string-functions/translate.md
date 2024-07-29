---
title: 字符替换
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.203"/>

根据提供的映射，将给定字符串中的特定字符替换为相应的替换字符，从而转换该字符串。

## 语法

```sql
TRANSLATE('<inputString>', '<charactersToReplace>', '<replacementCharacters>')
```

| 参数                      | 描述                                                                                     |
|---------------------------|-------------------------------------------------------------------------------------------------|
| `<inputString>`           | 要进行转换的输入字符串。                                                             |
| `<charactersToReplace>`   | 包含要在输入字符串中替换的字符的字符串。                            |
| `<replacementCharacters>` | 包含与 `<charactersToReplace>` 中字符相对应的替换字符的字符串。 |

## 示例

```sql
-- 将 'databend' 中的 'd' 替换为 '$'
SELECT TRANSLATE('databend', 'd', '$');

---
$ataben$

-- 将 'databend' 中的 'd' 替换为 'D'
SELECT TRANSLATE('databend', 'd', 'D');

---
DatabenD

-- 将 'databend' 中的 'd' 替换为 'D'，'e' 替换为 'E'
SELECT TRANSLATE('databend', 'de', 'DE');

---
DatabEnD

-- 从 'databend' 中移除 'd'
SELECT TRANSLATE('databend', 'd', '');

---
ataben
```