---
title: 操作系统 <Operating System>
date: 2024-03-05 16:43:16
categories: "Course Notes"
tags: Course
---

遵守:[请大家自觉不要把自己的实验作业代码公开。如果你本着 “炫耀” 的态度公布，那你的代码很可能写得很烂不值得炫耀。请停止这种对学弟和学妹造成伤害的行为——如果你看到了互联网上的代码，请记得 Academic Integrity 且主动不要使用它们。](https://jyywiki.cn/OS/2024/labs/Labs.md)因此仅会有伪代码来记录自己的思路。而对于实验以外的部分，例如有强度的测试用例，则会完整地附上。

吹爆❤JYY❤

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
