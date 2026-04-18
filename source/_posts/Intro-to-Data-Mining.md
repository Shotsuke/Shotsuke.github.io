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

### Def Data Classification (数据分类)

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

### Def Data Clustering (数据聚类)

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

### Def Outlier Detection (异常检测)

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

### Def Frequent Pattern Mining （频繁模式挖掘）

**Definition (Frequent Pattern Mining)** Given a binary n×d data matrix D, determine all subsets of columns such that all the values in these columns take on the value of 1 for at least a fraction s of the rows in the matrix. The relative frequency of a pattern is referred to as its support. The fraction s is referred to as the minimum support.

> 给定一个 n×d 的 二值矩阵（binary matrix） D。意思是数据只有 0 或 1。找出所有列的子集，使得这些列同时为 1 占的比例 s。

**Definition (Association Rules)** Let A and B be two sets of items. The rule A ⇒ B is said to be valid at support level s and confidence level c, if the following two conditions are satisfied: 
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

### (Def) Types of Attributes

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

### Def K-Means Clustering（K-均值聚类）

Given a data matrix $D$ with $n$ rows (records) and $d$ columns (features), partition the rows into $k$ clusters $C\_1, …, C\_k$ such that the sum of squared distances between each point and the centroid of its assigned cluster is minimized. Specifically:
1. For each cluster $C\_j$ , compute the centroid:
$$ x_i \in C_j \quad \text{if} \quad j = \arg \min_{l \in [1,k]} \|x_i - \mu_l\|^2 $$
2. Assign each point $x\_i \in D$ to the nearest centroid:
$$ \mu_j = \frac{1}{|C_j|} \sum_{x \in C_j} x $$

> 给定 n×d 数据矩阵 D，把数据分成 k 个簇，每个点分配到最近的簇中心，使得簇内平方距离总和最小。
Distance function 使用位置：在分配点到簇中心时，用距离（通常欧氏距离）计算“最近簇”。

### Def DBSCAN: Density-based Clustering（基于密度的聚类）

DBSCAN Given a data matrix D, cluster the data based on density rather than predefined centroids.
The steps are:
1. Estimate the density of each point using its $ε$-neighborhood:
$$ N_\varepsilon(x) = \{ y \in D \mid d(x, y) \le \varepsilon \} $$
2. Identify all high-density points where $|N\_\varepsilon(x)| \geq MinPts$
3. Link neighboring high-density points to form clusters; points not belonging to any cluster are considered noise.

> 根据每个点的邻域密度将数据分簇，不需要指定簇数。
> Distance function 使用位置：计算每个点的 $ε$-邻域时，用距离函数判断哪些点在半径内。

### Def Data-independent distance/similarity measures（独立于数据分布的距离/相似度度量）

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


### Def Isolation Kernel (隔离核)

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

### Dis 8

**1. Is the partitioning performed as a randon within data range? If no whats the restriction? If yes why it works?**

> Partitioning is random but constrained within the data range and structure. These constraints ensure that the random partitions reflect the underlying data distribution. The method works because dense regions are harder to separate, while sparse regions are easily isolated, and this behavior is captured statistically through repeated random partitioning.

随机划分可能是“无效划分”，但多次随机 → 总体是有效的。
划分是“树结构”，可以递归进行，划分次数可以远大于点的数量。
我们关注的是在随机划分过程中，两个点在第 t 次之前还没被分开的概率。
**Isolation 方法不是在“保证每次划分有效”，而是在“利用随机划分的统计行为”，通过观察点被分开的难易程度来刻画数据结构。**

**2. Why is isolation kernel a data dependent method since it depends on random partitioning?**

> Isolation kernel is data-dependent because the random partitions are generated based on the data distribution (e.g., data range and sampled points). Therefore, the resulting similarity reflects the structure and density of the data rather than purely geometric distance.

密集区域 → 很难被分开
稀疏区域 → 很容易被分开
这不是人为设定，而是数据本身决定的。Isolation kernel 虽然使用随机划分，但划分是在“数据分布约束下”进行的，最终的相似度反映的是数据结构（密度、分布），因此是 data-dependent。

**3. Why does it perform better than Gaussian / Laplacian kernel?**

> Isolation kernel often performs better because it captures data distribution and density, making it more robust to noise, outliers, and non-uniform data, whereas Gaussian and Laplacian kernels rely only on pairwise distances.

忽略了数据的密度，一个关心数据结构，另一个只关心点间距。
Gaussian Kernel 实际上不关心密度、DBSCAN 显式地关心密度、Isolation Kernel 隐式地关心密度。

**4. Why does it underperform in K-means?**

> Kernel K-Means assumes that clusters can be represented by centroids in the feature space, which requires a Euclidean-like structure. Isolation kernel defines similarity based on separability and density, which does not align with the centroid-based assumption, leading to poor performance.

不是因为 K-Means “本质是距离”，而是因为 K-Means 的优化目标和 Isolation kernel 的相似性定义不匹配。
K-Means 假定数据有质心、并且是凸的、球形的，而 Isolation Kernel 定义的相似性是根据密度来的，因此他们的优化目标实际上并不一样。Isolation Kernel 在 SVM 这类更相符的算法中会更加有效。


**5. Can mean partition in high-dimensional spaces capture complex structures?**

> No. It assumes spherical clusters and relies on distance measures that become less meaningful in high dimensions.

**6. As DBSCAN + IK can perform well, why we still need more algs, such as psKC?**

> Although DBSCAN combined with Isolation Kernel performs well in capturing complex structures, it still suffers from parameter sensitivity, difficulty in handling varying densities, and instability due to randomness. Advanced methods such as psKC are designed to overcome these limitations by leveraging global similarity structures and reducing dependence on local thresholds.

K-Means → 用“均值”
DBSCAN → 用“密度”
IK → 用“分离概率”
psKC → 用“结构 + 全局优化”

IK 改的是“相似度”，不是“密度阈值机制”，因此 DBSCAN 仍然不擅长处理密度不同的区域。psKC 这类方法避免定死阈值，用 kernel 表示结构，用 clustering 来处理。

### High Dimension

#### 高维空间中的问题与测度集中

Talagrand 定义：

> 一个随机变量，如果依赖很多独立随机变量，并且对每个变量的依赖都不大，那么它几乎是常数。

对高维距离的启示：

