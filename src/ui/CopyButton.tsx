// src/ui/CopyButton.tsx
import { useState } from 'react'

interface Props {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = 'tool-btn-secondary',
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button onClick={handleCopy} className={className} type="button">
      {copied ? `✅ ${copiedLabel}` : `📋 ${label}`}
    </button>
  )
}
