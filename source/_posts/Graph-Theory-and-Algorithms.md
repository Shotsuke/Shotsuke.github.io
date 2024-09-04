---
title: 图论与算法 <Graph Theory and Algorithms>
date: 2024-03-05 16:39:52
categories: "Course Notes"
tags: 
    - Note
    - Graph Theorem and Algorithms
excerpt: 南京大学2024春，图论笔记，算法解释，理论与代码。
---

# 数据结构

## 邻接表

```C++
vector<int> e[MAXN];
// Or int vertices[MAXN][MAXN]

signed main()
{
    for (int u, v; t; --t)
    {
        cin >> u >> v;
        e[u].push_back(v);
    }
}
```

## 链式前向星

```C++
class edge
{
public:
    int to;
    int net;
    long long val;
} e[MAXM];

inline void addEdge(int u, int v, long long w)
{
    e[++tot].to = v;
    e[tot].val = w;
    e[tot].net = head[u];
    head[u] = tot;
    // Reversed Edge: Use x ^ 1 to visited another.
    e[++tot].to = u;
    e[tot].val = 0;
    e[tot].net = head[v];
    head[v] = tot;
}

signed main()
{
    for (int i = 1, u, v, w; i <= m; ++i)
    {
        cin >> u >> v >> w;
        if (!flag[u][v])
        {
            addEdge(u, v, w);
            flag[u][v] = tot;
        }
        else
        {
            e[flag[u][v] - 1].val += w;
        }
    }
}
```


# 算法、伪代码与笔记 <Algorithm & Pseudocode & Notes>

## Ch2: Connection

### Cut Vertices

#### Tarjan Algorithm

若**u.isCutVertex**为真，那么u就是一个割点。
```pseudocode
Input: G = <V , E> and a vertex u
Output: Each vertex's isCutVertex member
DFSCV(G , u):
    time ← time + 1
    u.d ← time
    u.low ← u.d
    u.visited ← true

    foreach (u , v) in E do:
        if v.visited = false do:
            v.parent ← u
            u.children ← u.children + 1
            DFSCV(G , v)
            u.low ← MIN{u.low , v.low}
            if u.parent = nullptr and u.children >= 2 do:
                u.isCutVertex ← true
            elseif u.parent != nullptr and v.low >= u.d do:
                u.isCutVertex ← true
        elseif v != u.parent do:
            u.low ← MIN{u.low , v.d}
```

### Cut Edge

#### Tarjan Algorithm

算法与**Cut Vertex: Tarjan**相近,将**v.low >= u.d**改为**v.low > u.d**即可完成算法。
我们甚至不需要去考虑v是否为根节点的情况。

若**u.isCutEdge**为真，那么 **(u , u.parent)** 是一个桥。

```pseudocode
Input: G = <V , E> and a vertex u
Output: Each vertex's isCutEdge member
DFSCE(G , u):
    time ← time + 1
    u.d ← time
    u.low ← u.d
    u.visited ← true

    foreach (u , v) in E do:
        if v.visited = false do:
            v.parent ← u
            u.children ← u.children + 1
            DFSCV(G , v)
            u.low ← MIN{u.low , v.low}
            if u.parent = nullptr and v.low > u.d do:
                u.isCutEdge ← true
        elseif v != u.parent do:
            u.low ← MIN{u.low , v.d}
```

## Ch3: Circle

### Eulerian Trail/Circuit:

#### Fleury Algorithm

Fleury算法优先选择不是割边的边进行遍历。
```pseudocode
Input: G = <V , E> 
Output: The vertices of the eulerian trail of the G
Fleury():
    if exists a v in V with odd degree do:
        u := v
    else do:
        u := any vertex v in V not isolated
    trail.push(u)
    while u != isolated do:
        if u is in e* and e* != a bridge do:
            e := e*
        else do:
            e := any edge u connecting
        u ← another vertex in e
        trail.push(u)
        E ← E - e
    return trail
```
但是有个不是很显然的问题是，先使用Tarjan算法处理桥边，然后直接使用Fleury算法进行欧拉迹的处理，但是在Fleury算法的过程中会删去一些边，可能会导致原先的非桥边变成桥边。一个可行但是比较暴力的想法是在删去任何边之后立刻重新进行一次Tarjan算法以更新所有的桥边。

