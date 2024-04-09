---
title: 图论与算法 <Graph Theory and Algorithms>
date: 2024-03-05 16:39:52
categories: "Course Notes"
tags: Course
---

# 算法与伪代码 <Algorithm & Pseudocode>

## Cut vertices: Tarjan

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

## Cut Edge: Tarjan

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

## Eulerian Trail/Circuit:

### Fleury

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

### Hierholzer

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

## Block：
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