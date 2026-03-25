// src/tools/word-counter/WordCounter.tsx
import { useState, useMemo } from 'react'

interface Props {
  lang: 'zh' | 'en'
}

export default function WordCounter({ lang }: Props) {
  const [text, setText] = useState('')
  const isZh = lang === 'zh'

  const stats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(Boolean).length : 0
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0
    const lines = text.trim() ? text.split('\n').length : 0
    const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
    const readingTimeMin = Math.max(1, Math.ceil((words + chineseChars) / 250))
    return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, chineseChars, readingTimeMin }
  }, [text])

  const statItems = isZh
    ? [
        { label: '字符数', value: stats.characters },
        { label: '字符数（无空格）', value: stats.charactersNoSpaces },
        { label: '单词数', value: stats.words },
        { label: '中文字数', value: stats.chineseChars },
        { label: '句子数', value: stats.sentences },
        { label: '段落数', value: stats.paragraphs },
        { label: '行数', value: stats.lines },
        { label: '阅读时间', value: `≈ ${stats.readingTimeMin} 分钟` },
      ]
    : [
        { label: 'Characters', value: stats.characters },
        { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
        { label: 'Words', value: stats.words },
        { label: 'Chinese Chars', value: stats.chineseChars },
        { label: 'Sentences', value: stats.sentences },
        { label: 'Paragraphs', value: stats.paragraphs },
        { label: 'Lines', value: stats.lines },
        { label: 'Reading Time', value: `≈ ${stats.readingTimeMin} min` },
      ]

  return (
    <div className="space-y-4">
      {/* 统计面板 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 输入区 */}
      <textarea
        className="tool-textarea min-h-[300px]"
        placeholder={isZh ? '在此输入或粘贴文本...' : 'Type or paste your text here...'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {text && (
        <div className="flex justify-end">
          <button
            onClick={() => setText('')}
            type="button"
            className="tool-btn-secondary"
          >
            🗑️ {isZh ? '清空' : 'Clear'}
          </button>
        </div>
      )}
    </div>
  )
}
