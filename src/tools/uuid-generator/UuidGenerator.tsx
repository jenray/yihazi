// src/tools/uuid-generator/UuidGenerator.tsx
import { useState, useCallback } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function UuidGenerator({ lang }: Props) {
  const [count, setCount] = useState(1)
  const [format, setFormat] = useState<'standard' | 'upper' | 'no-hyphens'>('standard')
  const [uuids, setUuids] = useState<string[]>([])
  const isZh = lang === 'zh'

  const generate = useCallback(() => {
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = generateUUIDv4()
      if (format === 'upper') uuid = uuid.toUpperCase()
      if (format === 'no-hyphens') uuid = uuid.replace(/-/g, '')
      results.push(uuid)
    }
    setUuids(results)
  }, [count, format])

  const allText = uuids.join('\n')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="uuid-count">{isZh ? '生成数量' : 'Count'}:</label>
          <select
            id="uuid-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1"
          >
            {[1, 5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="uuid-format">{isZh ? '格式' : 'Format'}:</label>
          <select
            id="uuid-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            className="border border-gray-200 rounded px-2 py-1"
          >
            <option value="standard">{isZh ? '标准（含连字符）' : 'Standard (with hyphens)'}</option>
            <option value="upper">{isZh ? '大写' : 'Uppercase'}</option>
            <option value="no-hyphens">{isZh ? '无连字符' : 'No hyphens'}</option>
          </select>
        </div>
      </div>

      <button onClick={generate} type="button" className="tool-btn-primary">
        🆔 {isZh ? '生成 UUID' : 'Generate UUID'}
      </button>

      {uuids.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              {isZh ? `已生成 ${uuids.length} 个 UUID` : `Generated ${uuids.length} UUID${uuids.length > 1 ? 's' : ''}`}
            </label>
            <CopyButton text={allText} label={isZh ? '复制全部' : 'Copy All'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
          </div>
          <div className="space-y-2">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <code className="font-mono text-sm text-gray-800">{uuid}</code>
                <CopyButton text={uuid} label={isZh ? '复制' : 'Copy'} copiedLabel="✓" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
