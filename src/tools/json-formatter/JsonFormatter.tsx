// src/tools/json-formatter/JsonFormatter.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

export default function JsonFormatter({ lang }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const isZh = lang === 'zh'

  const format = () => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentSize))
      setError('')
    } catch (e) {
      setError(isZh ? `JSON 格式有误：${(e as Error).message}` : `Invalid JSON: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const minify = () => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(isZh ? `JSON 格式有误：${(e as Error).message}` : `Invalid JSON: ${(e as Error).message}`)
      setOutput('')
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch {
      // 剪贴板访问失败时静默处理
    }
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  return (
    <div className="space-y-4">
      {/* 输入区 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {isZh ? '输入' : 'Input'}
          </label>
          <div className="flex gap-2">
            <button onClick={handlePaste} type="button" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              📋 {isZh ? '粘贴' : 'Paste'}
            </button>
            <button onClick={clear} type="button" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              🗑️ {isZh ? '清空' : 'Clear'}
            </button>
          </div>
        </div>
        <textarea
          className="tool-textarea"
          placeholder={isZh ? '在此粘贴 JSON...' : 'Paste your JSON here...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} type="button" className="tool-btn-primary">
          {isZh ? '格式化' : 'Format'}
        </button>
        <button onClick={minify} type="button" className="tool-btn-secondary">
          {isZh ? '压缩' : 'Minify'}
        </button>

        <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
          <label htmlFor="indent-select">{isZh ? '缩进' : 'Indent'}:</label>
          <select
            id="indent-select"
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 输出区 */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              {isZh ? '结果' : 'Result'}
            </label>
            <CopyButton
              text={output}
              label={isZh ? '复制' : 'Copy'}
              copiedLabel={isZh ? '已复制！' : 'Copied!'}
            />
          </div>
          <pre className="tool-output max-h-[400px]">{output}</pre>
        </div>
      )}
    </div>
  )
}
