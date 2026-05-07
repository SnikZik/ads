import type { AggregateStats } from '@/lib/calculations'

interface Props {
  stats: AggregateStats
  periodStart: string
  periodEnd: string
  targetWeight: { min: number; max: number }
  targetWaist: number
}

export default function HeaderStats({ stats, periodStart, periodEnd, targetWeight, targetWaist }: Props) {
  return (
    <header className="pt-16 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-2">
        <span className="font-mono text-xs tracking-widest text-ink-mute uppercase">
          {periodStart} — {periodEnd} · {stats.totalDays} days logged
        </span>
      </div>

      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-4">
        SNIR.<br />BODY LOG
      </h1>

      <p className="font-body text-ink-mute text-base md:text-lg mb-10 max-w-xl">
        Cut evidence. Training, food, measurements, progress.
      </p>

      <hr className="border-ink/10 mb-10" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatBlock
          label="Current weight"
          value={`${stats.currentWeight} kg`}
          sub={`Target ${targetWeight.min}–${targetWeight.max} kg`}
        />
        <StatBlock
          label="Current waist"
          value={`${stats.currentWaist} cm`}
          sub={`Target ${targetWaist} cm`}
        />
        <StatBlock
          label="Period"
          value={`${periodStart} → ${periodEnd}`}
          sub="17 April – 6 May"
        />
        <StatBlock
          label="Avg score"
          value={`${stats.avgScore} / 10`}
          sub={`${stats.trainingDays} training days`}
        />
      </div>
    </header>
  )
}

function StatBlock({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="font-mono text-2xs tracking-widest text-ink-mute uppercase mb-1">{label}</div>
      <div className="font-display text-2xl md:text-3xl leading-tight">{value}</div>
      <div className="font-mono text-xs text-ink-mute mt-1">{sub}</div>
    </div>
  )
}
