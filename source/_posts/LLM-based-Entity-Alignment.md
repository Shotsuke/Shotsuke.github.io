---
title: "LLM-based Entity Alignment"
date: 2025-09-23 14:40:00
categories: "Paper Notes"
tags:
    - Note
    - Paper Reading
    - LLM
    - Entity Alignment
excerpt: LLM 参与 EA 任务相关论文阅读。
---

# 1. EA 任务定义

给定两个知识图谱 $G = (E, R, A, L, T\_{att}, T\_{rel})$ 和 $G' = (E', R', A', L', T'\_{att}, T'\_{rel})$（实体集、关系集、属性集、字面量集（属性值集），属性三元组集、关系三元组集）。为源图谱 $G$ 中的每一个实体 $e \in E$，在目标图谱 $G'$ 的实体集合 $E'$ 中，找到那个与它指代现实世界中同一对象的等价实体 $e'$。

# 2. LLM-Align

**原文：**[LLM-Align: Utilizing Large Language Models for Entity Alignment in Knowledge Graphs](https://arxiv.org/abs/2412.04690)

## Stage 1. 候选实体检索

输出一个候选实体列表，可以使用 **任何现有的EA模型** 来完成这一步。核心思想是选择一个计算成本极低的方法，快速为每个源实体筛选出一个可能包含真实对齐实体列表。

## Stage 2. Attribute-based Reasoning

LLM 介入的第一轮精细过滤。此阶段只关注实体的属性（Attribute）信息。

将属性三元组转换为自然的描述性句子，要求LLM忽略关系信息，只专注于比较属性，LLM会利用其常识（如单位换算、日期格式识别）进行判断。

## Stage 3. Relation-based Reasoning

对于通过属性检查的候选对，LLM 将结合其关系（Relation）上下文进行深度语义推理。

将关系三元组转换为描述上下文和角色的句子，要求LLM综合评估这些关系所描述的生活经历、职业轨迹、社会关联等是否一致。

## Stage 4. Multi-round Voting Machanism

LLM在处理长文本时，对出现在开头和结尾的信息记忆和理解更好，而容易忽略中间部分的信息。

因此，通过随机打乱顺序，确保每个候选实体都有机会出现在提示的开头、中间和尾部，从而公平地被LLM评估。多次随机后统计最终结果，超过半数被选中的实体作为最终答案。

# 3. EasyEA

**原文：**[EasyEA: Large Language Model is All You Need in Entity Alignment Between Knowledge Graphs](https://aclanthology.org/2025.findings-acl.1080/)

很嚣张说是，**is All You Need** 都来了，和以前的 AI 期刊一样。

## Stage 1: Information Summarization

将每个实体及其对应的属性、关系分别喂给 LLM ，生成不超过 100 单词的描述。

## Stage 2. Embedding and Feature Fusion

将上一步得到的实体文本、属性总结文本、关系总结文本均使用一个嵌入模型，将三种文本转化为向量 $E_N, E_A, E_R$ 。

然后采用最简单的**拼接**策略，将三个向量连接起来，形成最终的整体实体嵌入 $E = E_N \ || \ E_A \ || \ E_R$

## Stage 3. Candidate Selection

根据上一步的向量，计算源实体与目标图谱中所有实体的整体嵌入向量之间的余弦相似度，取前十。对于每个实体，将候选集中的每个实体的名称、随机三个属性三元组和随机三个关系三元组作为上下文提供给 LLM ，此时不再需要向量，也就是说向量只是为了快速初筛。

LLM 首先尝试仅凭实体名称信息来确定目标实体。如果 LLM 认为单凭名称无法做出十足的判断，接下来参考属性三元组。如果属性信息仍不足， LLM 最后会使用关系三元组作为最终决策依据。

# 4. ChatEA

**原文：**[Unlocking the Power of Large Language Models for Entity Alignment](https://arxiv.org/abs/2402.15048)

## Entity Feature Pre-processing

使用各种模型将实体名称，实体周围的结构信息（属性，关系），时序信息分别嵌入为向量，最后将这三个向量融合为一个统一的向量表示。后续的相似度比较就基于这个向量。

## KG Input and Understanding in LLMs

>（感觉怪怪的，总觉得多此一举）

不直接把复杂的图谱数据扔给 LLM，而是将其转换成一种 **Python 类的代码格式**。LLM 对代码有很强的理解能力，这种方式能帮它更好地结构化地理解图谱信息。

为每个实体定义一个类，包含：
- `__init()`
- `get_neighbors()`, `get_relations()`, `get_temporal()`: 让 LLM 能“查询”到该实体的邻居、关系和时间信息。
- `get_description()`: 这是激活 LLM 外部知识的关键。这个函数会提示 LLM，让它根据自己的内部知识，为实体生成一段简洁的描述文本。

## Two-Stage EA Strategy in ChatEA

**第一阶段：候选实体收集 (Candidate Collecting)**

目标：快速缩小范围，提高效率。

使用第一阶段生成的实体向量，用 **CSLS 度量方法**为每个目标实体计算最相似的一些实体作为候选。

> 一定需要这个度量方法吗？能否换成其他的？
> 应当：CSLS 不是必须的，但它是一个针对任务特性的优化工具。在这个框架中，这绝对是个插件。

首先只取最相似的1个候选实体。如果后续 LLM 判断不满意，再扩大到前10个，最后到前20个。这种渐进式方法避免了从一开始就进行大量计算。

**第二阶段：推理与再思考 (Reasoning and Rethinking)**

以对话形式，让 LLM 基于 KG-Code 模块提供的信息（名称、结构、时间、自动生成的描述），对目标实体和候选实体进行多维度、分步骤的推理，并为每个候选计算一个对齐分数。

再思考：LLM 会检查推理结果。
- 如果最高分远高于其他候选，且超过置信阈值，就确认对齐。
- 如果分数很接近，或最高分没达到阈值，则判断为“不满意”，系统会自动触发第一阶段的扩大搜索（从找Top-1扩大到Top-10），然后重新进行推理。这个循环可以持续直到得到满意结果。