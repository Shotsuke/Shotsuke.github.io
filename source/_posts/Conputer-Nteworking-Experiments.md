---
title: 计算机网络 NJU 实验部分 <Computer Networking Experiments>
date: 2024-09-12 14:10:00
categories: "Course Notes"
tags: Note
excerpt: 南京大学2024秋计算机网络实验部分笔记，据说对标的是CS144的实验部分。
---

# Check0实验报告


## (a) Program Structure and Design: 

在本实验的架构中，需要注意到所有已经实现的头文件和实现都在`./util`中。在这之中存放了对**Check0**重要的`address.hh`，`socket.hh`和`FileDescriptor.hh`，其中`TCPSocket`继承自`Socket`，`Socket`继承自`FileDescriptor`，在其对应的头文件中找到需要的接口（`write(), read(), connect(), close()`）即可完成**Webget**。

对于**Byte Stream**，将其对应的`.hh`和`.cc`文件阅读后即可编写，需要思考的是在头文件中以如何的方式存储字节流的数据，和维护什么样的状态信息。使用`string`, `string_view`, `deque`应当都是可以接受的。状态信息对着子类来设计即可。

## (b) Implementation Challenges: 

**Check0**的编写过程总体上算得上比较顺利。

比较折磨的是，在写完**Webget**后，执行`cmake --build build --target check_webget`编译和运行测试样例，报错误“应当有容量15，却得到0”。**Webget**并没有很难，因此我坚信不是我的问题，最后发现是网络问题，电脑连手机热点，手机开代理解决。

## (c) Remaining Bugs: 

Nothing.🎉

## (d) Experimental results and performance: 

**2.1: Fetch a Web page**

![run_result_2.1](\../imgs/Computer-Networking-Experiments/run_result_2.1.png)

**2.2: Send yourself an email**

![run_result_2.2](\../imgs/Computer-Networking-Experiments/run_result_2.2.png)

![run_result_2.2.1](\../imgs/Computer-Networking-Experiments/run_result_2.2.1.png)

**2.3: Listening and connecting**

![run_result_2.3](\../imgs/Computer-Networking-Experiments/run_result_2.3.png)

![run_result_2.3.1](\../imgs/Computer-Networking-Experiments/run_result_2.3.1.png)

**3, 4: Webget, Byte Stream**

![run_result_4](\../imgs/Computer-Networking-Experiments/run_result_4.png)