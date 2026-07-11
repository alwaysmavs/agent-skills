# Minimalist HTML PPT

一个面向产品经理、设计师、独立开发者和创意团队的 Agent Skill，用于生成可直接在浏览器播放的单文件 HTML 演示。

它不会把大纲机械地塞进模板，而是先建立一个完整的产品故事：从日常观察进入，放大一个容易忽略的细节，重新命名问题，再用证据、方案、取舍与验证让判断自然成立。

## 适合做什么

- 产品发布与产品故事
- 设计评审与体验决策
- 用户研究汇报
- 策略叙事与创意提案
- 适合录屏、投影或导出轮播图的浏览器原生演示

不适合大段财务表格、密集培训课件、多人实时编辑，或必须交付可编辑 PPTX 的工作流。

## 它包含什么

```text
minimalist-html-ppt/
├── SKILL.md
├── README.md
├── assets/
│   └── editorial-web-deck/
│       └── template.html
├── references/
│   ├── hara-method.md
│   ├── presentation-patterns.md
│   └── runtime.md
└── scripts/
    └── check-editorial-deck.js
```

## 使用方法

把整个 `minimalist-html-ppt` 目录放进 Agent 支持的 skills 目录，然后向 Agent 描述：

```text
请使用 minimalist-html-ppt，把我的产品材料整理成一套浏览器原生演示。
观众是……；我希望他们看完后……；已有素材包括……
```

模板输出为单 HTML 文件，不需要构建步骤。浏览器中支持：

- 方向键、空格、滚轮和触摸切页
- URL hash 定位页面
- `ESC` 打开页面索引
- `B` 关闭背景和元素动效，但保留横向切页
- `prefers-reduced-motion`、截图、打印和动画失败降级

为适配只接受普通 JavaScript 的 Skill 上传环境，目录中不包含 `.mjs`、ESM `import` / `export` 或 `type="module"`。检查器使用 CommonJS 风格的 `check-editorial-deck.js`，直接用 Node 运行即可。

运行检查：

```bash
node scripts/check-editorial-deck.js /path/to/index.html
```

## 设计方法

这套 Skill 将内容、视觉和运行时分开处理：

1. **故事方法**：普通观察、感知资源、reframe、证据和余味。
2. **视觉系统**：纸色、网格、语义强调色，以及衬线／无衬线／等宽字体角色。
3. **运行时**：横向切页、原生 Web Animations 语义动效、索引与静态降级。

视觉方向受到原研哉关于 WHITE、HAPTIC 与 RE-DESIGN 的公开方法启发，但不复制原研哉、MUJI 或任何既有作品的视觉样式。

## 技术参考与原创说明

本 Skill 的单文件 HTML、横向翻页、键盘／滚轮／触摸导航、索引和静态模式等运行时技术选型，参考了歸藏创建的开源项目 [`op7418/guizang-ppt-skill`](https://github.com/op7418/guizang-ppt-skill)。感谢该项目对浏览器原生 PPT 工作流的探索。

本项目没有复制归藏项目的视觉主题。当前的故事方法、暖纸色视觉系统、字体语义、页面构图、原生 Web Animations recipe、产品／设计评审定位及示例内容，均为本项目独立设计与实现。

归藏项目与本项目均可继续按照各自仓库的许可证和说明使用；重新分发 ZIP 前，请同时保留本 README 与仓库许可证。

## 小红书 / RED Skill 分享建议

发布时可以把本目录打包为 ZIP，并在笔记中同时展示：

- 一句真实的创作困境，而不是只列功能；
- 2–4 张最终页面或一段带动效的录屏；
- Skill 适合谁、不适合谁；
- ZIP 中包含什么、如何交给 Agent 使用；
- 明确的收藏、下载、试用和关注提示。

请以自己账号发布页实际显示的 RED Skill 上传资格、组件入口和平台规则为准。
