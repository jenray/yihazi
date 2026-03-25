// src/tools/image-compressor/ImageCompressor.tsx
import { useState, useRef, useCallback } from 'react'
import Compressor from 'compressorjs'
import { FileDropzone } from '../../ui/FileDropzone'
import { formatBytes } from '../../lib/utils'

interface Props {
  lang: 'zh' | 'en'
}

interface CompressResult {
  originalSize: number
  compressedSize: number
  originalUrl: string
  compressedUrl: string
  compressedBlob: Blob
  fileName: string
  mimeType: string
  ratio: number
}

export default function ImageCompressor({ lang }: Props) {
  const [quality, setQuality] = useState(0.8)
  const [mimeType, setMimeType] = useState<'auto' | 'image/jpeg' | 'image/webp'>('auto')
  const [results, setResults] = useState<CompressResult[]>([])
  const [processing, setProcessing] = useState(false)
  const [currentFile, setCurrentFile] = useState<string>('')
  const isZh = lang === 'zh'

  const compressFile = useCallback((file: File) => {
    setProcessing(true)
    setCurrentFile(file.name)
    const originalUrl = URL.createObjectURL(file)

    new Compressor(file, {
      quality,
      mimeType,
      // PNG 超过 1MB 时自动转为 JPEG
      convertTypes: ['image/png'],
      convertSize: 1000000,
      success(compressed) {
        const compressedUrl = URL.createObjectURL(compressed)
        const ext = compressed.type === 'image/webp' ? 'webp'
          : compressed.type === 'image/png' ? 'png' : 'jpg'
        const baseName = file.name.replace(/\.[^.]+$/, '')

        setResults((prev) => [
          {
            originalSize: file.size,
            compressedSize: compressed.size,
            originalUrl,
            compressedUrl,
            compressedBlob: compressed,
            fileName: `${baseName}_compressed.${ext}`,
            mimeType: compressed.type,
            ratio: ((1 - compressed.size / file.size) * 100),
          },
          ...prev,
        ])
        setProcessing(false)
        setCurrentFile('')
      },
      error(err) {
        console.error('Compression error:', err)
        setProcessing(false)
        setCurrentFile('')
      },
    })
  }, [quality, mimeType])

  const downloadAll = () => {
    results.forEach((r) => {
      const a = document.createElement('a')
      a.href = r.compressedUrl
      a.download = r.fileName
      a.click()
    })
  }

  const clearAll = () => {
    results.forEach((r) => {
      URL.revokeObjectURL(r.originalUrl)
      URL.revokeObjectURL(r.compressedUrl)
    })
    setResults([])
  }

  return (
    <div className="space-y-6">
      {/* 压缩参数 */}
      <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-xl">
        {/* 质量滑块 */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {isZh ? '压缩质量' : 'Quality'}: <span className="text-brand-600 font-bold">{Math.round(quality * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{isZh ? '最小体积' : 'Smallest'}</span>
            <span>{isZh ? '最高质量' : 'Best Quality'}</span>
          </div>
        </div>

        {/* 输出格式 */}
        <div className="flex-shrink-0">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {isZh ? '输出格式' : 'Output Format'}
          </label>
          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value as typeof mimeType)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="auto">{isZh ? '自动（保持原格式）' : 'Auto (keep original)'}</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>

      {/* 上传区域 */}
      <FileDropzone
        accept="image/png,image/jpeg,image/webp,image/gif"
        onFile={compressFile}
        dropText={isZh ? '拖拽图片到这里' : 'Drop image here'}
        clickText={isZh ? '或点击选择图片（PNG / JPG / WebP）' : 'or click to select (PNG / JPG / WebP)'}
        icon="🖼️"
      />

      {/* 处理中状态 */}
      {processing && (
        <div className="flex items-center justify-center gap-3 py-4 text-gray-500">
          <span className="animate-spin text-2xl">⏳</span>
          <span className="text-sm">
            {isZh ? `正在压缩 ${currentFile}...` : `Compressing ${currentFile}...`}
          </span>
        </div>
      )}

      {/* 批量操作 */}
      {results.length > 1 && (
        <div className="flex gap-3">
          <button onClick={downloadAll} type="button" className="tool-btn-primary">
            ⬇️ {isZh ? `下载全部（${results.length} 张）` : `Download All (${results.length})`}
          </button>
          <button onClick={clearAll} type="button" className="tool-btn-secondary">
            🗑️ {isZh ? '清空' : 'Clear All'}
          </button>
        </div>
      )}

      {/* 结果列表 */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* 统计信息 */}
              <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  📄 {result.fileName}
                </span>
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <span className="text-gray-500">
                    {formatBytes(result.originalSize)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-gray-900">
                    {formatBytes(result.compressedSize)}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    result.ratio > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {result.ratio > 0 ? '↓' : '↑'} {Math.abs(result.ratio).toFixed(1)}%
                  </span>
                </div>
                <a
                  href={result.compressedUrl}
                  download={result.fileName}
                  className="tool-btn-primary text-xs flex-shrink-0"
                >
                  ⬇️ {isZh ? '下载' : 'Download'}
                </a>
              </div>

              {/* 图片对比 */}
              <div className="grid grid-cols-2 gap-0">
                <div className="p-3 border-r border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">
                    {isZh ? '原图' : 'Original'} · {formatBytes(result.originalSize)}
                  </p>
                  <img
                    src={result.originalUrl}
                    alt="Original"
                    className="w-full rounded-lg object-contain max-h-48 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQoU2NkYGD4z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==')] bg-repeat"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-2">
                    {isZh ? '压缩后' : 'Compressed'} · {formatBytes(result.compressedSize)}
                  </p>
                  <img
                    src={result.compressedUrl}
                    alt="Compressed"
                    className="w-full rounded-lg object-contain max-h-48 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQoU2NkYGD4z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==')] bg-repeat"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 隐私说明 */}
      <p className="text-xs text-gray-400 text-center">
        🔒 {isZh
          ? '所有处理均在本地浏览器完成，图片不会上传到服务器'
          : 'All processing is done locally in your browser. Your images never leave your device.'}
      </p>
    </div>
  )
}
