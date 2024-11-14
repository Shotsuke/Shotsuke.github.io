---
title: '计算机网络：自顶向下方法 阅读笔记 <Computer Networking: A Top-Down Approach>'
date: 2024-10-22 18:25:00
categories: "Course Notes"
tags:
    - Note
    - Book Reading
    - Computer Networking
excerpt: 《计算机网络：自顶向下方法》阅读笔记，还不都是期中考期末考逼出来的。使用第八版。
---

# 1 计算机网络和因特网、

## 1.1 什么是因特网

- **终端系统**
  - 主机
  - 运行使用因特网的服务
- **通信链路**
- **分组交换机**
  - 路由器
  - 链路层交换机
- **因特网服务提供商**
  - 你说得对，从NJU WLAN接入

## 1.2 网络边缘

如端系统、客户、服务器、数据中心等。

## 1.3 网络核心

即由互联因特网端系统的分组交换机和链路构成的网状网络。

**分组交换**
- **存储转发传输**：交换机开始向输出链路传输该分组的第一个比特之前，必须接收到整个分组。
- **排队时延**和**分组丢失**：如果到达的分组需要传输的链路正忙，就需要承受**排队时延**。而受限于有限的缓存大小，如果到达时队列已满，将出现**分组丢失（丢包）**。
- **转发表**和**路由选择协议**：每台路由器具有一个**转发表**，将目前地址映射为输出链路。路由器检查该地址并选择合适的出链路。

**电路交换**
传统电话，创建专用的端到端连接。

- **频分复用**：在连接期间链路为每条连接专设一个频段，如无线电台。
- **时分复用**：实践划分为固定时段的帧，网络在每个帧中为该连接指定一个时隙。如老电话。

趋势向分组交换而非电路交换。

## 1.4 分组交换网中的时延、丢包和吞吐量

- **单台路由器上的时延**
  - 节点处理时延：检查分组的头部和决定该分组导向何处。
  - 排队时延：在链路上排队等待传输  。
    - 流量强度：`分组到达速率 * 平均大小 / 传输速率`，必须小于1。
    - 一旦流量强度大于1，将导致无限大的排队时延（假设容量无穷），或者一大堆丢包。
  - 传输时延：将分组中的所有比特推向链路（实际上占比最大）。
  - 传播时延：取决于链路种类（光纤等）。
- **端到端时延**
  - 将路径上的所有路由器的时延相总和。
- **吞吐量**：接收者主机接收到文件的速率（bps）。
  - 瓶颈链路：路径上所有路由器中传输速度最慢的。

## 1.5 协议层次和服务模型

该课程使用如下模型：
- 应用层
- 运输层
- 网络层
- 链路层

**封装**
- 网络应用产生**应用层报文（application-layer message）**传送给运输层。
- 运输层收取报文并附上附加信息（允许接收端运输层向上向适当的应用程序交付报文，差错位检测等），生成**运输层报文段（transport-layer segment）**，这就是一层封装，然后向网络层传输该报文段。
- 网络层收取报文段，增加系统地址等信息，生成**网络层数据报（network-layer datagram）**，传递给链路层。
- 链路层增加自己的首部信息生成**链路层帧（link-layer frame）**。
- 最后通过物理层（电线等）传递给链路层交换机。

# 2. 应用层

## 2.1 网络应用原理

- 客户-服务器体系结构
  - 有一个总是打开的主机称为服务器
  - Web, FTP, Telnel, mail
- 对等（P2P）体系结构
  - 每台主机既是客户也是服务器

客户通过**套接字（socket）**的软件接口向网络发送报文和从网络接收报文。

运输服务四个方面：
- 可靠数据传输
  - 确保应用程序的一段发送的数据正确完全地交付
- 吞吐量
  - 带宽敏感的应用具有一定的吞吐量要求
- 定时
- 安全性

运输服务：
- **TCP**
  - 面向连接：三次握手，同时收发报文
  - 可靠的数据传输服务
- **UDP**
  - 无连接
  - 不可靠的数据传输

## 2.2 Web和HTTP

**HTTP**

