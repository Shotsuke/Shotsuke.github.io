---
title: 计算机网络 NJU * CS144 <Computer Networking>
date: 2024-08-04 9:43:00
categories: "Course Notes"
tags: Note
excerpt: 大二下暑期自学CS144计算机网络笔记 * 南京大学2024秋计算机网络混合笔记。
---

# The Internet and IP

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

# The 4 Layer Internet Model
**每个网络协议层级只关心与其相同层级的任务**

## Application Layer：
-  `[data]`
- 主要作用：为应用程序提供网络服务的接口。应用层包括了用户实际使用的各种应用协议，如网页浏览、电子邮件等。
- 主要协议：HTTP（HyperText Transfer Protocol，超文本传输协议）、FTP（File Transfer Protocol，文件传输协议）、SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）等。

**HTTP是无状态的**：是因为它设计上不保留客户端和服务器之间会话的状态信息。

- 无状态性指的是每个HTTP请求都是独立的，服务器不会在不同的请求之间保留任何关于客户端的信息。每次客户端发送请求时，服务器都不会记得之前的请求。
  - HTTP的无状态性使得协议设计更简单。每个请求都是自包含的，服务器不需要存储任何会话信息。这减少了服务器的复杂性和资源消耗。
  - 由于服务器不需要保存客户端的状态信息，它可以处理更多的请求，提升了系统的可扩展性。这对于互联网规模的应用尤为重要。
  - 如果服务器需要保存状态信息，可能会消耗大量的内存和存储资源。无状态的设计降低了这种需求，减少了服务器的负担。
- 尽管HTTP本身是无状态的，实际应用中通常需要在多个请求之间维持会话状态。
  - Cookie, Session, URL parameters, Token可以保存会话状态。

## Transport Layer：
- `[Transport Header][data]`
- 主要作用：负责在源端和目的端之间提供端到端的通信服务。它确保数据可靠地传输，并且在必要时提供差错检测和纠正。

### 主要协议：TCP
提供可靠的、面向连接的服务；另外有UDP（User Datagram Protocol，用户数据报协议），提供不可靠的、无连接的服务。TCP提供保证顺序传输数据的服务，传输层之下的层级提供不可靠的数据包传输服务。

**Three-Way Handshake（三次握手）**
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

**Flow Control**

如果某应用程序读取数据时相对缓慢，而发送方发送得太多、太快，发送的数据就会很容易地使该连接的接收缓存溢出。

TCP 通过让发送方维护一个称为接收窗口 (receive window) 的变量来提供流量控制。

- 停止-等待协议： 在每发送一个数据包后，发送方必须等待接收方的确认（ACK）。只有收到确认后，发送方才能发送下一个数据包。这种方法简单，但效率较低，因为发送方在每次传输数据后都需要等待。
- 滑动窗口协议： 滑动窗口是一种常见的高效流量控制机制。在这种机制中，发送方可以连续发送多个数据包，而不需要逐个等待确认。发送方维护一个窗口，表示它可以发送但还未确认的数据包数量。接收方则通过调整窗口的大小来告诉发送方它能处理的数据量。TCP协议就使用了滑动窗口机制。
  - 1.初始化发送
    - 发送方和接收方首先协商窗口大小。假设窗口大小为W。发送方开始发送数据包，最多发送W个字节的数据，而无需等待ACK确认。
    - 窗口起点是最早未被确认的数据包，终点是发送方可以发送的最后一个数据包。
  - 2.连续发送数据
    - 在未超出窗口大小的情况下，发送方可以持续发送多个数据包
    - 每个数据包都有一个唯一的序列号，发送方依次为每个数据包赋予一个序列号。
  - 3.接收方处理数据
    - 接收方接收到数据包后，检查是否有数据包丢失或错误。如果数据包是有序的且没有错误，接收方将其存储在缓存中，并更新接收窗口。
    - 接收方会为每个连续的正确数据包发送ACK，确认接收到的数据序列号，并告知发送方接收窗口的大小，即它还能继续接收多少数据。
  - 4.窗口滑动
    - 每当发送方收到一个ACK，意味着接收方成功接收了某个数据包。发送方就可以滑动窗口，释放已确认的数据包，并将窗口向前移动，允许发送新的数据包
    - 窗口的起点：未被确认的最早序列号。
    - 窗口的终点：起点加上窗口大小（W）。
  - 5.窗口动态调整
    - 接收方可以根据自身缓存状态调整窗口大小。在ACK中，接收方会告知发送方可以继续发送的最大字节数。如果接收方的缓存快满了，它会减少窗口大小，迫使发送方放慢数据传输速度。
    - 发送方根据ACK中的窗口大小，动态调整发送窗口，确保接收方不会超载。
  - 6.数据重传
    - 如果发送方在一定时间内没有收到某个数据包的ACK（可能是数据包丢失或ACK丢失），发送方会重传该数据包。这种重传机制可以通过定时器或快速重传机制触发。
  - 7.结束
    - 当发送方发送的所有数据包都被接收方确认时，滑动窗口过程结束。

