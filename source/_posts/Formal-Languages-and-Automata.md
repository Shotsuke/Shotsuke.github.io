---
title: 形式语言与自动机 <Formal Languages and Automata>
date: 2024-09-03 14:01:00
categories: "Course Notes"
tags:
    - Note
    - Course
    - Automata
excerpt: 南京大学2024秋，形式语言与自动机笔记。
---

# Part 1: Preliminaries
## Mathematical Knowledge
## String and Language
### Language Definations

语言可以看作是字符串的集合，通常是由某个字母表（alphabet, $\Sigma$）上的所有可能字符串组成的集合。空串一般使用$\lambda$来表示。

定义串的幂次：若干份的卡式积。$L^n = LLLL... (n个L)$。定义任意串的零次幂为空串。

定义`*`操作：对于字母表$\Sigma$中所有的可能字符串的集合。$\Sigma^*$上的所有子集都是语言。

$\Sigma = \\{a, b\\}, \Sigma^* = \\{\lambda , a , b , aa , ab , bb , \dots \\}$

定义Reverse操作：将其中的所有字符串元素反转。如$L = \\{ a^n b^n \\} , L^R = \\{ b^n a^n \\}$

定义Concatenation操作：合并两个语言。$L_1 L_2 = \\{xy : x \in L_1 , y \in L_2\\}$

Star-Closure (Kleene \*):  $L^* = L^0 \cup L^1 \cup L^2 \cup \dots$

Positive Closure: $L^+ = L^1 \cup L^2 \cup \dots = L^* - \\{ \lambda \\}$

一个确定性的有穷自动机，具有：
- A finite set of states  (Q, typically).
- An input alphabet  ($\Sigma$, typically).
- A transition function  ($\delta$, typically).
- A start state  ($q_0$, in Q, typically).
- A set of final states  ($F \subseteq Q$, typically).

### Regular Language

如果 A 是一个自动机，L(A) 表示由该自动机 A 定义的语言，也就是它所“接受”的字符串集合。对于一个确定性有限自动机（DFA, Deterministic Finite Automaton） A，它的语言 L(A) 是由能够从开始状态（start state）到达某个终止状态（final state）的所有路径所标记的字符串集合。
DFA 接受的语言就是那些能够使 DFA 从初始状态到达终态的字符串。
$L(A) = \\{ w \mid \delta (q_0 , w) \in F \\}.$

**正则语言**是指可以被某个**确定性有限自动机（DFA）**所接受的语言（字符串集合）。
一个语言 L 是正则的，当且仅当存在一个 DFA，它能够准确地识别这个语言中的所有字符串，而不接受任何不在该语言中的字符串。
这意味着 DFA 只接受属于语言 L 的字符串，任何不属于 L 的字符串都会被 DFA 拒绝。
有些语言不是正则语言，例如$L = \\{ a^n b^n \mid n \geq 1 \\}$，这是一个非正则语言。

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