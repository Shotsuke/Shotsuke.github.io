---
title: CS144 <Computer Networking>
date: 2024-08-04 9:43:00
categories: "Course Notes"
tags: Note
excerpt: 大二下暑期自学CS144计算机网络珍贵笔记记录。
---

# U1 The Internet and IP

- How an application uses the Internet
- The structure of the Internert: The 4 Layer Model
- The IP Protocol
- Basic architevtural ideas and principles
  - Packet switching
  - Layering
  - Encapsulation

在计算机网络中，通过传输多个packet（数据包）来在计算机之间通信。在网络中传输的数据通常被分割成较小的单位，这些单位称为数据包。一个数据包包含了部分数据（例如文件的一部分或网页的一部分）以及必要的控制信息（如目的地址、源地址、序列号等）。在传输的过程中会经过多个router（路由器），路由器通过查看数据包中的目标IP地址，选择最优路径，将数据包从源地址发送到目标地址，通常要经过多个中间节点（其他路由器）。
<div>
    <img src="\../imgs/CS144-Computer-Networking/Link-Endhost-Router.jpg" alt="Link-Endhost-Router" width="50%" height="50%" display="inline-block"/>
</div>

## The 4 Layer Internet Model
**每个网络协议层级只关心与其相同层级的任务**

### Application Layer（应用层）：
-  `[data]`
- 主要作用：为应用程序提供网络服务的接口。应用层包括了用户实际使用的各种应用协议，如网页浏览、电子邮件等。
- 主要协议：HTTP（HyperText Transfer Protocol，超文本传输协议）、FTP（File Transfer Protocol，文件传输协议）、SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）等。

### Transport Layer（传输层）：
- `[Transport Header][data]`
- 主要作用：负责在源端和目的端之间提供端到端的通信服务。它确保数据可靠地传输，并且在必要时提供差错检测和纠正。

#### 主要协议：TCP（Transmission Control Protocol，传输控制协议）
提供可靠的、面向连接的服务；另外有UDP（User Datagram Protocol，用户数据报协议），提供不可靠的、无连接的服务。TCP提供保证顺序传输数据的服务，传输层之下的层级提供不可靠的数据包传输服务。

##### Three-Way Handshake（三次握手）
三次握手（Three-Way Handshake）是TCP协议（Transmission Control Protocol）在建立连接时使用的一个过程，确保客户端和服务器之间的连接是可靠的。它在数据传输之前进行，以确认双方都已准备好开始通信。

- 第一次握手（SYN）：
  - 客户端向服务器发送一个SYN（同步序列号，Synchronize Sequence Number）包，请求建立连接。
  - 该包包含一个初始序列号（Sequence Number），用于标识数据包的顺序。
- 第二次握手（SYN-ACK）：
  - 服务器收到客户端的SYN包后，发送一个SYN-ACK（同步-确认，Synchronize-Acknowledge）包作为响应。
  - 该包包含服务器的初始序列号（Sequence Number），同时对客户端的SYN包进行确认（ACK，Acknowledgment），表示已经收到了客户端的请求。
- 第三次握手（ACK）：
  - 客户端收到服务器的SYN-ACK包后，发送一个ACK（确认）包，确认已收到服务器的SYN-ACK包。
  - 在这个阶段，连接建立完成，双方可以开始传输数据。

### Internet Layer（网络层）：
- Datagram（数据报）：`[Network Header][Transport Header][data]`
- Example: `[Network Header (Source IP: 192.168.1.1, Destination IP: 192.168.1.2)]`
- 源IP地址表示数据包来自哪里，目的IP地址表示数据包要发送到哪里。IP地址用于全局定位，使得数据包能够跨越多个网络，最终到达目的地。
- 主要作用：负责跨越多个网络传输数据包，提供数据的寻址和路由功能。它的主要任务是找到最佳路径，将数据从源端传输到目的端。

#### 主要协议：IP（Internet Protocol，互联网协议）。

IP协议是互联网的一个“Thin Waist”，因为在这一层中仅有IP协议这一个协议，因为其设计的足够简单。

性质
- **Datagram**
  - IP是数据报服务。当请求时，创建一个数据报并放入数据。
  - `[IP Destination Addr][IP Source Addr][Data]`
