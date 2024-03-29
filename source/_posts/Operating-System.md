---
title: Operating System
date: 2024-03-05 16:43:16
categories: "Course Notes"
tags: Course
---

[Notes and PPTs](https://jyywiki.cn/OS/2024/)

# Experiments:

## M1: pstree

Task: write a program that implements the pstree command like linux do, with arguments -p -n -V

Essential idea: By visiting 
```
/proc/[pid]/stat
/proc/[pid]/status
```
can get information of pids.
Maintain proper prefix recurrsively can build a tree and print all pids as linux do.

## L0

Task: display an image in bare-metal and monitor keyboard press.

## M2
