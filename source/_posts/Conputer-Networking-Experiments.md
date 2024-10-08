---
title: 计算机网络 NJU 实验部分 <Computer Networking Experiments>
date: 2024-09-12 14:10:00
categories: "Course Notes"
tags: Note
excerpt: 南京大学2024秋计算机网络实验部分笔记，对标的是CS144的实验部分。
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

![run_result_2.1](\../imgs/Computer-Networking-Experiments/check0/run_result_2.1.png)

**2.2: Send yourself an email**

![run_result_2.2](\../imgs/Computer-Networking-Experiments/check0/run_result_2.2.png)

![run_result_2.2.1](\../imgs/Computer-Networking-Experiments/check0/run_result_2.2.1.png)

**2.3: Listening and connecting**

![run_result_2.3](\../imgs/Computer-Networking-Experiments/check0/run_result_2.3.png)

![run_result_2.3.1](\../imgs/Computer-Networking-Experiments/check0/run_result_2.3.1.png)

**3, 4: Webget, Byte Stream**

![run_result_4](\../imgs/Computer-Networking-Experiments/check0/run_result_4.png)

#  Check1实验报告

## (a) Program Structure and Design: 

考虑所有输入的`data`的`index`情况，无非仅三种情况：弃用，推流给`bytestream`，暂存。

因此就有了我凭感觉写的第一版，恰好匹配则推流，不匹配尝试暂存，否则丢弃，大概是这样的：

```pseudocode
if Fortunatly get matched
{
	push into output_
	renew expected index
	loop: 
		try to find matched data in storage
		if nothing get matched then break
}
else if data should be stored
{
	push into storage
}
```

大概打过了七八个点，发现缺乏了相当的鲁棒性，对于许多细节的补写需要当`if`战士，于是仔细思考所有的细节，画出了最重要的一张图：💡

![index_all](\../imgs/Computer-Networking-Experiments/check1/index_all.png)

看上去好似情况很多，实际上`Case 1 & 6`不需要处理，`Case 3 & maybe`作`substr()`能够转换为`Case 2`一并处理，`Case 5`作`substr()`能够转换为`Case 4`一并处理。如此整个实验的思路便清晰了不少。

在`reassembler.hh`中也只需维护如下成员：记录当前应当的起始下标，若读到终止字符串时应当修改的终止下标，暂存区。`void push`用于将合适的数据推流给`output_`。

```C++
private:
	Bytestream output_;
	
	uint64_t expect_index_ {};
	uint64_t end_index_ {0xffffffffffffffff};
	std::map<uint64_t, std::string> store_strings {};
	
	void push( uint64_t first_index, std::string data );
```

## (b) Implementation Challenges: 

### 编写部分

当写完繁琐的字符串长度的情况判断后，便需要思考，成功将`data`送入`output_`后，应当如何维护暂存的数据？或者说，如何更新暂存区，将所有合适的字符串送入`output_`？🤔

- 方案一：所有数据在接收到时，如果应当暂存，那么仅将超出容量部分截断后，直接送入暂存
  - 好处：写的真的很简单。
  - 坏处：对于重叠部分不做考虑，如果发送方送了若干次相同的数据，那么会造成空间的浪费。如果空间大，那么浪费更大。
  - 坏处：`uint64_t bytes_pending() const`函数真的很难写。
- 方案二：所有数据在接收到时，如果应当暂存，那么与暂存区中所有能够与其合并的字符串合并后再入暂存区。
  - 好处：完全避免空间浪费
  - 好处：`uint64_t bytes_pending() const`函数真的很简单。
  - 坏处：不好写。

方案一对于空间的浪费太恐怖了，因此无疑选择方案二。在该方案之下，将数据推入暂存区仍需要与其他字符串比较有无重叠部分，进行`Case 1 ~ maybe`的处理。

### 调试部分

- Error 1:
  - ![check1_error1](\../imgs/Computer-Networking-Experiments/check1/check1_error1.png)
  - 只需要输入的字符串能够覆盖`expect_index_`即需要被推给`output_`。
- Errro 2:
  - ![check1_error3](\../imgs/Computer-Networking-Experiments/check1/check1_error3.png)
  - `last string`的意义：
    - 标志输入流结束位置的索引
    - 不代表输入的结束与否
    - 在接收完数据后，如果结束位置前的数据全部被接收，那么也就意味着这些数据已经被全部写入`output_`，此时可以关闭`output_`的输入端。
  - 错误样例：标志结束位置应当为3（`abc\0`），而才读了两位，故不能设置`is_finished`为`true`。
- Error 3：
  - ![check1_error4](\../imgs/Computer-Networking-Experiments/check1/check1_error4.png)
  - ![check1_error5](\../imgs/Computer-Networking-Experiments/check1/check1_error5.png)
  - 接收到应当存入暂存区的字符串时，需要考虑所有的重叠问题。

## (c) Remaining Bugs: 

Nothing.🥳

## (d) Experimental results and performance: 

![check1_succ](\../imgs/Computer-Networking-Experiments/check1/check1_succ.png)