- 欧氏距离或余弦相似度是由很多维度贡献的
- 每个维度影响较小 → 总体距离几乎相同
- 结果：距离在高维空间趋于常数

==>>

- 单点最近邻（single nearest neighbor）几乎找不到
- 高维空间的距离退化（curse of dimensionality）
- hubness：少数点会频繁出现在很多点的 k 最近邻里

**可区分性（Distinguishability）**：核映射后的特征空间能够区分原本不同的点
**不可区分性（Indistinguishability）**：核映射后，不同点几乎无法区分

#### Euclidean / Cosine 在高维的表现

问题：

- 距离几乎相同 → 单点最近邻不可靠
- hubness 现象严重 → 某些点成为“枢纽”
- 高维检索（retrieval）不准确

解决方法：

- 基于核的相似性方法（如 Isolation Kernel）
  - 使用空间划分、全局结构
  - 保持点的可区分性
- 聚类或簇邻居替代单点最近邻
  - 找到与查询同簇的点，比找单个最近邻更有意义

### t-SNE

目标：将高维数据嵌入低维（2D/3D），保持局部结构

特点：

- 强调保持局部邻居关系
- 可以用 IK 核特征提高高维结构保留的准确性
- 在可视化聚类、异常点、流形结构上表现好

### Dis 9

**1. What can be expect when Euclidean distance or Cosine similarity is used to perform retrieval on high-dimensional database?**

> Distances between points become nearly identical, making it difficult to distinguish nearest neighbors. This also leads to issues such as hubness, where some points frequently appear as nearest neighbors.

**2. What can be done instead and why?**

> Kernel-based methods such as Isolation Kernel or cluster-based approaches can be used. These methods capture data structure and separability rather than relying solely on pairwise distances.

**3. Summarize what you have learned about t-SNE?**

> **t-SNE is a dimensionality reduction technique that maps high-dimensional data into a low-dimensional space while preserving local neighborhood structure.** It models pairwise similarities in both spaces and minimizes their divergence using KL divergence. It is particularly effective for visualizing complex structures such as clusters and manifolds in high-dimensional data.

# W5

## 4 Data Mining Algorithms

## Classification:

1. Decision Trees（决策树）
2. Rule-based classifier（基于规则的分类器）
3. K nearest neighbor classifier（K近邻分类器）
4. Support Vector Machines（支持向量机）
5. Neural Networks（神经网络）

### Def Decision Tree Construction Algorithm （决策树）

A greedy algorithm that constructs the tree in a **top-down, recursive, divide-and-conquer** manner:

1. Start with a set of training data
2. **If** all examples belong to the same class:
   - Make a leaf labeled with that class
3. **Otherwise** choose a test based on one attribute:
   - Each test attribute is selected on the basis of a **heuristic or statistical measure** (e.g., information gain)
   - This becomes an **internal node**; then create:
     - **One branch** for each value of categorical attribute, or
     - **Two branches**: A<=T, A>T for numeric attribute A, threshold T
4. Subdivide the examples according to their outcome on the test
5. Apply the procedure recursively to each subset

> 决策树构造是一个贪心算法，采用自顶向下、递归、分而治之的方式：
> 
> - 如果所有样本属于同一类 → 创建叶节点
> - 否则选择一个属性进行分裂（基于启发式或统计度量，如信息增益）
> - 对于类别属性：每个值一个分支
> - 对于数值属性：两个分支（A<=T 和 A>T）
> - 递归地对每个子集重复此过程

### Def K-Nearest Neighbours Classifier (K近邻算法)

KNN不需要训练过程，直接保存所有训练样本。
预测时：找到与测试样本最近的k个训练样本，通过投票或平均决定类别。

> 核心特点：
> - 懒惰学习：训练时不做任何工作，预测时才计算
> - 需要相似度度量（通常用欧氏距离）
> - k值是超参数，需要调优

### Def Support Vector Machines (支持向量机)

> SVM：找到一个超平面，使得两类之间的**间隔（margin）最大化**。

Decision boundary: 
$$y_i(\mathbf{w} \cdot \mathbf{x}_i + b) \geq +1$$

The weight vector: 
$$\mathbf{w} = \sum_{i=1}^{s} \lambda_i y_i \mathbf{x}_i$$

With s support vectors, the boundary can be expressed as:
$$y_i \left( \sum_{i=1}^{s} \lambda_i y_i \mathbf{x}_i \cdot \mathbf{x}_j + b \right) \geq +1$$

**Kernel Trick in SVM**

通过核函数，可以在**不显式计算高维特征映射**的情况下，计算高维空间中的点积。

> **为什么有用？**
> - 原始空间线性不可分 → 映射到高维空间可能线性可分
> - 核函数直接计算高维点积，避免显式映射（计算高效）
> - Gaussian/RBF kernel 可以映射到**无限维空间**

### Def Neural Networks (神经网络)

神经网络模拟生物神经元的工作方式：

> - Input layer（输入层）：接收原始特征
> - Hidden layers（隐藏层）：提取抽象特征
> - Output layer（输出层）：产生预测结果
> 
> 深度学习：
> - 多隐藏层 = Deep Neural Network
> - 能够学习层次化的特征表示

### Dis 10 (Slide Discussion 5)

**1. Explain the similarities and differences between the main classification methods.**

> **Similarities:**
> - All aim to learn a mapping from features to class labels
> - All require labeled training data (supervised learning)
> - Can handle multi-class problems
> 
> **Differences:**
> 
> | Method | Model Type | Training | Interpretability |
> |--------|-----------|----------|-----------------|
> | **Decision Tree** | Rule-based | Greedy splitting | High (visual rules) |
> | **KNN** | Instance-based | None (lazy) | Medium (nearest neighbors) |
> | **SVM** | Geometric | Optimization | Low (hyperplane) |
> | **Neural Networks** | Function approximation | Gradient descent | Very low (black box) |
> | **Rule-based** | Logical rules | Set-covering/separate-and-conquer | High (explicit rules) |

**2. Explain why the divide-and-conquer algorithm used to generate a decision rule is called a greedy algorithm.**

> Because at each split, it selects the **locally optimal** attribute (highest information gain) **without reconsidering previous decisions**. It never backtracks to optimize the global tree structure.

