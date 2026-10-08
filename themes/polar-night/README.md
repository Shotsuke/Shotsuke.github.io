# Polar Night · 极夜来信

为 Shotsuke 的 Hexo 博客制作的独立主题。博客沿用朋友 shotsuke-site 的蓝灰暮色背景、圆角雪景和雪夜电台，可切换明亮模式；`/novel/` 是《生死逆转》的专属介绍页。

## 使用

博客根目录 `_config.yml` 已设置 `theme: polar-night`。使用已有的 Node.js 环境：

```sh
npm ci
npm run build
npm run server -- --ip 127.0.0.1
```

访问 `http://localhost:4000/` 和 `http://localhost:4000/novel/`。只修改主题源码后重新执行构建即可。切换其他主题时建议先 `npm run clean`，避免旧静态资源残留。若使用 pnpm，`pnpm install --lockfile=false` 与 `pnpm run build` 也可；仓库现有的 npm lockfile 没有修改。

## 页面和功能

- 首页、文章、分页、归档、分类、标签、关于和友邻共用主题。
- 小说介绍页由 `source/novel/index.md` 的 `layout: novel` 启用；阅读链接自动从文章 slug 查找，沿用原文 URL。
- 全文搜索按需加载本地 `search.json`，可用按钮或 `⌘/Ctrl + K` 打开；支持多关键词、空结果和网络失败重试。
- 手机导航、明亮／暮色切换、可关闭的飘雪、系统减少动态效果支持；小说页保留书信排版，以及极夜／余光切换。
- 文章提供目录、阅读进度、前后文章、代码块和表格横向滚动。MathJax 从仓库已有依赖生成本地资源，不需要 CDN。
- 正文字体优先使用设备上的宋体；没有外部字体或追踪脚本。
- 雪夜电台沿用朋友的 ghostpia 官网 BGM、播放／暂停和音量控件。播放器常驻页面，站内导航只更新正文，前进／后退、搜索跳转和分类分页都不会重建音频。记住暂停选择和音量，浏览器阻止自动播放时等待点击。
- 站内跳转保留地址、标题、当前导航与滚动位置，文章公式会重新排版。外链、下载、新窗口链接仍使用浏览器默认行为。请求失败或含独立脚本的页面回退为普通加载；手动刷新、外站和新标签页不属于连续播放范围。

## 配置与内容

编辑本主题 `_config.yml` 可调整导航、站点名、首页描述、背景图、社交链接、动效及人物立绘。首页的大标题和小说介绍文案分别位于 `layout/index.ejs` 与 `layout/novel.ejs`。

小说页只使用原作短篇中已经出现的内容，没有把尚未确定的长篇情节当作正式设定。目前小说页不展示人物介绍区。

## 人物素材


参考图、设定说明、配色与姿态要求放在博客根目录的 `design-assets/polar-night/characters/`；那里不会被 Hexo 输出到网站。

正式展示的透明背景 PNG / WebP 放在本主题的 `source/images/characters/`。推荐：

```text
themes/polar-night/source/images/characters/zero.png
themes/polar-night/source/images/characters/ying.png
```

然后设置：

```yaml
novel:
  title: 生死逆转
  english_title: LIFE AND DEATH REVERSAL
  post_slug: Life-and-Death-Reversal
  zero_image: /images/characters/zero.png
  ying_image: /images/characters/ying.png
```

建议提供全身或半身立绘，高度至少 1200px，周围保留少量透明边距，不必预先裁成相同尺寸。参考资料可按 `zero/`、`ying/` 分文件夹，并附上需要保留的细节。

## 视觉来源

本次按用户要求，从 `/Users/shotsuke/Dev/shotsuke-site/assets/` 接入朋友选用的 ghostpia 素材：

- 首页：`source/images/ghostpia-story.jpg`（1280×780，雪镇）。
- 小说：`source/images/ghostpia-top.jpg`（1920×1080，雪地少女）。
- 音乐：`https://ghostpia.xyz/sounds/bgm.mp3`，电台保留官网来源链接。
- 背景配色、圆角大图和电台样式由朋友版本移植，集中在 `source/css/afterglow.css`。小说内容结构继续使用本主题的 `layout/novel.ejs`。

以上图片及音乐来自 [ghostpia 官网](https://ghostpia.xyz/)，不属于本博客原创资产。旧的原创 `polar-town.webp` 保留为可选背景，制作记录见 `ART-DIRECTION.md`。没有参考 `onimai-style`。

`_config.yml` 中 `hero_image`、`novel_hero_image` 可分别替换两张图片；`music.enabled` 可关闭播放器，`music.src` 与 `music.volume` 可设置音源和默认音量（0–100）。无需在朋友的静态目录重新生成文章。

主题结构遵循 [Hexo 主题文档](https://hexo.io/docs/themes)；本地搜索与公式资源使用 [Hexo generator](https://hexo.io/api/generator)。

## 验证

构建后运行 `python3 themes/polar-night/tests/check_build.py`，检查导航、分页、主题资源和搜索文章链接；运行 `node --test themes/polar-night/tests/navigation.test.cjs` 检查连续翻页与旧公式数据块的回归用例。移动端与交互还应在浏览器中检查；本次已检查的尺寸与结果见 `VALIDATION.md`。
