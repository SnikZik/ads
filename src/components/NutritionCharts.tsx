'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { DayChartRow } from '@/lib/calculations'

interface Props {
  chartData: DayChartRow[]
}

const tooltipStyle = {
  background: '#0B0B0F',
  border: 'none',
  color: '#F5F2EC',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: 12,
  borderRadius: 0,
}

const axisProps = {
  tick: { fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6B72' },
}

export default function NutritionCharts({ chartData }: Props) {
  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto mb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Daily breakdown</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Nutrition Charts</h2>
      </div>

      <div className="space-y-10">
        <ChartBlock title="Calories (kcal)" unit="kcal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <XAxis dataKey="date" {...axisProps} interval={2} />
              <YAxis {...axisProps} width={40} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kcal`, 'Calories']} />
              <Bar dataKey="calories" fill="#2A2A30" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>

        <ChartBlock title="Protein (g)" unit="g">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <XAxis dataKey="date" {...axisProps} interval={2} />
              <YAxis {...axisProps} width={40} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}g`, 'Protein']} />
              <Bar dataKey="protein" fill="#2A2A30" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>

        <ChartBlock title="Est. deficit (kcal)" unit="kcal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <XAxis dataKey="date" {...axisProps} interval={2} />
              <YAxis {...axisProps} width={40} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => v ? [`${v} kcal`, 'Deficit'] : ['—', 'Deficit']}
              />
              <Bar dataKey="deficit" radius={[1, 1, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.deficit === null ? '#ECE7DC' : '#4B2BE0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>
      </div>
    </section>
  )
}

function ChartBlock({ title, children }: { title: string; unit: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-xs text-ink-mute uppercase mb-3">{title}</div>
      <div className="w-full h-44">{children}</div>
    </div>
  )
}
