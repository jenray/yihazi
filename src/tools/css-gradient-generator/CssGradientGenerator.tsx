// src/tools/css-gradient-generator/CssGradientGenerator.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Stop { color: string; position: number }
interface Props { lang: 'zh' | 'en' }

export default function CssGradientGenerator({ lang }: Props) {
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<Stop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#ec4899', position: 100 },
  ])
  const isZh = lang === 'zh'

  const stopStr = stops
    .slice().sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')

  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stopStr})`
    : `radial-gradient(circle, ${stopStr})`

  const fullCss = `background: ${css};`

  const updateStop = (idx: number, key: keyof Stop, value: string | number) => {
    setStops(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
  }

  const addStop = () => {
    if (stops.length >= 6) return
    setStops(prev => [...prev, { color: '#a855f7', position: 50 }])
  }

  const removeStop = (idx: number) => {
    if (stops.length <= 2) return
    setStops(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-5">
      {/* 渐变预览 */}
      <div
        className="w-full h-32 rounded-xl border border-gray-200"
        style={{ background: css }}
      />

      {/* 类型切换 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('linear')}
          className={type === 'linear' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '线性渐变' : 'Linear'}
        </button>
        <button
          type="button"
          onClick={() => setType('radial')}
          className={type === 'radial' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '径向渐变' : 'Radial'}
        </button>
      </div>

      {/* 角度（线性专属） */}
      {type === 'linear' && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium w-24 flex-shrink-0">
            {isZh ? '角度' : 'Angle'}: {angle}°
          </label>
          <input
            type="range" min={0} max={360} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number" min={0} max={360} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="w-16 text-center px-2 py-1 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      )}

      {/* 色标 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {isZh ? '颜色节点' : 'Color Stops'}
          </label>
          <button onClick={addStop} type="button" className="tool-btn-secondary text-xs">
            + {isZh ? '添加' : 'Add Stop'}
          </button>
        </div>
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={e => updateStop(idx, 'color', e.target.value)}
              className="w-10 h-10 rounded-lg border cursor-pointer flex-shrink-0"
            />
            <span className="font-mono text-sm w-20 text-gray-600">{stop.color}</span>
            <input
              type="range" min={0} max={100} value={stop.position}
              onChange={e => updateStop(idx, 'position', Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-10 text-right">{stop.position}%</span>
            <button
              onClick={() => removeStop(idx)}
              type="button"
              disabled={stops.length <= 2}
              className="text-gray-400 hover:text-red-500 disabled:opacity-30 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 输出 CSS */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">CSS</span>
          <CopyButton text={fullCss} label={isZh ? '复制' : 'Copy'} copiedLabel={isZh ? '已复制！' : 'Copied!'} className="text-xs text-gray-400 hover:text-white" />
        </div>
        <code className="text-green-400 text-sm font-mono break-all">{fullCss}</code>
      </div>
    </div>
  )
}
