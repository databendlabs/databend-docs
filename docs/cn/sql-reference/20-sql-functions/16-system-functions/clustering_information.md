---
title: CLUSTERING_INFORMATION
---

返回表的聚簇信息。

## 语法

```sql
CLUSTERING_INFORMATION('<database_name>', '<table_name>')
```

## 示例

```sql
CREATE TABLE mytable(a int, b int) CLUSTER BY(a+1);

INSERT INTO mytable VALUES(1,1),(3,3);
INSERT INTO mytable VALUES(2,2),(5,5);
INSERT INTO mytable VALUES(4,4);

SELECT * FROM CLUSTERING_INFORMATION('default','mytable')\G
*************************** 1. row ***************************
            cluster_key: ((a + 1))
      total_block_count: 3
   constant_block_count: 1
unclustered_block_count: 0
       average_overlaps: 1.3333
          average_depth: 2.0
  block_depth_histogram: {"00002":3}
```

| 参数               	| 描述                                                                                                            	|
|-------------------------	|------------------------------------------------------------------------------------------------------------------------	|
| cluster_key         	| 定义的聚簇键。                                                                                               	|
| total_block_count       	| 当前的块数量。                                                                                           	|
| constant_block_count    	| 最小/最大值相等的块的数量，表示每个块仅包含一个（组）cluster_key 值。 	|
| unclustered_block_count 	| 尚未聚簇的块的数量。                                                                  	|
| average_overlaps        	| 给定范围内重叠块的平均比率。                                                          	|
| average_depth           	| 聚簇键的重叠分区的平均深度。                                                       	|
| block_depth_histogram   	| 每个深度级别的分区数。较低深度级别的分区集中度越高，表示表聚簇越有效。                                                                          	|