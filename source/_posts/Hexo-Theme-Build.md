---
title: Hexo主题搭建日志 <LETS GO HEXO>
date: 2024-08-04 23:00:00
categories: "Biuld Notes"
tags: Note
---

前言：绪山真寻太可爱了！公式网站太可爱了！想要复刻！

# 阅读网页代码

`header`放在左侧，右上布置`oftwi_pc`社交链接，中间为`main`。

<div class="image-gallery">
    <img src="\../imgs/Hexo-Theme-Build/home1.jpg" alt="home1" width="45%" class="image-item"/>
    <img src="\../imgs/Hexo-Theme-Build/home2.jpg" alt="home2" width="45%" class="image-item"/>
</div>


在点开任意一个`header`中的标签后，`main`中的元素变化。

<img src="\../imgs/Hexo-Theme-Build/labelopen.jpg" alt="labelopen" width="45%" class="image-item"/>

# 编写


[来自官方文档](https://hexo.io/zh-cn/docs/themes)

创建 Hexo 主题非常简单，只需创建一个新文件夹即可。 并修改 _config.yml 内的 theme 设定，即可切换主题。 一个主题可能会有以下的结构：
```
.
├── _config.yml
├── languages
├── layout
├── scripts
└── source
```

我们可以暂时不要`languages`和`scripts`，只着手写`layout`和`source`。其中约定将布局放在`layout`文件夹，将素材放在`source`文件夹。具体而言，将html/ejs/njk放在layout中，将css和js放在source中。