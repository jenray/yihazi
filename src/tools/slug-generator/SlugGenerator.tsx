// src/tools/slug-generator/SlugGenerator.tsx
import { useState, useMemo } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // 去掉 diacritics
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}]/gu, ' ') // 中文字符转空格
    .replace(/[^\w\s-]/g, '')          // 去除特殊字符
    .trim()
    .replace(/[\s_-]+/g, separator)    // 合并分隔符
}

export default function SlugGenerator({ lang }: Props) {
  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState('-')
  const isZh = lang === 'zh'

  const slug = useMemo(() => toSlug(input, separator), [input, separator])

  const examples = isZh
    ? ['Hello World', '如何学习 React', 'Getting Started with Next.js', 'SEO 优化指南 2024']
    : ['Getting Started with React', 'How to Learn TypeScript', '10 Best VS Code Extensions', 'CSS Tips & Tricks']

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {isZh ? '输入标题' : 'Input Title'}
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder={isZh ? '如：如何学习 React 入门' : 'e.g. Getting Started with React'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      {/* 分隔符 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{isZh ? '分隔符' : 'Separator'}:</label>
        {['-', '_', '.'].map(sep => (
          <button
            key={sep}
            type="button"
            onClick={() => setSeparator(sep)}
            className={`px-3 py-1 font-mono text-sm rounded-lg border transition-colors ${
              separator === sep ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {sep === '-' ? 'hyphen' : sep === '_' ? 'underscore' : 'dot'}  ({sep})
          </button>
        ))}
      </div>

      {/* 输出 */}
      {input && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <CopyButton text={slug} label={isZh ? '复制' : 'Copy'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
          </div>
          <code className="block font-mono text-base text-brand-700 break-all">{slug}</code>
        </div>
      )}

      {/* 示例快捷词 */}
      <div>
        <p className="text-sm text-gray-500 mb-2">{isZh ? '快速示例：' : 'Quick examples:'}</p>
        <div className="flex flex-wrap gap-2">
          {examples.map(ex => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
