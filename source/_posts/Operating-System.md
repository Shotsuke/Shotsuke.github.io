---
title: 操作系统 <Operating System>
date: 2024-03-05 16:43:16
categories: "Course Notes"
tags: Note
---

遵守:[请大家自觉不要把自己的实验作业代码公开。如果你本着 “炫耀” 的态度公布，那你的代码很可能写得很烂不值得炫耀。请停止这种对学弟和学妹造成伤害的行为——如果你看到了互联网上的代码，请记得 Academic Integrity 且主动不要使用它们。](https://jyywiki.cn/OS/2024/labs/Labs.md)因此仅会有伪代码来记录自己的思路。而对于实验以外的部分，例如有强度的测试用例，则会完整地附上。

吹爆❤JYY❤

课程主页、PPT：[https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)、

# 课程小工具

## strace

在最简单的情况下，strace运行指定的命令直到其退出。它<span style="color:red; font-weight:700">拦截并记录</span>**被进程调用的系统调用**以及**进程接收到的信号**。每个系统调用的名称、其参数和返回值都会被打印到标准错误或使用 -o 选项指定的文件中。
使用例：
```bash
$ strace ./a.out
$ strace ls
$ strace ls |& grep -e read -e write
```

## Model Checker

**操作系统模型和检查器**：我们可以把 “状态机的管理者” 这个思想在 Python 世界中构造出来：我们用 Python 的函数来声明状态机，并且实现状态空间的遍历。所有的实现都是 “最简” 的——但它真的能用来澄清 Three Easy Pieces 里的概念：Concurrency, Virtualization, 和 Persistence。

Model Checker能够帮助我们遍历并发问题中的所有可能性。其将状态视作点而执行指令视作边，列出所有的执行情况。

# 绪论

# 并发

## 实现互斥

- 关中断
- Peterson算法：不断将自己保存的状态与锁的状态互换
- 原子指令：在汇编代码中加入**lock**

```asm
asm volatile(
    "lock addq $1, %0" : "+m"(sum));
```

- 自旋锁：

```C++
void spin_lock(lock_t *lk) {
retry:
    int got = atomic_xchg(&lk->status, ❌);
    if (got != ✅) {
        goto retry;
    }
}

void spin_unlock(lock_t *lk) {
    atomic_xchg(&lk->status, ✅);
}
```

- 对于某个CPU而言，关中断 + 自旋锁能够保证实现互斥。出于考虑如果在执行锁时被系统中断打断，之后无法回来。或者，我们需要在执行中断时保存上锁解锁的状态。
- 读写异步：自旋锁的效率不高。在读请求远大于写请求的数量时，以此来控制版本的访问。当所有的CPU都完成了一次线程的切换时，那么此时旧版本将不会再被访问到，因此此时可以回收旧版本。
- pthread Mutex Lock：使用方法与自旋锁完全一致。
- Futex(Fast Userspace muTexes)：将“自旋”交给操作系统执行，然而实际上并没有进行真正的自旋。操作系统标记其为等待，在其他线程释放这把锁是将该锁标记为可用，从而使得另一程序可用。

## 实现同步

- 生产者-消费者问题
  - 生产者向缓冲区中输入数据，满时等待
  - 消费者从缓冲区中取走数据，空时等待
  - 条件变量

```C++
#define CAN_PRODUCE {0, 1}
#define CAN_CONSUME {0, 1}
mutex_t lk = MUTEX_INIT();
cond_t cv = COND_INIT();

void producer()
{
    while (1)
    {
        mutex_lock(&lk);
        while (!CAN_PRODUCE)
        {
            cond_wait(&cv, &lk);
            /*
                mutex_unlock(&lk);
                wait_for_someone_wake_me_up(&cv);
                mutex_lock(&lk);
            */
        }

        to do

        cond_broadcast(&cv);
        mutex_unlock(&lk);
    }
}

void consumer()
{
    while (1)
    {
        mutex_lock(&lk);
        while (!CON_CONSUMER)
        {
            cond_wait(&cv, &lk);
            // sacrifice efficiency to gain consision
            // use 
        }

        to do

        cond_broadcast(&lk);
        mutex_unlock(&lk);
    }
}
```

# 虚拟化

## 进程的地址空间

### mmap

简单而言，mmap能够增、删、改一段虚拟内存的映射，或是查看一个程序的虚拟空间的映射。mmap在调用者的虚拟地址空间创建了一个新的映射。
```bash
$ mmap [proc]
```

### gdb

**非常的危险！爱来自JYY！**
**小百合的幕后黑手！！**

## 系统调用和 UNIX Shell

**访问操作系统中的对象**
- 文件：有 “名字” 的对象
- 字节流 (终端) 或字节序列 (普通文件；包括 /proc/*)

**文件描述符**
- 指向操作系统对象的 “指针”
  - Everything is a file
  - 通过指针可以访问 “一切”
- 对象的访问都需要指针*-
  - open, close, read/write (解引用), lseek (指针内赋值/运算), dup (指针间赋值)

**可执行文件**
是一个状态机初始状态的描述

# 内核

**⚠：**该部分的部分内容无法在**wsl**下运行，因为代码调用了` /boot/linuz `，但是wsl是windows的子系统，其` /boot `为空文件夹，与linux系统不完全一样。

**syscall**
“跳转并链接”
```pseudocode
syscall = “jal”:  // sysret: 逆操作
    mov %rip, %rcx
    mov %rflags, %r11
    set SS = kernel, SS = kernel, CPL = 0
    jmp IA32_LSTAR  // System Target Address Register
```

**中断**
- 保存寄存器等各种现场、上下文
  - 保存至内存中
  - save context: rip cs rflags rsp rsp0
  - save register
- 切换上下文到应当执行的位置
- （等待切换的上下文结束）
- 恢复上下文，继续执行

**虚拟地址空间**
64位地址后12位是偏移量，中36位是虚拟页号
普通实现：x86, ARM, RISC-V, ...
f (内存部分): Radix Tree
- 一个 1024 叉树 (64-bit: 512 叉)
- 32bit：10b + 10b + 12b
  - 1024叉刚好能够存放到4KB的页表中，如此便有多级页表
    - 在32位机中，两个10bit恰好对应两层，即二级页表
    - 在64位机中，一个指针8B，因此恰好为512叉
  - i386: 2 层，正好 10 + 10 + 12
  - x86_64: PML4/PML5
    - 也有三级页表 (sv39，索引 512 GB)

f (处理器部分): CR3 (PDBR)
`struct page *cr3;  // 指向数据结构根的指针，即第一级页表地址`
- Translation-Lookaside Buffer (TLB): 缓存

**上下文切换**
考试不会考细节，但是一定要记得上下文切换
- 在每一次中断的时候，都有一个指针能够获取所有的寄存器
- 然后可以将这些寄存器保存下来
- 在保存之后，可以任意选择系统中的进程执行

```C
Context *on_interrupt(Event ev, Context *ctx) {
    current->context = *ctx;

    // Can return any valid Context*
    current = schedule();

    return &current->context;
}
```

**处理器调度**


# 持久化

## 存储设备原理

## 输入输出设备

GPIO（通用输入输出）：一根可以读写数据的线，负责采集外部器件的信息或者控制外部器件工作，即输入输出。GPIO引脚可以配置为输入或输出，用于与外部设备进行通信或控制。

IO设备时一个能与CPU交换数据的接口/控制器。
一个理论上的IO设备，就是许多个寄存器，其通过握手信号从线上读出和写入数据。

计算机就是CPU连了控制器，控制器连了寄存器，寄存器可以读写。

**总线、中断控制器和 DMA**

总线( Bus )：一个特殊的IO设备
提供设备的 “虚拟化”：注册和转发
计算机只看到一个IO设备：总线
其他所有的IO设备都被总线虚拟化了
- 把收到的地址 (总线地址) 和数据转发到相应的设备上
- 例子: port I/O 的端口就是总线上的地址
  - IBM PC 的 CPU 其实只看到这一个 I/O 设备

这样 CPU 只需要直连一个总线就行了！
- 今天 PCI 总线肩负了这个任务
  - 总线可以桥接其他总线 (例如 PCI → USB)
- lspci -tv 和 lsusb -tv: 查看系统中总线上的设备
  - 概念简单，实际非常复杂……
    - 电气特性、burst 传输、中断、Plug and Play

即插即用：非常具有挑战性的功能
将设备插入后，电信号还并没有完全稳定，此时总线会进行一系列的动作来确保设备的正常使用。设备上的接口是带有时钟周期的。在设备完成初始化后，总线会看到这个设备，向操作系统发送一个中断，操作系统重新扫描一遍IO设备，看到了这个IO设备，然后将其计入操作系统可以访问的IO设备中。

IO设备输入时，相当于是向CPU发送了一个中断（4号引脚`IRQ`），告诉CPU应当处理我设备的输入。当IO设备数量变多时，单个中断请求（IRQ）线不足以处理所有设备的中断请求。这时需要更复杂的中断管理机制来有效处理多个设备的中断请求。

中断共享（Interrupt Sharing）：
- 多个设备可以共享一个中断线。共享中断时，中断处理程序需要检查所有可能的中断源，以确定哪个设备发出了中断请求。
- 共享中断在PCI设备中较为常见，通过IRQ线共享机制实现。

<img src="\../imgs/OS/CPU.jpg" alt="CPU Core" width="30%" height="30%" />

**GPU和加速器**

计算机系统里充满了 “CPU”
- CPU: 大核 + 小核 + 超小核
- DMA: 执行 memcpy() 的 CPU
- 打印机：解析执行 PCL/PostScript 的 CPU
- 网卡：分拣以太网 packet (frame) 的 CPU
  - 它们都受到 CPU 的统一调配
  
## 文件和设备驱动

**文件和文件描述符**

传世名句其二：`Everything is a File`
GPT：这句话揭示了 Linux 操作系统的一种核心设计哲学，即系统中的几乎所有内容都可以通过文件接口来访问和操作。这种设计提供了一种统一的接口，使得系统的许多操作都可以通过相同的读、写、打开和关闭操作来完成。

**为什么采用“一切皆文件”设计？**
- 统一接口：通过将所有内容抽象为文件，系统调用接口更加统一。无论是读取文件、设备输入、进程通信，都是通过相同的系统调用完成（如 open、read、write、close 等）。
- 简化开发：开发人员只需掌握一组操作文件的 API，就可以处理各种类型的输入和输出设备、网络通信和进程间通信。
- 灵活性和扩展性：这种设计使得系统更具灵活性。例如，通过挂载不同的文件系统，可以将新的设备和功能无缝地集成到系统中。
- 简化系统管理：系统管理员可以使用相同的工具和方法来管理文件、设备和网络通信。例如，使用 ls、cat、cp 等命令操作设备和网络套接字文件。

**文件与文件描述符**
- 文件就是有名字的对象，另外也有匿名对象
- 文件描述符
  - 是指向操作系统对象的“指针”
    - 这并不是真的指针，而是一个句柄，以整数存储在计算机中。
    - GPT：操作系统中用于标识已打开文件或其他I/O资源的整数。在Unix-like系统（如Linux、macOS等）中，每个进程都有一个文件描述符表，用于跟踪它打开的文件或设备。
      - 通过句柄可以访问everything
    - 对象的访问都需要指针
      - open, close, read/write (解引用), lseek (指针内赋值/运算), dup (指针间赋值)

mmap, lseek, ftruncate 互相交互的情况
- 假设初始时文件大小为 2MB
  - lseek to 3 MiB (SEEK_SET)
    - 这时候能写入吗？
    - 能够写入。在写入后，操作系统会将文件的大小扩展为3MB + 1字节，2MB到3MB的区域用00填充。
- ftruncate to 1 MiB
  - 这时候 offset 在哪里？
    - 3MB + 1
  - 在新一次的读写后，将文件大小重新定位3MB

## 文件系统

**ext2文件系统**
![ext2](\../imgs/OS/ext2.png)