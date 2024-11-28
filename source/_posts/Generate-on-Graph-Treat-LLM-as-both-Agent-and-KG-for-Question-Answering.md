---
title: "Generate-on-Graph: Treat LLM as both Agent and KG for Question Answering"
date: 2024-11-21 12:00:00
categories: "Paper Notes"
tags:
    - Note
    - Paper Reading
    - Generate on Graph
excerpt: 大语言模型之GoG测试。
---

论文来源：arXiv2404：[https://arxiv.org/abs/2404.14741](https://arxiv.org/abs/2404.14741)

# 论文阅读

作者提出GoG算法来为LLM添路，写的）很易懂（？整体看下来没什么大碍。

当然指的是整体的啦。🐱至于许多细节，都在源代码里，我也没有很仔细地去分析过，只是让它在win上跑了跑GoG罢了。

# 论文结果复现GoG

配置环境和导入数据库：{% post_link 'Virtuoso-on-Windows' '让Virtuoso在windows上跑起来，如果你的数据量还巨大！' %}

实际上结果差不多（难道真的敢造假吗），虽然说团队所使用的gpt-3.5-turbo-0613模型无法再被调用，然后说是可以使用qwen来替代。。。好吧差不多就行了，毕竟我的虚拟信用卡也被gpt禁了，能用qwen跑乐意至极，网速还快。