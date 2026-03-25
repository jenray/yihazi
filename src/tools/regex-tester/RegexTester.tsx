// src/tools/regex-tester/RegexTester.tsx
import { useState, useMemo } from 'react'

interface Props { lang: 'zh' | 'en' }

export default function RegexTester({ lang }: Props) {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')
  const isZh = lang === 'zh'

  const result = useMemo(() => {
    if (!pattern || !text) return null
    try {
      const re = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups: Record<string, string> | undefined }[] = []
      if (flags.includes('g')) {
        let m
        while ((m = re.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups })
          if (m.index === re.lastIndex) re.lastIndex++
        }
      } else {
        const m = re.exec(text)
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups })
      }
      // 构建高亮 HTML（将匹配项用 span 包裹）
      let highlighted = text
      if (matches.length > 0) {
        const reHighlight = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
        highlighted = text.replace(reHighlight, m =>
          `<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">${m.replace(/</g, '&lt;')}</mark>`
        )
      }
      return { matches, highlighted, error: null }
    } catch (e) {
      return { matches: [], highlighted: text, error: (e as Error).message }
    }
  }, [pattern, flags, text])

  const COMMON = isZh
    ? [
        { label: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
        { label: '手机号', pattern: '1[3-9]\\d{9}' },
        { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+' },
        { label: 'IP 地址', pattern: '\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b' },
      ]
    : [
        { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
        { label: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+' },
        { label: 'IPv4', pattern: '\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b' },
        { label: 'Hex Color', pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b' },
      ]

  return (
    <div className="space-y-4">
      {/* 常用正则 */}
      <div className="flex flex-wrap gap-2">
        {COMMON.map(c => (
          <button
            key={c.label}
            type="button"
            onClick={() => setPattern(c.pattern)}
            className="text-xs px-2.5 py-1 border border-gray-200 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 正则输入行 */}
      <div className="flex gap-2 items-center">
        <span className="font-mono text-gray-400 text-lg">/</span>
        <input
          type="text"
          className="flex-1 px-3 py-2 font-mono border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder={isZh ? '正则表达式...' : 'regex pattern...'}
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          spellCheck={false}
        />
        <span className="font-mono text-gray-400 text-lg">/</span>
        <input
          type="text"
          value={flags}
          onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
          className="w-16 px-2 py-2 font-mono border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="gim"
          maxLength={6}
        />
      </div>

      {/* 测试文本 */}
      <textarea
        className="tool-textarea"
        placeholder={isZh ? '输入要测试的文本...' : 'Enter test string...'}
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
      />

      {/* 结果 */}
      {result && (
        <div className="space-y-3">
          {result.error ? (
            <p className="text-red-500 text-sm">⚠️ {result.error}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">
                {result.matches.length > 0
                  ? (isZh ? `✅ 找到 ${result.matches.length} 个匹配` : `✅ ${result.matches.length} match${result.matches.length !== 1 ? 'es' : ''} found`)
                  : (isZh ? '❌ 未找到匹配' : '❌ No matches found')}
              </p>
              {/* 高亮显示 */}
              {text && (
                <div
                  className="p-3 border border-gray-200 rounded-xl font-mono text-sm whitespace-pre-wrap break-all bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: result.highlighted.replace(/</g, s => s === '<mark' || s === '</mark' ? s : '&lt;') }}
                />
              )}
              {/* 匹配详情 */}
              {result.matches.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">{isZh ? '匹配列表：' : 'Match list:'}</p>
                  {result.matches.slice(0, 20).map((m, i) => (
                    <div key={i} className="flex items-center gap-3 bg-yellow-50 rounded-lg px-3 py-1.5 text-sm">
                      <span className="text-xs text-gray-400">#{i + 1}</span>
                      <code className="font-mono text-yellow-800 flex-1">{m.match}</code>
                      <span className="text-xs text-gray-400">{isZh ? '位置' : 'at'} {m.index}</span>
                    </div>
                  ))}
                  {result.matches.length > 20 && (
                    <p className="text-xs text-gray-400 text-center">{isZh ? `... 还有 ${result.matches.length - 20} 个匹配` : `... and ${result.matches.length - 20} more`}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
