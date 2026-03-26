// src/tools/markdown-preview/MarkdownPreview.tsx
import { useState, useMemo, useEffect } from 'react'
import { parse } from 'marked'
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

interface Props { lang?: string }

export default function MarkdownPreview({ lang = 'zh' }: Props) {
  const [md, setMd] = useState(DEFAULT_MD)
  const [tab, setTab] = useState<'split' | 'preview' | 'source'>('split')
  const [isMounted, setIsMounted] = useState(false)
  const isZh = lang === 'zh'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const html = useMemo(() => {
    if (!isMounted) return ''
    try {
      const parsed = parse(md, { breaks: true, gfm: true })
      // marked 最新版可能会返回 Promise，如果检测到是 Promise 我们直接给降级提示，或者因为我们没开 Async 它仍然是字符串。
      if (typeof parsed !== 'string') return '<p class="text-yellow-600">Pending render...</p>'
      return parsed
    } catch (e) {
      console.error('Markdown parse error:', e)
      return '<p class="text-red-500">Failed to parse markdown.</p>'
    }
  }, [md, isMounted])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[500px] border border-gray-100 rounded-xl bg-gray-50 text-gray-400 animate-pulse">
        {isZh ? '正在加载编辑器...' : 'Loading editor...'}
      </div>
    )
  }


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
