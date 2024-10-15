---
title: Lambda Expressions
---

Lambda expressions are anonymous functions that allow you to encapsulate logic and pass it as an argument to higher-order functions, such as those for processing arrays, lists, or other complex data types. It typically takes a set of input parameters and a body of code that is executed for each element in a collection or for each comparison in sorting logic.

## Syntax

```sql
-- Take one parameter
<parameter> -> <expression>

-- Take multiple parameters
(<parameter1>, <parameter2>, ...) -> <expression>
```

| Parameter                         | Description                                                                                    |
|-----------------------------------|------------------------------------------------------------------------------------------------|
| `<parameter1>, <parameter2>, ...` | Values that the Lambda will operate on (e.g., elements of an array).                           |
| `->`                              | Separates the input parameters from the logic.                                                 |
| `<expression>`                    | The logic that applies to the input parameters, often written as a conditional or calculation. |

## Examples

This lambda expression takes a single argument n and adds 5 to it:

```bash
n -> (n + 5)
```

This lambda expression takes an integer x and returns `Positive` if x is greater than 0, otherwise it returns `Non-Positive`:

```bash
x -> (CASE WHEN x > 0 THEN 'Positive' ELSE 'Non-Positive' END)
```

This lambda expression checks if num is even. It returns `true` for even numbers and `false` for odd numbers:

```bash
num -> (num % 2 = 0)
```

This lambda expression adds the two parameters x and y:

```bash
(x, y) -> (x + y)
```