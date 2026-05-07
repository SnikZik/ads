import { entries, snapshots, targetWeight, targetWaist, periodStart, periodEnd } from '@/data/bodyLog'
import {
  computeStats,
  computeDelta,
  buildChartData,
  buildWeightTrend,
  buildWaistTrend,
} from '@/lib/calculations'
import HeaderStats from '@/components/HeaderStats'
import ProgressCards from '@/components/ProgressCards'
import NutritionCharts from '@/components/NutritionCharts'
import TrainingSummary from '@/components/TrainingSummary'
import BodyMetrics from '@/components/BodyMetrics'
import DailyLogTable from '@/components/DailyLogTable'
import CoachSummary from '@/components/CoachSummary'

export default function Page() {
  const latestSnapshot = snapshots[snapshots.length - 1]
  const firstSnapshot = snapshots[0]

  const stats = computeStats(entries, latestSnapshot)
  const delta = computeDelta(firstSnapshot, latestSnapshot)
  const chartData = buildChartData(entries)
  const weightTrend = buildWeightTrend(snapshots)
  const waistTrend = buildWaistTrend(snapshots)

  return (
    <main>
      <HeaderStats
        stats={stats}
        periodStart={periodStart}
        periodEnd={periodEnd}
        targetWeight={targetWeight}
        targetWaist={targetWaist}
      />

      <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8" />

      <div className="pt-16">
        <ProgressCards stats={stats} />

        <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8 mb-16" />

        <BodyMetrics
          snapshots={snapshots}
          weightTrend={weightTrend}
          waistTrend={waistTrend}
          targetWeight={targetWeight}
          targetWaist={targetWaist}
          delta={delta}
        />

        <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8 mb-16" />

        <TrainingSummary chartData={chartData} stats={stats} />

        <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8 mb-16" />

        <NutritionCharts chartData={chartData} />

        <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8 mb-16" />

        <DailyLogTable entries={entries} />

        <hr className="border-ink/10 max-w-6xl mx-auto px-4 md:px-8 mb-16" />

        <CoachSummary stats={stats} delta={delta} />
      </div>

      <footer className="px-4 md:px-8 max-w-6xl mx-auto pb-16 pt-8 border-t border-ink/10">
        <div className="font-mono text-xs text-ink-mute">
          SNIR. BODY LOG · {periodStart} – {periodEnd} · Private performance record
        </div>
      </footer>
    </main>
  )
}
