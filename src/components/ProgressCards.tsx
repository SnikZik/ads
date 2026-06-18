'use client'

import { useState } from 'react'
import type { AggregateStats } from '@/lib/calculations'

interface Props {
  stats: AggregateStats
}

interface StatCard {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export default function ProgressCards({ stats }: Props) {
  const cards: StatCard[] = [
    { label: 'Current weight', value: `${stats.currentWeight} kg`, sub: 'Target 70–71 kg' },
    { label: 'Current waist', value: `${stats.currentWaist} cm`, sub: 'Target 82 cm' },
    { label: 'Avg calories', value: `${stats.avgCalories} kcal`, sub: 'per day midpoint' },
    { label: 'Avg protein', value: `${stats.avgProtein}g`, sub: 'per day midpoint' },
    { label: 'Est. avg deficit', value: `${stats.avgDeficit} kcal`, sub: 'excludes unknown days', accent: true },
    { label: 'Training days', value: `${stats.trainingDays}`, sub: `of ${stats.totalDays} total` },
    { label: 'Days logged', value: `${stats.totalDays}`, sub: '17/04 → 06/05' },
  ]

  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto mb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Overview</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Key Stats</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </section>
  )
}

function Card({ label, value, sub, accent }: StatCard) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(o => !o)}
      className={`text-left p-4 border transition-colors rounded-none ${
        accent
          ? 'border-purple/30 bg-lilac/10'
          : 'border-ink/10 bg-paper hover:bg-paper-dim'
      }`}
    >
      <div className="font-mono text-2xs tracking-widest text-ink-mute uppercase mb-2">{label}</div>
      <div className="font-display text-2xl md:text-3xl leading-none">{value}</div>
      {open && sub && (
        <div className="font-mono text-xs text-ink-mute mt-2 pt-2 border-t border-ink/10">{sub}</div>
      )}
      {!open && (
        <div className="font-mono text-2xs text-ink-mute mt-2 opacity-50">tap for detail</div>
      )}
    </button>
  )
}
