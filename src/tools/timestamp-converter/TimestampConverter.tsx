// src/tools/timestamp-converter/TimestampConverter.tsx
import { useState, useEffect } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

export default function TimestampConverter({ lang }: Props) {
  const [timestamp, setTimestamp] = useState('')
  const [datetime, setDatetime] = useState('')
  const [now, setNow] = useState(Date.now())
  const [results, setResults] = useState<{
    seconds: string
    millis: string
    iso: string
    local: string
    utc: string
  } | null>(null)
  const isZh = lang === 'zh'

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timestampToDate = () => {
    const ts = Number(timestamp)
    if (isNaN(ts)) return
    const ms = ts > 1e12 ? ts : ts * 1000
    const date = new Date(ms)
    setResults({
      seconds: String(Math.floor(ms / 1000)),
      millis: String(ms),
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    })
    setDatetime(date.toISOString().slice(0, 16))
  }

  const dateToTimestamp = () => {
    const date = new Date(datetime)
    if (isNaN(date.getTime())) return
    const ms = date.getTime()
    setResults({
      seconds: String(Math.floor(ms / 1000)),
      millis: String(ms),
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    })
    setTimestamp(String(Math.floor(ms / 1000)))
  }

  const useNow = () => {
    setTimestamp(String(Math.floor(now / 1000)))
    setDatetime(new Date(now).toISOString().slice(0, 16))
    const ms = now
    const date = new Date(ms)
    setResults({
      seconds: String(Math.floor(ms / 1000)),
      millis: String(ms),
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    })
  }

  return (
    <div className="space-y-6">
      {/* 当前时间 */}
      <div className="bg-gray-50 rounded-xl p-4 text-center space-y-1">
        <p className="text-sm text-gray-500">{isZh ? '当前 Unix 时间戳（秒）' : 'Current Unix Timestamp (seconds)'}</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-3xl font-mono font-bold">{Math.floor(now / 1000)}</p>
          <CopyButton
            text={String(Math.floor(now / 1000))}
            label={isZh ? '复制' : 'Copy'}
            copiedLabel={isZh ? '已复制！' : 'Copied!'}
          />
        </div>
        <p className="text-sm text-gray-500">{new Date(now).toLocaleString()}</p>
        <button onClick={useNow} type="button" className="text-xs text-brand-600 hover:underline mt-1">
          {isZh ? '以当前时间填入' : 'Fill with current time'}
        </button>
      </div>

      {/* 时间戳 → 日期 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {isZh ? '时间戳 → 日期时间' : 'Timestamp → Date'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={isZh ? '输入时间戳（秒或毫秒均可）' : 'Enter timestamp (seconds or ms)'}
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <button onClick={timestampToDate} type="button" className="tool-btn-primary">
            {isZh ? '转换' : 'Convert'} →
          </button>
        </div>
      </div>

      {/* 日期 → 时间戳 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {isZh ? '日期时间 → 时间戳' : 'Date → Timestamp'}
        </label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
          <button onClick={dateToTimestamp} type="button" className="tool-btn-primary">
            ← {isZh ? '转换' : 'Convert'}
          </button>
        </div>
      </div>

      {/* 结果 */}
      {results && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          {[
            { label: isZh ? '秒级时间戳' : 'Unix (seconds)', value: results.seconds },
            { label: isZh ? '毫秒级时间戳' : 'Unix (milliseconds)', value: results.millis },
            { label: 'ISO 8601', value: results.iso },
            { label: isZh ? '本地时间' : 'Local Time', value: results.local },
            { label: 'UTC', value: results.utc },
          ].map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4">
              <span className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">{item.label}</span>
              <code className="font-mono text-sm text-gray-800 flex-1 break-all">{item.value}</code>
              <CopyButton text={item.value} label={isZh ? '复制' : 'Copy'} copiedLabel="✓" className="text-xs text-gray-500 hover:text-gray-700 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
