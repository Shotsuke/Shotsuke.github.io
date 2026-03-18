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

# W1-4

## 1 Intro

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

> Because they learn from labeled training data. The model learns the relationship between inputs and outputs.
> The diff is that classification **predicts discrete class labels**, while regression **predicts continuos numeric values**.

分类是离散类别，回归是连续数值。

**2. What do you need in order to produce a classification model?**

> A labeled training dataset, input features (attributes), class lables, a classification algorithm, a training process to learn the model.

**3. How do you know that you have produced a good model?**

> It gains great score when using test data.

如 Accuracy，Precision，Recall，F1-score.

**4. Why is a classification model also called a generalized model?**

> Because it learns general patterns from training data and applies them to unseen data.
> The goal is not to memorize the training data but to generalize to new instances.

### Def 2 Data Clustering (数据聚类)

Given a data matrix D, partition its rows (records) into sets/clusters C1 . . . Ck , such that the rows (records) in each cluster C are “similar” to one another.

> 划分数据组，同一组里的数据彼此相似，不同组的数据尽量不相似。这是**无监督学习**，没有给出正确答案。

### Dis 2

**1. Explain how a clustering task differs from a classification task.**

> Classification is a supervised learning task while clustering task is an unsupervised learning task.

**2. What is the core operation/measurement required in a clustering task?**

> Similarity or distance calculation between data points.

聚类的核心只有一个问题：两个数据点有多相似？
因此聚类算法最重要的是距离或相似度计算。

**3. How do you know that you have produced a good clustering outcome?**

> High similarity with clusters and low similarity between clusters.

### Def 3 Outlier Detection (异常检测)

Given a data matrix D, determine the few rows of the data matrix that are very different from the majority of rows in the matrix.

> 给定一个数据矩阵 D，每一行是一条记录。任务是找出那些与大多数记录非常不同的少数行。

### Dis 3

**1. Explain how an anomaly detection task differs from a classification task.**

> Anomaly detection aims to identify rare or unusual instances that significantly deviate from the majority of the data. It is often unsupervised or semi-supervised because anomalies are usually unknown beforehand.
> Classification is a supervised learning task.

**2. Explain how it differs from a clustering task.**

> Clustering groups data points into clusters based on similarity, while anomaly detection focuses on identifying points.

它们都是无监督学习。聚类找到数据中的多个群体结构，异常检测关注偏离群体的点。

**3. How do you know that you have produced a good anomaly detection outcome?**

> A good anomaly detection result correctly identifies rare abnormal instances while minimizing false positives. Evaluation may use labeled anomalies, precision/recall, or domain knowledge.

### Def 4 Frequent Pattern Mining （频繁模式挖掘）

**Definition 4 (Frequent Pattern Mining)** Given a binary n×d data matrix D, determine all subsets of columns such that all the values in these columns take on the value of 1 for at least a fraction s of the rows in the matrix. The relative frequency of a pattern is referred to as its support. The fraction s is referred to as the minimum support.

> 给定一个 n×d 的 二值矩阵（binary matrix） D。意思是数据只有 0 或 1。找出所有列的子集，使得这些列同时为 1 占的比例 s。

**Definition 4.1 (Association Rules)** Let A and B be two sets of items. The rule A ⇒ B is said to be valid at support level s and confidence level c, if the following two conditions are satisfied: 
1. The support of the item set A is at least s. 
2. The confidence of A ⇒ B is at least c.

> 接下来从 频繁项集 里生成规则。意思是：如果有 A，往往也会有 B。其支持度至少为 s，置信度（出现 A 的情况下有多少可能出现 B）至少为 c。

### Dis 4

**1. How does association pattern mining differ from other data mining tasks?**

> Association pattern mining is an unsupervised task that discovers relationships (co-occurrence patterns) among items in data.

**2. How does association pattern mining differ from rule-based classification?**

> Association pattern mining discovers rules based on co-occurrence without a target variable, while rule-based classification learns rules specifically to predict a predefined class label.

**3. What is a search space?**

> The set of all possible candidate solutions.

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

**1. Does a semi-supervised learning refer to supervised or unsupervised learning or something completely different?**

> Hybrid. It uses a small amount of labeled data (supervised) together with a large amount of unlabeled data (unsupervised) to improve learning.

**2. How does semi-supervised learning impact on model evaluation?**

> Evaluation in semi-supervised learning must focus on labeled data, since only labeled points provide ground truth. The presence of unlabeled data affects training but does not directly provide evaluation metrics, which makes careful validation crucial.

评估仍然依赖 labeled 数据，但训练过程可以利用大量 unlabeled 数据提高性能，需要谨慎验证以避免偏差。

