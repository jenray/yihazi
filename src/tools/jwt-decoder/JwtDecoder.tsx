// src/tools/jwt-decoder/JwtDecoder.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

function safeBase64Decode(str: string): string {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4)
    return decodeURIComponent(
      atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
  } catch {
    return str
  }
}

interface DecodedJWT {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  isExpired: boolean | null
  expiresAt: string | null
}

export default function JwtDecoder({ lang }: Props) {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState('')
  const isZh = lang === 'zh'

  const decode = () => {
    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      setError(isZh ? 'JWT 格式无效，应包含三个由 . 分隔的部分' : 'Invalid JWT format. Expected 3 parts separated by dots.')
      setDecoded(null)
      return
    }
    try {
      const header = JSON.parse(safeBase64Decode(parts[0]))
      const payload = JSON.parse(safeBase64Decode(parts[1]))
      const exp = typeof payload.exp === 'number' ? payload.exp : null
      const isExpired = exp !== null ? Date.now() / 1000 > exp : null
      const expiresAt = exp !== null ? new Date(exp * 1000).toLocaleString() : null
      setDecoded({ header, payload, signature: parts[2], isExpired, expiresAt })
      setError('')
    } catch (e) {
      setError(isZh ? `解码失败：${(e as Error).message}` : `Decode failed: ${(e as Error).message}`)
      setDecoded(null)
    }
  }

  const EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">JWT Token</label>
          <button
            type="button"
            onClick={() => setToken(EXAMPLE)}
            className="text-xs text-brand-600 hover:underline"
          >
            {isZh ? '使用示例 Token' : 'Load example token'}
          </button>
        </div>
        <textarea
          className="tool-textarea min-h-[80px] font-mono text-xs"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={token}
          onChange={e => setToken(e.target.value)}
          spellCheck={false}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={decode} type="button" className="tool-btn-primary">
          🎫 {isZh ? '解码' : 'Decode'}
        </button>
        <button onClick={() => { setToken(''); setDecoded(null); setError('') }} type="button" className="tool-btn-secondary">
          🗑️ {isZh ? '清空' : 'Clear'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}

      {decoded && (
        <div className="space-y-4">
          {/* 过期状态 */}
          {decoded.isExpired !== null && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
              decoded.isExpired ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {decoded.isExpired ? '⛔' : '✅'}
              {decoded.isExpired
                ? (isZh ? `Token 已过期（${decoded.expiresAt}）` : `Token expired at ${decoded.expiresAt}`)
                : (isZh ? `Token 有效，到期时间：${decoded.expiresAt}` : `Token valid. Expires at ${decoded.expiresAt}`)}
            </div>
          )}

          {/* Header / Payload */}
          {([
            { label: 'Header', data: decoded.header },
            { label: 'Payload', data: decoded.payload },
          ] as const).map(({ label, data }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <CopyButton
                  text={JSON.stringify(data, null, 2)}
                  label={isZh ? '复制' : 'Copy'}
                  copiedLabel={isZh ? '已复制！' : 'Copied!'}
                />
              </div>
              <pre className="tool-output text-xs max-h-[200px] overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}

          {/* Signature */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">
              Signature <span className="text-xs text-gray-400 font-normal">({isZh ? '无法在客户端验证' : 'cannot be verified client-side'})</span>
            </p>
            <code className="block font-mono text-xs text-gray-600 bg-gray-50 rounded-xl p-3 break-all">
              {decoded.signature}
            </code>
          </div>
        </div>
      )}
    </div>
  )
}
