'use client'
import { useState, useMemo } from 'react'
interface ChartProps {
  data: { date: string; amount: number }[]
}
export default function SalesChart({ data }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const height = 300
  const width = 800
  const padding = 40
  const maxAmount = useMemo(() => {
    const max = Math.max(...data.map((d) => d.amount), 1000)
    return max * 1.2 // Add some breathing room at the top
  }, [data])
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding
      const y = height - (d.amount / maxAmount) * (height - padding * 2) - padding
      return { x, y, amount: d.amount, date: d.date }
    })
  }, [data, maxAmount])
  const pathData = useMemo(() => {
    if (points.length === 0) return { line: '', area: '' }
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const area = `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    return { line, area }
  }, [points])
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    setHoveredIndex(index)
    setMousePos({ x: e.clientX, y: e.clientY })
  }
  return (
    <div className="relative w-full h-[350px] mt-4 select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0071E3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0071E3" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = height - p * (height - padding * 2) - padding
          return (
            <g key={p}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#F5F5F7"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-text-muted font-bold"
              >
                ৳{Math.round((p * maxAmount) / 1000)}k
              </text>
            </g>
          )
        })}
        {/* Area Fill */}
        <path
          d={pathData.area}
          fill="url(#chartGradient)"
          className="transition-all duration-700 ease-in-out"
        />
        {/* Line */}
        <path
          d={pathData.line}
          fill="none"
          stroke="#0071E3"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-700 ease-in-out"
        />
        {/* Points & Interaction Areas */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Interaction Area */}
            <rect
              x={p.x - (width / data.length) / 2}
              y={0}
              width={width / data.length}
              height={height}
              fill="transparent"
              onMouseEnter={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-crosshair"
            />
            {/* Data Point Dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 6 : 4}
              fill="white"
              stroke="#0071E3"
              strokeWidth="2"
              className="transition-all duration-300"
              style={{ opacity: hoveredIndex === i || data.length < 15 ? 1 : 0 }}
            />
            {/* X Axis Labels */}
            {i % Math.ceil(data.length / 7) === 0 && (
              <text
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] fill-text-muted font-bold"
              >
                {p.date}
              </text>
            )}
          </g>
        ))}
        {/* Vertical Scan Line */}
        {hoveredIndex !== null && (
          <line
            x1={points[hoveredIndex].x}
            y1={padding}
            x2={points[hoveredIndex].x}
            y2={height - padding}
            stroke="#0071E3"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
      </svg>
      {/* Custom Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="fixed z-[100] pointer-events-none bg-primary p-3 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md transition-opacity duration-200"
          style={{ 
            left: mousePos.x + 15, 
            top: mousePos.y - 60,
          }}
        >
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
            {points[hoveredIndex].date}
          </p>
          <p className="text-sm font-black text-secondary">
            ৳{points[hoveredIndex].amount.toLocaleString('en-IN')}
          </p>
        </div>
      )}
    </div>
  )
}
