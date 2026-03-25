// src/tools/unit-converter/UnitConverter.tsx
import { useState, useMemo } from 'react'

interface Props { lang: 'zh' | 'en' }

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'speed'

interface UnitInfo {
  id: string
  nameZh: string
  nameEn: string
  factor?: number // 与基准单位的换算系数。温度需特殊处理
}

const CATEGORIES: Record<UnitCategory, { nameZh: string; nameEn: string; units: UnitInfo[] }> = {
  length: {
    nameZh: '长度', nameEn: 'Length',
    units: [
      { id: 'm', nameZh: '米 (Meter)', nameEn: 'Meter (m)', factor: 1 },
      { id: 'km', nameZh: '千米 (Kilometer)', nameEn: 'Kilometer (km)', factor: 1000 },
      { id: 'cm', nameZh: '厘米 (Centimeter)', nameEn: 'Centimeter (cm)', factor: 0.01 },
      { id: 'mm', nameZh: '毫米 (Millimeter)', nameEn: 'Millimeter (mm)', factor: 0.001 },
      { id: 'mi', nameZh: '英里 (Mile)', nameEn: 'Mile (mi)', factor: 1609.344 },
      { id: 'yard', nameZh: '码 (Yard)', nameEn: 'Yard (yd)', factor: 0.9144 },
      { id: 'ft', nameZh: '英尺 (Foot)', nameEn: 'Foot (ft)', factor: 0.3048 },
      { id: 'in', nameZh: '英寸 (Inch)', nameEn: 'Inch (in)', factor: 0.0254 },
    ]
  },
  weight: {
    nameZh: '重量', nameEn: 'Weight',
    units: [
      { id: 'kg', nameZh: '千克 (Kilogram)', nameEn: 'Kilogram (kg)', factor: 1 },
      { id: 'g', nameZh: '克 (Gram)', nameEn: 'Gram (g)', factor: 0.001 },
      { id: 'mg', nameZh: '毫克 (Milligram)', nameEn: 'Milligram (mg)', factor: 0.000001 },
      { id: 'lb', nameZh: '磅 (Pound)', nameEn: 'Pound (lb)', factor: 0.45359237 },
      { id: 'oz', nameZh: '盎司 (Ounce)', nameEn: 'Ounce (oz)', factor: 0.0283495231 },
    ]
  },
  temperature: {
    nameZh: '温度', nameEn: 'Temperature',
    units: [
      { id: 'c', nameZh: '摄氏度 (°C)', nameEn: 'Celsius (°C)' },
      { id: 'f', nameZh: '华氏度 (°F)', nameEn: 'Fahrenheit (°F)' },
      { id: 'k', nameZh: '开尔文 (K)', nameEn: 'Kelvin (K)' },
    ]
  },
  area: {
    nameZh: '面积', nameEn: 'Area',
    units: [
      { id: 'sqm', nameZh: '平方米 (m²)', nameEn: 'Square meter (m²)', factor: 1 },
      { id: 'sqkm', nameZh: '平方千米 (km²)', nameEn: 'Square kilometer (km²)', factor: 1000000 },
      { id: 'ha', nameZh: '公顷 (Hectare)', nameEn: 'Hectare (ha)', factor: 10000 },
      { id: 'acre', nameZh: '英亩 (Acre)', nameEn: 'Acre (ac)', factor: 4046.85642 },
      { id: 'sqft', nameZh: '平方英尺 (sq ft)', nameEn: 'Square foot (sq ft)', factor: 0.09290304 },
    ]
  },
  speed: {
    nameZh: '速度', nameEn: 'Speed',
    units: [
      { id: 'mps', nameZh: '米/秒 (m/s)', nameEn: 'Meter/second (m/s)', factor: 1 },
      { id: 'kmph', nameZh: '千米/小时 (km/h)', nameEn: 'Kilometer/hour (km/h)', factor: 0.277777778 },
      { id: 'mph', nameZh: '英里/小时 (mph)', nameEn: 'Mile/hour (mph)', factor: 0.44704 },
      { id: 'knot', nameZh: '节 (Knot)', nameEn: 'Knot (kn)', factor: 0.514444444 },
    ]
  }
}

export default function UnitConverter({ lang }: Props) {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')
  const [fromValue, setFromValue] = useState<string>('1')
  const isZh = lang === 'zh'

  const handleCategoryChange = (c: UnitCategory) => {
    setCategory(c)
    setFromUnit(CATEGORIES[c].units[0].id)
    setToUnit(CATEGORIES[c].units[1].id)
  }

  const convertedValue = useMemo(() => {
    const val = parseFloat(fromValue)
    if (isNaN(val)) return ''

    if (category === 'temperature') {
      let c = 0
      if (fromUnit === 'c') c = val
      else if (fromUnit === 'f') c = (val - 32) * 5/9
      else if (fromUnit === 'k') c = val - 273.15

      let res = 0
      if (toUnit === 'c') res = c
      else if (toUnit === 'f') res = c * 9/5 + 32
      else if (toUnit === 'k') res = c + 273.15
      
      return Number(res.toFixed(6)).toString() // 去除多余的 0
    }

    const { units } = CATEGORIES[category]
    const fromFactor = units.find(u => u.id === fromUnit)?.factor || 1
    const toFactor = units.find(u => u.id === toUnit)?.factor || 1
    
    const baseVal = val * fromFactor
    const res = baseVal / toFactor
    return Number(res.toPrecision(7)).toString()
  }, [category, fromUnit, toUnit, fromValue])

  const curCategoryInfo = CATEGORIES[category]

  return (
    <div className="space-y-6">
      {/* 分类切换 */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        {(Object.entries(CATEGORIES) as [UnitCategory, typeof CATEGORIES[UnitCategory]][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {isZh ? info.nameZh : info.nameEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center bg-gray-50 p-6 rounded-xl border border-gray-100">
        {/* Origin */}
        <div className="space-y-3">
          <input
            type="number"
            value={fromValue}
            onChange={e => setFromValue(e.target.value)}
            className="w-full px-4 py-3 text-2xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="0"
          />
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            {curCategoryInfo.units.map(u => (
              <option key={u.id} value={u.id}>{isZh ? u.nameZh : u.nameEn}</option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={() => {
            setFromUnit(toUnit)
            setToUnit(fromUnit)
            setFromValue(convertedValue)
          }}
          className="mx-auto w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
        >
          ⇄
        </button>

        {/* Target */}
        <div className="space-y-3">
          <input
            type="text"
            readOnly
            value={convertedValue}
            className="w-full px-4 py-3 text-2xl font-semibold border border-gray-200 rounded-xl bg-gray-100 text-gray-600 focus:outline-none"
            placeholder="0"
          />
          <select
            value={toUnit}
            onChange={e => setToUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            {curCategoryInfo.units.map(u => (
              <option key={u.id} value={u.id}>{isZh ? u.nameZh : u.nameEn}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