#### Hierholzer Algorithm

为驱动这个函数，我们可以选择图中的任意一点。
如果这个图不包含任何欧拉回路，但是包含一条欧拉迹，
那么选取一个奇度点作为起始即可。
```pseudocode
Input: G = <V , E>
Output: The vertices of the eulerian trail of the G.
Hierholzer(u):
    circuit ← find a circuit in E begin with u
    if circuit is empty do:
        return u
    E ← E - circuit
    foreach v in circuit do:
        v ← Hierholzer(v)
    return circuit
```

但是，这份伪代码~~过分~~简洁了，以至于甚至第一眼看不出来如何实现。
以下是较为直白的版本：

```pseudocode
Input: G = <V , E>
Output: The vertices of the eulerian trail of the G.
DFS(u , circuit):
    foreach v is adjacent to u do:
        E ← E - (u , v)
        DFS(v , circuit)
    circuit.push(u)

Hierholzer():
    if exists a vertex v with odd degree
        u := v
    else
        u := any vertex v in V
    DFS(u , circuit)
    return circuit
```

## Ch4: Connectivity

### Block
~~~pseudocode
Input: G = <V , E>
Output: Each block of G
DFSBlk(G , u):
    time ← time + 1
    u.d ← time
    u.low ← u.d
    u.visited = true
    foreach (u , v) in E do:
        if v.visited = false do:
            blkStack.push((u , v))
            v.parent ← u
            u.children ← u.children + 1
            DFSBlk(G , v)
            u.low ← MIN{u.low , v.low}
            if u.parent = nullptr and u.children >= 2 or
                u.parent != nullptr and v.low >= u.d do:
                blkNum++
                do:
                    (x , y) := blkStack.top()
                    blk[blkNum].push((x , y))
                    blkStack.pop()
                while (x , y) != (u , v)
        elseif v != u.parent do:
            if u.d > v.d do:
                blkStack.push((u , v))
            u.low ← MIN{u.low , v.d}

GetBlk(G , u):
    DFSBlk(G , u)
    if blkStack is not empty do:
        blkNum++
        Join blkStack to blk[blkNum]
    return blk
~~~

## Ch5: Matching

### Max Matching

#### Hungarian Algorithm

核心思想：从空集匹配M出发，不断寻找不被M饱和的交错路，并以其来扩充M。
~~~pseudocode
Input: G = <X union Y , E>
Output: The max matching of G
Hungarian(G = <X union Y , E>):
    M := NULL
    do:
        foreach u in (X union Y) do:
            u.visited ← true
        foreach r in X do:
            if r.visited = true and r != saturated by M do:
                P ← DFSAP ()
                if P != NULL do:
                    M ← {e | e in P} DELTA M
                    // DELTA = symmetric difference operation
                    break
    while P != NULL
    return M

DFSAP(G = <X union Y , E> , u , M):
    u.visited ← true
    if u is not saturated by M and u is not the root of DFS tree do:
        return the path from root to u
    else do:
        foreach (u, v) in E do:
            if v.visited = false and the path
            from root to v is an alternating path of M do:
                P* ← DFSAP(G , v , M)
                if P* != NULL do:
                    return P*
    return NULL
~~~

#### Hopcroft-Karp Algorithm

不断循环尝试找一个M增广路的集合P，直到不存在增广路。
HKInit
~~~pseudocode
Input: G = <X union Y , E>
Output: The max matching of G
Hopcroft-Karp(G = <X union Y , E>):
    M := NULL
    do:
        Q ← HKInit(G , M)
        Y ← HKBFS(G , M , Q)
        P ← HKPaths(G , Y)
        foreach p in P do:
            M ← {e | e in p} DELTA M
            // DELTA = symmetric difference operation
    while P != NULL
    return M

HKInit(G = <X union Y , E> , M):
    stack Q := NULL
    foreach u in (X union Y) do:
        if u in X and u is not saturated by M do:
            u.visited ← true
            u.d ← 0
            Q.push(u)
        else do:
            u.visited ← false
            u.d ← +infty
    return Q

