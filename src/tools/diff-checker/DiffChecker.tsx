// src/tools/diff-checker/DiffChecker.tsx
import { useState } from 'react'
import { diffLines } from 'diff'

interface Props { lang: 'zh' | 'en' }

export default function DiffChecker({ lang }: Props) {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [diffResult, setDiffResult] = useState<ReturnType<typeof diffLines> | null>(null)
  const isZh = lang === 'zh'

  const compare = () => {
    if (!left && !right) return
    setDiffResult(diffLines(left, right))
  }

  const clear = () => { setLeft(''); setRight(''); setDiffResult(null) }

  const added = diffResult?.filter(p => p.added).reduce((n, p) => n + (p.count ?? 0), 0) ?? 0
  const removed = diffResult?.filter(p => p.removed).reduce((n, p) => n + (p.count ?? 0), 0) ?? 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {isZh ? '原始文本' : 'Original Text'}
          </label>
          <textarea
            className="tool-textarea min-h-[240px]"
            placeholder={isZh ? '在此粘贴原始内容...' : 'Paste original content here...'}
            value={left}
            onChange={e => setLeft(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {isZh ? '修改后文本' : 'Modified Text'}
          </label>
          <textarea
            className="tool-textarea min-h-[240px]"
            placeholder={isZh ? '在此粘贴修改后内容...' : 'Paste modified content here...'}
            value={right}
            onChange={e => setRight(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={compare} type="button" className="tool-btn-primary">
          🔍 {isZh ? '对比差异' : 'Compare'}
        </button>
        <button onClick={clear} type="button" className="tool-btn-secondary">
          🗑️ {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {diffResult && (
        <div className="space-y-3">
          {/* 统计 */}
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">+{added} {isZh ? '行新增' : 'lines added'}</span>
            <span className="text-red-500 font-medium">-{removed} {isZh ? '行删除' : 'lines removed'}</span>
          </div>

          {/* Diff 输出 */}
          <div className="rounded-xl border border-gray-200 overflow-hidden font-mono text-sm">
            {diffResult.map((part, i) => {
              const lines = part.value.split('\n').filter((_, idx, arr) => idx < arr.length - 1 || part.value.endsWith('\n') || arr[idx])
              return lines.map((line, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`px-4 py-0.5 ${
                    part.added
                      ? 'bg-green-50 text-green-800 border-l-4 border-green-400'
                      : part.removed
                        ? 'bg-red-50 text-red-800 border-l-4 border-red-400'
                        : 'text-gray-700'
                  }`}
                >
                  <span className="select-none text-gray-400 w-4 inline-block mr-2">
                    {part.added ? '+' : part.removed ? '-' : ' '}
                  </span>
                  {line || '\u00A0'}
                </div>
              ))
            })}
          </div>
        </div>
      )}
    </div>
  )
}
