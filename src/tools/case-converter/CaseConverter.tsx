// src/tools/case-converter/CaseConverter.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (c) => c.toUpperCase())
}
function toSentenceCase(str: string): string {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
}
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}
function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/-/g, '_')
    .replace(/_+/g, '_')
}
function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/-+/g, '-')
}

export default function CaseConverter({ lang }: Props) {
  const [input, setInput] = useState('')
  const isZh = lang === 'zh'

  const conversions = input
    ? [
        { label: 'UPPERCASE', value: input.toUpperCase() },
        { label: 'lowercase', value: input.toLowerCase() },
        { label: 'Title Case', value: toTitleCase(input) },
        { label: 'Sentence case', value: toSentenceCase(input) },
        { label: 'camelCase', value: toCamelCase(input) },
        { label: 'PascalCase', value: toPascalCase(input) },
        { label: 'snake_case', value: toSnakeCase(input) },
        { label: 'kebab-case', value: toKebabCase(input) },
      ]
    : []

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {isZh ? '输入文本' : 'Input Text'}
          </label>
          {input && (
            <button onClick={() => setInput('')} type="button" className="text-xs text-gray-500 hover:text-gray-700">
              🗑️ {isZh ? '清空' : 'Clear'}
            </button>
          )}
        </div>
        <textarea
          className="tool-textarea"
          placeholder={isZh ? '输入要转换的文本...' : 'Enter text to convert...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={3}
        />
      </div>

      {conversions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            {isZh ? '转换结果' : 'Converted Results'}
          </h3>
          {conversions.map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <code className="text-xs font-mono font-semibold text-gray-600">{item.label}</code>
                <CopyButton
                  text={item.value}
                  label={isZh ? '复制' : 'Copy'}
                  copiedLabel={isZh ? '✓ 已复制' : '✓ Copied'}
                />
              </div>
              <p className="text-sm text-gray-800 break-all">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {!input && (
        <div className="text-center py-8 text-gray-300 text-6xl">🔤</div>
      )}
    </div>
  )
}