**HTTP(HyperText Transfer Protocol)超文本传输协议**，定义了Web客户向Web服务器请求Web页面的方式，以及服务器向客户传送Web页面的方式。

HTTP使用TCP作为支撑运输协议。HTTP是一个**无状态协议**，其服务器不保存关于客户端任何信息（但是有Cookie）。

**非持续连接和持续连接**
- 非持续连接：每个请求/响应是经一个单独的TCP连接发送
- 持续连接：所有的请求机器响应经相同的TCP连接发送

**往返时间RTT**：指一个短分组从客户端到服务器然后再返回客户所花费的时间。发起连接-收到回复产生一个RTT，请求文件-收到文件产生一个RTT + 文件传输时间。

**HTTP响应报文**
![2.2.3 HTTP head](\../imgs/A-Top-Down-Approach/2.2.3-HTTP-head.jpg)

此处使用了`HEAD`来仅请求头部信息。`GET`会在之后附上`data`。
- **状态行（status line）**
  - 指示使用`HTTP/1.1`，并且正常`200 OK`。
- **首部行（header line）**
  - 每行形如`Name: Value`
- **实体体（entity body）**

你说得对，这部分**不考**，但是我希望你知道：
- 1xx：信息性状态码
  - 100 Continue：初始部分已接收，客户端可以继续请求。
  - 101 Switching Protocols：服务器正在切换协议。
- 2xx：成功状态码
  - 200 OK：请求成功，响应包含所请求的数据。
  - 201 Created：请求成功并创建了新的资源。
  - 202 Accepted：请求已接受，但尚未处理。
  - 203 Non-Authoritative Information：请求成功，但返回的信息来自其他来源。
  - 204 No Content：请求成功，但没有返回内容。
  - 205 Reset Content：请求成功，但客户端应重置视图。
  - 206 Partial Content：部分内容已成功返回。
- 3xx：重定向状态码
  - 300 Multiple Choices：请求的资源有多种选择。
  - 301 Moved Permanently：请求的资源已被永久移动到新位置。
  - 302 Found：请求的资源临时移动到其他位置。
  - 303 See Other：应使用GET方法访问其他URI。
  - 304 Not Modified：自上次请求后资源未被修改。
  - 305 Use Proxy：请求的资源必须通过代理访问。
  - 307 Temporary Redirect：请求的资源临时移动，保持原有方法。
- 4xx：客户端错误状态码
  - 400 Bad Request：请求无效，服务器无法理解。
  - 401 Unauthorized：未授权，需身份验证。
  - 402 Payment Required：保留状态，暂未实现。
  - 403 Forbidden：服务器拒绝请求，无法访问资源。
  - 404 Not Found：请求的资源未找到。
  - 405 Method Not Allowed：请求方法不被允许。
  - 406 Not Acceptable：请求的资源不可接受。
  - 407 Proxy Authentication Required：需要代理身份验证。
  - 408 Request Timeout：请求超时，客户端未及时发送请求。
  - 409 Conflict：请求冲突，导致无法完成。
  - 410 Gone：请求的资源已永久删除，不再可用。
  - 411 Length Required：未提供Content-Length头。
  - 412 Precondition Failed：请求的先决条件失败。
  - 413 Payload Too Large：请求体过大，服务器无法处理。
  - 414 URI Too Long：请求的URI过长。
  - 415 Unsupported Media Type：不支持的媒体类型。
  - 416 Range Not Satisfiable：请求的范围不满足。
  - 417 Expectation Failed：期望失败。
- 5xx：服务器错误状态码
  - 500 Internal Server Error：服务器内部错误，无法完成请求。
  - 501 Not Implemented：服务器不支持请求的方法。
  - 502 Bad Gateway：作为网关或代理的服务器接收到无效响应。
  - 503 Service Unavailable：服务器当前无法处理请求。
  - 504 Gateway Timeout：作为网关或代理的服务器未能及时响应。

**Cookie**
HTTP是无状态的，这不错，但是一个web站点希望能够识别用户，因此在传给用户的包中设置cookie，之后的通信中用户都会带上这个cookie，以方便识别。

