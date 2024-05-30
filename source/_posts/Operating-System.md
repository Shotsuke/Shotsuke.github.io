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