## 2 Data

### (Def 5) Types of Attributes

- Nominal（名义型）
- Ordinal（序数型）
- Interval（区间型）
- Ratio（比率型）

### Dis 5

**1. What is the attribute type of each of the following kinds of attributes (a)Age,(b) Salary, (c) Zip Code, (d) Province of Residence, (e) Height, (f) Weight.**

> | Attribute             | Type    | 说明                     |
> | --------------------- | ------- | ------------------------ |
> | Age                   | Ratio   | 有零点，可比较大小和比率 |
> | Salary                | Ratio   | 有零点，可比较大小和比率 |
> | Zip Code              | Nominal | 只是标识，没有大小顺序   |
> | Province of Residence | Nominal | 类别标签，没有顺序       |
> | Height                | Ratio   | 有零点，可比较大小和比率 |
> | Weight                | Ratio   | 有零点，可比较大小和比率 |

**2. An analyst sets up a sensor network in order to measure the temperature of different locations over a period. What is the data type of the data collected?**

> Interval + Ratio.

**3. An analyst processes Web logs in order to create records with the ordering information for Web page accesses from different users. What is the type of this data?**

> Complex data object. Nominal

**4. Describe the difference between interval and ratio attribute type.**

> | Aspect              | Interval                   | Ratio                              |
> | ------------------- | -------------------------- | ---------------------------------- |
> | Zero point          | Arbitrary                  | Absolute zero                      |
> | Can compute ratios? | No                         | Yes                                |
> | Example             | Celsius temperature, dates | Kelvin temperature, weight, height |

**5. Suppose that you are employed as a data mining consultant for an Internet search engine company. Describe how data mining can help the company by giving specific examples of how techniques, such as clustering, classification, association rule mining, and anomaly detection can be applied.**

> Clustering: Group users by search behavior to personalize recommendations.
> Classification: Predict whether a search query will lead to a click or conversion.
> Association rule mining: Find frequent co-occurrences of search queries (e.g., “laptop → laptop bag”).
> Anomaly detection: Detect unusual search behavior indicating bots or fraudulent activity.

**6. Distinguish between noise and outliers. Consider the following questions.
(a) Is noise ever interesting or desirable? Outliers?
(b) Can noise objects be outliers?
(c) Are noise objects always outliers?
(d) Are outliers always noise objects?
(e) Can noise make a typical value into an unusual one, or vice versa?**

> (a) noise: not intersting. Outliers: often
> (b) yes
> (c) No, noise may just add small variations without being extreme
> (d) No, outliers may be valid, rare patterns
> (e) Yes, noise can distort data to appear as unusual (false outlier) or mask a real outlier

## 3 Distances

### Def 6 K-Means Clustering（K-均值聚类）

Given a data matrix $D$ with $n$ rows (records) and $d$ columns (features), partition the rows into $k$ clusters $C\_1, …, C\_k$ such that the sum of squared distances between each point and the centroid of its assigned cluster is minimized. Specifically:
1. For each cluster $C\_j$ , compute the centroid:
$$ x_i \in C_j \quad \text{if} \quad j = \arg \min_{l \in [1,k]} \|x_i - \mu_l\|^2 $$
2. Assign each point $x\_i \in D$ to the nearest centroid:
$$ \mu_j = \frac{1}{|C_j|} \sum_{x \in C_j} x $$

> 给定 n×d 数据矩阵 D，把数据分成 k 个簇，每个点分配到最近的簇中心，使得簇内平方距离总和最小。
Distance function 使用位置：在分配点到簇中心时，用距离（通常欧氏距离）计算“最近簇”。

### Def 7 DBSCAN: Density-based Clustering（基于密度的聚类）

DBSCAN Given a data matrix D, cluster the data based on density rather than predefined centroids.
The steps are:
1. Estimate the density of each point using its $ε$-neighborhood:
$$ N_\varepsilon(x) = \{ y \in D \mid d(x, y) \le \varepsilon \} $$
2. Identify all high-density points where $|N\_\varepsilon(x)| \geq MinPts$
3. Link neighboring high-density points to form clusters; points not belonging to any cluster are considered noise.

> 根据每个点的邻域密度将数据分簇，不需要指定簇数。
> Distance function 使用位置：计算每个点的 $ε$-邻域时，用距离函数判断哪些点在半径内。

### Def 8 Data-independent distance/similarity measures（独立于数据分布的距离/相似度度量）

Lp Norm / Minkowski Distance: 
$$ d_{p}(x, y) = \left( \sum_{i=1}^{d} |x_i - y_i|^p \right)^{1/p} $$

