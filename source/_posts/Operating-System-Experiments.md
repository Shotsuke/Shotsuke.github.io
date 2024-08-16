---
title: 操作系统实验部分 <Operating System Experiments>
date: 2024-03-24 16:43:16
categories: "Course Notes"
tags: Note
excerpt: jyy操作系统实验回忆录
---

# M1: pstree

任务：实现类似于linux中的`pstree`命令，包含 `-p -n -V`参数。

收获：理解pid，线程，进程，查看进程号，格式化打印前缀。

_**难度：😼MEDIUM**_ _**耗时：⌛6 h**_

核心思想：
```
/proc/[pid]/stat
/proc/[pid]/status
```
包含了pid的关键信息。
迭代地维护以{' ' , '|'}组成的前缀来打印即能够打印漂亮的缩进，解决了这个之后打印`pstree`便易如反掌。

# M2: libco

**✊✊✊**

![Step by step to finish it.](\../imgs/Operating-System-Experiments/M2-AC.jpg)

任务：自定义结构体，完成协程库

收获：理解线程/协程的工作原理。

_**难度：🙀WARNING**_ _**耗时：⌛MANY h**_

首先，以C语言实现协程库有若干种方法：
- 我是汇编大神！`asm volatile`
- 实验手册就是我爹！`setjmp / longjmp`
- 推倒实验手册，构建自己的协程结构！`ucontext`
- 还玩不玩😓之本末倒置！`Pthread`

我写了：
- `setjmp / longjmp`: OJ AC!，但是于4/8/24惨遭同学hack😭（虽然jyy并没有增强测试数据）
- `ucontext`：OJ AC!，在hack之中存活=v=

整合所有wiki上的代码，能够得到这样的一份框架，对于协程的实现都有帮助：
```C
#include "co.h"
#include <stdio.h>

#include <stdint.h>
#include <setjmp.h>

#define DEBUG

enum co_status {
    CO_NEW = 1, // 新创建，还未执行过
    CO_RUNNING, // 已经执行过
    CO_WAITING, // 在 co_wait 上等待
    CO_DEAD,    // 已经结束，但还未释放资源
};

struct co {
    char *name;
    void (*func)(void *); // co_start 指定的入口地址和参数
    void *arg;

    enum co_status status;              // 协程的状态
    struct co *    waiter;              // 是否有其他协程在等待当前协程
    struct context context;             // 寄存器现场
    uint8_t        stack[STACK_SIZE];   // 协程的堆栈
};

struct co* current;

// __attribute__((constructor)) void init() {}

struct co *co_start(const char *name, void (*func)(void *), void *arg)
{
}

void       co_wait(struct co *co)
{
}

void       co_yield()
{
    int val = setjmp(current->context);
    if (val == 0) {
        // ?
    } else {
        // ?
    }
}

// static inline void
// stack_switch_call(void *sp, void *entry, uintptr_t arg) {
//     asm volatile (
// #if __x86_64__
//         "movq %0, %%rsp; movq %2, %%rdi; jmp *%1"
//           :
//           : "b"((uintptr_t)sp),
//             "d"(entry),
//             "a"(arg)
//           : "memory"
// #else
//         "movl %0, %%esp; movl %2, 4(%0); jmp *%1"
//           :
//           : "b"((uintptr_t)sp - 8),
//             "d"(entry),
//             "a"(arg)
//           : "memory"
// #endif
//     );
// }
```

## setjmp / longjmp 方式
```pseudocode
struct co *co_start(const char *name, void (*func)(void *), void *arg)
{
    Initialize coroutine
    Record cotoutine to coroutine list
}
void       co_wait(struct co *co)
{
    do co_yield until co is CO_DEAD
    free(co)
    // hacked
}
void       co_yield()
{
    int val = setjmp(current->context);
    if (val == 0) 
    {
        random choose co to be next.
        if co is CO_NEW:
            turn it to CO_RUNNING
            save context and change to function of co

            recover context
            turn it to CO_DEAD
            if someone else is watting co do:
                turn to that coroutine
            co_yield()
            // hacked
        else
            turn to the current coroutine
    } 
    else 
    {
        Actually we do nothing here,
        because only longjmp( , 1) can reach here.
        In this case we let coroutine do its own.
    }
}
```

Hack触发条件:
- caller要比callee先死
- caller需要是wait启动的，且在callee返回前被回收

