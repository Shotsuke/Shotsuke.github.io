---
title: Dinitz' Algorithm The Original Version and Even's Version
date: 2024-04-17 20:00:00
categories: "Paper Notes"
tags: 
    - Graph Theorem and Algorithms
    - Read Paper
    - Note
---

# [Dinitz' Algorithm: The Original Version and Even's Version](https://doi.org/10.1007/11685654_10)

## 1. What is and Why use Dinitz' Algorithm

在我们使用朴素的不断寻找增广路的算法（见 图论与算法 < Graph Theory and Algorithms > Ford-Fulkerson Algorithm），可能会对某些边计算反向时重复多次。故引入Dinitz算法来加速。

## 2. The Origin Dinitz' Algorithm

### Main Body and Example

![Main Body of Dinitz'z Algorithm](\../imgs/Graph-Theory-and-Algorithms/Main%20Body%20of%20Dinitz'z%20Algorithm.png)

- (a) 初始图$G$（边容量未画出）
- (b) 从源点$s$开始的一棵BFS树，其中有一条从$s$到$t$的路径已经被粗体标注。约定被饱和的边以打叉表示。
- (c) 将(b)中的BFS树进行扩充。与初始图相比，我们仅仅需要与源点$s$距离（之后也称为深度）不同顶点之间的弧，而不关心所有深度相同点之间的弧。记$V\_0 = \\{ s \\}$，$V\_i$表示所有与源点距离$i$的点，$E\_i$表示所有从$V\_\{i-1\}$到$V_i$的弧。定义$L(s) = (\cup\{V\_i\} , \cup\{E\_i\})$。
- (d) 我们并不关心与$t$同层次的点以及层次更深的其他点，那会在之后的阶段中关心，因此可以将$L(s)$精简为$\hat{L}(s,t)$。$\hat{L}(s,t)$仅仅包含$l$层，其中$l$为从$s$到$t$的距离，称为$\hat{L}(s,t)$的长度，同时记$\hat{L} = \hat{L}(s,t)$，并称为分层子图。这个精简是简单的，只需要从$t$反向做一次BFS即可。在这之后运行$PathFinding$得到一条从源点到汇点的路径。
  - $PathFinding$：从汇点$t$开始，不断地寻找入边，直到回到源点$s$，返回这条路径。
  - 在这个例子中我们假定有两条边被饱和了。对于分层子图有：
    - $V\_i = \\{t\\}$
    - 所有$\hat{V}\_i$中的点均满足：离源点距离$i$，离汇点距离$l-i$
    - 分层子图$\hat{L}$是所有能够形成从源点到汇点最短路的点和弧的集合
    - 不存在“死胡同”：除源点外，没有点没有入边；除汇点外，没有点没有出边
- (e) 移除饱和弧
- (f) 在移除（可能不止一条）弧后，需要执行清理$Cleaning$操作，将不在需要的点与边从分层子图中移除。在这个例子中，$RightPass$检测到死点$a$，将其和其所连弧移除。
  - $Cleaning$：维护所有已饱和边$Sat$，初始化$Q^l = Q^r = Sat$。然后不断地执行$RightPass$和$LeftPass$直至两个队列均为空，顺序无关。我们不妨约定将源点摆在我们的最左手边，而汇点摆在最右手边，其余点按照深度的增加从左向右排列。
  - $RightPass$：对于任意边（其实就是弧）$e \in Q^r$，如果它的右手点没有入边，那么将其和它的所有出边删除，并将这些边入队$Q^r$
  - $LeftPass$：对于任意边（其实就是弧）$e \in Q^l$，如果它的左手点没有出边，那么将其和它的所有入边删除，并将这些边入队$Q^l$
- (g) 可见(f)中的分层子图已经不连通了，体现在进行DFS时报告流量为0，因此需要重新生成分层子图。类似的继续执行DFS进行路径搜索，在例子中我们找到了一条长度为4的路径，并且饱和了一条弧。虚线框中的两个点位于相同深度。依照惯例执行$Cleaning$，我们将点$a$以及其所有出边删除，然后将这条路对应的补强流量加到答案流量中。
- (h) 在当前的分层子图中，DFS报告流量不为0，因此重复类似操作。
- (i) 在最开始的时候，Dinitz假定如果两点之间没有弧，那么添加一条拥有0容量的弧来补全，这显然是不影响最终输出的。在剩余网络$G\_f$中，从源点执行的BFS无法到达汇点，因此算法结束。

### Pseudocode

```pseudocode
The Original Dinitz Algorithm
Input:
    a flow network G =(V,E,c,s,t),
    a feasible flow f, in G (equal to zero, by default).
/* Phase Loop:*/
    dowhile
    begin
        Build ˆL(s,t) in Gf, using the extended BFS;
        if ˆL(s, t) = ∅ then return f
        else ˆL ← ˆL(s,t);
        /* Iteration Loop:*/
        while ˆL is not empty do
        /*Iteration Invariant: ˆL is the union of all shortest augmenting paths*/
        begin
            P ← PathFinding(ˆL);
            Sat ← FlowChange(P);
            /* Cleaning(ˆL): */
            begin
                Removal of edges in Sat;
                Qr,Ql ← Sat;
                RightPass(Qr);
                LeftPass(Ql);
            end;
        end;
    end;
```

### Summary

