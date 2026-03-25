// src/tools/markdown-preview/MarkdownPreview.tsx
import { useState, useMemo } from 'react'
import { marked } from 'marked'
import { CopyButton } from '../../ui/CopyButton'

const DEFAULT_MD = `# Hello, Markdown!

这是一个**实时预览**编辑器，输入 Markdown，右侧即时渲染。

## 功能列表

- 标题（H1 ~ H6）
- **粗体** 和 *斜体*
- 有序和无序列表
- \`行内代码\` 和代码块
- [链接](https://yihazi.com) 和图片
- 表格

## 代码示例

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

## 表格

| 名称 | 类型 | 说明 |
|------|------|------|
| name | string | 用户名 |
| age  | number | 年龄 |
`

interface Props { lang: 'zh' | 'en' }

export default function MarkdownPreview({ lang }: Props) {
  const [md, setMd] = useState(DEFAULT_MD)
  const [tab, setTab] = useState<'split' | 'preview' | 'source'>('split')
  const isZh = lang === 'zh'

  const html = useMemo(() => {
    marked.setOptions({ breaks: true, gfm: true })
    return marked.parse(md) as string
  }, [md])

  return (
    <div className="space-y-3">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-sm">
          {(['split', 'source', 'preview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              type="button"
              className={`px-3 py-1 rounded-md transition-colors font-medium ${
                tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'split'
                ? (isZh ? '分栏' : 'Split')
                : t === 'source'
                  ? (isZh ? '源码' : 'Source')
                  : (isZh ? '预览' : 'Preview')}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <CopyButton text={md} label={isZh ? '复制 MD' : 'Copy MD'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
          <CopyButton text={html} label={isZh ? '复制 HTML' : 'Copy HTML'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
        </div>
      </div>

      {/* 编辑/预览区 */}
      <div className={`grid gap-4 ${tab === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {(tab === 'split' || tab === 'source') && (
          <textarea
            className="tool-textarea min-h-[480px] font-mono text-sm"
            value={md}
            onChange={e => setMd(e.target.value)}
            spellCheck={false}
          />
        )}
        {(tab === 'split' || tab === 'preview') && (
          <div
            className="min-h-[480px] border border-gray-200 rounded-xl p-5 overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  )
}
