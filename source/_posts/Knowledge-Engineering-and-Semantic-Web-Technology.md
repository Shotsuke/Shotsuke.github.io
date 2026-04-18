---
title: 知识工程及语义网技术 <Knowledge engineering and semantic web technology>
date: 2026-03-03 16:00:00
categories: "Course Notes"
tags: 
	- Note
    - Course
    - Knowledge Graph
excerpt: 南京大学2026春，知识工程及语义网技术笔记。
---

10% 出勤 + 40% 研讨（总共两次） + 50% 课程报告

内容：
- 经典知识工程简介
- 万维网、语义网、本体工程
- XML、RDF(S)、OWL
- 本体构建
- 存储与检索
- 逻辑与推理
- 语义搜索
- 知识融合
- 知识问答
- 大语言模型

感觉可以直接懒完，研讨、报告按自己和 AI 的来就行，极致水课。

## Paper Note: Improving Distantly-Supervised Relation Extraction with Joint Label Embedding

> 这篇论文是你小组报告最可能用到的那篇。它的核心不是“再做一个 relation extractor”，而是想办法把 **relation label 的结构信息** 利用起来，减少 distant supervision 里的噪声。

### 1. Problem Setup

**Task: Distantly-Supervised Relation Extraction (DSRE)**

Given an entity pair $(e_1, e_2)$, collect all sentences mentioning this pair as a **bag**. The bag is assigned a distant supervision label from a knowledge base if $(e_1, e_2)$ is linked by a relation in the KB.

> 问题是：一个 entity pair 对应的 bag 里，只有少数句子真的表达了这个关系，大量句子其实是噪声。  
> 所以 DSRE 的核心困难不是“有没有标签”，而是“标签很 noisy”。

### 2. Why Existing Methods Are Not Enough

Common DSRE models usually use sentence-level attention or bag-level attention to select useful instances, but they still treat relation labels as simple class IDs.

This paper argues that relation labels have **semantic structure**:

- some relations are semantically close
- some relations are inverse or correlated
- KB facts and textual descriptions can provide extra supervision

> 也就是说，relation label 不是一个纯离散编号。  
> 它本身可以嵌入到向量空间里，和句子表示一起做匹配。

### 3. Main Idea

The paper proposes **joint label embedding**.

The model uses two kinds of label information:

1. **Knowledge graph information**
   - relation embeddings learned from triples
2. **Textual label description information**
   - relation descriptions encoded from text

Then these two sources are fused into a **joint label representation**.

> 直觉上：  
> - KG gives structural semantics  
> - description gives textual semantics  
> - joint embedding gives a richer label space for attention and classification

### 4. Model Understanding

#### 4.1 Label Embedding

The paper learns a label vector for each relation.

One way to understand it:

- each relation has a KG-based embedding
- each relation also has a description-based embedding
- the model combines them into a final relation embedding

> 这一步的意义是：让 label 之间“有距离感”。  
> 比如两个相近关系在向量空间里也应该更接近，而不是完全独立的 one-hot 类别。

#### 4.2 Label-Driven Attention

The label embedding is then used to guide attention over sentences in a bag.

For a bag of sentences:

- encode each sentence into a vector
- compare each sentence vector with the relation label embedding
- give higher attention to sentences more compatible with the label

> 这比普通 bag attention 更强的地方在于：  
> attention 的依据不只是“句子本身像不像中心语义”，还包括“它像不像当前关系标签”。

#### 4.3 Joint Use of KG and Description

The paper’s key trick is to combine:

- structural relation semantics from KG
- textual relation semantics from descriptions

This helps when either source alone is incomplete.

> KG 里有结构，但不一定有充分的文本解释。  
> 描述有语义，但可能不够精确。  
> 联合起来更稳。

### 5. Why It Helps in DSRE

DSRE has two noise sources:

1. **instance noise**
   - many sentences in a bag do not express the target relation