**Web缓存**
ISP通常有Web缓存，在用户试图连接网站时，先从Web缓存中查找是否已经有过缓存。

## 2.4 DNS（域名服务）
DNS提供进行主机名到IP地址转换的目录服务。
DNS是一个由分层的DNS服务器实现的分布式数据库，使得主机能够查询分布式数据库的应用层协议。

在用户试图发送包时，必须得到URL的IP地址。
- 访问同一台主机上运行DNS应用的客户端
- 将URL传给DNS应用
- DNS向DNS服务器发送请求
- 收到回答报文

**分布式、层次数据库**
根DNS服务器，顶级域DNS服务器和权威DNS服务器。
```pseudocode
Root DNS Server
com DNS Server    org DNS Server    edu DNS Server
xxx.com           xxx.org           xxx.edu

本地DNS服务器
```
本地DNS服务器能够缓存IP地址。

## 2.5 P2P文件分发

最小分发时间$D\_{cs} \geq \max \\{ \frac{NF}{u\_s}, \frac{F}{d\_{min} } \\}$，即同时考虑服务器自身的上传速度和所有对等方最小的下载速度。

# 3. 运输层

## 3.1 运输层服务

运输层是在端系统中实现的。将接收到的应用程序的报文转换为运输层报文段，然后交由下层网络层进行运输。网络层提供了主机之间的逻辑通信，而运输层为运行在不同主机上的进程之间提供了逻辑通信。

UDP提供了一种不可靠、无连接的服务，而TCP提供了一种可靠的、面向连接的服务。在网络层中，**IP**的服务模型是**尽力而为交付模型**，因此TCP和UDP的实现并不相同。将主机间交付扩展到进程间交付被称为运输层的**多路复用**与**多路分解**。TCP额外有**可靠数据传输**和**拥塞控制**。

## 3.2 多路复用与多路分解

将报文段的数据交付到正确的套接字的工作称为**多路分解**，将主机的不同套接字中手机数据块，封装为报文段传递到网络层的工作称为**多路复用**。为套接字设定端口号能够非常精确地描述复用和分解。

## 3.3 UDP

无需连接建立、无连接状态，嗯传。
UDP报文段：
- 16b源端口号
- 16b目的端口号
- 16b长度
- 16b检验和
- data

## 3.4 可靠数据传输原理