**3. The set-covering algorithm used to generate decision rules is sometimes called the separate-and-conquer algorithm. How does this differ conceptually from the divide-and-conquer algorithm?**

> **Divide-and-conquer (Decision Tree):**
> - Recursively **splits the entire dataset** into subsets
> - All data points are processed together in a hierarchical structure
> 
> **Separate-and-conquer (Set-covering/Rule-based):**
> - **Learns one rule at a time**
> - Once a rule is learned, **remove covered examples** from the dataset
> - Repeat on remaining data until all covered
> 
> **Key difference:**
> - Divide-and-conquer: 同时处理所有数据，递归分裂
> - Separate-and-conquer: 逐个学习规则，每次"分离"已覆盖的样本

**4. As the k-nearest neighbor algorithm does nothing in training, does it produce a generalized model that enables it to classify well on unseen data points?**

> **Paradoxically, yes.**
> 
> KNN does not explicitly build a generalized model, but it **implicitly generalizes** by assuming that:
> - Similar data points (in feature space) belong to the same class
> - Local smoothness: nearby points share labels
> 
> **However:**
> - It can overfit with small k (noise sensitivity)
> - Performance depends heavily on distance metric and k choice
> - No explicit model → no interpretability

尽管没有显式模型，KNN通过"相似样本属于同一类"的假设**隐式泛化**。但容易过拟合（小k时），且依赖距离度量和k值选择。

**5. Explain the distinct features of SVM with respect to other classification methods.**

> **Distinct features of SVM:**
> 
> 1. **Maximum margin principle**: Not just any separating boundary, but the one with **largest margin** → better generalization
> 2. **Kernel trick**: Can handle nonlinear problems by mapping to high-dimensional space **without explicitly computing transformation**
> 3. **Support vectors**: Only a subset of training data (support vectors) determines the boundary → memory efficient
> 4. **Convex optimization**: Guaranteed global optimum (no local minima like neural networks)
> 5. **Theoretical foundation**: Based on structural risk minimization (VC theory)

**6. Which of the five classification algorithms require a distance/similarity function?**

> - ✅ **K-Nearest Neighbours**: Core requirement (Euclidean, Manhattan, etc.)
> - ✅ **SVM (with kernel)**: Kernel function is essentially a similarity measure
> - ❌ **Decision Tree**: Uses information gain/Gini (not distance-based)
> - ❌ **Neural Networks**: Uses weighted sums and activation functions
> - ❌ **Rule-based**: Uses logical conditions

## Clustering:

1. K-means / K-medoids - 基于中心点的方法
2. DBSCAN - 基于密度的方法
3. Spectral Clustering - 基于图论的方法
4. IDK-based Clustering (e.g., psKC) - 基于Isolation Distributional Kernel的方法

### Def Spectral Clustering (谱聚类)

1. Preprocessing
   - Produce a similarity matrix of a neighborhood graph
   
2. Eigen-decomposition
   - Compute eigenvalues & eigenvectors of the similarity matrix or Laplacian matrix
   - Map each point in the input space to a new space represented by k eigenvectors

3. Clustering
   - Often uses k-means on the transformed space

> **谱聚类**利用图论和线性代数：
> 
> **核心思想：**
> 将数据点看作图中的节点，用相似度连边，然后通过分析图的结构（特征向量）来划分簇。
> 1. 构建相似度矩阵（邻接矩阵或Laplacian矩阵）
> 2. 特征分解：找到前k个特征向量
> 3. 在特征向量空间中用k-means聚类
> 
> **为什么有效？**
> - 特征向量捕获了数据的全局结构
> - 可以发现非凸形状的簇
> - 对复杂流形结构鲁棒

[谱聚类交互演示](/demos/spectral_clustering_explainer.html)

### Dis 11 (Slide Discussion 6)

**1. Describe the two key steps in k-means clustering.**

