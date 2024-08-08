---
title: CS144 <Computer Networking>
date: 2024-08-04 9:43:00
categories: "Course Notes"
tags: Note
---

在计算机网络中，通过传输多个packet（数据包）来在计算机之间通信。在网络中传输的数据通常被分割成较小的单位，这些单位称为数据包。一个数据包包含了部分数据（例如文件的一部分或网页的一部分）以及必要的控制信息（如目的地址、源地址、序列号等）。在传输的过程中会经过多个router（路由器），路由器通过查看数据包中的目标IP地址，选择最优路径，将数据包从源地址发送到目标地址，通常要经过多个中间节点（其他路由器）。
<div>
    <img src="\../imgs/CS144-Computer-Networking/Link-Endhost-Router.jpg" alt="Link-Endhost-Router" width="50%" height="50%" display="inline-block"/>
</div>

The 4 Layer Internet Model
**每个网络协议层级只关心与其相同层级的任务**
- Application Layer（应用层）：
  - `[data]`
  - 主要作用：为应用程序提供网络服务的接口。应用层包括了用户实际使用的各种应用协议，如网页浏览、电子邮件等。
  - 主要协议：HTTP（HyperText Transfer Protocol，超文本传输协议）、FTP（File Transfer Protocol，文件传输协议）、SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）等。
- Transport Layer（传输层）：
  - `[Transport Header][data]`
  - 主要作用：负责在源端和目的端之间提供端到端的通信服务。它确保数据可靠地传输，并且在必要时提供差错检测和纠正。
  - 主要协议：TCP（Transmission Control Protocol，传输控制协议），提供可靠的、面向连接的服务；UDP（User Datagram Protocol，用户数据报协议），提供不可靠的、无连接的服务。
    - TCP提供保证顺序传输数据的服务，传输层之下的层级提供不可靠的数据包传输服务。
- Internet Layer（网络层）：
  - Datagram（数据报）：`[Network Header][Transport Header][data]`
  - Example: `[Network Header (Source IP: 192.168.1.1, Destination IP: 192.168.1.2)]`
  - 源IP地址表示数据包来自哪里，目的IP地址表示数据包要发送到哪里。IP地址用于全局定位，使得数据包能够跨越多个网络，最终到达目的地。
  - 主要作用：负责跨越多个网络传输数据包，提供数据的寻址和路由功能。它的主要任务是找到最佳路径，将数据从源端传输到目的端。
  - 主要协议：IP（Internet Protocol，互联网协议）。
    - IP协议是互联网的一个“Thin Waist”，因为在这一层中仅有IP协议这一个协议，因为其设计的足够简单。
- Link Layer（链路层）
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

