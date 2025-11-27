
---
title: OBFUSCATE
---

OBFUSCATE 表函数用于生成匿名化数据。这是一个快速工具，对于更复杂的场景，推荐直接使用底层函数 [MARKOV_TRAIN](../07-aggregate-functions/aggregate-markov-train.md)、[MARKOV_GENERATE](../20-other-functions/markov_generate.md) 和 [FEISTEL_OBFUSCATE](../20-other-functions/feistel_obfuscate.md)。该函数支持的类型包括 Email、String、Date、Integer 和 Float。

## 语法

```sql
OBFUSCATE('<table>'[, seed => <seed>])
```

## 参数

| 参数        | 描述        |
| ----------- | ----------- |
| `<table>` | 输入表。|
| `seed` | 随机种子。|

## 示例

```sql
create or replace table users as 
select * from (values 
(1, 'James Smith', 'james.smith@gmail.com', '123 Fake St, Anytown, CA 91234'),
(2, 'Mary Johnson', 'mary.johnson@yahoo.com', '456 Fictional Ave, Springfield, IL 62704'),
(3, 'John Williams', 'john.williams@outlook.com', '789 Imaginary Ln, Pleasantville, NY 10570'),
(4, 'Patricia Brown', 'patricia.brown@hotmail.com', '101 Nonexistent Rd, Metropolis, KS 66666'),
(5, 'Robert Jones', 'robert.jones@example.com', '222 Make Believe Dr, Smallville, OH 44688'),
(6, 'Jennifer Garcia', 'jennifer.garcia@gmail.com', '333 Phantom Ct, Gotham, NJ 07005'),
(7, 'Michael Miller', 'michael.miller@yahoo.com', '444 Unreal Blvd, Wonderland, TX 75001'),
(8, 'Linda Davis', 'linda.davis@outlook.com', '555 Fabricated Way, Neverland, FL 32801'),
(9, 'William Rodriguez', 'william.rodriguez@hotmail.com', '666 Bogus Pl, Oz, KS 67445'),
(10, 'Elizabeth Martinez', 'elizabeth.martinez@example.com', '777 Sham Ln, Camelot, CA 90210'),
(11, 'James Johnson', 'james.johnson@gmail.com', '888 Pretend Ave, Atlantis, GA 30303'),
(12, 'Mary Williams', 'mary.williams@yahoo.com', '999 Simulated Rd, Utopia, MI 48009'),
(13, 'John Brown', 'john.brown@outlook.com', '1010 Counterfeit St, El Dorado, AR 71730'),
(14, 'Patricia Jones', 'patricia.jones@hotmail.com', '10 Counterfeit St, El Dorado, AR 71730'),
(15, 'Robert Garcia', 'robert.garcia@example.com', '1111 Phony Ln, Shangri-La, CO 80014'),
(16, 'Jennifer Miller', 'jennifer.miller@gmail.com', '1212 Artificial Dr, Rivendell, WA 98101'),
(17, 'Michael Davis', 'michael.davis@yahoo.com', '1313 Spurious Ave, Narnia, TN 37201'),
(18, 'Linda Rodriguez', 'linda.rodriguez@outlook.com', '1414 Pseudo Rd, Brigadoon, PA 19003'),
(19, 'William Martinez', 'william.martinez@hotmail.com', '1515 Feigned St, Never Never Land, CA 90210'),
(20, 'Elizabeth Smith', 'elizabeth.smith@example.com', '1616 Imitation Ln, Asgard, NY 10001'),
(21, 'James Williams', 'james.williams@gmail.com', '1717 Simulated Ave, Middle Earth, OR 97006'),
(22, 'Mary Brown', 'mary.brown@yahoo.com', '123 Fake St, Anytown, CA 91234'),
(23, 'John Jones', 'john.jones@outlook.com', '456 Fictitious Ave, Springfield, IL 62704'),
(24, 'Patricia Garcia', 'patricia.garcia@hotmail.com', '789 Illusion Ln, Pleasantville, NY 10570'),
(25, 'Robert Miller', 'robert.miller@example.com', '101 Imaginary Rd, Metropolis, KS 66666'),
(26, 'Jennifer Davis', 'jennifer.davis@gmail.com', '222 Make Believe Dr, Neverland, FL 33333'),
(27, 'Michael Rodriguez', 'michael.rodriguez@yahoo.com', '333 Pretend Ct, Wonderland, TX 77777'),
(28, 'Linda Martinez', 'linda.martinez@outlook.com', '444 Fabricated Blvd, Utopia, WA 98101'),
(29, 'William Smith', 'william.smith@hotmail.com', '555 Sham Way, Mirage, AZ 85001'),
(30, 'Elizabeth Johnson', 'elizabeth.johnson@example.com', '666 Bogus Pl, Fantasyland, GA 30303'),
(31, 'James Brown', 'james.brown@gmail.com', '777 Unreal Ave, Dreamville, CO 80202'),
(32, 'Mary Jones', 'mary.jones@yahoo.com', '888 Counterfeit Ln, Wishville, OH 44114'),
(33, 'John Garcia', 'john.garcia@outlook.com', '999 Phony Rd, Delusion, MI 48075'),
(34, 'Patricia Miller', 'patricia.miller@hotmail.com', '1010 Simulated St, Echo, NV 89109'),
(35, 'Robert Davis', 'robert.davis@example.com', '1111 Spurious Ave, Replica, PA 19103'),
(36, 'Jennifer Rodriguez', 'jennifer.rodriguez@gmail.com', '1212 Artificial Dr, Clone, NC 27601'),
(37, 'Michael Martinez', 'michael.martinez@yahoo.com', '1313 Synthetic Ct, Duplicate, TN 37201'),
(38, 'Linda Smith', 'linda.smith@outlook.com', '1414 Feigned Blvd, Imposter, IN 46204'),
(39, 'William Johnson', 'william.johnson@hotmail.com', '1515 Pseudo Pl, Mimic, MN 55401'),
(40, 'Elizabeth Williams', 'elizabeth.williams@example.com', '1616 Forged Way, Facsimile, AL 35203')
) users(id, name, email, address);


select * from obfuscate(users, seed=>10) limit 5 offset 20;
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│        id        │        name       │           email           │                 address                 │
│ Nullable(UInt64) │  Nullable(String) │      Nullable(String)     │             Nullable(String)            │
├──────────────────┼───────────────────┼───────────────────────────┼─────────────────────────────────────────┤
│               21 │ William Rodriguez │ michael.davis@example.com │ 1212 Artificial Dr, Rivendell, WA 98101 │
│               16 │ Jennifer Garcia   │ patricia.brown@gmail      │ 1313 Spurious Ave, NC 27601             │
│               25 │ John Brown        │ michael.martinez@example  │ 1111 Phony Ln, Asgard, NY 10570         │
│               30 │ Mary Brown        │ jennifer.garcia@gmail.com │ 222 Make Believe Dr, Clone, NC 27601    │
│               24 │ James Smith       │ elizabeth.johnson@example │ 444 Fabricated St, Anytown, CA 90210    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
