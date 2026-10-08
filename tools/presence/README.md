# 顶部近况组件

位置：Shotsuke 右侧。桌面悬浮、键盘聚焦或手机点击展开；Esc、点击外部可关闭。
文案：`小㊗️正在：XXX`。每项数据按实际采样时间独立过期，期限 1 小时。

## 数据流

- `Update presence` 每小时第 7、17、27、37、47、57 分钟查询小米健康云，仅提取最新心率和当天步数。
- Mac／Windows 登录用户的上报程序每 10 分钟发送前台应用名与活动类别，通过 `repository_dispatch` 触发同一 Actions 更新程序，同时刷新小米健康云，作为定时调度延迟时的补充。两台电脑都运行时，云端查询可能比 10 分钟更频繁。健康查询最多等待 45 秒，失败仍会发布电脑状态并保留旧健康样本的原时间。GitHub 可能延迟调度，页面显示的是最近一次采样。
- 输出发布到独立分支 `presence-data/status.json`，不重新构建整个博客。浏览器每分钟读取一次。该分支和历史版本是公开数据，只输出明确列出的字段。
- 电脑关闭、睡眠、无网络或停止上报时，旧样本自然过期；鼠标键盘 5 分钟无操作时报告“离开电脑”。离开不等于入睡。
- 当前未验证实时入睡信号，不根据心率或电脑闲置推断睡眠。睡觉状态可暂时手动指定。

## 启用顺序

1. 将这些代码合并／推送到默认分支。现有 Pages workflow 构建博客。
2. 在仓库 Actions Secrets 中配置 `MI_USER_ID` 和 `MI_PASS_TOKEN`。凭据来自本机已经扫码登录的测试项目；凭据只提供给 GitHub 上的状态更新任务（定时、手动或电脑上报触发），不能放入代码、状态 JSON、构建产物或日志。
3. 手动执行 `Update presence`（activity=keep），确认独立数据分支创建且心率时间正确。GitHub runner 能否成功登录小米，需要上线时验证。
4. 两台电脑各自配置 GitHub CLI 登录。最小权限为仅该仓库 Contents: write 的细粒度 token，用于 `repository_dispatch`；不要在公开脚本里填写 token。可用 GitHub CLI 的系统凭据存储。
5. 安装下列上报程序。无需心率广播、无需解除手机配对。

扫码登录态失效时，重新在本地小米测试页扫码，再更新 Secrets。任务保留旧数据的原采样时间，并产生 warning，前端照常将它标为过期。

## Mac

需要 Python 3、GitHub CLI、Xcode Command Line Tools（用于编译 Swift）。

```sh
sh tools/presence/agents/install-mac.sh
```

安装目录：`~/Library/Application Support/ShotsukePresence`。
如果访问 GitHub 需要代理，可在运行安装器时传入 `HTTPS_PROXY`；安装器会将显式设置保存在本机服务配置中。
服务：`~/Library/LaunchAgents/io.shotsuke.presence.plist`，只在用户登录时运行。
编辑安装目录下 `config.json` 的应用分类或 `private_apps` 可屏蔽指定应用。
测试不上传：在安装目录运行 `python3 report.py --dry-run`。
暂停：`launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/io.shotsuke.presence.plist`。
恢复：`launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/io.shotsuke.presence.plist`。

## Windows

在目标电脑安装并登录 GitHub CLI，然后从仓库运行：

```powershell
& .\tools\presence\agents\install-windows.ps1
```

安装目录：`%LOCALAPPDATA%\ShotsukePresence`；计划任务：`ShotsukePresence`。
脚本只读取前台窗口所属进程名和闲置时长，不调用读取窗口标题的 API。
需要当前用户的 PowerShell 执行策略允许本地脚本；安装器不会修改系统执行策略。
测试不上传：`& "$env:LOCALAPPDATA\ShotsukePresence\report-windows.ps1" -DryRun`。
暂停／恢复：任务计划程序中禁用／启用 `ShotsukePresence`。

在两台电脑的 `config.json` 中将游戏应用／进程名加入 `gaming_apps`。
Steam 客户端本身不代表正在游戏；浏览器统一归类为“浏览网页”，不读取 URL 或页面标题。
未知应用显示“使用电脑”。工作应用列表可自行补充。所有上报字段经过发布端白名单校验。

## 手动状态

在 GitHub Actions → Update presence → Run workflow 中选择状态和有效分钟数（1–720）。
`auto` 清除覆盖，`keep` 不改变覆盖。手动状态优先于设备上报，到期自动恢复。
电脑状态以未过期、非闲置设备的最新报告为准，两台设备的具体信息始终分别展示。

## 验证

```sh
python3 -m unittest discover -s tools/presence/tests
node --test tools/presence/tests/presence.test.cjs
npm run build
python3 themes/polar-night/tests/check_build.py
```

小米读取代码使用已核对的 `HUAYUE1024/mi-fitness-mcp-cn` 固定版本，其许可与依赖由 requirements 中的源项目提供。这里只读取原始心率和步数；跨来源步数采用当天步数最多的单一来源，避免叠加同一段活动。首次上线仍需与手机总数核对。
