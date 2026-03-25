// src/tools/password-generator/PasswordGenerator.tsx
import { useState, useCallback } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export default function PasswordGenerator({ lang }: Props) {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [count, setCount] = useState(1)
  const isZh = lang === 'zh'

  const generate = useCallback(() => {
    let charset = ''
    if (options.lowercase) charset += CHARSETS.lowercase
    if (options.uppercase) charset += CHARSETS.uppercase
    if (options.numbers) charset += CHARSETS.numbers
    if (options.symbols) charset += CHARSETS.symbols

    if (!charset) {
      setPassword(isZh ? '请至少选择一种字符类型' : 'Please select at least one character type')
      return
    }

    const passwords: string[] = []
    for (let j = 0; j < count; j++) {
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      let pw = ''
      for (let i = 0; i < length; i++) {
        pw += charset[array[i] % charset.length]
      }
      passwords.push(pw)
    }
    setPassword(passwords.join('\n'))
  }, [length, options, count, isZh])

  const strengthLabel = (): { text: string; color: string } => {
    let poolSize = 0
    if (options.lowercase) poolSize += 26
    if (options.uppercase) poolSize += 26
    if (options.numbers) poolSize += 10
    if (options.symbols) poolSize += 30
    const entropy = length * Math.log2(poolSize || 1)
    if (entropy < 40) return { text: isZh ? '弱' : 'Weak', color: 'text-red-500' }
    if (entropy < 60) return { text: isZh ? '一般' : 'Fair', color: 'text-yellow-500' }
    if (entropy < 80) return { text: isZh ? '强' : 'Strong', color: 'text-green-500' }
    return { text: isZh ? '非常强' : 'Very Strong', color: 'text-green-700' }
  }

  const strength = strengthLabel()
  const optionLabels: Record<string, string> = {
    lowercase: isZh ? '小写字母 (a-z)' : 'Lowercase (a-z)',
    uppercase: isZh ? '大写字母 (A-Z)' : 'Uppercase (A-Z)',
    numbers: isZh ? '数字 (0-9)' : 'Numbers (0-9)',
    symbols: isZh ? '符号 (!@#$...)' : 'Symbols (!@#$...)',
  }

  return (
    <div className="space-y-4">
      {/* 长度 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium w-28 flex-shrink-0">
          {isZh ? '长度' : 'Length'}: {length}
        </label>
        <input
          type="range" min="4" max="128" value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-500 w-8 text-right">{length}</span>
      </div>

      {/* 字符集选项 */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(options).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={val}
              onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
              className="rounded"
            />
            {optionLabels[key]}
          </label>
        ))}
      </div>

      {/* 数量 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{isZh ? '生成数量' : 'Count'}:</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border border-gray-200 rounded px-2 py-1 text-sm"
        >
          {[1, 5, 10, 20].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <span className={`ml-auto text-sm font-medium ${strength.color}`}>
          {isZh ? '密码强度' : 'Strength'}: {strength.text}
        </span>
      </div>

      <button onClick={generate} type="button" className="tool-btn-primary w-full">
        🔑 {isZh ? '生成密码' : 'Generate Password'}
      </button>

      {password && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              {isZh ? '生成结果' : 'Generated Password'}
            </label>
            <CopyButton
              text={password}
              label={isZh ? '复制' : 'Copy'}
              copiedLabel={isZh ? '已复制！' : 'Copied!'}
            />
          </div>
          <pre className="tool-output select-all">{password}</pre>
        </div>
      )}
    </div>
  )
}
