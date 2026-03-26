// src/tools/color-converter/ColorConverter.tsx
import { useState, useCallback } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

// --- 颜色转换工具函数 ---
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) { const v = Math.round(ln * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  return [
    Math.round(hue2rgb(p, q, hn + 1/3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1/3) * 255),
  ]
}

export default function ColorConverter({ lang }: Props) {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState<[number, number, number]>([59, 130, 246])
  const [hsl, setHsl] = useState<[number, number, number]>([217, 91, 60])
  const [alpha, setAlpha] = useState(1)
  const isZh = lang === 'zh'

  const updateFromHex = useCallback((value: string) => {
    setHex(value)
    const r = hexToRgb(value)
    if (r) { setRgb(r); setHsl(rgbToHsl(...r)) }
  }, [])

  const updateFromPicker = useCallback((value: string) => {
    setHex(value)
    const r = hexToRgb(value)
    if (r) { setRgb(r); setHsl(rgbToHsl(...r)) }
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb([r, g, b])
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    setHsl([h, s, l])
    const r = hslToRgb(h, s, l)
    setRgb(r)
    setHex(rgbToHex(...r))
  }, [])

  const outputs = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.join(', ')})` },
    { label: 'RGBA', value: `rgba(${rgb.join(', ')}, ${alpha})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'CSS Variable', value: `--color: ${hex};` },
  ]

  return (
    <div className="space-y-6">
      {/* 颜色选择器 */}
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={hex.length === 7 ? hex : '#3B82F6'}
          onChange={e => updateFromPicker(e.target.value)}
          className="w-16 h-16 rounded-xl border cursor-pointer"
        />
        <div
          className="flex-1 h-16 rounded-xl border border-gray-200"
          style={{ background: `rgba(${rgb.join(',')}, ${alpha})` }}
        />
      </div>

      {/* HEX 输入 */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={e => updateFromHex(e.target.value)}
            className="w-full font-mono px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="#000000"
          />
        </div>

        {/* RGB 输入 */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">RGB</label>
          <div className="grid grid-cols-3 gap-2">
            {(['R', 'G', 'B'] as const).map((ch, i) => (
              <div key={ch}>
                <div className="text-xs text-center text-gray-400 mb-1">{ch}</div>
                <input
                  type="number" min={0} max={255}
                  value={rgb[i]}
                  onChange={e => {
                    const v = Math.min(255, Math.max(0, parseInt(e.target.value) || 0))
                    const next = [...rgb] as [number, number, number]
                    next[i] = v
                    updateFromRgb(...next)
                  }}
                  className="w-full text-center px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HSL 输入 */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">HSL</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'H', max: 360, idx: 0 },
              { label: 'S%', max: 100, idx: 1 },
              { label: 'L%', max: 100, idx: 2 },
            ].map(({ label, max, idx }) => (
              <div key={label}>
                <div className="text-xs text-center text-gray-400 mb-1">{label}</div>
                <input
                  type="number" min={0} max={max}
                  value={hsl[idx]}
                  onChange={e => {
                    const v = Math.min(max, Math.max(0, parseInt(e.target.value) || 0))
                    const next = [...hsl] as [number, number, number]
                    next[idx] = v
                    updateFromHsl(...next)
                  }}
                  className="w-full text-center px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Alpha */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            {isZh ? '透明度' : 'Alpha'}: {alpha}
          </label>
          <input
            type="range" min={0} max={1} step={0.01} value={alpha}
            onChange={e => setAlpha(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 输出结果 */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">{isZh ? '颜色格式输出' : 'Color Formats'}</h3>
        {outputs.map(o => (
          <div key={o.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-xs font-mono font-semibold text-gray-500 w-24">{o.label}</span>
            <code className="font-mono text-sm text-gray-800 flex-1">{o.value}</code>
            <CopyButton text={o.value} label={isZh ? '复制' : 'Copy'} copiedLabel="✓" />
          </div>
        ))}
      </div>
    </div>
  )
}
