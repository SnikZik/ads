import type {
  DailyEntry,
  NumericRange,
  MacroValue,
  DeficitValue,
  TrainingType,
  BodySnapshot,
} from '@/data/bodyLog'

export function midpoint(v: number | NumericRange): number {
  if (typeof v === 'number') return v
  return (v.min + v.max) / 2
}

export function macroMidpoint(v: MacroValue): number | null {
  if (typeof v === 'number') return v
  if (typeof v === 'object') return midpoint(v)
  return null
}

export function deficitMidpoint(v: DeficitValue): number | null {
  if (v === 'unknown') return null
  if (v === 'light') return 250
  if (v === 'light-medium') return 350
  if (typeof v === 'number') return v
  return midpoint(v)
}

export function trainingLoad(t: TrainingType): 0 | 1 | 2 {
  if (t === 'rest') return 0
  if (t === 'double') return 2
  return 1
}

export function formatRange(v: number | NumericRange): string {
  if (typeof v === 'number') return String(v)
  return `${v.min}–${v.max}`
}

export function formatMacro(v: MacroValue): string {
  if (typeof v === 'number') return String(v)
  if (typeof v === 'object') return `${v.min}–${v.max}`
  return v
}

export function formatDeficit(v: DeficitValue): string {
  if (v === 'unknown') return '—'
  if (v === 'light') return '~250'
  if (v === 'light-medium') return '~350'
  if (typeof v === 'number') return String(v)
  return `${v.min}–${v.max}`
}

export interface AggregateStats {
  totalDays: number
  trainingDays: number
  restDays: number
  boxingSessions: number
  strengthSessions: number
  doubleSessions: number
  otherSessions: number
  avgCalories: number
  avgProtein: number
  avgDeficit: number
  avgScore: number
  currentWeight: number
  currentWaist: number
}

export function computeStats(entries: DailyEntry[], latestSnapshot: BodySnapshot): AggregateStats {
  const totalDays = entries.length
  const trainingDays = entries.filter(e => e.trainingType !== 'rest').length
  const restDays = entries.filter(e => e.trainingType === 'rest').length
  const boxingSessions = entries.filter(e => e.trainingType === 'boxing').length
  const strengthSessions = entries.filter(e => e.trainingType === 'strength').length
  const doubleSessions = entries.filter(e => e.trainingType === 'double').length
  const otherSessions = entries.filter(e => e.trainingType === 'other').length

  const calValues = entries.map(e => midpoint(e.calories))
  const avgCalories = Math.round(calValues.reduce((a, b) => a + b, 0) / calValues.length)

  const protValues = entries.map(e => macroMidpoint(e.protein)).filter((v): v is number => v !== null)
  const avgProtein = Math.round(protValues.reduce((a, b) => a + b, 0) / protValues.length)

  const defValues = entries.map(e => deficitMidpoint(e.deficit)).filter((v): v is number => v !== null)
  const avgDeficit = Math.round(defValues.reduce((a, b) => a + b, 0) / defValues.length)

  const avgScore = Math.round((entries.reduce((a, e) => a + e.score, 0) / entries.length) * 10) / 10

  return {
    totalDays,
    trainingDays,
    restDays,
    boxingSessions,
    strengthSessions,
    doubleSessions,
    otherSessions,
    avgCalories,
    avgProtein,
    avgDeficit,
    avgScore,
    currentWeight: latestSnapshot.weight,
    currentWaist: latestSnapshot.waist,
  }
}

export interface MeasurementDelta {
  weight: number
  waist: number
  neck: number
  chest: number
  thigh: number
  arm: number
}

export function computeDelta(before: BodySnapshot, after: BodySnapshot): MeasurementDelta {
  return {
    weight: Math.round((after.weight - before.weight) * 10) / 10,
    waist: after.waist - before.waist,
    neck: after.neck - before.neck,
    chest: after.chest - before.chest,
    thigh: after.thigh - before.thigh,
    arm: after.arm - before.arm,
  }
}

export interface DayChartRow {
  date: string
  isoDate: string
  calories: number | null
  protein: number | null
  deficit: number | null
  load: 0 | 1 | 2
}

export function buildChartData(entries: DailyEntry[]): DayChartRow[] {
  return entries.map(e => ({
    date: e.date,
    isoDate: e.isoDate,
    calories: midpoint(e.calories),
    protein: macroMidpoint(e.protein),
    deficit: deficitMidpoint(e.deficit),
    load: trainingLoad(e.trainingType),
  }))
}

export interface TrendPoint {
  date: string
  value: number
}

export function buildWeightTrend(snapshots: BodySnapshot[]): TrendPoint[] {
  return snapshots.map(s => ({ date: s.date, value: s.weight }))
}

export function buildWaistTrend(snapshots: BodySnapshot[]): TrendPoint[] {
  return snapshots.map(s => ({ date: s.date, value: s.waist }))
}
