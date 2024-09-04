---
title: 形式语言与自动机 <Forlaml Languages and Automata>
date: 2024-09-03 14:01:00
categories: "Course Notes"
tags: Note
excerpt: 南京大学2024秋，形式语言与自动机笔记。
---

# Part 1: Preliminaries
## Mathematical Knowledge
## String and Language

语言可以看作是字符串的集合，通常是由某个字母表（alphabet, $\Sigma$）上的所有可能字符串组成的集合。空串一般使用$\lambda$来表示。

定义串的幂次：若干份的卡式积。$L^n = LLLL... (n个L)$。定义任意串的零次幂为空串。

定义`*`操作：对于字母表$\Sigma$中所有的可能字符串的集合。$\Sigma^*$上的所有子集都是语言。

$\Sigma = \\{a, b\\}, \Sigma^* = \\{\lambda , a , b , aa , ab , bb , \dots \\}$

定义Reverse操作：将其中的所有字符串元素反转。如$L = \\{ a^n b^n \\} , L^R = \\{ b^n a^n \\}$

定义Concatenation操作：合并两个语言。$L_1 L_2 = \\{xy : x \in L_1 , y \in L_2\\}$

Star-Closure (Kleene \*):  $L^* = L^0 \cup L^1 \cup L^2 \cup \dots$

Positive Closure: $L^+ = L^1 \cup L^2 \cup \dots = L^* - \\{ \lambda \\}$

# Part 2:
## Finite Automata and Regular Expression
## Context Free Grammar and Pushdown Automata
## Turing Automata

# Part 3 Modeling:
## Transition System
## Petri Net
## Timed and Hybrid Automata
## Message Sequence Chart

# Part 4: Tutorials
## Computability
## Model Checking
## Trustworthy Software