# 穆夏风格图片工作室

**语言：** [English](README.md) | 简体中文

**仓库导航：** [全部技能（English）](../../README.md) | [全部技能（中文）](../../README.zh-CN.md)

**把一个创意，或一张珍爱的照片，变成具有阿尔丰斯·穆夏灵感的新艺术风格作品。**

`mucha-gpt-image-studio` 是一个用于生成精致穆夏风头像、宠物海报、邀请函插画、菜单装饰框、朋友圈背景图、壁纸和其他装饰性图片的 Agent Skill。它的核心是审美与构图约束；执行时既可以使用 Agent 自带的图片工具，也可以使用 OOMOL 提供的可恢复 GPT Image 2 工作流。

## 看看实际效果

以下四张为该 Skill 生成的典型成品，用于让用户在使用前快速判断它适合的视觉方向。它们不是只能复用的固定模板：用户可以替换主体、配色、文案或参考照片，同时沿用穆夏式的新艺术风格方向。

<table>
  <tr>
    <td width="50%" align="center">
      <a href="examples/mucha-corgi-poster.png"><img src="examples/mucha-corgi-poster.png" alt="穆夏风花卉小柯基海报" width="100%"></a><br>
      <strong>花卉小柯基海报</strong>
    </td>
    <td width="50%" align="center">
      <a href="examples/mucha-jiangnan-portrait.png"><img src="examples/mucha-jiangnan-portrait.png" alt="穆夏风江南女子肖像" width="100%"></a><br>
      <strong>江南婉约人物肖像</strong>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <a href="examples/mucha-huaiyang-menu.png"><img src="examples/mucha-huaiyang-menu.png" alt="穆夏风淮扬菜菜单" width="100%"></a><br>
      <strong>淮扬雅宴菜单</strong>
    </td>
    <td width="50%" align="center">
      <a href="examples/mucha-huizhou-architecture.png"><img src="examples/mucha-huizhou-architecture.png" alt="穆夏风徽派建筑风景" width="100%"></a><br>
      <strong>徽派建筑风景</strong>
    </td>
  </tr>
</table>

## 能做什么

### 1. 依据文字描述生成原创穆夏风图片

描述主体、用途、情绪和配色即可。Skill 会选择合适画幅，并使用穆夏式的视觉语言：流动线条、花卉光环、装饰边框、印刷纸张质感和具有呼吸感的编辑式构图。

### 2. 将照片转成穆夏风艺术作品

提供人物、宠物、物品或产品照片后，Skill 会自动进入参考图编辑模式。源图永远放在第一张，并在提示词中明确要保留的特征，例如狗狗的毛色、花纹、耳朵、比例和表情；同时改变背景、配色、装饰和插画风格。

这是艺术化转换，不承诺人物身份、尺码、版型或印花细节绝对一致。

### 3. 按最终用途匹配构图

| 需求 | 默认交付 |
| --- | --- |
| 头像或个人肖像 | `1024x1024`，清晰裁切边缘与花卉光环 |
| 海报、菜单或邀请函 | `1024x1536`，装饰框与可放文字的留白区域 |
| 朋友圈背景或社交横幅 | `1536x1024`，预留文案或 UI 空间 |
| 手机壁纸 | `1024x1536`，竖版构图且底部保留安全区域 |

Skill 使用 `mucha-pet-poster`、`mucha-profile-portrait`、`mucha-menu-frame`、`mucha-event-poster`、`mucha-social-background`、`mucha-seasonal-card` 等创作原型，让每种成品都有对应构图，而不是只在提示词后面追加“穆夏风”。

### 4. 优先使用当前环境已有的图片能力

已经安装 OOMOL 时，Skill 使用可恢复的 GPT Image 2 runner；没有安装 OOMOL、但 Agent 自带图片生成或编辑工具时，直接使用原生工具，不额外引入依赖。只有两种能力都不存在时，才进入 OOMOL 引导安装。

## 两条执行路径

- **已安装 OOMOL：** 使用已认证的 `oo` CLI 和 `gpt-image-2` 配套 Skill，负责上传、生成、轮询、恢复和下载。
- **未安装 OOMOL：** 优先使用 Agent 自带的图片生成或编辑工具，不要求用户安装 OOMOL。
- **两者都不可用：** Agent 简要说明缺少图片执行能力，再提供 OOMOL 官方安装引导，并在安装后继续用户原来的创作需求。

不要把 API Key 写入 Skill 或提交到仓库。

## 小红书 RED Skill 上传

根据上传页显示的白名单，当前 Skill 不需要转换代码。上传包包含主 Skill 和两个按运行时分开的 Markdown reference：

```text
mucha-gpt-image-studio/
├── SKILL.md
└── references/
    ├── native-image-runtime.md
    └── oomol-runtime.md
```

OOMOL 路径使用普通的 `scripts/run_image.js`，不需要 `.mjs`。仓库中的 PNG 示例和 `agents/openai.yaml` 不放进上传包。

## 让 Agent 安装

将以下请求复制给你的 Agent：

```text
请将 https://github.com/alwaysmavs/agent-skills 中的 mucha-gpt-image-studio skill 安装到我当前 Agent 的 skills 目录，并遵循 SKILL.md 选择当前可用的运行方式：已安装 OOMOL 时使用 OOMOL；未安装但 Agent 自带图片工具时直接使用原生工具；两者都没有时再引导安装 OOMOL。请重点遵循其中的穆夏风艺术指导，保留我提供的人物或宠物特征，并展示最终图片，而不是只报一个本地路径。
```

面向 Agent 的运行步骤、参考图处理、任务恢复、交付检查和失败处理请阅读 [SKILL.md](SKILL.md)。

## 设计与交付说明

- 海报和菜单中的生成文字应尽量短，并逐字校对。若是商用、法律、多语言或必须完全正确的文字，请先生成留白的艺术底图，再在设计工具中排最终文字。
- 需要一套素材时，应分别生成海报、背景图和头像等不同用途的图片，而不是用一批相似变体替代。
- 图片会使用稳定、描述性的文件名保存，并预览或附给用户。请求透明背景时，应检查交付文件是否为保留 alpha 通道的 PNG。