- DA consists of phases. Each one contains iterations changing the flow using shortest augmenting paths of a fixed length, $l$.
- At the beginning of each phase, the extended BFS builds in $O(|E|)$ time a layered network data structure, $\hat{L}$, of length $l$. The layered network is constantly maintained during the phase as the union of all shortest augmenting paths of length $l$, until it vanishes, in total time $O(|E|)$.
- The layered structure of $\hat{L}$ and absence of dead-ends in it allow for the execution of every iteration of FF in $O(l)=O(|V|)$time.
- The layered network is strictly pruned after each iteration of $FF$. Therefore, the number of iterations at each phase is bounded by $|E|$.
- When the layered network vanishes, there isnoaugmentingpathof length lesser than or equal to $l$, w.r.t the current flow. Hence, the length of the next layered network, equal to the length of the currently shortest augmenting path, is strictly greater than $l$.
- Since the length of $\hat{L}$ grows from phase to phase, there are at most $|V| − 1$ phases.
- When DA stops, the current flow is maximum.
- The running time of DA is $O(|V|^2|E|)$.

## 3. The Version of Shimon Even and Alon Itai

对于原始版本的优化有很多：
- 使用两端分层网络$\hat{L}(s,t)$是一种奢侈；单端分层网络$L(s)$就足够了。
- 分层网络在$s$方向上（即从左往右）应该没有死胡同（即没有传入边），而在$t$方向上（即从右往左）存在死胡同也没有什么坏处。因此，DA可以切换到由$L(s)$初始化的分层网络$L$。
- $L(s)$的构建可以在完成第$l$层时停止。
- DA只可能去除$s$方向上的死角，也就是说，在$Cleaning$时，仅执行$RightPass(Q^r)$就足够了。
- $L(s)$的原始属性（即从$s$到所有可到达的顶点的所有最短路径的并集）**不会**被这种维护所保留。然而，这对于DA来说并不是必需的，因为它仅使用到$t$的最短路径。此时的$L$实际上的不变式是包含所有的增广路（不是它们的并集），同时不存在更短的增广路。

Even和Itai承认$L$中两个方向都有死胡同；因此，他们取消了$Cleaning$并放弃使用$PathFinding$。他们提出了另一种寻找增广路的方法：以DFS为模板，去除其遇到的死胡同。
DFS开始从$s$构建一条路径，从一层到下一层逐弧递增。这种路径构建要么在到达$t$（成功）时停止，要么在另一个死胡同处停止。在后一种情况下，DFS 回溯到通向该死胡同的弧的尾部，同时将该弧视为无用而从$L$中删除（即不包含在$L$中的从$s$到$t$的任何路径中）。之后，DFS继续如上所述，在可能的情况下增加当前路径，否则回溯并删除$L$中的最后一条弧。当DFS位于$s$并且没有出边可以离开时（表明该阶段已完成）或到达$t$时，此过程结束。在后一种情况下，DFS构建了一条增广路径。然后，沿着该路径执行流量变化，同时从$L$中移除其已饱和的所有弧：显然至少有一个这样的弧。

## 4. Implementation of DA by Cherkassky

```pseudocode
/* Input:*/
    a flow network G = (V, E, c, s, t),
    a feasible flow f, in G (equal to zero, by default).
Initialization:
    compute ∀e ∈ E : c_f(e) = c(e) − f(e);
/* Phase Loop:*/
    dowhile
    begin
        compute ∀v ∈ V : rank(v)=dist(v,t),
        by BFS from t on edges with c_f > 0,
        in the inverse edge direction;
        if rank(s) = ∞ then
        begin
            f ← c − c_f;
            return f;
            /*此处的c - c_f指的是围着源点或者汇点的那一圈弧*/
        end;
        while DFS from s do
        begin
            /∗ P denotes the current path
            and x the current vertex of DFS ∗/
            any edge (x,y) s.t. c_f(x,y) = 0
            or rank(y) != rank(x) − 1 is skipped;
            if x = t then
            begin
                ϵ ← min{c_f(e) : e ∈ P};
                for edges (v, u) of P, from t downto s do
                begin
                    c_f(v, u) ← c_f(v, u) − ϵ;
                    c_f(u, v) ← c_f(u, v) + ϵ;
                    if c_f(u, v) = 0 then x ← u;
                end;
                /∗ continue DFS from x ∗/
            end;
        end;
    end;
```

## Other: 适用于实际编写算法的伪代码

```pseudocode
Input: G = <V , A , c , s , t>
Output: The max flow in G from s to t
Dinitz:
    res := 0
    while bfs() do:
        while flow := dfs(s , curflow) do:
            res ← res + flow
    return res

bfs():
    q.clear()
    q.push(s)
    depth.clear()
    depth[s] ← 1

    do:
        u := q.front()
        q.pop()
        foreach <u , v> in A do:
            if r(<u , v>) > 0 and depth[v] is 0 do:
                depth[v] ← depth[u] + 1
                q.push(v)
    while q is not empty

    if depth[t] is 0
        return false
    return true

dfs(u , curflow):
    if u is t
        return curflow
    foreach <u , v> in A do:
        if depth[v] is depth[u] + 1 and r[v] is not 0 do:
            nextflow := dfs(v , min(curflow , r(<u , v>)))
            if nextflow is not 0 do:
                reduce reversed edge weight
                add upright edge weight
                return nextflow // transmit to upper level
    return 0
```

为什么我在我的生日前还要看论文、写Lab和复习期中考（碎碎念）