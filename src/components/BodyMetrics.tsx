'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { BodySnapshot } from '@/data/bodyLog'
import type { TrendPoint, MeasurementDelta } from '@/lib/calculations'

interface Props {
  snapshots: BodySnapshot[]
  weightTrend: TrendPoint[]
  waistTrend: TrendPoint[]
  targetWeight: { min: number; max: number }
  targetWaist: number
  delta: MeasurementDelta
}

const tooltipStyle = {
  background: '#0B0B0F',
  border: 'none',
  color: '#F5F2EC',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: 12,
  borderRadius: 0,
}

export default function BodyMetrics({
  snapshots,
  weightTrend,
  waistTrend,
  targetWeight,
  targetWaist,
  delta,
}: Props) {
  const first = snapshots[0]
  const last = snapshots[snapshots.length - 1]

  const measurements = [
    { name: 'Weight (kg)', before: first.weight, after: last.weight, delta: delta.weight },
    { name: 'Waist (cm)', before: first.waist, after: last.waist, delta: delta.waist },
    { name: 'Neck (cm)', before: first.neck, after: last.neck, delta: delta.neck },
    { name: 'Chest (cm)', before: first.chest, after: last.chest, delta: delta.chest },
    { name: 'Thigh (cm)', before: first.thigh, after: last.thigh, delta: delta.thigh },
    { name: 'Arm (cm)', before: first.arm, after: last.arm, delta: delta.arm },
  ]

  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto mb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Measurements</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Body Metrics</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="font-mono text-xs text-ink-mute uppercase mb-3">Weight kg</div>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrend} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, fill: '#6B6B72' }} />
                <YAxis
                  domain={[69, 74]}
                  tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, fill: '#6B6B72' }}
                  width={32}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={targetWeight.max} stroke="#4B2BE0" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'target', fill: '#4B2BE0', fontSize: 10, fontFamily: 'var(--font-jetbrains)' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0B0B0F"
                  strokeWidth={2}
                  dot={{ fill: '#0B0B0F', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="font-mono text-xs text-ink-mute uppercase mb-3">Waist cm</div>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waistTrend} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, fill: '#6B6B72' }} />
                <YAxis
                  domain={[80, 86]}
                  tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, fill: '#6B6B72' }}
                  width={32}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <ReferenceLine y={targetWaist} stroke="#4B2BE0" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'target', fill: '#4B2BE0', fontSize: 10, fontFamily: 'var(--font-jetbrains)' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0B0B0F"
                  strokeWidth={2}
                  dot={{ fill: '#0B0B0F', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="text-left py-2 text-ink-mute font-normal text-2xs tracking-widest uppercase">Measurement</th>
              <th className="text-right py-2 text-ink-mute font-normal text-2xs tracking-widest uppercase">{first.date}</th>
              <th className="text-right py-2 text-ink-mute font-normal text-2xs tracking-widest uppercase">{last.date}</th>
              <th className="text-right py-2 text-ink-mute font-normal text-2xs tracking-widest uppercase">Change</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map(m => (
              <tr key={m.name} className="border-b border-ink/5">
                <td className="py-2 text-ink-soft">{m.name}</td>
                <td className="text-right py-2">{m.before}</td>
                <td className="text-right py-2 font-display text-base">{m.after}</td>
                <td className={`text-right py-2 ${m.delta < 0 ? 'text-purple' : m.delta > 0 ? 'text-ink-mute' : 'text-ink-mute'}`}>
                  {m.delta > 0 ? '+' : ''}{m.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {last.forearm && (
          <div className="font-mono text-xs text-ink-mute mt-3">
            Forearm (new): {last.forearm} cm — not measured on {first.date}
          </div>
        )}
      </div>
    </section>
  )
}
