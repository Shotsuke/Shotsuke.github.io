---
title: Graph Theory and Algorithms
date: 2024-03-05 16:39:52
categories: "Course Notes"
tags: Course
---

# 1. Basic Concepts of Graph

Degree Sequence: Non-increasing sequence of all vertex sorted by every degree.
Max degree: $\Delta(G)$
Min degree: $\delta(G)$

Adjacent Matrix
Incidence Matrix: $M_{i,j}$ denotes whether $v_i$ and $e_j$ is connected.

Subgraph
- Vertex Induced Subgraph
- Edge Induced Subgraph
- Spanning Subgraph


# 2. Connection and Traverse

## Connection and DFS

Walk（路线）：允许重复
Path（路径）：不允许重复
Trail（迹）：不重复出现的路线
Internal Vertex（内顶点）：路中除起点、终点的点

## Cut Vertex and Cut Edge

The vertex(edge) that cut the graph into two parts.