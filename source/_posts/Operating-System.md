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
- 对象的访问都需要指针
  - open, close, read/write (解引用), lseek (指针内赋值/运算), dup (指针间赋值)

# 内核

**⚠：**该部分的部分内容无法在**wsl**下运行，因为代码调用了` /boot/linuz `，但是wsl是windows的子系统，其` /boot `为空文件夹，与linux系统不完全一样。

# 持久化

# Experiments:

## M1: pstree

任务：实现类似于linux中的pstree命令，包含 -p -n -V参数。

核心思想：
```
/proc/[pid]/stat
/proc/[pid]/status
```
包含了pid的关键信息。
迭代地维护以{' ' , '|'}组成的前缀来打印即能够打印漂亮的缩进，解决了这个之后打印pstree便易如反掌。

## M2: libco

任务：自定义结构体，完成协程库

**⚠：难度警告**

首先，以C语言实现协程库有若干种方法：
- 我是汇编大神！asm volatile
- 实验手册就是我爹！setjmp / longjmp
- 推倒实验手册，构建自己的协程结构！ucontext
- 还玩不玩😓之本末倒置！Pthread

我写了：
- setjmp / longjmp: OJ AC!，但是于4/8/24惨遭同学hack😭（虽然jyy并没有增强测试数据）
- ucontext：OJ AC!，在hack之中存活=v=

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

### setjmp / longjmp 方式
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

在我的代码中，wait里调用free，但是在yield中设置DEAD，据说就会触发bug。触发bug时会返回到一个已经被回收的栈的rsp，然后💀。
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

### ucontext 方式
去CSDN上搜一篇来读了，一天就能写完。
基本思路与上述类似，但是给出的库函数能够帮助摆脱一大堆冗长的汇编代码，使代码总体变得十分简洁。
属于是老奶奶坐轮椅碾过OJ了。👵♿♿♿

## L0: hello, bare-metal!

任务：在裸机上编程，实现**显示**一张图片和监测键盘的输入。

仔细研读给出的kernel代码，以及实验要求，就能在十行内完成这个实验。

**⚠**：调用halt()和调用return尝试使程序结束会产生不同的程序结束情况。使用halt()可能可以使你在你的本地环境上正常地退出程序，但是没法通过OJ，报错信息为程序未结束。

## L1: pmm
