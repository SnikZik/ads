import type { AggregateStats, MeasurementDelta } from '@/lib/calculations'

interface Props {
  stats: AggregateStats
  delta: MeasurementDelta
}

export default function CoachSummary({ stats, delta }: Props) {
  const weightChange = delta.weight < 0 ? `Lost ${Math.abs(delta.weight)} kg` : `Gained ${delta.weight} kg`
  const waistChange = delta.waist < 0 ? `down ${Math.abs(delta.waist)} cm` : `up ${delta.waist} cm`

  return (
    <section className="px-4 md:px-8 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <span className="font-mono text-2xs tracking-widest text-ink-mute uppercase">Coach read</span>
        <h2 className="font-display text-3xl md:text-4xl mt-1">Summary</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4 font-body text-ink-soft leading-relaxed">
          <p>
            <span className="font-display text-ink">{weightChange}</span> over {stats.totalDays} days.
            Waist {waistChange}. Trained {stats.trainingDays} of {stats.totalDays} days —
            {stats.boxingSessions} boxing, {stats.strengthSessions} strength, {stats.doubleSessions} double sessions.
          </p>
          <p>
            Average protein was <span className="font-mono text-ink">{stats.avgProtein}g</span> — solid
            but some days dropped under target. Average calories sat at{' '}
            <span className="font-mono text-ink">{stats.avgCalories} kcal</span>, with an estimated
            average deficit of <span className="font-mono text-ink">{stats.avgDeficit} kcal</span>.
          </p>
          <p>
            Training volume was high. The best cut stretch was{' '}
            <span className="font-mono text-ink">23/04 – 29/04</span>, consistently clean eating with
            strong deficits. High-carb performance days on{' '}
            <span className="font-mono text-ink">30/04</span> and{' '}
            <span className="font-mono text-ink">01/05</span> fuelled double sessions.
          </p>
        </div>

        <div className="space-y-3">
          <Insight
            label="Best cut stretch"
            value="23/04 – 29/04"
            note="Clean eating, strong deficits, consistent execution"
          />
          <Insight
            label="Performance days"
            value="30/04, 01/05"
            note="High-carb load for double sessions — intentional"
          />
          <Insight
            label="Social day"
            value="06/05"
            note="Not a failure — cheat or social day, not a pattern"
          />
          <Insight
            label="Next target"
            value="82 cm waist"
            note="Then weight to 70–71 kg"
          />
        </div>
      </div>
    </section>
  )
}

function Insight({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex gap-4 py-3 border-t border-ink/10">
      <div className="w-2 h-2 rounded-full bg-purple mt-2 flex-shrink-0" />
      <div>
        <div className="font-mono text-2xs tracking-widest text-ink-mute uppercase">{label}</div>
        <div className="font-display text-lg">{value}</div>
        <div className="font-body text-sm text-ink-mute">{note}</div>
      </div>
    </div>
  )
}