在写完[实验check3](https://cs144.github.io/assignments/check3.pdf)后，紧急跳过前面部分先来阅读这一部分。

**可靠数据传输**为上层实体提供的服务抽象是：数据可以通过一条可靠的信道进行传输。借助可靠信道，传输数据比特将不会受到损坏或丢失，而且所有数据都是按照其发送顺序进行交付。

**rdt1.0**：如果底层信道是完全可靠的，那么这是rdt1.0。不必担心任何数据损坏和丢失，直接进行传输/接收即可。

**rdt2.0**：也称**停等**协议。底层信道的分组中的比特可能受损。基于**肯定确认**和**否定确认**控制报文使得接收方能够使发送方知道哪些内容被正确接收。基于这样的重传机制的可靠数据传输协议称为**自动重传请求（ARQ）协议**。
- 检测差错：check位
- 收方反馈：肯定确认ACK和否定确认NAK
  - 发送方在发送一个包后，必须等待ACK，否则不会传下一个包。如果等待到NAK，那么重传。
- 重传：收到有差错的分组时，发送方将重传
但是rdt2.0协议的ACK或NAK可能受损，引入的解决方法是：在数据分组中添加一新字段：序号。使用0和1两个序号来表示发的包是重传还是另外的正常传输。由此引入rdt2.1和rdt2.2.

**rdt3.0**：假定底层信道还会丢包。引入倒计数定时器，控制重传和切断连接。但是仍然基于2.0的停等协议，会出现协议限制底层硬件运行速度的情况。因此有了：
- **回退N步（GBN）**：允许发送方发送多个分组而不用等待确认
  - `<- ACK -> | <- Outstanding -> <- Sending -> | <- Unavailable ->`
  - 一次性发送整个窗口长度N的包，在收到回应后继续发送之后的包。
  - 如果出现超时，那么接收方将丢弃**所有**失序分组。在得到超时信号后，发送方从超时包开始全部重新发送。
  - 优点：接收缓存简单，接收方不需要缓存任何失序分组。
  - 如果分组序号的比特位数为k，则序号范围为$[0, 2^k - 1]$
- **选择重传（SR）**：让发送方仅重传那些它怀疑在接收方出错的分组。对于每个收到的包回应对应的ACK，以此让发送方知道哪些包没有收到。另：窗口长度必须小于等于序号空间大小的一半。

## 3.5 TCP

**三次握手**：SYN, ACK + SYN, ACK + DATA
- SYN = 1, seqno = 114
  - 和我讲话！我生成的初始随机序列号为114！
- ACK = 115, SYN = 1, seqno = 514
  - 收到讲话请求，和我讲话！确认前114，期待第115位，我生成的初始随机序列号为514！
- SYN = 0, seqno = 115, ACK = 515, data
  - 收到讲话请求！收到对于114位的确认，现在发送首位序列号115，确认前514位，期待第515位！

**关闭连接**：客户关闭连接：FIN, ACK / 服务器发送完所有数据后：FIN, ACK

报文段的长度首先于**最大报文段长度（MSS）**。TCP为每块客户数据配上一个TCP header，从而形成**TCP报文段**。
- 16b源端口号 + 16b目的端口号
- 32b序号字段 + 32b确认号字段
  - 序号和确认号由双方各自维护
- 4b首部长度字段 + 保留未用字段 + 6bFLAG字段
  - ACK, RST, SYN, FIN, PSH（交给上层）, URG（紧急数据）
- 16b接收窗口
- 16b检验和 + 16b紧急数据指针
- 选项字段
- 数据

书中简单明了的工作图：
```pseudocode
loop {
  switch
    从应用层接收到数据e：
      生成报文段向IP传递
      如果定时器未启动，则启动
      维护序列号
    定时器超时：
      重传最小序号而未收到确认的报文段
      重设定时器（加倍时间）
    收到ACK：
      维护ACK
      如果确实有包被对方成功接收，重设定时器（初始时间）
      如果收到了三次冗余ACK，则立刻重传
}
```

**流量控制**：维护剩余空间的窗口大小，记录为`rwnd (reserve window)`，使得发送者不会发送过多的包。

## 3.7 TCP拥塞控制

需要考虑拥塞窗口和剩余窗口大小的关系，即`min( rwnd, cwnd ) `。

- 慢启动
  - `cwnd`初始值为一个MSS的较小值，随后不断翻倍。
  - 在收到超时丢包时，设置`cwnd`为1并重新开始慢启动。此时将`ssthresh (Slow Start Threshold)`设置为拥塞窗口值的一半。
- 拥塞避免
  - 当`cwnd`的值到达`ssthresh`时，结束慢启动并缓慢增加`cwnd`。
  - 当收到三个冗余的`ACK`时，`ssthresh`设置为`cwnd`的一半，将`cwnd`的值减半。
- 快速恢复
  - Reno
    - 较新版本，对于三个冗余`ACK`设置`cwnd`为`0.5 * cwnd + 3`
  - Tahoe
    - 早期版本，对于三个冗余`ACK`也会将`cwnd`设置为1.

# 4. 网络层：数据平面

## 4.1 概述

路由器不运行应用层和传输层的协议。网络层的作用从表面上看极为简单，将分组从一台发送主机移动到一台接收主机。
- 转发：当一个分组到达某路由的一条输入链路时，该路由需要将其移动到适当的输出链路。转发时在数据平面中实现的唯一功能，尽管也是最为常见和重要的功能。
  - 转发是在路由器本地操作，在几纳秒中发生，通常用硬件实现。
- 路由选择：当分组从发送方流向接收方时，网络层必须决定这些分组所采用的路由或路径。计算这些路径的算法称为**路由选择算法**。
  - 路由是确定分组从源到目的地所采取的端到端路径的网络范围处理过程，发生在几秒钟，因此通常使用软件来处理。