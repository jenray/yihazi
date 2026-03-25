// src/tools/qr-code-generator/QrCodeGenerator.tsx
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  lang: 'zh' | 'en'
}

export default function QrCodeGenerator({ lang }: Props) {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isZh = lang === 'zh'

  useEffect(() => {
    if (!text || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: color, light: bgColor },
      margin: 2,
    }).catch(() => {})
  }, [text, size, color, bgColor])

  const download = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[80px]"
        placeholder={isZh ? '输入文本或网址...' : 'Enter text or URL...'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="qr-size">{isZh ? '尺寸' : 'Size'}:</label>
          <select
            id="qr-size"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1"
          >
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="qr-color">{isZh ? '颜色' : 'Color'}:</label>
          <input id="qr-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="qr-bg">{isZh ? '背景' : 'Background'}:</label>
          <input id="qr-bg" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
        </div>
      </div>

      {text && (
        <div className="flex flex-col items-center gap-4 py-4">
          <canvas ref={canvasRef} className="rounded-lg border" />
          <button onClick={download} type="button" className="tool-btn-primary">
            ⬇️ {isZh ? '下载二维码 (PNG)' : 'Download QR Code (PNG)'}
          </button>
        </div>
      )}

      {!text && (
        <div className="text-center py-12 text-gray-300 text-6xl">📱</div>
      )}
    </div>
  )
}
