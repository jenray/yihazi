// src/data/tools.ts
export type ToolCategory = 'text' | 'image' | 'developer' | 'generator' | 'converter' | 'calculator'

export interface ToolMeta {
  slug: string
  icon: string           // emoji 图标
  category: ToolCategory
  tags: string[]         // 搜索用标签
  isNew?: boolean
  isPopular?: boolean
}

export const tools: ToolMeta[] = [
  // === 文本工具 ===
  {
    slug: 'word-counter',
    icon: '🔢',
    category: 'text',
    tags: ['word', 'count', 'character', '字数', '统计', 'words', 'characters'],
    isPopular: true,
  },
  {
    slug: 'case-converter',
    icon: '🔤',
    category: 'text',
    tags: ['case', 'uppercase', 'lowercase', 'camel', 'snake', 'kebab', '大小写'],
  },
  {
    slug: 'diff-checker',
    icon: '🔍',
    category: 'text',
    tags: ['diff', 'compare', 'text', '对比', '差异', 'difference'],
  },
  {
    slug: 'slug-generator',
    icon: '🔗',
    category: 'text',
    tags: ['slug', 'url', 'seo', 'permalink'],
  },
  {
    slug: 'lorem-ipsum-generator',
    icon: '📝',
    category: 'text',
    tags: ['lorem', 'ipsum', 'placeholder', '占位文本', 'dummy text'],
  },
  {
    slug: 'markdown-preview',
    icon: '📑',
    category: 'text',
    tags: ['markdown', 'preview', 'editor', '预览', 'md'],
  },

  // === 图片工具 ===
  {
    slug: 'image-compressor',
    icon: '🖼️',
    category: 'image',
    tags: ['image', 'compress', 'png', 'jpg', 'webp', '图片', '压缩', 'photo'],
    isPopular: true,
  },
  {
    slug: 'color-converter',
    icon: '🎨',
    category: 'converter',
    tags: ['color', 'hex', 'rgb', 'hsl', 'color picker', '颜色', '转换'],
  },
  {
    slug: 'css-gradient-generator',
    icon: '🌈',
    category: 'developer',
    tags: ['css', 'gradient', '渐变', '生成', 'linear', 'radial'],
    isNew: true,
  },

  // === 开发工具 ===
  {
    slug: 'json-formatter',
    icon: '📋',
    category: 'developer',
    tags: ['json', 'format', 'beautify', 'validate', '格式化', '美化', 'minify'],
    isPopular: true,
  },
  {
    slug: 'base64-codec',
    icon: '🔐',
    category: 'developer',
    tags: ['base64', 'encode', 'decode', '编码', '解码'],
    isPopular: true,
  },
  {
    slug: 'url-codec',
    icon: '🌐',
    category: 'developer',
    tags: ['url', 'encode', 'decode', 'percent', '编码', 'urlencode'],
  },
  {
    slug: 'hash-generator',
    icon: '🔒',
    category: 'developer',
    tags: ['hash', 'md5', 'sha', 'sha256', 'sha1', 'sha512', '哈希', 'checksum'],
  },
  {
    slug: 'regex-tester',
    icon: '🧪',
    category: 'developer',
    tags: ['regex', 'regular expression', 'regexp', 'test', '正则', '表达式'],
  },
  {
    slug: 'jwt-decoder',
    icon: '🎫',
    category: 'developer',
    tags: ['jwt', 'token', 'decode', 'json web token'],
  },
  {
    slug: 'timestamp-converter',
    icon: '⏱️',
    category: 'converter',
    tags: ['timestamp', 'unix', 'epoch', 'date', 'time', '时间戳', '时间'],
    isPopular: true,
  },

  // === 生成工具 ===
  {
    slug: 'qr-code-generator',
    icon: '📱',
    category: 'generator',
    tags: ['qr', 'qrcode', 'barcode', '二维码', 'qr code'],
    isPopular: true,
  },
  {
    slug: 'password-generator',
    icon: '🔑',
    category: 'generator',
    tags: ['password', 'random', 'secure', '密码', '随机', 'passphrase'],
    isPopular: true,
  },
  {
    slug: 'uuid-generator',
    icon: '🆔',
    category: 'generator',
    tags: ['uuid', 'guid', 'unique id', '唯一标识'],
  },

  // === 转换工具 ===
  {
    slug: 'unit-converter',
    icon: '📐',
    category: 'converter',
    tags: ['unit', 'length', 'weight', 'temperature', '单位', '转换', 'measure'],
  },
]

// 按分类分组的工具函数
export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category)
}

export function getPopularTools(): ToolMeta[] {
  return tools.filter((t) => t.isPopular)
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase()
  return tools.filter(
    (t) =>
      t.slug.includes(q) ||
      t.tags.some((tag) => tag.includes(q))
  )
}