**如果有数据报未送达**

在TCP协议中，滑动窗口的机制允许发送方在不等待每个数据包确认的情况下，连续发送多个数据包。当接收方没有收到某个数据包时，TCP通过确认机制和超时机制来检测并恢复丢失的数据包。假设发送了若干包，其中一个包没有被接收方收到：

- 1.接收方未收到某个数据包
  - 假设发送方发送了数据包1、2、3、4，但接收方未收到数据包3。
接收方会正常接收数据包1、2，并会发送确认报文（ACK）来确认它成功接收到的数据。
但由于数据包3丢失，接收方无法按顺序接收后续的数据包，因此虽然接收方可能收到了数据包4，但不会立即确认数据包4。
- 2.接收方发送重复的ACK
  - 在TCP中，接收方会发送ACK来确认成功接收的数据。在接收到数据包1、2后，接收方会发送针对数据包2的ACK。
  - 当接收方收到数据包4（即超出顺序的数据包）时，它意识到数据包3丢失，因此会再次发送针对数据包2的ACK，表明它期望接收的数据包是包3。
  - 由于接收方无法接收到数据包3，所以会连续多次发送ACK，确认它最后成功接收的是数据包2。
- 3.发送方收到重复的ACK
  - 发送方接收到多个重复的ACK（即多个针对数据包2的ACK）时，意识到接收方可能没有收到数据包3。
在TCP的快速重传机制下，当发送方收到3个重复的ACK时，发送方会立即重传丢失的数据包3，而不需要等待超时。
- 4.发送方重传丢失的数据包
  - 发送方根据接收到的3个重复的ACK，判断数据包3丢失，于是它会立即重新发送数据包3。
  - 同时，发送方继续维护滑动窗口，准备发送后续的数据包。
- 5.接收方收到丢失的数据包
  - 当接收方收到重新发送的数据包3后，它可以正确地组装顺序。
  - 此时，接收方会立即发送一个新的ACK，确认它已经成功接收了所有数据包1、2、3、4。
  - ACK会指向下一个期望的数据包（如果是包5，则ACK的值为5）。
- 6.发送方继续正常发送后续数据包
  - 发送方收到接收方确认的ACK后，会继续移动滑动窗口，并发送接下来的数据包。

## Internet Layer：
- Datagram（数据报）：`[Network Header][Transport Header][data]`
- Example: `[Network Header (Source IP: 192.168.1.1, Destination IP: 192.168.1.2)]`
- 源IP地址表示数据包来自哪里，目的IP地址表示数据包要发送到哪里。IP地址用于全局定位，使得数据包能够跨越多个网络，最终到达目的地。
- 主要作用：负责跨越多个网络传输数据包，提供数据的寻址和路由功能。它的主要任务是找到最佳路径，将数据从源端传输到目的端。

### 主要协议：IP

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

### ICMP