在我的代码中，`wait`里调用`free`，但是在`yield`中设置DEAD，据说就会触发bug。触发bug时会返回到一个已经被回收的栈的rsp，然后💀。
~~hack~~调试代码如下：
```C
typedef struct m_pair
{
    int i;
    int j;
} m_pair;

static void f(void *ptr_in)
{
    struct m_pair *ptr = (struct m_pair *)ptr_in;
    printf("round:%d coroutine:%d\n", (*ptr).i, (*ptr).j);
    co_yield ();
}

static void test_3()
{
    for (size_t i = 0; i < 1000; i++)
    {
        struct co *thd[100];
        m_pair *p[100];
        for (size_t k = 0; k < 100; k++)
        {
            p[k] = NULL;
            thd[k] = NULL;
        }
        for (size_t j = 0; j < 5; j++)
        {
            p[j] = (m_pair *)malloc(sizeof(m_pair));
            p[j]->i = i;
            p[j]->j = j;
            thd[j] = co_start("Test", f, p[j]);
        }
        for (size_t j = 0; j < 5; j++)
        {
            co_wait(thd[j]);
        }
        for (size_t j = 0; j < 5; j++)
        {
            free(p[j]);
        }
    }
    printf("Test 3 success\n");
}
```

## ucontext 方式
去CSDN上搜一篇来读了，一天就能写完。
基本思路与上述类似，但是给出的库函数能够帮助摆脱一大堆冗长的汇编代码，使代码总体变得十分简洁。
属于是老奶奶坐轮椅碾过OJ了。👵♿♿♿

# M3: gpt.c

任务：从指定的程序中找到能够使用并行大幅提升运行速度的代码段，并并行化处理。

收获：并行优化。

_**难度：😺EASY**_ _**耗时：⌛2 h**_

核心思想：一个可执行程序，执行部分总是若干个函数。如果有个命令能够找出函数中耗时最高的那个就好了！

`sudo perf top`能够实时查询计算机中占用性能若干top位的程序。其不仅能够提供程序名，还能够深入地查询到每个程序中若干耗时最高函数的名称。

另一方面就是思考那些代码块能够并行化。在最大可能避免数据竞争的情况下进行并行化处理，否则在发生数据竞争的情况下，实际上并不能得到**相比于串行程序，在一个k个处理器的计算机上，除去模型加载时间，你应当在有较多轮推理时得到近似线性 (k倍) 的加速比。**

因为数据竞争会导致锁，而锁会使得某个变量的访问不可并行化。

# M4: crepl

**你怎么知道我一发秒了🤣🤣🤣**

![ONE submit kills the match.](\../imgs/Operating-System-Experiments/M4-AC.jpg)

任务：C语言同样也可以实现“交互式”的shell，支持即时定义函数，而且能计算C表达式的数值。

收获：`/tmp`目录操作，文件操作，共享库的编译生成和链接编译，多线程编程，`exec`函数族的使用。

_**难度：😹HARD**_ _**耗时：⌛12 h**_

在大一时，我写过一个[**简单语言的解释器**](https://github.com/Shotsuke/SimpleLexerAnalyzer)，我觉得先有了这个能够对实验有那么一丁点的启发吧。

接受用户的交互输入函数，将其拼接到`.c`文件中，编译生成共享库`.so`；接受用户的交互输入表达式，将其拼接到另一个`.c`文件中，和共享库链接编译得到结果。整个实验的流程非常清晰，但是实现非常的注重细节（这同样是解释器非常头疼的点，虽然说关注的细节几乎完全不一样）：
- `/tmp`文件夹下的文件处理
- `exec`函数族的参数传入
- `fork`的父子进程的关系、等待
- 对不通过编译的错误语法输入的处理

# M5: sperf

**主播给打急眼了，遂几乎通宵干这个实验😡😡😡**

![Stay up to work out it QAQ](\../imgs/Operating-System-Experiments/M5-AC.jpg)

任务：实现一个命令行工具，它能启动另一个程序，并统计该程序中各个系统调用的占用时间。

收获：文件操作，命令`strace`，`exec`函数族原理，管道读写/文件读写。

_**难度：😹HARD**_ _**耗时：⌛12 h**_

DDL战士就是要M4，M5连着一起写！二者的文件操作、子线程的创建思路非常的相似。

使用`strace -T [COMMAND] [ARGV]`来得到程序各系统调用的运行时间，解析其输出来排序。这是这个实验的主调。

但是另外，本实验非常考察各种输出方式。
- std
  - stdout
  - stderr
- redirection
  - fprintf -> FILE
  - pipe
    - dup2
    - -o
    - >

如何将`strace`的输出和`COMMAND`的输出区分开，好吧其实方法有很多:)

# M6: fsrecov

**耻辱下播😵**

![M6-part-correct](\../imgs/Operating-System-Experiments/M6-part.jpg)