HKBFS(G = <X union Y , E> , M , Q):
    Y' := NULL
    d' := +infty
    while Q is not empty do:
        v ← Q.pop()
        if v.d > d' do:
            break
        elseif v is not saturated by M and v.d > 0 do:
            Y' ← Y' union {v}
            d' ← v.d
        else
            foreach (v , w) in E do:
                if not w.visited and the path
                from BFS tree root to w is an alternating path of M do:
                    w.visited ← true
                    w.d ← v.d + 1
                    Q.push(w)
    return Y'
~~~

## Ch6: Weighted Graph

### Chinese Postman Problem

#### Edmonds-Johnsun Algorithm

```pseudocode
Input: G = <V , E , w>, foreach w >= 0
Output: Min sum of postman path 
Edmonds-Johnson(G = <V , E , w>):
    EM := NULL
    V_odd := {v in V | d(v) is odd}
    E_odd := {(u , v) | u and v are both in V_odd}
    w_odd := {distance of (u , v) | u and v are both in V_odd}
    G_odd := <V_odd , E_odd , w_o>
    M := perfect matching with min weight in G_odd
    foreach (u , v) in M do:
        E* := {x | x in (u , v) path with min weight}
        E_Mul ← E_Mul union E*
    return the Eulerian circuit of <V , E union E_Mul>
```

### (Metric) Traveling Salesperson Problem

#### Christofides-Serdyukov Algorithm

```pseudocode
Input: G = <V , E , w>, w satisfies triangle inequality (Metric)
Output: The (APPROXIMATE) answer of TSP 
Christofides-Serdyukov(G = <V , E , w>):
    T := <V , E_Tree> ← the min spanning tree of G
    V_odd ← {v in V | d_Tree(v) is odd}
    M ← perfect matching with min weight in G[V_odd]
    C ← Eulerian circuit of <V , E_Tree union M>
    C ← remove duplicated  vertices in C
    return C union {start vertex of C}
```

Christofides-Serdyukov Algorithm具有$\frac{3}{2}$的近似性。

**⚠：度量旅行商问题具有$\frac{123}{122}$不可近似性，即不存在近似比为小于$\frac{123}{122}$的常数的多项式时间算法，除非$P = NP$。**

## Ch7: Directed Graph

### Max Flow in Flow Network

#### Ford-Fulkerson Algorithm

福特算法不断地在剩余网络中寻找增广路，并将其加入到最大流当中。其先减少反向边的流量，再增加正向边的流量。

```pseudocode
Input: G = <V , A , c , s , t>
Output: The max flow in the network
Ford-Fulkerson(G = <V , A , c , s , t>):
    f := 0
    while G_f includes an alternating path P do:
        r ← min r(u , v) , <u , v> is in P
        foreach <u , v> in P do:
            if <v , u> in A do:
                r' ← min{f(<v , u>) , r}
                f(<v , u>) ← f(<v , u>) - r'
                r ← r - r'
            if <u , v> in A do:
                f(<u , v>) ← f(<u , v>) + r
```