用于在IP网络中发送错误消息、网络状态信息、诊断和控制信息。ICMP通常用于网络设备（如路由器、主机）之间，帮助检测和报告网络连接中的问题。

`[Data][IP Header]`，取IP报文数据中的前8字节和IP头，与TYPE和CODE组成ICMP报文：`[8 Byte of Data][Header][TYPE][CODE]`，将其作为一份新的IP报文，添加上`[IP Header]`而后发送。

**ping**

`TYPE = 8, CODE = 0`，这是一个回显请求，用于发给服务端的ping。服务端在接收到后，回应一个`TYPE = 0, CODE = 0`的回显回答。

**traceroute**

- 发送初始数据包（TTL=1）：
  - Traceroute 首先向目标主机发送一个 IP 数据包，设置 TTL 为 1。
当数据包到达第一个路由器时，TTL 减为 0。这个路由器丢弃数据包，并向源主机发送一个 ICMP Time Exceeded 报文，告诉源主机该数据包已被丢弃。
  - Traceroute 记录下这个 ICMP Time Exceeded 报文中包含的路由器信息（包括路由器的 IP 地址）以及该过程所需的时间（即往返时间）。
- 逐步增加 TTL 值：
  - 接着，Traceroute 发送第二个数据包，将 TTL 设置为 2。这使得数据包能够穿过第一个路由器，到达第二个路由器。
第二个路由器再次将 TTL 减为 0，并返回 ICMP Time Exceeded 报文。Traceroute 再次记录该路由器的信息和时间。
这个过程不断重复，逐步增加 TTL 值，直到数据包到达目标主机或达到预设的最大跳数（通常是 30）。
- 到达目标主机：
  - 当 TTL 足够大，数据包能够到达目标主机时，目标主机不会返回 ICMP Time Exceeded 报文，而是返回一个 ICMP Echo Reply 报文（如果是使用 ICMP 的 Traceroute）。
  - 此时，Traceroute 知道已经到达目标主机，探测路径完成。

## Link Layer
- Frame（帧）：`[Link Header][Network Header][Transport Header][data][Link Trailer]`
- Example: `[Link Header (Source MAC: 00:1A:2B:3C:4D:5E, Destination MAC: 00:5E:4D:3C:2B:1A)]`
- 源MAC地址表示帧来自哪个网络接口，目的MAC地址表示帧要发送到哪个网络接口。MAC地址用于局域网络内的设备定位，确保数据帧在本地网络中找到正确的下一个节点（如下一跳路由器或目标设备）。
- 主要作用：负责在直接相连的网络设备之间传输数据。这一层涉及的数据传输是基于硬件的，通常在本地网络（如以太网）中发生。链路层包括物理层和数据链路层的功能。
- 主要协议：Ethernet（以太网）、Wi-Fi等。

<div class="image-gallery">
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model.jpg" alt="The-4-Layer-Model" width="45%" class="image-item"/>
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model-Summary.jpg" alt="The-4-Layer-Model-Summary" width="45%" class="image-item"/>
    <img src="\../imgs/CS144-Computer-Networking/The-4-Layer-Model-Protocol-Example.jpg" alt="The-4-Layer-Model-Protocol-Example"  width="45%" class="image-item" />
    <img src="\../imgs/CS144-Computer-Networking/The-7-Layer-Model.jpg" alt="The-7-Layer-Model.jpg"  width="45%" class="image-item" />
</div>

**IPV4**

一个IPV4地址指明了一个在网络上的设备，使用32位`a.b.c.d`来表示一个地址。

**网络掩码**

- 1 表示IP地址的网络部分（Network Portion）。这意味着这一部分的比特位在同一子网内是相同的，决定了设备属于哪个网络。
- 0 表示IP地址的主机部分（Host Portion）。这部分的比特位用来标识同一网络中的不同设备（主机）。

**地址解析协议（ARP）**

将已知IP地址转换为MAC地址的工作是由ARP协议来完成的.