- **Unreliable**
  - 不承诺一定送到。因此，可能会有掉包
- **Best effort**
  - IP协议尽可能地传送数据报
- **Connectionless**
  - 各个数据报可能不按顺序到达。

IP服务就像邮政服务一样，不保证一定能够送达，连着两三天按顺序发送的信件也不保证一定按照顺序送达，但是一定是尽全力送的。

**为什么IP服务设计的如此简单？简单到不保证送到？**
- 保持简单、速度、维护和构建成本
- 端到端原则：如果可能，在终端实现需要的功能
- 允许各种基于IP的可靠的，或者不可靠的实现
  - 如打电话，固执地传输之前传输失败的数据变得毫无意义
- IP可以在任何链路层上工作

**IP的作用**
- 防止数据报死循环
  - 当路由器中的转发表发生变化时，最有可能发生这种情况
  - IP协议通过一个叫做**“TTL”（Time to Live，生存时间）**的字段来防止数据报在网络中进入死循环。
    - 初始值设定：每个IP数据报在发送时，都会在其头部的TTL字段中设置一个初始值（通常为64或128等）。
    - 每次路由递减：数据报在经过每个路由器时，路由器会将TTL值减1。
    - TTL为0时丢弃：当TTL值减少到0时，数据报会被丢弃，并且发送一个ICMP（Internet Control Message Protocol）消息给源地址，告知数据报未能到达目的地。
- 将过长的数据报分割成若干片段
  - 将数据报分成若干片段时会添加信息，以便后续重新正常排序。
- 使用标头校验来减少错误传输数据报的可能性
- 今有IPV4和IPV6两种IP服务模型
  - ipv4使用32位地址，而这几乎已经消耗完了
  - ipv6使用128位地址，这几乎是无穷的
- 允许将新功能添加到标头中

![IPV4-Datagram](\../imgs/CS144-Computer-Networking/IPV4-Datagram.jpg)
- Version: ipv4/ipv6
- Header Length
- Type of Service: 向路由器提示该数据报的重要性
- Total Packet Length
- Packet ID, Flags, Fragment Offset: 分段数据报（如果需要）
- Time to live
- Protocol ID: 表明上层的协议。如写入6表明为tcp协议，以便正确传输到tcp协议的代码中
- Checksum: 校验和
- Source IP Addr
- Destination IP Addr
- (OPTIONS)
- (PAD)

### Link Layer（链路层）
- Frame（帧）：`[Link Header][Network Header][Transport Header][data][Link Trailer]`
- Example: `[Link Header (Source MAC: 00:1A:2B:3C:4D:5E, Destination MAC: 00:5E:4D:3C:2B:1A)]`
- 源MAC地址表示帧来自哪个网络接口，目的MAC地址表示帧要发送到哪个网络接口。MAC地址用于局域网络内的设备定位，确保数据帧在本地网络中找到正确的下一个节点（如下一跳路由器或目标设备）。
- 主要作用：负责在直接相连的网络设备之间传输数据。这一层涉及的数据传输是基于硬件的，通常在本地网络（如以太网）中发生。链路层包括物理层和数据链路层的功能。
- 主要协议：Ethernet（以太网）、Wi-Fi等。

<div class="image-gallery">
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model.jpg" alt="The-4-Layer-Model" width="45%" class="image-item"/>
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model-Summary.jpg" alt="The-4-Layer-Model-Summary" width="45%" class="image-item"/>
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model-Protocol-Example.jpg" alt="The-4-Layer-Model-Protocol-Example"  width="45%" class="image-item" />
    <img src="\../imgs/CS144-Computer-Networking/The-7-Layer-Model.jpg" alt="The-7-Layer-Model.jpg"  width="45%" class="image-item" />T
</div>

**IPV4**

一个IPV4地址指明了一个在网络上的设备，使用32位`a.b.c.d`来表示一个地址。

**网络掩码**

- 1 表示IP地址的网络部分（Network Portion）。这意味着这一部分的比特位在同一子网内是相同的，决定了设备属于哪个网络。
- 0 表示IP地址的主机部分（Host Portion）。这部分的比特位用来标识同一网络中的不同设备（主机）。

**地址解析协议（ARP）**

将已知IP地址转换为MAC地址的工作是由ARP协议来完成的.

