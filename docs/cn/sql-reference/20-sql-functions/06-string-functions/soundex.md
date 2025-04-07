---
id: string-soundex
title: SOUNDEX
---

生成字符串的 Soundex 代码。

- Soundex 代码由一个字母后跟三个数字组成。Databend 的实现返回超过 4 位数字，但你可以使用 [SUBSTR](substr.md) 获取标准的 Soundex 代码。
- 字符串中所有非字母字符都将被忽略。
- A-Z 范围之外的所有国际字母字符都将被忽略，除非它们是首字母。

:::tip What is Soundex?
Soundex 将字母数字字符串转换为一个四字符代码，该代码基于该字符串用英语发音的方式。更多信息，请参见 https://en.wikipedia.org/wiki/Soundex
:::

另请参见：[SOUNDS LIKE](soundslike.md)

## 语法

```sql
SOUNDEX(<str>)
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| str  | 字符串。 |

## 返回类型

返回 VARCHAR 类型的代码或 NULL 值。

## 示例

```sql
SELECT SOUNDEX('Databend');

---
D153

-- 字符串中所有非字母字符都将被忽略。
SELECT SOUNDEX('Databend!');;

---
D153

-- A-Z 范围之外的所有国际字母字符都将被忽略，除非它们是首字母。
SELECT SOUNDEX('Databend，你好');

---
D153

SELECT SOUNDEX('你好，Databend');

---
你3153

-- 使用 SUBSTR 获取标准的 Soundex 代码。
SELECT SOUNDEX('Databend Cloud'),SUBSTR(SOUNDEX('Databend Cloud'),1,4);

soundex('databend cloud')|substring(soundex('databend cloud') from 1 for 4)|
-------------------------+-------------------------------------------------+
D153243                  |D153                                             |

SELECT SOUNDEX(NULL);
+-------------------------------------+
| `SOUNDEX(NULL)`                     |
+-------------------------------------+
| <null>                              |
+-------------------------------------+
```