// src/tools/hash-generator/HashGenerator.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'
import CryptoJS from 'crypto-js'

interface Props { lang?: string }

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'] as const
type Algorithm = (typeof algorithms)[number]

export default function HashGenerator({ lang }: Props) {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<Algorithm, string>>({} as Record<Algorithm, string>)
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>('SHA256')
  const isZh = lang === 'zh'

  const compute = () => {
    if (!input) return
    const newResults = {} as Record<Algorithm, string>
    newResults.MD5 = CryptoJS.MD5(input).toString()
    newResults.SHA1 = CryptoJS.SHA1(input).toString()
    newResults.SHA256 = CryptoJS.SHA256(input).toString()
    newResults.SHA512 = CryptoJS.SHA512(input).toString()
    setResults(newResults)
  }

  const clear = () => { setInput(''); setResults({} as Record<Algorithm, string>) }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {isZh ? '输入文本' : 'Input Text'}
          </label>
          <button onClick={clear} type="button" className="text-xs text-gray-500 hover:text-gray-700">
            🗑️ {isZh ? '清空' : 'Clear'}
          </button>
        </div>
        <textarea
          className="tool-textarea"
          placeholder={isZh ? '输入要计算哈希的文本...' : 'Enter text to hash...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <button onClick={compute} type="button" className="tool-btn-primary">
        🔒 {isZh ? '计算哈希' : 'Calculate Hash'}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{isZh ? '计算结果' : 'Results'}</h3>
          {algorithms.map((algo) => (
            <div key={algo} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono font-semibold text-gray-600">{algo}</span>
                <CopyButton
                  text={results[algo]}
                  label={isZh ? '复制' : 'Copy'}
                  copiedLabel={isZh ? '已复制！' : 'Copied!'}
                />
              </div>
              <p className="font-mono text-xs text-gray-800 break-all">{results[algo]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
