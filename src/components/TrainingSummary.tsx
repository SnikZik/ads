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
import type { DayChartRow, AggregateStats } from '@/lib/calculations'

interface Props {
  chartData: DayChartRow[]
  stats: AggregateStats
}

const tooltipStyle = {
  background: '#0B0B0F',
  border: 'none',
  color: '#F5F2EC',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: 12,
  borderRadius: 0,
}

const loadLabels: Record<number, string> = { 0: 'Rest', 1: 'Session', 2: 'Double' }
const loadColors: Record<number, string> = { 0: '#ECE7DC', 1: '#2A2A30', 2: '#4B2BE0' }

export default function TrainingSummary({ chartData, stats }: Props) {
  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto mb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Training</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Training Summary</h2>
      </div>

      <div className="mb-2">
        <div className="font-mono text-xs text-ink-mute uppercase mb-3">
          Training load by day <span className="normal-case ml-2 text-ink-mute/60">(0 rest · 1 session · 2 double)</span>
        </div>
        <div className="w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6B72' }}
                interval={2}
              />
              <YAxis
                domain={[0, 2]}
                ticks={[0, 1, 2]}
                tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6B72' }}
                width={24}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [loadLabels[v] ?? v, 'Load']}
              />
              <Bar dataKey="load" radius={[1, 1, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={loadColors[entry.load] ?? '#2A2A30'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="font-mono text-xs text-ink-mute/70 mb-8 italic">
        Training count is based on logged entries only. Some sessions may have been mentioned conversationally and not fully structured.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Total days', value: stats.totalDays },
          { label: 'Training', value: stats.trainingDays },
          { label: 'Rest', value: stats.restDays },
          { label: 'Boxing', value: stats.boxingSessions },
          { label: 'Strength', value: stats.strengthSessions },
          { label: 'Double', value: stats.doubleSessions },
        ].map(({ label, value }) => (
          <div key={label} className="border-t border-ink/10 pt-3">
            <div className="font-mono text-2xs tracking-widest text-ink-mute uppercase">{label}</div>
            <div className="font-display text-3xl mt-1">{value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