Cosine Similarity:
$$ \text{cosine}(X_1, X_2) = \frac{\langle X_1, X_2 \rangle}{\|X_1\| \|X_2\|} $$

Gaussian Kernel:
$$ K(x, y) = \exp(-\gamma \|x-y\|^2) $$

### Dis 6

![k-means vs DBSCAN.png](\../imgs/Data-Mining/k-means vs DBSCAN.png)

> K-means assumes convex, spherical clusters and minimizes distance to centroids.
> So:
> - For ring-shaped data, it cuts across rings because rings are non-convex → wrong grouping.
> - For two moons / curved shapes, it splits by straight boundaries → fails to capture the true structure.

核心原因：k-means 的“模型假设”不适合这些数据形状。
k-means 的本质是：
- 用质心（centroid）表示每个簇
- 最小化每个点到其质心的 欧氏距离平方
- 等价于假设：每个簇是“凸的、近似球形的”

> DBSCAN groups points by density connectivity instead of distance to centroids.
> So:
> - It can detect arbitrary-shaped clusters (rings, curves)
> - Points connected through dense regions form one cluster → correct grouping

核心原因：DBSCAN 是“基于密度”的，而不是基于中心点。
DBSCAN 的关键思想：
定义一个半径 $ε$（邻域）
如果某点附近有足够多点（$minPts$），它就是“核心点”
相互“密度可达”的点会被连成一个簇


### Def 9 Isolation Kernel (隔离核)

Isolation Kernel of any two points $x, y \in \mathbb{R}^d$ is defined to be the expectation taken over the probability distribution $P\_{H\_\psi(D)}$ on all partitionings $H \in H\_\psi(D)$ such that both $x$ and $y$ fall into the same isolating partition $\theta[z] \in H$:
$$
K_\psi(x, y \mid D)
= \mathbb{E}_{H \sim P_{H_\psi(D)}} 
\left[
\mathbf{1}\big( x, y \in \theta[z] \mid \theta[z] \in H \big)
\right],
$$
where $\mathbf{1}(\cdot)$ is an indicator function.

> 如果两个点经常被分在同一个区域 → 它们相似
> 如果很容易被分开 → 它们不相似
> 隔离核描述了两个点有多相似。

Definition 9.1 Isolation Kernel $K\_\psi$ has a feature map $\Phi : x \mapsto \{0,1\}^{t \times \psi}$.
$K_\psi$ has no closed-form expression and is expressed in terms of $\Phi$ as follows:
$$
K_\psi(x, y \mid D)
\simeq \frac{1}{t} \langle \Phi(x \mid D), \Phi(y \mid D) \rangle.
$$

Isolation Kernel is a data dependent kernel without closed form expression.

> 表示每个点所属的区域，并比较向量。
> 看它们的向量有多相似（点积），用“向量相似度”去近似那个概率。

![distance function affects result.png](\../imgs/Data-Mining/distance%20function%20affects%20result.png)

距离函数（distance）和相似度度量方式，会直接影响聚类效果；尤其是“数据依赖（data-dependent）”的度量在处理不同密度的数据时更好。

### Dis 7

![kernel trick.png](\../imgs/Data-Mining/kernel%20trick.png)

**既然 kernel trick 能让线性模型变非线性，为什么在 k-means 上效果并不好？**

> **kernel ≠ data-dependent**
> Kernel trick 解决的是“线性 vs 非线性”，但聚类的难点是“结构 vs 密度”。

**为什么说从“非线性”？**

> 模型始终是线性的，但“线性是相对于谁而言”发生了改变。是对 $\phi(x)$ 线性，而 $\phi(x)$ 是非线性映射。
> Kernel 并没有让“模型变非线性”，而是把数据映射到一个更高维空间，在那里用线性模型解决问题，从而在原空间表现为非线性。
> Kernel 相当于把数据“弯曲/抬升”到更高维空间，让原本弯曲的分界变成平的，但它只改变“几何形状”，不改变“簇的统计结构”。

- Kernel k-means 的本质没变：
  - 假设每个簇是“球状”的
  - 用“中心点”表示
  - Kernel 只是将其换到了高维空间中，可以看作是曲线距离
  - 即使在高维空间，簇仍然被假设为：凸的、均匀密度、中心可表示
- 同时，Kernel 是全局的，σ 是全局参数，不能同时适应稠密区和稀疏区
- 而 density-based 方法是“局部”的，比如 DBSCAN 思想：
  - 每个点有自己的邻域
  - 密度是局部计算的
  - 能处理：变密度、非均匀结构