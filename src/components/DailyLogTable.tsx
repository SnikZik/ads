'use client'

import { useState, useMemo } from 'react'
import type { DailyEntry, TrainingType } from '@/data/bodyLog'
import { formatRange, formatMacro, formatDeficit } from '@/lib/calculations'

interface Props {
  entries: DailyEntry[]
}

const trainingFilters: { label: string; value: TrainingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Boxing', value: 'boxing' },
  { label: 'Strength', value: 'strength' },
  { label: 'Double', value: 'double' },
  { label: 'Rest', value: 'rest' },
]

const typeLabel: Record<TrainingType, string> = {
  boxing: 'BOX',
  strength: 'STR',
  double: 'DBL',
  rest: 'REST',
  other: 'OTH',
}

const typeBg: Record<TrainingType, string> = {
  boxing: 'bg-ink text-paper',
  strength: 'bg-ink-soft text-paper',
  double: 'bg-purple text-paper',
  rest: 'bg-paper-dim text-ink-mute',
  other: 'bg-paper-dim text-ink-mute',
}

export default function DailyLogTable({ entries }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TrainingType | 'all'>('all')
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchType = filter === 'all' || e.trainingType === filter
      const q = search.toLowerCase()
      const matchSearch = !q || e.food.toLowerCase().includes(q) || e.training.toLowerCase().includes(q) || e.date.includes(q)
      return matchType && matchSearch
    })
  }, [entries, search, filter])

  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto mb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Full log</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Daily Log</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search food or training…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="font-mono text-sm bg-transparent border border-ink/20 px-3 py-2 outline-none focus:border-ink/60 flex-1 placeholder:text-ink-mute/40"
        />
        <div className="flex gap-1 flex-wrap">
          {trainingFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-mono text-xs px-3 py-2 border transition-colors ${
                filter === f.value
                  ? 'bg-purple text-paper border-purple'
                  : 'border-ink/20 text-ink-mute hover:border-ink/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-ink/20">
              {['Date', 'Type', 'Cal', 'Prot', 'Carbs', 'Fat', 'Deficit', 'Score'].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-ink-mute font-normal text-2xs tracking-widest uppercase whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <>
                <tr
                  key={e.date}
                  onClick={() => setExpandedDate(expandedDate === e.date ? null : e.date)}
                  className={`border-b border-ink/5 cursor-pointer hover:bg-paper-dim transition-colors ${expandedDate === e.date ? 'bg-paper-dim' : ''}`}
                >
                  <td className="py-2 pr-4 font-display text-base whitespace-nowrap">{e.date}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-2xs px-1.5 py-0.5 font-mono tracking-wider ${typeBg[e.trainingType]}`}>
                      {typeLabel[e.trainingType]}
                    </span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatRange(e.calories)}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatMacro(e.protein)}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatMacro(e.carbs)}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatMacro(e.fat)}</td>
                  <td className={`py-2 pr-4 whitespace-nowrap ${e.deficit === 'unknown' ? 'text-ink-mute' : ''}`}>
                    {formatDeficit(e.deficit)}
                  </td>
                  <td className={`py-2 font-display text-base ${e.score >= 9 ? 'text-purple' : ''}`}>
                    {e.score}
                  </td>
                </tr>
                {expandedDate === e.date && (
                  <tr key={`${e.date}-exp`} className="bg-paper-dim border-b border-ink/10">
                    <td colSpan={8} className="py-3 px-2">
                      <div className="text-2xs tracking-widest text-ink-mute uppercase mb-1">Training</div>
                      <div className="text-sm text-ink-soft mb-3">{e.training}</div>
                      <div className="text-2xs tracking-widest text-ink-mute uppercase mb-1">Food</div>
                      <div className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{e.food}</div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="font-mono text-sm text-ink-mute py-8 text-center">No entries match.</div>
        )}
      </div>

      <div className="font-mono text-xs text-ink-mute mt-4">
        {filtered.length} of {entries.length} days shown · Click a row to expand food detail
      </div>
    </section>
  )
}
