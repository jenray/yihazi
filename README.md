<div align="center">
  <h1>⚡ 一哈子 (Yihazi) - 效率工具集</h1>
  <p><strong>免费、本地化、注重隐私的在线开发者工具箱</strong></p>

  <p>
    <a href="https://yihazi.com/"><img src="https://img.shields.io/badge/Website-yihazi.com-blue?style=for-the-badge&logo=vercel" alt="Website" /></a>
    <img src="https://img.shields.io/badge/Astro-5.0-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

<br/>

**一哈子 (Yihazi)** 是一个基于 **Astro 5 + React 19 + Tailwind CSS 3** 构建的多语言全静态在线工具箱。项目采用纯浏览器本地处理机制，不依赖任何后端 API，旨在提供最快、最安全、最沉浸式的开发者体验。

“一哈子”取自四川方言，意为“一会儿”，寓意我们希望每一位用户都能在“一哈子”内搞定琐碎的数据处理需求。

---

## ✨ 核心特性

- 🔒 **本地处理，隐私优先**：所有数据转换、编码和文件处理均在您的浏览器本地执行，绝不上传任何数据到服务器。
- ⚡️ **极致的加载性能**：受益于 Astro 的局部水合技术（Islands Architecture），页面默认以纯静态 HTML 输出，按需加载 React 交互脚本。
- 🌍 **国际化双语支持**：无缝支持 **简体中文** 和 **English**，拥有原生的 `hreflang` 搜索引擎优化与完全本地化的多语言路由。
- 🧑‍💻 **开发者友好**：支持暗黑模式（即将推出）、响应式布局、完善的代码高亮与便捷的一键“复制”功能。
- 📦 **边缘节点的静态托管**：专为 Cloudflare Pages / Vercel 等平台设计，支持零配置构建即发布。

## 🛠️ 全家桶工具集
当前版本包含分为四大类的 **20个高效工具**：

### 📝 文本与代码工具
- [x] JSON 格式化验证 (JSON Formatter)
- [x] Base64 编码解码 (Base64 Codec)
- [x] URL 编码解码 (URL Codec)
- [x] 文本字数/单词统计 (Word Counter)
- [x] 文本对比差异 (Diff Checker)
- [x] Markdown 实时预览 (Markdown Preview)
- [x] 文本/驼峰/蛇形格式转换 (Case Converter)

### 🔒 加密与安全工具
- [x] 安全随机密码生成器 (Password Generator)
- [x] MD5/SHA256等哈希计算 (Hash Generator)
- [x] UUID/GUID 批量生成器 (UUID Generator)
- [x] JWT 结构离线解析验证 (JWT Decoder)

### 📊 数据图表与计算
- [x] 二维码生成器 (QR Code Generator)
- [x] Unix 时间戳日期转换 (Timestamp Converter)
- [x] 颜色进制转换/选择器 (Color Converter)
- [x] 长度/重量/温度等单位换算 (Unit Converter)

### 🎨 前端及设计生成
- [x] 智能图片前端在线压缩 (Image Compressor) - 支持 PNG/JPG/WebP 输出
- [x] CSS 多彩渐变代码生成 (CSS Gradient Generator)
- [x] 正则表达式高亮测试 (Regex Tester)
- [x] URL SEO 友好 Slug 生成器 (Slug Generator)
- [x] Lorem Ipsum 无意义文章占位符 (Lorem Ipsum Generator)

---

## 🚀 本地运行与开发

项目采用 [`pnpm`](https://pnpm.io/) 作为包管理器。

```bash
# 1. 克隆项目
git clone https://github.com/jenray/yihazi.git
cd yihazi

# 2. 安装依赖包
pnpm install

# 3. 启动本地开发服务器 (默认端口 http://localhost:4321)
pnpm run dev

# 4. 构建静态产物用于生产发布 (产物位于 ./dist)
pnpm run build

# 5. 在本地预览构建产物
pnpm run preview
```

## 🏗️ 架构结构

```plaintext
yihazi/
├── public/                 # 静态资源、robots.txt、重定向配置等
├── src/
│   ├── components/         # Astro 通用布局组件（页头、页脚、面包屑）
│   ├── data/               # 所有工具的配置与元数据检索数据
│   ├── i18n/               # 中英双语对照翻译与类型文件
│   ├── layouts/            # 页面框架（BaseLayout 注入 Meta，ToolLayout 包裹工具）
│   ├── pages/              # Astro 基于文件系统的路由目录
│   │   ├── tools/          # -> 中文路由
│   │   └── en/tools/       # -> 英文路由
│   ├── tools/              # 核心层：承载各工具的具体 React 业务组件与逻辑库
│   └── ui/                 # 跨工具复用的底层 React 基础骨架组件（Dropzone, Button）
├── astro.config.mjs        # Astro 及 Sitemap 插件配置文件
├── tailwind.config.mjs     # 顺滑自适应样式表调色盘定义，采用 Tailwind CSS v3
└── package.json            # 生产依赖项和开发依赖脚本描述
```

## 📄 依赖许可说明
本应用在实现各种计算工具时，依赖了多个优秀的开源类库（涵盖加解密、校验、语法高亮等），特别感谢：
* `qrcode` - 二维码绘制驱动
* `crypto-js` - 支撑多种哈希运算
* `diff` & `marked` - 用于文本计算渲染的核心基准
* `compressorjs` - 优秀的画布级前端图片压缩方案

## 🤝 贡献规范
对本项目有任意改善意见或是希望能加入新的实用工具？欢迎提出 Issue 或者是递交一个 PR！
在提交 PR 之前，请通过 `pnpm build` 命令验证一下全部类型的页面均可以完美渲染不产生构建冲突。

## 📜 许可证 (License)
基于 **[MIT License](./LICENSE)** 分发。您可以自由地在你的项目中复用、重构和部署！