但是，FF算法~~速度太慢了~~在后世被大幅度地改进了。将FF算法使用的DFS改用为BFS可以得到EK算法，这能够显著地提升算法的速度；建立分层图以及使用其可以得到Dinitz算法（见Paper Notes: Dinitz' Algorithm The Original Version and Even's Version），显著地降低理论上的时间复杂度。另外还有[ISAP和HLPP](https://www.luogu.com/article/6qms0ux2)。


## Ch8: Independence, Covering and Dominating

**（最大）边独立集**：边的匹配集。（最大）记为$\alpha'(G)$
**（最大）点独立集**：任意两点不相邻之集。（最大）记为$\alpha(G)$
**（最大）边覆盖集**：包含所有顶点的边集。（最大）记为$\beta'(G)$
**（最大）点覆盖集**：包含所有边的点。（最大）记为$\beta(G)$
**（最小）边支配集**：补集中的每条边都与其中至少一条边相邻。（最小）记为$\gamma'(G)$
**（最小）点支配集**：补集中的每个点都与其中至少一个点相邻。（最小）记为$\gamma(G)$

### Edge Covering Set


## Ch9 Coloring

### Edge Coloring

#### Divide and Conquer Algorithm

```pseudocode
Input: Binary Graph G = <X union Y , E>
Output: Edge Coloring of G
DCEC:
    
```

#### Misra Algorithm

逐步构造一个边染色，每步染一条边，并对已经染过的边色进行必要的调整，保持所有相邻的已经染过的边的色各不同。
```pseudocode
Input: G = <V , E>
Output: Edge Coloring of G
Misra:
    while exists (u, v0) in E, ec((u, v0)) = 0 do:
        // 仍有边未染色
        v0, v1, ..., vl ← extremely max fan of u
        // v0未染色，(u, v1), ..., (u, vl)均已染色
        cl ← the color not in edges connecting vl 
        cu ← the color not in edges connecting u
        // 意图对点u所关联的一条未染色的边(u, v0)染色
        if exists vk in v0, ..., v_{l-1}, ec((u, vk)) = cl do:
            // 选择的cl颜色已经为点u所关联的边(u, vk)的颜色
            P ← the extremely max path from u, alternating through cl and cu
            foreach e in all edges in P do:
                // 转换极长路中cu和cl颜色，为意图染cl色腾出空间
                if ec(e) = cl do:
                    ec(e) ← cu
                else do:
                    ec(e) ← cl
            if P goes through v_{k-1} do:
                // 若该极长路经过vk，此时(u, vk)颜色已被转换为cu
                // 此时直接考虑整个扇的旋转即可
                vw ← vl
            else do:
                // 若极长路径不经过vk，那么将vk之前的的扇旋转即可
                vw ← v_{k-1}
        else
            vw ← vl
        foreach vi in {v1, v2, ..., vw} do:
            ec((u, v_{i-1})) ← ec((u, vi))
        ec((u, vw)) ← cl
        // 将所有的颜色传给上一条边，然后另未染色的边进行染色
```

## Chapter 10: Plane

**可平面性：**如果一个图能够在一个平面上画出。
**平面图：**图在平面上映射的图像结果
**$K\_5$, $K\_{3,3}$：**是不可平面的
**面：**平面图将平面分割出的极大相连区域，分为无限面和有限面
**面数：**面的数量，记作$\varphi(H)$。

**欧拉公式：**$v(G) - \varepsilon(G) + \varphi(H) = 2$

### Planable

#### DMP Algorithm

DMP算法逐步尝试构造图的平面图嵌入，每步尝试将当前已经映射到平面上的子图中的一个片段中的固定点之间的一条路径映射到平面上。

**片段：**若G的子图B恰由不在边集E\*但端点在顶点集V\*的一条边组成，或恰由图G - V\*的一个连通分支以及端点分别在该连通分支和V\*中的所有边组成，那么称B为G的H片段。B和H的公共顶点称为固定点。

对于2-点连通度的点G，DMP算法从G中的任意一个环开始。对于更高的连通度，将其分解为若干的块。
- 尝试加入一条路径来映射到平面上
  - 对于一个片段，只有当该片段中所有的固定点都被H中的同一个面的边界包含时，这个片段才有可能被映射到该平面上。
    - 对于能够被加入到平面图中的片段，记录其固定点能够被面包含的面
    - 如果不存在这样的面，那么这个片段就无法被映射到平面上了，因此直接输出不可
  - 检验所有的片段，选择一个能够映射到平面上的
    - 如果有片段只能够被一个面包含，那么需要先将该片段映射到平面上
    - 如果有多个这样的片段，那么随机从这些片段中选择一个
  - 将选定的片段中的任意两个固定点之间的一条路加入到对平面图的映射中
- 直到将所有的点和边映射到平面图之中。

```pseudocode
Input: Connected G = <V , E>
Output: Whether the graph G is planable
DMP: 
    H = <V* , E*> ← a random circle in G
    Map H to plane and get f0 and f1
    while H != G do:
        foreach Bi in all fragments H of G do:
            Bi.F ← NULL
            foreach fj in all surface of the plane graph of H
                if the boundary of fj saturates all attached vertices of Bi do:
                    Bi.F ← Bi.F union {fi}
            if Bi.F = NULL do:
                output: G is NOT planable
            else if |Bi.F| = 1 do:
                B ← Bi
            
        if B = NULL do:
            B ← a random fragment H of G
        P ← a random path from a random attached vertex in B to another
        f ← a random plane of B.F
        map P to f
        update V* and E*
    output G is planable
```