2. **label noise / ambiguity**
   - distant supervision labels are only weakly aligned with sentence semantics

Joint label embedding helps both:

- better label representation reduces label ambiguity
- label-guided attention reduces instance noise

> 所以它不是只改 encoder，而是在“标签侧”也做了建模。  
> 这是这篇论文最值得讲的点。

### 6. What to Emphasize in Group Report

If you present this paper, the most important storyline is:

1. DSRE is noisy because labels come from KB alignment, not manual annotation
2. Standard attention only filters sentence noise, but ignores label semantics
3. This paper builds a richer label space using KG and descriptions
4. Joint label embeddings are then used to guide instance selection and classification
5. The final effect is cleaner attention and better relation extraction

### 7. My Reading Notes

- **`distant supervision`** means labels are weak and noisy
- **`bag`** means one entity pair with multiple sentences
- **`joint label embedding`** means label semantics from multiple sources are fused
- **`attention`** is used to select sentences that are more likely to express the target relation
- The paper is useful for a report because it shows how **knowledge graph information can improve text mining**

### 8. Discussion

**1. Why does distant supervision introduce noise?**

> Because the KB relation is assigned to all sentences mentioning the entity pair, even though only some of them actually express that relation.

中文说明：

这是 DSRE 的根本问题。实体对有某个关系，不代表每一句提到这对实体的句子都真的在表达这个关系。

**2. What is the benefit of joint label embedding?**

> It captures semantic similarity between relations and provides richer supervision than a one-hot label id.

中文说明：

one-hot 标签是“互相独立”的；joint label embedding 会把标签放进向量空间，表达相似关系之间的结构。

**3. Why use both KG and textual descriptions?**

> They are complementary. KG gives structural relation knowledge, while descriptions give textual semantics. Combining them makes the label representation more complete.

中文说明：

结构知识和文本知识互补。单看 KG 可能稀疏，单看描述可能不精确，合起来更稳。

**4. What is the key difference between sentence-level attention and label-guided attention?**

> Sentence-level attention focuses on selecting useful instances in a bag, while label-guided attention additionally uses label semantics to decide which sentence best matches the target relation.

中文说明：

普通 attention 更像“找代表句”；label-guided attention 更像“找最像当前标签的句子”。

**5. One-sentence summary**

> This paper improves distant supervision relation extraction by learning joint embeddings for relation labels from KG and descriptions, and then using them to guide attention and reduce noise.

### 9. Group Report Outline

If you present this paper as a group report, a clean structure is:

1. **Title and task definition**
   - Introduce distant supervision relation extraction
   - Explain what a bag is
   - State the main noise problem

2. **Motivation**
   - Why DSRE is noisy
   - Why sentence-level attention is not enough
   - Why label semantics should matter

3. **Related work**
   - Early DSRE with distant supervision
   - Multi-instance learning methods
   - Neural attention-based methods
   - Methods using external information such as KG or descriptions

4. **Core idea of the paper**
   - Relation labels are not just IDs
   - Learn joint label embeddings from KG and descriptions
   - Use label embeddings to guide attention

5. **Model overview**
   - Sentence encoder
   - Label embedding construction
   - Label-guided attention
   - Joint representation for classification

6. **Why it works**
   - Better label semantics
   - Cleaner sentence selection
   - Less instance noise and label ambiguity

7. **Experiments**
   - Compare with CNN+ATT, APCNN+D, JointD+KATT, RESIDE
   - Show that RELE performs better
   - Mention that the improvement comes from stronger label embedding and better attention

8. **Takeaway**
   - The main contribution is not only a better encoder, but a better way to use label information
   - This is a useful idea for combining knowledge graph information and text mining

### Report Speaking Order

If you need a simple speaking script, use this order:

1. What is DSRE?
2. Why is DSRE hard?
3. What do existing methods do?
4. What do they miss?
5. What does this paper propose?
6. How does the model work?
7. Why is it better?
8. What is the final takeaway?
