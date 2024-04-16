---
title: 图论与算法 <Graph Theory and Algorithms>
date: 2024-03-05 16:39:52
categories: "Course Notes"
tags: Course
---

# 算法与伪代码 <Algorithm & Pseudocode>

## Ch2: Connection

### Cut vertices

#### Tarjan Algorithm

若**u.isCutVertex**为真，那么u就是一个割点。
```pseudocode
Input: G = <V , E> and a vertex u
Output: Each vertex's isCutVertex member
DFSCV(G , u):
    time <- time + 1
    u.d <- time
    u.low <- u.d
    u.visited <- true

    foreach (u , v) in E do:
        if v.visited is false do:
            v.parent <- u
            u.children <- u.children + 1
            DFSCV(G , v)
            u.low <- MIN{u.low , v.low}
            if u.parent is nullptr and u.children >= 2 do:
                u.isCutVertex <- true
            elseif u.parent isn't nullptr and v.low >= u.d do:
                u.isCutVertex <- true
        elseif v isn't u.parent do:
            u.low <- MIN{u.low , v.d}
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
    time <- time + 1
    u.d <- time
    u.low <- u.d
    u.visited <- true

    foreach (u , v) in E do:
        if v.visited is false do:
            v.parent <- u
            u.children <- u.children + 1
            DFSCV(G , v)
            u.low <- MIN{u.low , v.low}
            if u.parent is nullptr and v.low > u.d do:
                u.isCutEdge <- true
        elseif v isn't u.parent do:
            u.low <- MIN{u.low , v.d}
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
    while u is not isolated do:
        if u is in e* and e* is not a bridge do:
            e := e*
        else do:
            e := any edge u connecting
        u <- another vertex in e
        trail.push(u)
        E <- E - e
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
    circuit <- find a circuit in E begin with u
    if circuit is empty do:
        return u
    E <- E - circuit
    foreach v in circuit do:
        v <- Hierholzer(v)
    return circuit
```

但是，这份伪代码~~过分~~简洁了，以至于甚至第一眼看不出来如何实现。
以下是较为直白的版本：

```pseudocode
Input: G = <V , E>
Output: The vertices of the eulerian trail of the G.
DFS(u , circuit):
    foreach v is adjacent to u do:
        E <- E - (u , v)
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
    time <- time + 1
    u.d <- time
    u.low <- u.d
    u.visited = true
    foreach (u , v) in E do:
        if v.visited is false do:
            blkStack.push((u , v))
            v.parent <- u
            u.children <- u.children + 1
            DFSBlk(G , v)
            u.low <- MIN{u.low , v.low}
            if u.parent is nullptr and u.children >= 2 or
                u.parent is not nullptr and v.low >= u.d do:
                blkNum++
                do:
                    (x , y) := blkStack.top()
                    blk[blkNum].push((x , y))
                    blkStack.pop()
                while (x , y) is not (u , v)
        elseif v is not u.parent do:
            if u.d > v.d do:
                blkStack.push((u , v))
            u.low <- MIN{u.low , v.d}

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
            u.visited <- true
        foreach r in X do:
            if r.visited is true and r is not saturated by M do:
                P <- DFSAP ()
                if P is not NULL do:
                    M <- {e | e in P} DELTA M
                    // DELTA = symmetric difference operation
                    break
    while P is not NULL
    return M

DFSAP(G = <X union Y , E> , u , M):
    u.visited <- true
    if u is not saturated by M and u is not the root of DFS tree do:
        return the path from root to u
    else do:
        foreach (u, v) in E do:
            if v.visited is false and the path
            from root to v is an alternating path of M do:
                P* <- DFSAP(G , v , M)
                if P* is not NULL do:
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
        Q <- HKInit(G , M)
        Y <- HKBFS(G , M , Q)
        P <- HKPaths(G , Y)
        foreach p in P do:
            M <- {e | e in p} DELTA M
            // DELTA = symmetric difference operation
    while P is not NULL
    return M

HKInit(G = <X union Y , E> , M):
    stack Q := NULL
    foreach u in (X union Y) do:
        if u in X and u is not saturated by M do:
            u.visited <- true
            u.d <- 0
            Q.push(u)
        else do:
            u.visited <- false
            u.d <- +infty
    return Q

HKBFS(G = <X union Y , E> , M , Q):
    Y' := NULL
    d' := +infty
    while Q is not empty do:
        v <- Q.pop()
        if v.d > d' do:
            break
        elseif v is not saturated by M and v.d > 0 do:
            Y' <- Y' union {v}
            d' <- v.d
        else
            foreach (v , w) in E do:
                if not w.visited and the path
                from BFS tree root to w is an alternating path of M do:
                    w.visited <- true
                    w.d <- v.d + 1
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
        E_Mul <- E_Mul union E*
    return the Eulerian circuit of <V , E union E_Mul>
```

### (Metric) Traveling Salesperson Problem

#### Christofides-Serdyukov Algorithm

```pseudocode
Input: G = <V , E , w>, w satisfies triangle inequality (Metric)
Output: The (APPROXIMATE) answer of TSP 
Christofides-Serdyukov(G = <V , E , w>):
    T := <V , E_Tree> <- the min spanning tree of G
    V_odd <- {v in V | d_Tree(v) is odd}
    M <- perfect matching with min weight in G[V_odd]
    C <- Eulerian circuit of <V , E_Tree union M>
    C <- remove duplicated  vertices in C
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
        r <- min r(u , v) , <u , v> is in P
        foreach <u , v> in P do:
            if <v , u> in A do:
                r' <- min{f(<v , u>) , r}
                f(<v , u>) <- f(<v , u>) - r'
                r <- r - r'
            if <u , v> in A do:
                f(<u , v>) <- f(<u , v>) + r
```