> **Step 1: Assignment**
> - Assign each data point to the **nearest centroid** (using distance, e.g., Euclidean)
> 
> **Step 2: Update**
> - Recompute each centroid as the **mean** of all points assigned to that cluster
> 
> **Repeat** until convergence (centroids stop moving or assignment doesn't change)

将每个点分配到最近的质心 → 重新计算质心（簇内点的均值） → 重复直到收敛。

**2. Describe the two key steps in DBSCAN.**

> **Step 1: Density estimation**
> - For each point, compute its **ε-neighborhood**: $N_ε(x) = \{y \mid d(x,y) \leq ε\}$
> - Classify points as:
>   - **Core points**: $|N_ε(x)| \geq MinPts$ (high-density region)
>   - **Border points**: In ε-neighborhood of core point but not core itself
>   - **Noise points**: Neither core nor border
> 
> **Step 2: Density-based connectivity**
> - Connect core points that are within ε distance
> - Form clusters from **density-connected** core points and their border points

估计每个点的密度（ε-邻域内点数）→ 连接高密度区域（核心点及其边界点）→ 噪声点不属于任何簇。

**3. Explain the purpose of the first two steps in Spectral Clustering.**

> **Step 1 (Preprocessing):** 
> - Construct a **similarity graph** representing pairwise similarities
> - Captures the **manifold structure** of data (which points are "connected")
> 
> **Step 2 (Eigen-decomposition):**
> - Extract **global structure** via eigenvectors of the graph Laplacian
> - Transform data into a space where **clusters are more separable** (often linearly separable)
> 
> **Purpose:** Convert a complex clustering problem in original space into a simpler problem in spectral space, where k-means can work effectively.

构建相似度图（捕获流形结构）→ 特征分解（提取全局结构，转换到更易分离的空间）。

**4. Explain the key difference between IDK-based Clustering and the above three clustering methods.**

> **K-means, DBSCAN, Spectral Clustering:**
> - Use **data-independent** distance/similarity measures (Euclidean, Gaussian kernel)
> - Same distance function for all regions
> 
> **IDK-based Clustering (e.g., psKC):**
> - Uses **Isolation Distributional Kernel (IDK)**, which is **data-dependent**
> - Similarity is based on **how easily two points are isolated from each other**
> - Adapts to **local density variations** (dense vs sparse regions)
> - More robust to non-uniform density and complex structures

**核心区别：**
- 前三者：使用固定的、数据无关的距离度量
- IDK方法：使用数据依赖的相似度，基于隔离难度，能自适应不同密度区域

## Anomaly Detection

1. **Distance-based anomaly detectors（基于距离的异常检测器）**
   - Local Outlier Factor (LOF)
   - One-class Support Vector Machine (OCSVM)
   - Kernel Density Estimator (KDE)

2. **Isolation-based anomaly detectors（基于隔离的异常检测器）**
   - **Isolation Forest (iForest)** - Liu et al. ICDM 2008
   - **Isolation Distribution Kernel detector (IDK detector)**
     - Based on Kernel Mean Embedding

### Def Isolation Forest

**iForest** (Liu et al ICDM 2008)

**Core idea:** A collection of **isolation trees (iTrees)**

**Key properties:**
- Each iTree isolates every instance from the rest of the instances in a given sample
- **Anomalies are 'few and different'**
  - More susceptible to isolation
  - **Shorter average path length**

**Anomaly Score:**
$$
\text{Score}(x) = \frac{1}{t} \sum_{i=1}^{t} h_i(x)
$$

where $h_i(x)$ is the **path length** of $x$ traversed in tree $i$.

> **Isolation Forest 的核心思想：**
> 
> **异常点更容易被"隔离"** → 在隔离树中的路径更短
> 
> **为什么？**
> - 异常点：数量少、特征值与众不同 → 很快就能被单独划分出来
> - 正常点：数量多、特征值相似 → 需要多次划分才能隔离
> 
> **异常分数：**
> - 路径越短 → 异常分数越高 → 越可能是异常点
> - 路径越长 → 异常分数越低 → 越可能是正常点

**Construction of iTrees**

**iTrees are completely random trees**
- Guided by the range of values in a subsample

**步骤：**

1. **Subsample** $D_i$ from a given data set $D$
   - $D_i \subset D$ ($i = 1,2,\cdots,t$)
   - $|D_i| = \psi \ll |D| = n$

2. **Build an iTree from each** $D_i$
   - Partition recursively until every instance is isolated
   - **Height restriction**: $h = \log_2 \psi$

**Random partition:**
- Randomly select an attribute
- Randomly select a split value within the range of that attribute in current node

> **隔离树的构造：**
> 
> **完全随机树** - 由子样本中的值范围引导
> 
> **关键步骤：**
> 1. 从数据集 D 中随机抽取子样本 $D_i$（大小 $\psi \ll n$）
> 2. 对每个子样本构建一棵隔离树：
>    - 随机选择一个属性
>    - 在该属性的值范围内随机选择分裂点
>    - 递归划分，直到每个样本被隔离
>    - 高度限制：$h = \log\_2 \psi$
> 
> **为什么是随机的？**
> - 不需要计算信息增益（不像决策树）
> - 速度快，适合大规模数据
> - 通过集成多棵树来提高鲁棒性

**子采样**

Reduce both the **swamping** and **masking** effects

**Swamping effect（淹没效应）：**
- 大量正常点"淹没"了异常点的特征
- 使得异常点不明显

**Masking effect（掩盖效应）：**
- 异常点太多时，彼此"掩盖"
- 难以区分异常和正常

> 1. **减少淹没效应：** 正常点数量减少 → 异常点相对更突出
> 2. **减少掩盖效应：** 采样后异常点之间距离增大 → 更容易被单独隔离
> 3. **计算效率：** $\psi \ll n$ → 每棵树构建更快
> 4. **多样性：** 多次采样 → 多棵树 → 集成效果更好

- iForest 的评估复杂度：$O(tn\log(\psi))$ 是**线性**于数据规模 $n$
- LOF 的评估复杂度：$O(n^2)$ 是**平方**级别
- 当数据量大时，iForest 明显更快

### Def Isolation Distributional Kernel (分布式隔离核)

**Background: Kernel Mean Embedding (KME)**

Kernel mean embedding (KME) is a way to convert a **point-to-point kernel** to a **distributional kernel**:

$$
\widehat{K}(P_S, P_T) = \frac{1}{|S||T|} \sum_{x \in S} \sum_{y \in T} k(x, y)
$$

$$
\approx \langle \widehat{\phi}(P_S), \widehat{\phi}(P_T) \rangle \quad \text{(using Nystrom method)}
$$

**Key property:**
- If $k$ is a **characteristic kernel**, then its kernel mean map is **injective**, i.e.,
  $$\| \widehat{\phi}(P_S) - \widehat{\phi}(P_T) \|_H = 0 \iff P_S = P_T$$

**KME with Gaussian kernel has two key issues:**
1. **Quadratic time complexity** (resolved using Nystrom method)
2. **Weak task-specific accuracy**

**Root cause:** Gaussian kernel

> **核均值嵌入（KME）：**
> 
> 将点对点的核函数转换为**分布间的核函数**。
> 
> **Gaussian kernel 的问题：**
> - 计算复杂度高（$O(n^2)$）
> - 任务特定准确性弱（不够data-dependent）
> 
> **解决方案：** 用 Isolation Kernel 替换 Gaussian kernel → Isolation Distributional Kernel (IDK)


### IDK Method for Anomaly Detection

**核心思想：**

Use IDK to measure the similarity effectively between every point (in the given dataset $D$) and $D$ (the reference dataset).

**判断规则：**

- **If** $x \sim P_D$, $\widehat{K}(\delta(x), P_D)$ is **large**, which can be interpreted as:
  - $x$ is likely to be **part of** $P_D$ (正常点)

- **If** $y \nsim P_D$, $\widehat{K}(\delta(y), P_D)$ is **small**, which can be interpreted as:
  - $y$ is **not likely to be part of** $P_D$ (异常点)

**Definition of anomaly:**

> "Given a similarity measure $\widehat{K}$ of two distributions, an anomaly is an observation whose **Dirac measure** $\delta$ has a **low similarity** with the distribution from which a reference dataset is generated."

> **IDK 异常检测方法：**
> 
> 1. 计算每个点 $x$ 的 Dirac measure $\delta(x)$（单点分布）
> 2. 计算 $\delta(x)$ 与参考分布 $P_D$ 的相似度 $\widehat{K}(\delta(x), P_D)$
> 3. 相似度低 → 异常点；相似度高 → 正常点
> 
> **为什么有效？**
> - 使用 Isolation Kernel（data-dependent）
> - 捕获数据的局部密度结构
> - 比 Gaussian kernel 更准确


### Example Computation

**IDK 的计算示例：**

$$
\widehat{K}_I(\delta(x), P_D) = \frac{1}{t} \langle \widehat{\Phi}(\delta(x)), \widehat{\Phi}(P_D) \rangle
$$

**可视化：**
- 数据空间 $\mathbb{R}^d$ 中有数据集 $D$
- 对于点 $y_1, y_2$，计算它们的特征映射 $\widehat{\Phi}(\delta(y_1)), \widehat{\Phi}(\delta(y_2))$
- 在 Hilbert Space $\mathcal{H}$ 中计算与 $\widehat{\Phi}(P_D)$ 的相似度

> **关键步骤：**
> 1. 用 Isolation 树构建特征映射 $\widehat{\Phi}$
> 2. 计算点的 Dirac measure 与整体分布的内积
> 3. 相似度作为正常/异常的评分

---

### Dis 12 (Slide Discussion 7)

**1. Describe the operational principle of:**
   - **Distance-based anomaly detector**
   - **Isolation-based anomaly detector**
   - **IDK-based anomaly detector**

> **Distance-based anomaly detector (e.g., LOF):**
> - 计算每个点到其 k 近邻的距离
> - 比较点的局部密度与邻居的局部密度
> - 局部密度明显低于邻居 → 异常点
> 
> **Isolation-based anomaly detector (e.g., iForest):**
> - 构建随机隔离树（iTrees）
> - 异常点"少且不同" → 容易被隔离 → 路径短
> - 正常点"多且相似" → 难以隔离 → 路径长
> - 异常分数 = 平均路径长度（越短越异常）
> 
> **IDK-based anomaly detector:**
> - 使用 Isolation Distributional Kernel
> - 计算每个点的 Dirac measure 与整体分布的相似度
> - 相似度低 → 异常点

**2. Is an Isolation tree a variant of decision tree? Explain your answer.**

> **No, Isolation tree is NOT a variant of decision tree.**
> 
> **Key differences:**
> 
> | Aspect | Decision Tree | Isolation Tree |
> |--------|--------------|----------------|
> | **Goal** | Classification/Regression | Isolation/Anomaly detection |
> | **Split criterion** | Information gain, Gini index (greedy) | **Random** split point |
> | **Training** | Supervised (requires labels) | Unsupervised (no labels) |
> | **Leaf nodes** | Class labels or values | Individual instances (isolated) |
> | **Purpose** | Predict class/value | Measure path length (isolation difficulty) |
> 
> **虽然都是树结构，但：**
> - Decision tree 追求**最优分裂**（贪心算法）
> - Isolation tree 使用**随机分裂**（无需优化）
> - Decision tree 是**监督学习**
> - Isolation tree 是**无监督学习**

**3. Explain another possible way to perform isolation which is different from using isolation trees. Hint: the principle is to isolate one point from the rest of the points in a sample.**

> **Alternative isolation method: Random Hyperplane Projection**
> 
> **Principle:**
> - Instead of axis-parallel splits (like iTrees), use **random hyperplanes**
> - Randomly generate a hyperplane in d-dimensional space
> - Count how many splits are needed to isolate a single point
> 
> **Steps:**
> 1. Randomly select a normal vector $\mathbf{w} \in \mathbb{R}^d$
> 2. Randomly select a bias $b$
> 3. Split data by hyperplane: $\mathbf{w} \cdot \mathbf{x} + b = 0$
> 4. Recursively split until point is isolated
> 5. Record number of splits as isolation score
> 
> **Why it works:**
> - Anomalies are **far from dense regions** → fewer splits needed
> - Normal points are **within dense regions** → more splits needed
> 
> **另一种隔离方法：随机超平面投影**
> 
> 与 iTrees（轴平行分裂）不同，使用**随机方向的超平面**进行分裂。
> 
> 核心思想不变：异常点更容易被隔离 → 需要更少的分裂次数。

## Association Pattern Mining

### Def Frequent Pattern Mining (频繁模式挖掘)

Given a binary $n \times d$ data matrix $D$, find all subsets of columns such that all values in these columns are $1$ for at least a fraction $s$ of rows.

- The relative frequency of a pattern is its **support**
- The threshold $s$ is the **minimum support**
- A frequent itemset is an itemset whose support is at least $s$

$$
support(X)=\frac{|\{t \in D \mid X \subseteq t\}|}{|D|}
$$

> 频繁模式挖掘的输入通常可以理解为购物篮数据：每一行是一笔交易，每一列是一个 item，1 表示该交易包含该 item。任务是找出经常一起出现的 item 组合。

### Def Association Rules (关联规则)

For two itemsets $A$ and $B$, the rule $A \Rightarrow B$ is valid at support level $s$ and confidence level $c$ if:

1. $support(A \cup B) \geq s$
2. $confidence(A \Rightarrow B) \geq c$

$$
confidence(A \Rightarrow B)=\frac{support(A \cup B)}{support(A)}
$$

> $A \Rightarrow B$ 的含义是：如果出现了 A，那么 B 也倾向于出现。
> 
> - **Support** 衡量规则出现得是否足够频繁
> - **Confidence** 衡量在 A 出现时 B 出现的条件概率

### Enumeration Tree Algorithms (枚举树算法)

Association pattern mining 的核心困难是 **search space 很大**。

如果有 $d$ 个 items，那么可能的 itemsets 数量是：

$$
2^d - 1
$$

枚举树算法的目标是用一种系统化的方式遍历这些候选模式：

- 每个节点代表一个 itemset
- 从根节点开始逐步扩展 itemset
- 每个候选 itemset 只生成一次
- 通过剪枝减少不可能成为 frequent itemset 的候选

> 枚举树不是一种具体模型，而是一种搜索框架。它解决的问题是：如何在指数级候选空间中，不重复、不遗漏地搜索可能的 frequent patterns。

### Apriori Algorithm

Apriori 使用 **downward closure property（向下闭包性质）** 做剪枝：

> Every subset of a frequent itemset is also frequent.

等价地说：

> If an itemset is infrequent, then all of its supersets must also be infrequent.

**Algorithm idea:**

1. Find frequent 1-itemsets
2. Use frequent $(k-1)$-itemsets to generate candidate $k$-itemsets
3. Count support of candidates
4. Remove candidates whose support is below minimum support
5. Repeat until no more frequent itemsets can be generated

> Apriori 的关键不是“生成所有组合”，而是先用较小项集的频繁性剪掉大量不可能频繁的更大项集。
> 
> 例子：如果 $\{A,B\}$ 都不频繁，那么 $\{A,B,C\}$、$\{A,B,D\}$ 这些超集不可能频繁，可以直接不考虑。

### Dis 13 (Slide Discussion 8)

**1. Describe the important concepts in enumeration tree algorithms.**

> Enumeration tree algorithms organize the search space of candidate patterns as a tree. Each node represents a candidate itemset, and child nodes are generated by extending the current itemset with additional items. The key concepts are candidate generation, systematic traversal, support counting, pruning, and avoiding duplicate candidates.

中文说明：

- **Search space**：所有可能 itemsets 的集合
- **Node**：一个候选 itemset
- **Expansion**：向当前 itemset 添加新 item
- **Support counting**：计算该 itemset 在数据中出现的频率
- **Pruning**：根据 minimum support 和 downward closure 删除不可能频繁的分支
- **Non-repetitive search**：每个候选只检查一次

**2. Why is "non-repetitive" an important criterion?**

> Non-repetitive search is important because the number of candidate patterns grows exponentially with the number of items. If the same candidate itemset is generated multiple times, the algorithm wastes computation and may also count or report the same pattern repeatedly.

中文说明：

如果 $d$ 个 items 有 $2^d-1$ 个候选，搜索空间本来就已经指数级了。重复生成候选会让复杂度更糟，而且可能导致重复输出。考试答题时可以抓住一句话：**non-repetitive avoids redundant computation and duplicate results**。

**3. Why is "systematic" an important criterion?**

> Systematic search is important because it ensures that all valid candidate patterns are explored in a well-defined order. Without a systematic exploration strategy, the algorithm may miss frequent patterns or fail to apply pruning rules correctly.

中文说明：

系统化搜索保证两件事：

- 不遗漏：所有可能 frequent 的 itemsets 都会被考虑
- 可剪枝：因为搜索顺序明确，Apriori 的 downward closure 才能有效使用

**4. What is the downward closure property and why is it useful?**

> The downward closure property states that every subset of a frequent itemset must also be frequent. It is useful because if an itemset is found to be infrequent, all of its supersets can be safely pruned without support counting.

中文说明：

向下闭包是 Apriori 的核心剪枝依据。它把“不频繁”这个结论向上传播：一个小集合都不够频繁，包含它的大集合更不可能频繁。

## Assumption and Applicability

### Assumption of These Algorithms

Most algorithms studied in this chapter assume that every data point in a multidimensional dataset is **independent and identically distributed (i.i.d.)**.

> i.i.d. means that data points are independently sampled from the same unknown distribution.

这个假设对传统 data mining algorithms 很重要，因为它暗含：

- 训练数据和测试数据来自同一分布
- 样本之间没有强依赖关系
- 每一行可以被看作一个独立 record
- 数据已经被表示成固定维度的 feature vector

如果数据是 spatial data、graph data、time series 或 trajectory data，这个假设通常不完全成立，因为数据对象之间存在结构关系、顺序关系或空间邻近关系。

### Dis 14 (Slide Discussion 9)

**1. Given a multidimensional dataset, you are consulted as a data mining consultant to explore ways to extract interesting information from this dataset. Explain which algorithm(s) you will use and why.**

> I would first identify the data mining task and then choose algorithms accordingly. If labels are available and the goal is prediction, I would use classification algorithms such as decision trees, SVM, KNN, or neural networks. If there are no labels and the goal is grouping, I would use clustering methods such as k-means, DBSCAN, spectral clustering, or IDK-based clustering. If the goal is to find rare abnormal points, I would use anomaly detection methods such as LOF, iForest, or IDK-based anomaly detection. If the data is transactional or binary and the goal is to find co-occurring items, I would use frequent pattern mining methods such as Apriori.

中文说明：

这题考的是“按任务选算法”，不是让你背单个算法。

| Goal | Task | Candidate algorithms |
| --- | --- | --- |
| Predict labels | Classification | Decision Tree, Rule-based, KNN, SVM, Neural Network |
| Find groups | Clustering | K-means, DBSCAN, Spectral Clustering, IDK-based clustering |
| Find rare points | Anomaly Detection | LOF, OCSVM, KDE, iForest, IDK detector |
| Find co-occurrence | Frequent Pattern Mining | Enumeration tree, Apriori |

**背诵版：**

> The algorithm should be chosen according to the mining objective: classification for labeled prediction, clustering for grouping unlabeled data, anomaly detection for rare and different objects, and association pattern mining for co-occurrence patterns.

**2. Can we use the data mining algorithms we have studied for a spatial (or graph) dataset? Explain your answer.**

> Yes, but not directly in general. The algorithms studied in this chapter assume multidimensional i.i.d. records. Spatial or graph datasets contain structural dependencies such as neighborhood, edges, paths, or topology. To use these algorithms, we usually need to transform the complex objects into feature vectors or define an appropriate distance, similarity, or kernel that captures the spatial or graph structure. Otherwise, applying standard algorithms directly may lose important structural information.

中文说明：

可以用，但要先转换表示。

- Spatial data：需要把位置、邻域、距离、区域关系变成特征或相似度
- Graph data：需要把节点/边/子图结构变成 embedding、graph kernel 或结构特征
- Time series / trajectory：需要定义序列距离或提取统计特征

关键句：

> These algorithms assume multidimensional feature vectors. For complex data objects, we can still use them if we convert the objects into a suitable multidimensional representation or define a task-appropriate similarity/kernel.

### Week 5 Summary

- 每个 data mining task 都可以用不同算法解决
- 重要的不是死记算法步骤，而是理解每个算法的 **problem-solving principle**
- Classification：学习从 feature 到 label 的映射
- Clustering：根据相似性或密度发现 group structure
- Anomaly detection：发现少数且不同的对象
- Association pattern mining：发现频繁共现模式
- 大多数算法默认输入是 multidimensional i.i.d. records
- 对 graph、spatial、time series 等复杂对象，需要先做 feature representation 或定义合适的 similarity/kernel

# W5 Workshop

This workshop mainly reviews **anomaly detection** and extends the idea of **distributional kernels** to complex data objects such as groups, trajectories, and time series.

## Density-based Anomalies

### Def Density-based Anomalies

Density-based anomalies are instances located in regions of **low density** or **low local/relative density**.

Typical methods:

- **KDE (Kernel Density Estimator)**：估计每个点附近的概率密度
- **LOF (Local Outlier Factor)**：比较一个点和其邻居的局部密度
- **Nearest-neighbor anomaly detection**：看一个点离最近邻或第 $k$ 近邻有多远

> Density-based 方法的核心假设是：正常点位于高密度区域，异常点位于低密度区域。

## Data-independent Distance / Similarity

Data-independent distance or similarity measures are purely based on the **geometric positions** of points in the input space, independent of the data distribution.

Examples:

$$
d_p(x,y)=\left(\sum_{i=1}^{d}|x_i-y_i|^p\right)^{1/p}
$$

$$
cosine(X_1,X_2)=\frac{\langle X_1,X_2\rangle}{\|X_1\|\|X_2\|}
$$

> 这类距离只看点之间的几何差异，不看数据分布。问题是：在不同密度区域中，相同的几何距离不一定代表相同的异常程度。

## Workshop Discussion 1

**Dataset: three Gaussian distributions with increasing densities. Explain how KDE and iForest detect anomalies in this dataset.**

> **KDE:** KDE estimates the density around each point. Points in low estimated density regions receive low density scores and are treated as anomalies. In a dataset with clusters of different densities, KDE may regard points in the sparse Gaussian cluster as more anomalous, even if they are normal within that cluster.
>
> **iForest:** iForest isolates points by random partitioning. Points that are few and different are isolated with shorter path lengths and therefore receive higher anomaly scores. In sparse regions, points are easier to isolate, so iForest may also assign higher anomaly scores to points in low-density clusters.

中文说明：

- KDE：直接估计密度，低密度就是异常
- iForest：随机切分，容易被隔离就是异常
- 如果三个 Gaussian 的密度逐渐增大，稀疏簇里的正常点可能被当作异常，因为它们局部密度低、隔离路径短

**Key limitation:**

> Both KDE and iForest may be affected by varying densities. A point in a sparse but legitimate cluster may be incorrectly treated as anomalous.

## IDK for Point Anomaly Detection

### Def IDK Method

IDK uses **Isolation Distributional Kernel** to measure the similarity between each point and the reference dataset distribution $P_D$.

For a point $x$, treat it as a Dirac distribution $\delta(x)$ and compute:

$$
\widehat{K}_I(\delta(x),P_D)
$$

Decision rule:

- High similarity with $P_D$ → likely normal
- Low similarity with $P_D$ → likely anomaly

> IDK 不是只看点到点的几何距离，而是看“这个点作为一个单点分布，和整体数据分布有多相似”。相似度低的点就是异常。

## Workshop Discussion 2

**1. Explain how IDK detects anomalies in the three-Gaussian dataset.**

> IDK detects anomalies by comparing each point's Dirac distribution with the reference data distribution. Because the isolation kernel is data-dependent, similarity is affected by the density structure of the data. Points that are not well supported by the overall distribution have low IDK similarity and are detected as anomalies.

中文说明：

IDK 的关键是 **data-dependent similarity**。它不只是问“这个点离其他点远不远”，而是问“这个点是否像是从整体数据分布中生成的”。因此 IDK 对不同密度结构更敏感，也比单纯几何距离更适合复杂分布。

**2. What if the dataset has three Gaussian distributions of the same variance?**

> If the three Gaussian distributions have the same variance and similar density, density imbalance becomes less severe. KDE, iForest, and IDK are less likely to confuse a sparse normal cluster with anomalies. The main anomalies would be points far from all Gaussian components or points lying in very low-probability regions.

中文说明：

如果三个 Gaussian 方差相同，密度差异变小，KDE/iForest 因“稀疏簇”误判的风险降低。此时真正异常的点更可能是远离所有 Gaussian 成分的点。

**3. Explain the key differences and similarities between IDK and KDE/iForest.**

> **Similarities:** All three methods can be used for unsupervised anomaly detection and assign each point an anomaly score without requiring class labels.
>
> **Differences:** KDE estimates probability density directly using a kernel density estimator. iForest measures how easily a point can be isolated by random partitions. IDK measures the similarity between a point distribution and the reference data distribution using a data-dependent isolation kernel.

中文说明：

| Method | Core idea | Score meaning |
| --- | --- | --- |
| KDE | Estimate density | Low density = anomaly |
| iForest | Random isolation | Short path = anomaly |
| IDK | Distributional similarity | Low similarity to $P_D$ = anomaly |

**背诵版：**

> KDE is density-estimation based, iForest is isolation based, and IDK is distributional-similarity based. They are all unsupervised anomaly detectors, but they define abnormality using different principles.

## Group Anomaly Detection

### Def Group Anomaly Detection

Group anomaly detection aims to detect anomalous **groups of data points** in an unsupervised setting.

The key question is:

> Are two groups of data points generated from the same distribution or from different distributions?

Examples:

- 一组用户行为是否异常
- 一条 trajectory 是否与其他 trajectories 分布不同
- 一个 time-series subsequence 是否来自异常模式

### IDK for Group Anomaly Detection

IDK can be used at two levels:

1. **Level-1 IDK:** maps individual points into an isolation-kernel feature space
2. **Level-2 IDK:** maps each group distribution into a point in a Hilbert space, then compares groups

> Point anomaly detection 判断“一个点是否不像整体分布”；group anomaly detection 判断“一组点形成的分布是否不像其他组的分布”。

## Workshop Discussion 3

**What is group anomaly detection, and why do we need distributional measures?**

> Group anomaly detection identifies groups whose underlying data distribution is different from the majority of groups. We need distributional measures because a group is not a single point; it is a set or distribution of points. Therefore, comparing groups requires comparing distributions rather than only comparing individual points.

中文说明：

普通 anomaly detection 的对象是单个点；group anomaly detection 的对象是一组点。比如一条轨迹由很多采样点组成，一段时间序列由很多 timestamp 组成。此时只比较单个点不够，需要比较“整组点的分布”。

## Trajectory Anomaly Detection

### Commonly Used Trajectory Distances

常见 trajectory distance：

- **Hausdorff distance**
- **DTW (Dynamic Time Warping) distance**
- **Frechet distance**

这些距离通常试图比较两条轨迹的形状、位置或匹配关系。

### Workshop Discussion 4

**How can you use iForest, nearest-neighbor detector, or LOF to detect anomalous trajectories in a dataset of trajectories?**

> To use standard anomaly detectors on trajectories, we first need to represent each trajectory as a feature vector or define a trajectory-level distance. For iForest, trajectories can be converted into fixed-length feature vectors, such as length, speed statistics, turning angles, spatial coverage, or learned embeddings. For nearest-neighbor and LOF detectors, we can define a distance between trajectories, such as Hausdorff, DTW, or Frechet distance, and then detect trajectories that are far from their neighbors or have low local density.

中文说明：

这些算法本来处理的是固定维度 records，但 trajectory 是复杂对象。因此有两种做法：

- **Feature representation**：把轨迹变成固定维度向量，再用 iForest
- **Distance representation**：定义轨迹之间的距离，再用 NN/LOF

**背诵版：**

> We cannot directly apply point-based anomaly detectors to raw trajectories. We must either extract fixed-dimensional trajectory features or define a trajectory distance, then apply iForest, nearest-neighbor detection, or LOF on the transformed representation.

## Distributional vs Non-distributional Measures

### Point-to-point Distance vs Distribution-based Kernel

Point-to-point based distances compare objects by matching individual points.

Problems:

- Sensitive to noise
- Sensitive to misalignment
- Often require expensive alignment methods such as DTW or SBD
- May not have the uniqueness property for distributions

Distribution-based kernels compare the underlying distributions of objects.

Advantages:

- More robust to noise
- Fewer alignment issues
- Can compare groups, trajectories, and subsequences as distributions
- IDK provides a more efficient distributional measure

> Non-distributional measures 问的是“点如何匹配点”；distributional measures 问的是“两个对象是否来自相似分布”。

## Time Series Anomaly Detection

### Measures for Time Series

Current time-series measures are usually in either the **time domain** or **frequency domain**.

Main issue:

> They are sensitive to misalignment between subsequences.

Common remedies:

- **DTW (Dynamic Time Warping)**
- **SBD (Shape-based distance)**

Root cause:

> These methods rely on point-to-point distance, which causes high computational cost and alignment sensitivity.

### Distance-based Time Series Anomaly Detectors

**STOMP**

> STOMP computes z-normalized Euclidean distances between all subsequences extracted from a time series and their nearest neighbors. A subsequence is anomalous if its nearest-neighbor distance is large.

**NormA**

> NormA builds a normal model using mean vectors of clusters of subsequences. A subsequence is anomalous if it is far from the learned normal model.

中文说明：

- STOMP：找每个 subsequence 最近的类似片段；找不到相似邻居 → 异常
- NormA：先学习 normal subsequence clusters；离 normal model 远 → 异常

## Workshop Discussion 5

**1. Summarize the key approach used by STOMP and NormA to detect anomalies.**

> STOMP detects anomalous subsequences by computing nearest-neighbor distances among all z-normalized subsequences. A subsequence with a large nearest-neighbor distance is considered anomalous. NormA detects anomalies by learning a normal model from clusters of subsequences and then identifying subsequences that are far from this model.

中文说明：

两者都是 subsequence anomaly detection，但方式略有不同：

| Method | Key approach | Anomaly criterion |
| --- | --- | --- |
| STOMP | nearest-neighbor distance among subsequences | far from nearest neighbor |
| NormA | normal model from subsequence clusters | far from normal model |

**2. Explain the key differences between IDK and STOMP/NormA.**

> STOMP and NormA are based on point-to-point distances between subsequences, so they are sensitive to misalignment and may require expensive distance computation. IDK treats subsequences as distributions and compares them using a distributional kernel. Therefore, IDK is more robust to noise and alignment issues and can be computationally more efficient.

中文说明：

STOMP/NormA 的核心还是 Euclidean/point-to-point matching；IDK 的核心是 distributional similarity。前者容易受错位、噪声影响，后者更关注 subsequence 的整体分布结构。

## Workshop Final Reflection

**1. What is the commonly used approach to anomaly detection?**

> The commonly used approach is to define a score that measures how unusual an object is, based on density, distance, nearest neighbors, isolation, or similarity to a normal/reference distribution. Objects with high anomaly scores or low normality scores are detected as anomalies.

中文说明：

常规思路就是：给每个对象一个 abnormality score。分数来源可以是低密度、远离邻居、容易隔离、或不像参考分布。

**2. How does IDK differ from the above approaches?**

> IDK differs because it uses a data-dependent distributional kernel. Instead of relying only on point-to-point distance, density estimation, or isolation path length, it measures the similarity between a point or group distribution and the reference data distribution.

中文说明：

IDK 把 anomaly detection 从“点对点距离/密度/隔离长度”转成“分布相似度”问题。

**3. How does IDK differ from Isolation Forest?**

> Isolation Forest uses random isolation trees and detects anomalies through short average path lengths. IDK also uses the isolation idea, but it converts isolation partitions into a kernel feature map and measures similarity between distributions. Therefore, iForest is an isolation-based detector, while IDK is a distributional-kernel method.

中文说明：

iForest 输出的是路径长度；IDK 输出的是 kernel similarity。二者都用 isolation 思想，但目标不同。

**4. How does IDK differ from IK?**

> IK is a point-to-point kernel that measures similarity between two points using isolation partitions. IDK extends this idea to distributions through kernel mean embedding, so it can compare a point distribution with a dataset distribution or compare two groups of points.

中文说明：

IK 比较点和点；IDK 比较分布和分布。IDK 可以处理 point anomaly，也可以处理 group anomaly。

**5. What are the key messages of this workshop?**

> The key message is that many anomaly detection methods rely on point-to-point distance, density estimation, or isolation. These approaches can struggle with varying density, noise, misalignment, and complex objects. Distributional kernels, especially IDK, provide a way to compare points, groups, trajectories, and time-series subsequences through their underlying distributions.

中文说明：

Workshop 的主线：

- 传统 anomaly detection：distance / density / isolation
- 复杂对象：group、trajectory、time series 不能直接当普通点处理
- point-to-point distance 容易受噪声和错位影响
- distributional measure 更适合比较复杂对象
- IDK = isolation idea + distributional kernel，是本 workshop 的重点
