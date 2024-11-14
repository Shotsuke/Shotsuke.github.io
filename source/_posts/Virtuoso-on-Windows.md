---
title: 在windows环境下配置virtuoso <Virtuoso on Windows>
date: 2024-11-14 00:00:00
categories: "Environment Build"
tags: 
	- Note
	- Environment
	- Virtuoso
excerpt: 让Virtuoso在windows上跑起来，如果你的数据量还巨大！
---

环境：
- Windows11
- Virtuoso7.2

配置：
- 处理器	12th Gen Intel(R) Core(TM) i9-12900H   2.50 GHz
- 机带 RAM	32.0 GB
- 系统类型	64 位操作系统, 基于 x64 的处理器

# 前言

花了相当长的时间。因为数据巨大（125GB）而且自己也不熟悉，因此每一次的试错时间十分长。现在想来是踩了大坑，不如先导入一个小的数据集试试。

**三周前**

发现需要操作的数据量巨大，原始数据量达到400G，过滤后的数据有125G，因此~~合理地~~摸鱼等待大容量固态寄到。

**两周前**

尝试在VMWARE * Ubuntu23和WSL上过滤数据。在VMWARE虚拟机下的Ubuntu本身就性能不佳，再运行这么大量的数据，不如卡死算了。接下来换到WSL上，跑~~睡~~了一晚上发现就处理了约10%，因此~~偷个懒~~从前辈手里直接拿到过滤后的数据。

接下来尝试在WSL运行Virtuoso，导入速度很慢~~因此又睡了好多晚上~~，但好歹是在跑，把示例代码跑过了。

**一周前**

但是导入的速度就这么慢了，接下来的实验速度想必会更慢，因此希望能够在自己机子的win环境下运行，想必能够提升速度。

# 配置Virtuoso正文

实际运行效果，导入125G花费`52583266 ms = 14.6 h`，至少不用再睡好几天了：

![succ_load](\../imgs/Virtuoso-on-Windows/succ_load.jpg)

## 1. 安装Virtuoso

[https://sourceforge.net/projects/virtuoso/files/virtuoso/](https://sourceforge.net/projects/virtuoso/files/virtuoso/)

下载`for_Windows.exe`，运行。

## 2. 调整设置

在`database/virtuoso.ini`中修改配置：
```
DirsAllowed			= ., ../vad
```
在后边加入自己的数据库的文件夹路径。

对于**需要运行巨大数据集**，务必修改这两个值，否则等着睡好几天。在这上边注释已经提醒了，给出了如果硬盘空间确保足够的话推荐更改的值。
```
NumberOfBuffers          =
MaxDirtyBuffers          =
```

## 3. 启动本地服务

不确定的话，先管理员权限运行`srv_delete.bat`，确保没有服务正在运行（如果服务正在运行，此时修改的`database/virtuoso.ini`不生效，需要重启服务）。此后管理员权限运行`srv_create.bat`启动本地服务，默认在`localhost:8890`。在网页`localhost:8890/conductor/`中可以见到页面，默认用户名和密码都是dba。

## 4. 批量导入数据集

管理员权限进入到`/bin`文件夹，执行`isql 1111 dba dba`，即interactive sql，在1111端口，以用户名dba，密码dba进行登录，成功后会有SQL交互。

之后执行

```powerprint
ld_dir('your_dataset_folder', 'your_dataset_name', 'dataset_name'); 
rdf_loader_run();
delete from db.dba.load_list;
```

来导入数据。记得要删除load_list，然后重启服务端即可。
至此已经完成了导入。
在此处能够看到自己导入的数据集：
![succ_load_graph](\../imgs/Virtuoso-on-Windows/succ_load_graph.jpg)
成功运行示例代码：
![succ_search_example](\../imgs/Virtuoso-on-Windows/succ_search_example.jpg)

# 踩过的坑和思考

**为什么需要修改`NumberOfBuffers, MaxDirtyBuffers`这两个值？**

不论有没有导入完，来到`database/virtuoso.log`看一看，会看见一堆的：
- `Write wait on column page <number>. Waits should be on the index leaf page, except when col page is held for read by background write`
- 和少量的`* Monitor: High disk read (2)`
- `* Monitor: CPU% is low while there are large numbers of runnable threads`。

![deadlock](\../imgs/Virtuoso-on-Windows/deadlock.jpg)

这个“问题”老早就有了：[https://github.com/openlink/virtuoso-opensource/issues/44](https://github.com/openlink/virtuoso-opensource/issues/44)。那么为什么issue至今仍open并且没人管呢？根据issue上的描述来看，这是一个deadlock死锁，但是**virtuoso是可以自己解决的**。

**如果**不改这两个值，那么这个125G的玩意需要导入两天多。因此推断这两个值和死锁发生的频率有关，对比前后的log日志得到证实。死锁的频率越高，耗时越长。

**思考**：根据变量名，应该能够得知：
- `NumberOfBuffers`表示当前正在使用的缓冲区数量。
- `MaxDirtyBuffers`表示可以标记为“脏”的缓冲区最大数量。
在写入数据前需要上锁，因此这两个变量控制了写入的速度。如果在导入过程中不断地执行

```SPARQL
SELECT (COUNT(*) AS ?TripleCount)
WHERE { GRAPH <graph_name> { ?s ?p ?o } };
```

查看已经导入的三元组的数量，可以发现在前段的导入速度明显高于后段。这也许表明了底层的数据是以树形结构来存的，例如B+树。