任务：给出一个被快速格式化的FAT32结构的文件系统，尽可能地还原出其中的数据。

收获：理解FAT32文件系统，手册阅读能力，长篇代码编写。

没写：对数据存放在不连续簇中的图片恢复（卷积、神经网络等）

_**难度：🙀WARNING**_ _**耗时：⌛24h（没打过）**_

深读了：[JYY os persistance readfat.c](https://jyywiki.cn/os-demos/persistence/readfat/) (or: `wget -r -np -nH --cut-dirs=2 -R "index.html*"`)

因此先以readfat.c源代码来理解FAT32文件系统。其实在代码中并没有隐藏什么高深的结构，毕竟FAT32文件系统本身也不是特别的复杂。FAT32文件结构及其遍历思路如图。
- 关键头文件`fat32.h`
  - `fat32hdr` 记录了保留扇区的内容（前512字节）
  - `fat32dent` 记录了数据区的内容
  - `__attribute__((packed))` 禁用对齐
- 全局变量
  - `struct fat32hdr *hdr` 用于存储 FAT32 文件系统的头部信息。
- 函数
  - `void *mmap_disk(const char *fname)` 将给定的.img镜像文件映射到内存中
  - `u32 next_cluster(int n)`  返回下一个簇的值
  - `void *cluster_to_sec(int n)` 将簇号转化为地址
  - `void dfs_scan(u32 clusId, int depth, int is_dir)` 遍历搜索

![FAT32](\../imgs/Operating-System-Experiments/FAT32.jpg)

在理解了FAT32文件系统之后，查看其对于快速格式化的说明。其快速格式化清空了整个fat表，和根目录文件夹(`./`)对应的簇下所有的信息。因此只能从数据区入手。根据实验描述，根目录文件夹下还有一个文件夹(`./DCIM/`)，该文件夹下的所有内容仍然在数据区中，因此可以通过暴力查找该文件夹的所有簇来恢复出所有文件的文件名。

`east test 1` 和 `easy test 2` 均只要求恢复出文件名。猜测这两个测试点只有创建文件，没有删除文件，这意味着，这两个测试点的`./DCIM/`所在簇的簇号一定是升序连续的。就是说，如果簇3，8215，15318三个簇是分配给这个文件夹的，那么访问顺序一定是3，8215，15318。而在`hard test`中文件夹簇并没有升序连续，也就是说实际上的访问顺序可能是3，15318，8215。

对于`hard test`下的文件恢复，需要注意的是：
- 文件夹簇号不升序连续
  - 如果认为文件夹簇号升序连续，仅能处理约1/3的数据
- 文件的簇号倾向连续，但仍然会断开不连续，例如#9135-#9318, #9462-#9499存放了一个文件的数据
  - 如果认为文件簇号全部连续，则恢复数据达不到要求
  - 主播没处理完这一部分qaq，因为还要打L1和L2:(

# L0: hello, bare-metal!

任务：在裸机上编程，实现**显示**一张图片和监测键盘的输入。

_**难度：🙀EASY**_ _**耗时：⌛1 h**_

仔细研读给出的kernel代码，以及实验要求，就能在十行内完成这个实验。

**⚠**：调用`halt()`和调用`return`尝试使程序结束会产生不同的程序结束情况。使用`halt()`可能可以使你在你的本地环境上正常地退出程序，但是没法通过OJ，报错信息为程序未结束。

# L1: pmm

_**难度：🪦DEAD**_

崩溃了，在学校内写了很久，想了很久，暑假再干一个星期，结果自己写的版本只能过两个点，甚至打不过一把大锁。

反过来一想我的版本其实也没写什么，第一版纯是在想到什么写什么，后面就重新写了一版。这次我读了xv6的分配源码，额外的想法是不断地将内存的页分配给各个CPU进行内存分配，以bitmap，PAGE_FULL，PAGE_PART，PAGE_EMPTY进行分配的控制，在释放内存时归还页到空闲页表形成的链中中。当然这种依托于链表的实现需要在页的头部标注各种信息，那么这部分是不能够拿来分配内存的，这在我的思路中会产生“很大”的开销：例如申请了128B大小的内存，那么就会申请一页，然后将该页标记为128B，即其仅存储若干128B大小的数据。一页是4KB，那么如果申请2KB的内存，就直接浪费了一半。

在这之后想到了fat文件结构，我能否在内存中直接开连续的一块来保存我的页的各种信息？可是离22日所剩时日无多，L2又还没写，那么未能再去深入写这个想法，也只能遗憾离场，一把大锁保平安。

# L2: kmt

_**难度：🪦DEAD**_

寄