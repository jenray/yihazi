// src/tools/base64-codec/Base64Codec.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

export default function Base64Codec({ lang }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const isZh = lang === 'zh'

  const process = () => {
    if (!input.trim()) return
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))))
      }
      setError('')
    } catch {
      setError(isZh ? '输入内容无法解码，请检查是否为有效的 Base64 字符串' : 'Unable to decode input. Please check if it is valid Base64.')
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setError('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  const clear = () => { setInput(''); setOutput(''); setError('') }

  return (
    <div className="space-y-4">
      {/* 模式切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('encode'); setError('') }}
          type="button"
          className={mode === 'encode' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '编码 → Base64' : 'Encode → Base64'}
        </button>
        <button
          onClick={() => { setMode('decode'); setError('') }}
          type="button"
          className={mode === 'decode' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '解码 ← Base64' : 'Decode ← Base64'}
        </button>
      </div>

      <textarea
        className="tool-textarea"
        placeholder={
          mode === 'encode'
            ? (isZh ? '输入要编码的文本...' : 'Enter text to encode...')
            : (isZh ? '输入要解码的 Base64 字符串...' : 'Enter Base64 string to decode...')
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
      />

      <div className="flex gap-3 flex-wrap">
        <button onClick={process} type="button" className="tool-btn-primary">
          {mode === 'encode' ? (isZh ? '编码' : 'Encode') : (isZh ? '解码' : 'Decode')}
        </button>
        {output && (
          <button onClick={swap} type="button" className="tool-btn-secondary">
            🔄 {isZh ? '结果作为输入' : 'Use as Input'}
          </button>
        )}
        <button onClick={clear} type="button" className="tool-btn-secondary">
          🗑️ {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{isZh ? '结果' : 'Result'}</label>
            <CopyButton text={output} label={isZh ? '复制' : 'Copy'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
          </div>
          <pre className="tool-output max-h-[300px] break-all whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}
