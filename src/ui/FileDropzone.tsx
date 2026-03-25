// src/ui/FileDropzone.tsx
import { useState, useRef } from 'react'

interface Props {
  accept?: string
  multiple?: boolean
  onFile: (file: File) => void
  dropText?: string
  clickText?: string
  icon?: string
}

export function FileDropzone({
  accept = 'image/*',
  multiple = false,
  onFile,
  dropText = '拖拽文件到这里',
  clickText = '或点击选择文件',
  icon = '📂',
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
      className={[
        'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
        isDragging
          ? 'border-brand-500 bg-brand-50'
          : 'border-gray-200 hover:border-gray-300',
      ].join(' ')}
    >
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-gray-500">{dropText}</p>
      <p className="text-sm text-gray-400 mt-1">{clickText}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]) }}
        className="hidden"
      />
    </div>
  )
}
