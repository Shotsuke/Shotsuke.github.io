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

### Dis 10

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

### Dis 11 

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

## Dis 12

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