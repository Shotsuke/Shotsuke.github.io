---
title: 操作系统 <Operating System>
date: 2024-03-05 16:43:16
categories: "Course Notes"
tags: Course
---

课程主页、PPT：[https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)

# Experiments:

## M1: pstree

任务：实现类似于linux中的pstree命令，包含 -p -n -V参数。

核心思想：
```
/proc/[pid]/stat
/proc/[pid]/status
```
包含了pid的关键信息。
迭代地维护以{' ' , '|'}组成的前缀来组成空格即能够打印漂亮的pstree。

## L0

任务：在裸机上编程，实现显示一张图片和监测键盘的输入。

## M2: libco
