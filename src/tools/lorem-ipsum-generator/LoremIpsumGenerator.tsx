// src/tools/lorem-ipsum-generator/LoremIpsumGenerator.tsx
import { useState, useMemo } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props { lang?: string }

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
  'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

const ZH_CHARS = [
  '的', '一', '是', '在', '不', '了', '有', '和', '人', '这', '中', '大', '为', '上',
  '个', '国', '我', '以', '要', '他', '时', '来', '用', '们', '生', '到', '作', '地',
  '于', '出', '就', '分', '对', '成', '会', '可', '主', '发', '年', '动', '同', '工',
  '也', '能', '下', '过', '子', '说', '产', '种', '面', '而', '方', '后', '多', '定',
  '行', '学', '法', '所', '民', '得', '经', '十', '三', '之', '进', '着', '等', '部',
  '度', '家', '电', '力', '里', '如', '水', '化', '高', '自', '二', '理', '起', '小',
  '物', '现', '实', '加', '量', '都', '两', '体', '制', '机', '当', '使', '点', '从',
  '业', '本', '去', '把', '性', '好', '应', '开', '它', '合', '还', '因', '由', '其'
]

function generateText(type: 'words' | 'sentences' | 'paragraphs', count: number, lang: 'zh' | 'en'): string {
  const dictionary = lang === 'en' ? WORDS : ZH_CHARS
  const randomWord = () => dictionary[Math.floor(Math.random() * dictionary.length)]
  
  const generateSentence = (wordCount: number) => {
    if (lang === 'zh') {
      return Array.from({ length: wordCount }, randomWord).join('') + '。'
    } else {
      const sentence = Array.from({ length: wordCount }, randomWord).join(' ')
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
    }
  }

  const generateParagraph = (sentenceCount: number) => {
    return Array.from({ length: sentenceCount }, () => generateSentence(Math.floor(Math.random() * 8) + 5)).join(lang === 'zh' ? '' : ' ')
  }

  if (type === 'words') {
    if (lang === 'zh') {
      return Array.from({ length: count }, randomWord).join('')
    }
    return Array.from({ length: count }, randomWord).join(' ')
  }

  if (type === 'sentences') {
    return Array.from({ length: count }, () => generateSentence(Math.floor(Math.random() * 8) + 5)).join(lang === 'zh' ? '' : ' ')
  }

  if (type === 'paragraphs') {
    return Array.from({ length: count }, () => generateParagraph(Math.floor(Math.random() * 4) + 3)).join('\n\n')
  }

  return ''
}

export default function LoremIpsumGenerator({ lang }: Props) {
  const [count, setCount] = useState(3)
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [textLang, setTextLang] = useState<'en' | 'zh'>(lang)
  const [htmlTags, setHtmlTags] = useState(false)
  const isZh = lang === 'zh'

  const result = useMemo(() => {
    let output = generateText(type, count, textLang)
    if (htmlTags && type === 'paragraphs') {
      output = output.split('\n\n').map(p => `<p>${p}</p>`).join('\n')
    }
    return output
  }, [type, count, textLang, htmlTags])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
        {/* 段落/句子/单词 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{isZh ? '类型' : 'Type'}</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as typeof type)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
          >
            <option value="paragraphs">{isZh ? '段落 (Paragraphs)' : 'Paragraphs'}</option>
            <option value="sentences">{isZh ? '句子 (Sentences)' : 'Sentences'}</option>
            <option value="words">{isZh ? '单词 (Words)' : 'Words'}</option>
          </select>
        </div>

        {/* 数量 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{isZh ? '数量' : 'Count'}: {count}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* 语言 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{isZh ? '文本语言' : 'Language'}</label>
          <select
            value={textLang}
            onChange={e => setTextLang(e.target.value as 'zh' | 'en')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
          >
            <option value="en">English (Lorem Ipsum)</option>
            <option value="zh">中文 (无意义测试文本)</option>
          </select>
        </div>

        {/* HTML 标签 */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-6 cursor-pointer">
            <input
              type="checkbox"
              checked={htmlTags}
              onChange={e => setHtmlTags(e.target.checked)}
              disabled={type !== 'paragraphs'}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 disabled:opacity-50"
            />
            {isZh ? '包含 <p> 标签' : 'Wrap in <p> tags'}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">{isZh ? '生成结果' : 'Result'}</h3>
          <CopyButton text={result} label={isZh ? '复制' : 'Copy'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
        </div>
        <textarea
          className="tool-textarea min-h-[300px]"
          value={result}
          readOnly
          spellCheck={false}
        />
      </div>
    </div>
  )
}
