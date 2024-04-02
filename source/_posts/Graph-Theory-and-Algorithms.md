---
title: Graph Theory and Algorithms
date: 2024-03-05 16:39:52
categories: "Course Notes"
tags: Course
---

# Algorithm & Pseudocode

## Cut vertices: Tarjan
Input: G = <V , E> and a vertex u
Output: Each vertex's isCutVertex member
If **u.inCutVertex** is true, then u is a cut vertex.
```
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
Like **Cut Vertex: Tarjan**, by changing **v.low >= u.d** into **v.low > u.d**.
And we don't need to think about whether u is root node.

Input: G = <V , E> and a vertex u
Output: Each vertex's isCutEdge member
If **u.isCutEdge** is true, then **(u , u.parent)** consists a bridge.
```
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

## Eulerian Trail/Circuit: Hierholzer
Input: G = <V , E>
Output: The vertices of the eulerian trail of the G.
To drive this function, we can choose any vertex u in a graph.
If the graph doesn't contain a eulerian circuit but contains a eulerian trail,
choose a vertex v with odd degree can draw a eulerian trail.
```
Hierholzer(u):
    circuit <- find a circuit in E begin with u
    if circuit is empty do:
        return u
    
    E <- E - circuit
    foreach v in circuit do:
        v <- Hierholzer(v)
    return circuit
```

However, this pseudocode is too abstract to translate it into codes,
so here is my version:
```
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