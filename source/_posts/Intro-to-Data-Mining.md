---
title: 数据挖掘导论 <Introduction to Data Mining>
date: 2026-03-04 10:00:00
categories: "Course Notes"
tags: 
	- Note
    - Course
    - Data Mining
excerpt: 南京大学2026春，数据挖掘导论笔记。
---

In-class assessment 20% + One assignment 40% + A final examination 40%

- W1-4 Intro, Data, Distances
- W5 Data Mining Algorithms
- W6-11 Time series, Trajectory, Graph
- W12-16 Data Streams, Social Networks, Web Data
- Group Assignment due 6 June 2026

# 1 Intro

> Data mining is a process of extracting previously unknown, 
valid, and actionable information from large databases and 
then using the information to make crucial decisions.
> 数据挖掘是从大型数据库中提取以前未知的、有效的、可操作的信息，然后使用这些信息做出关键决策的过程。

### Def 1 Data Classification (数据分类)

Given an n×d training data matrix D (database D), and a class label value in {1 . . . k} associated with each of the n rows in D (records in D), create a training model M, which can be used to predict the class label of a d-dimensional record Y ∉ D.

> 给定一批带标签的数据，用它们训练一个模型，让这个模型能够给新的数据样本预测类别。
> 很多分类算法，其实只是构造不同形式的 模型 M。而这本质上就是一个映射函数。

### Dis 1

**1. Classification and regression methods are usually described as supervised learning methods. Explain why. And describe the difference between the two.**

**2. What do you need in order to produce a classification model?**
**3. How do you know that you have produced a good model?**
**4. Why is a classification model also called a generalized model?**


### Def 2 Data Clustering (数据聚类)

Given a data matrix D, partition its rows (records) into sets/clusters C1 . . . Ck , such that the rows (records) in each cluster C are “similar” to one another.

> 划分数据组，同一组里的数据彼此相似，不同组的数据尽量不相似。这是**无监督学习**，没有给出正确答案。

### Dis 2

**1. Explain how a clustering task differs from a classification task.**
**2. What is the core operation/measurement required in a clustering task?**
**3. How do you know that you have produced a good clustering outcome?**

### Def 3 Outlier Detection (异常检测)

Given a data matrix D, determine the few rows of the data matrix that are very different from the majority of rows in the matrix.

> 给定一个数据矩阵 D，每一行是一条记录。任务是找出那些与大多数记录非常不同的少数行。

### Dis 3

**1. Explain how an anomaly detection task differs from a classification task.**
**2. Explain how it differs from a clustering task.**
**3. How do you know that you have produced a good anomaly detection outcome?**

### Def 4 Frequent Pattern Mining （频繁模式挖掘）

**Definition 4 (Frequent Pattern Mining)** Given a binary n×d data matrix D, determine all subsets of columns such that all the values in these columns take on the value of 1 for at least a fraction s of the rows in the matrix. The relative frequency of a pattern is referred to as its support. The fraction s is referred to as the minimum support.

> 给定一个 n×d 的 二值矩阵（binary matrix） D。意思是数据只有 0 或 1。找出所有列的子集，使得这些列同时为 1 占的比例 s。

**Definition 4.1 (Association Rules)** Let A and B be two sets of items. The rule A ⇒ B is said to be valid at support level s and confidence level c, if the following two conditions are satisfied: 
1. The support of the item set A is at least s. 
2. The confidence of A ⇒ B is at least c.

> 接下来从 频繁项集 里生成规则。意思是：如果有 A，往往也会有 B。其支持度至少为 s，置信度（出现 A 的情况下有多少可能出现 B）至少为 c。

### Dis 4

**1. How does association pattern mining differ from other data mining tasks?**
**2. How does association pattern mining differ from rule-based classification?**
**3. What is a search space?**

### Ass i.i.d

Every data point in a dataset is independent and identically distributed 
(i.i.d.). 

> 样本之间相互独立，并且来自同一个概率分布。

Is there any issue in using a classification model trained from P to classify a test set derived from P1 ≠ P?

> 如果分类模型是在分布 P 上训练的，但测试数据来自 另一个分布 P1（而且 P1 ≠ P），会不会有问题？

称为 **distribution shift（分布漂移）**。模型其实是在学习分布里的规律，但如果测试数据来自另一个分布，那么训练得到的规则就会完全失效。因为模型从没见过这样的数据区域。

机器学习理论描述的是一个非常理想化的宇宙——数据来自同一个稳定的概率分布，因此很多现代研究领域其实就在试图解决这个问题，这些方向本质上都在对抗一个事实：真实世界很少严格满足 i.i.d. 假设。


### Types of learning methods

- Supervised/Inductive learning: Classification
- Unsupervised learning: Clustering, outlier detection
- Semi-supervised learning
- Transductive (a special semi-supervised) learning

### Ques
1. Does a semi-supervised learning refer to supervised or unsupervised learning or something completely different?4
2. How does semi-supervised learning impact on model evaluation? 

# 2 Data

### (Def 5) Types of Attributes

- Nominal（名义型）
- Ordinal（序数型）
- Interval（区间型）
- Ratio（比率型）

### Dis 5

1. What is the attribute type of each of the following kinds of attributes (a)Age,(b) Salary, (c) Zip Code, (d) Province of Residence, (e) Height, (f) Weight.
2. An analyst sets up a sensor network in order to measure the temperature of different locations over a period. What is the data type of the data collected?
3. An analyst processes Web logs in order to create records with the ordering information for Web page accesses from different users. What is the type of this data?
4. Describe the difference between interval and ratio attribute type.
5. Suppose that you are employed as a data mining consultant for an Internet search engine company. Describe how data mining can help the company by giving specific examples of how techniques, such as clustering, classification, association rule mining, and anomaly detection can be applied.
6. Distinguish between noise and outliers. Consider the following questions.
(a) Is noise ever interesting or desirable? Outliers?
(b) Can noise objects be outliers?
(c) Are noise objects always outliers?
(d) Are outliers always noise objects?
(e) Can noise make a typical value into an unusual one, or vice versa?