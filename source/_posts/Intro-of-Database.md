---
title: 数据库概论 <Introduction of Database>
date: 2024-09-02 14:01:00
categories: "Course Notes"
tags:
    - Note
    - Course
    - Database
excerpt: 南京大学2024秋，数据库概论笔记。
---

理论部分+实验部分
期末考试70%，作业+实验30%

# 1：数据库系统概述

## 1.4：数据库内部结构体系

**三级架构两种映射**

- 内部模式（Internal Schema）：数据库的物理存储结构，描述了数据在存储介质上的实际布局。
- 概念模式（Conceptual Schema）：数据库的逻辑结构，描述了数据的逻辑关系和完整性约束，但不关心具体的存储实现。
- 外部模式（External Schema）：数据库的视图，定义了不同用户或应用程序所能访问的数据子集和视图。

- 逻辑与内部映射（Logical-to-Internal Mapping）
  - 数据存储：概念模式中的数据如何映射到实际的物理存储结构中。例如，如何将概念模式中的表和索引映射到内部模式的文件和存储结构。
  - 优化：为了提高查询性能，数据库系统可能会在内部模式中使用不同的存储结构（如索引、聚集）来优化概念模式中的数据访问。
  - 这个映射的目标是将逻辑上的数据组织和操作（概念模式）转换为实际存储和检索的数据方式（内部模式），确保数据能够高效地存储和检索。
- 外部与概念映射（External-to-Conceptual Mapping）
  - 视图定义：如何将外部模式中的用户视图与概念模式中的逻辑结构对应。例如，用户视图可能只显示部分数据或特定的数据格式，而概念模式则描述了整个数据库的结构。
  - 数据访问：用户通过外部模式访问数据库时，如何将其请求转换为概念模式中的查询。这包括如何处理用户的不同视图、权限和数据安全等问题。
  - 这个映射的目标是将用户视图（外部模式）转换为数据库的逻辑视图（概念模式），以便用户可以在不关心实际存储结构的情况下访问数据。

![3Models-2Mappings](\../imgs/Intro-of-Database/3Models-2Mappings.png)

# 2：数据模型

## 2.3：概念世界与概念模型

### 关联

类之间的二元联系称为**关联**

使用`m..n`来表示相应的数量。

**关联类**

认为是它依附的关联的属性。

# 3：关系数据库系统

## 3.3：关系数据结构

表框架由n个命名的属性组成，n称为表的元数（n元表）。
在表框架中也可按行存放数据，其中每行的数据称为元组。一个表框架存放m个元组，m称为表的基数。

### 关系操纵

关系代数是一种过程化的查询语言，通过一系列的操作符对关系进行操作，最终返回一个新的关系。它包括一些基本的操作符，允许对关系进行各种操作。

- 选择（Selection，$\sigma$）：从关系中筛选满足某个条件的元组（行）。例如，选择年龄大于20的学生。
  - 形式：$\sigma条件(关系)$
  - 示例：$\sigma \\ Age > 20(Student)$
- 投影（Projection，$\pi$）：从关系中提取某些属性（列），忽略其他属性。用于返回部分列的数据。
  - 形式：$\pi属性列表(关系)$
  - 示例：$\pi \\ Name, Age(Student)$
- 并（Union，$\cup$）：对两个关系进行并集操作，返回同时属于两个关系的所有元组，去重后返回。
  - 形式：$R1 \cup R2$
  - 示例：$Student \cup Teacher$（假设Student和Teacher表具有相同的属性）
- 差（Difference，$-$）：从一个关系中减去属于另一个关系的元组。返回在第一个关系中存在而在第二个关系中不存在的元组。
  - 形式：$R1 - R2$
  - 示例：S$tudent - GraduateStudents$（返回不是研究生的学生）
- 笛卡尔积（Cartesian Product，$\times$）：将两个关系的所有元组合在一起形成新的元组，返回的是一个“笛卡尔积”。
  - 形式：$R1 \times R2$
  - 示例：$Student \times Course$（返回每个学生与每门课程的所有组合）
- 连接（Join，$\Join$）：将两个关系中的元组基于某个条件连接在一起，通常是基于共同的属性。
  - 形式：$R1 \Join 条件 R2$
  - 示例：$Student \Join Student.ID = Enroll.StudentID Enroll$

关系代数的特点：
- 过程化：用户需要明确指定数据如何检索和操作，操作步骤清晰。
- 操作返回一个新的关系。

## 3.4 关系数据库语言SQL92

### 模式

- `CREATE SCHEMA <模式名> AUTHORIZATION <用户名>`
- `DROP SCHEMA <模式名> <删除方式>`

### 基表

- `CREATE TABLE<基表名>（<列定义>[<列定义>]…）[其他参数]`
- `ALTER TABLE <基表名> ADD/DROP <列名> <数据类型>`
- `DROP TABLE <基表名>`

### 索引

- `CREATE[UNIQUE] [CLUSTER] INDEX <索引名> ON<基表名>(<列名>[<顺序>][,<列名>[<顺序>],…])[其他参数]`
- `DROP INDEX <索引名>`

### SQL数据操纵功能

```SQL
SELECT <列名> [,<列名>,...]
FROM <基表名> [,<基表名>,...]
WHERE <逻辑条件>
```

- 结果排序：`ORDER BY <列名> [ASC|DESC]`
- 分组：`GROUP BY ... HAVING ... `
- `ANY`, `SOME`: `WHERE column operator ANY/SOME (subquery);`
- `EXISTS`: `WHERE EXISTS (subquery);`

### 视图

```SQL
CREATE VIEW <视图名> [(<列名>[,<列名>,…])]
AS <SELECT语句>
[WITH CHECKOPTION]
```

**更新**

```SQL
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**内连接**

```SQL
SELECT columns
FROM table1
INNER JOIN table2
ON table1.column = table2.column;
```

# 4：数据库安全性与完整性保护

## 4.1：SQL对数据库安全的支持

```SQL
GRANT  <操作权限列表>  ON  <操作对象>
TO  <用户名列表>  [WITH GRANT OPTION]

REVOKE  <操作权限列表>  ON  <操作对象>
FROM  <用户名列表>  [RESTRICT | CASCADE]
```

- CASCADE：连锁回收
- RESTRICT：在不存在连锁回收问题时才能回收权限，否则拒绝回收

# 5：事务处理、并发控制与故障恢复技术

## 5.1 事务处理

事务的四个特性ACID
- 原子性（Atomicity）
- 一致性（Consistency）
- 隔离性（Isolation）
- 持久性（Durability）

有关事务之间的并发：
```SQL
SET TRANSACTION ISOLATION LEVEL
	  READUNCOMMITTED
  | READCOMMITTED
  |	READREPEATABLE
  | SERIALIZABLE
```

- READUNCOMMITTED 未提交读
  - 不申请任何锁
- READCOMMITTED 提交读
  - 读之前申请锁，读之后释放锁
- READREPEATABLE 可重复读
  - 读之前申请锁，事务结束释放锁
- SERIALIZABLE 可序列化（可串行化）
  - 避免所有干扰，串行执行

**事实上，再往后该课内容涉及数据库内部实现和数据库设计范式，但是记不动了（**