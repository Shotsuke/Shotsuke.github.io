---
title: Algorithm Design and Analysis
date: 2024-03-05 14:06:57
categories: "Course Notes"
tags: Course
---

Notice: this note is originally writen by obisidian.
Because markdown does not support: $...$ ~~I am lazy to modify it~~, there are lots of errors.
Copy them and paste them into obisidian or latex.

# 1. Model of Computation

Strategy
^
|
|   D&C         Optimise of Graph(MST, Path): Greedy, DP
|    ^                      ^
|    |                      |
|    |                      |
|    |                      |
|   BF              Traverse of Graph: BFS, DFS
|
------------------------------------------- > Problem

The main body should be the problem, then consider the aspact of strategy.


# 2. Asymptotics

## Basic ideas

Find key in a sequence: O(n)

n should be large enough, and the analysis should focus on its essential parts.

Key notations:
$w(n)$: the worst situation time cost
$A(n)$: the average time cost
$O, \Omega , \Theta , o , \omega$

- $O$
	- $f \in O(g)$ means: $\exists n_0 , \forall n \geq n_0 \ ,\ \exists C \ , \ f(n) \leq Cg(n)$
	- Or: $\lim_{n \rightarrow \infty} \frac{f(n)}{g(n)} = C < \infty$
- $\Omega$
	-  ... $f (n) \geq Cg(n)$
- $\Theta$
	- ... $C_1 g(n) \leq f(n) \leq C_2 g(n)$
- $o$
	- 
- $\omega$
	- 

## Definition

passed

## Examples

passed

# 3. Recursion

## Recursion Algorithm Design

## Recursion Equation Solution

I have learnt Master Theorem in discrete maths, so passed. 

This class for me is a review about how to draw a recursion equation and how to solve it, so there are no notes here.