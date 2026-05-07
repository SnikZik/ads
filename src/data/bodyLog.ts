export type TrainingType = 'boxing' | 'strength' | 'double' | 'rest' | 'other'

export interface NumericRange {
  min: number
  max: number
}

export type MacroValue = number | NumericRange | 'low' | 'medium' | 'medium-high' | 'high'
export type DeficitValue = number | NumericRange | 'light' | 'light-medium' | 'unknown'

export interface DailyEntry {
  date: string
  isoDate: string
  training: string
  trainingType: TrainingType
  food: string
  calories: number | NumericRange
  protein: MacroValue
  carbs: MacroValue
  fat: MacroValue
  deficit: DeficitValue
  score: number
}

export interface BodySnapshot {
  date: string
  weight: number
  waist: number
  neck: number
  chest: number
  thigh: number
  arm: number
  forearm?: number
}

export const entries: DailyEntry[] = [
  {
    date: '17/04',
    isoDate: '2025-04-17',
    training: 'Boxing personal + group, 2.5 hours, very high intensity',
    trainingType: 'boxing',
    food: '2 egg omelet, cottage, 2 sourdough slices, plum, 200g chicken breast, tahini, hummus, pita, potato, sea bream, potato, bun',
    calories: 1900,
    protein: 140,
    carbs: 150,
    fat: 55,
    deficit: 900,
    score: 7,
  },
  {
    date: '18/04',
    isoDate: '2025-04-18',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Yogurt + grapes, granola bar, cottage + rice cakes, 3 apples + strawberries, sea bream + couscous + potatoes, 150g pargit + potatoes + tahini + vegetables',
    calories: 2150,
    protein: 110,
    carbs: 250,
    fat: 60,
    deficit: 0,
    score: 8,
  },
  {
    date: '19/04',
    isoDate: '2025-04-19',
    training: 'Boxing personal, high pace',
    trainingType: 'boxing',
    food: 'Coffee, 2 eggs, tuna 51g, salad, 2 sourdough slices, chicken breast 220g, tahini, hummus, small potato, third laffa, salad, 150g sirloin, extra sirloin 100g, rice, green beans, Greek yogurt + grapes',
    calories: { min: 2500, max: 2800 },
    protein: { min: 170, max: 190 },
    carbs: { min: 220, max: 260 },
    fat: { min: 70, max: 85 },
    deficit: { min: 0, max: 200 },
    score: 9.5,
  },
  {
    date: '20/04',
    isoDate: '2025-04-20',
    training: 'Hard strength workout',
    trainingType: 'strength',
    food: 'Coffee, sourdough with cottage, protein drink, 2 boiled eggs, 3 rye sourdough slices + cottage, 160g sirloin, 2 potatoes, 1 sweet potato, olive oil, mustard, honey, onion',
    calories: { min: 1800, max: 2000 },
    protein: { min: 130, max: 145 },
    carbs: { min: 160, max: 180 },
    fat: { min: 60, max: 70 },
    deficit: { min: 300, max: 500 },
    score: 8,
  },
  {
    date: '21/04',
    isoDate: '2025-04-21',
    training: 'Medium strength + 30 min skate',
    trainingType: 'strength',
    food: 'Protein drink, half tuna sourdough sandwich, protein bar, 120g shawarma + rice, 30g cereal + milk, 100g sirloin + 200g sweet potato, another protein bar',
    calories: { min: 1800, max: 2000 },
    protein: { min: 140, max: 155 },
    carbs: { min: 170, max: 190 },
    fat: { min: 50, max: 60 },
    deficit: { min: 400, max: 600 },
    score: 8.5,
  },
  {
    date: '22/04',
    isoDate: '2025-04-22',
    training: 'Boxing',
    trainingType: 'boxing',
    food: 'Greek yogurt 130g, protein drink, 2 eggs, white cheese, 2 sourdough slices, half protein bar, burger 200g with bun + wing, sushi 2.5 rolls salmon sweet potato avocado',
    calories: { min: 2100, max: 2300 },
    protein: { min: 130, max: 145 },
    carbs: { min: 180, max: 200 },
    fat: { min: 80, max: 90 },
    deficit: { min: 0, max: 200 },
    score: 8,
  },
  {
    date: '23/04',
    isoDate: '2025-04-23',
    training: 'Boxing 1.5 hours',
    trainingType: 'boxing',
    food: 'Protein shake, 100g cooked chicken breast, 200g rice, green beans, 200g cooked chicken breast, 2 potatoes',
    calories: { min: 1200, max: 1400 },
    protein: { min: 130, max: 145 },
    carbs: { min: 110, max: 120 },
    fat: { min: 15, max: 20 },
    deficit: { min: 700, max: 1000 },
    score: 9,
  },
  {
    date: '24/04',
    isoDate: '2025-04-24',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Protein shake, skipped lunch, 70g sea bream, 2 challah slices, 100g beef, 150g couscous',
    calories: { min: 850, max: 1000 },
    protein: { min: 70, max: 85 },
    carbs: { min: 75, max: 90 },
    fat: { min: 20, max: 25 },
    deficit: { min: 900, max: 1100 },
    score: 6.5,
  },
  {
    date: '25/04',
    isoDate: '2025-04-25',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Protein shake, 120g pargit + 100g cooked couscous, 150g sea bream + some potatoes, protein bar 10g protein, 60g cornflakes + milk',
    calories: { min: 1100, max: 1250 },
    protein: 114,
    carbs: { min: 95, max: 110 },
    fat: { min: 35, max: 40 },
    deficit: { min: 700, max: 900 },
    score: 8.5,
  },
  {
    date: '26/04',
    isoDate: '2025-04-26',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Protein drink 33g, 2 egg omelet + 2 sourdough slices, 150g sirloin + sweet potato + half potato + olive oil, protein bar + cornflakes + milk',
    calories: { min: 1500, max: 1650 },
    protein: { min: 118, max: 125 },
    carbs: 130,
    fat: 45,
    deficit: { min: 400, max: 600 },
    score: 8.8,
  },
  {
    date: '27/04',
    isoDate: '2025-04-27',
    training: 'Strength',
    trainingType: 'strength',
    food: '30g cornflakes + 120ml milk, 50g protein shake, 1 egg + sourdough slice, 120g sirloin + half sweet potato + half potato, apple',
    calories: { min: 1050, max: 1100 },
    protein: 98,
    carbs: { min: 90, max: 100 },
    fat: 23,
    deficit: { min: 800, max: 1000 },
    score: 8,
  },
  {
    date: '28/04',
    isoDate: '2025-04-28',
    training: 'Strength',
    trainingType: 'strength',
    food: 'Protein shake 25g, 2 eggs in olive oil, cooked chicken breast + half pizza + cabbage salad + hummus + tahini, apple + banana',
    calories: { min: 1250, max: 1450 },
    protein: { min: 95, max: 110 },
    carbs: { min: 100, max: 115 },
    fat: { min: 50, max: 60 },
    deficit: { min: 500, max: 700 },
    score: 8,
  },
  {
    date: '29/04',
    isoDate: '2025-04-29',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Half cottage + toast, 50g turkey shawarma + 50g veal shawarma, hummus, tahini, quarter pita, salads, protein shake with fruit yogurt milk, 200g sirloin + sweet potato or potato, granola + Greek yogurt',
    calories: { min: 1600, max: 1750 },
    protein: { min: 120, max: 130 },
    carbs: { min: 110, max: 130 },
    fat: { min: 50, max: 60 },
    deficit: { min: 300, max: 500 },
    score: 9,
  },
  {
    date: '30/04',
    isoDate: '2025-04-30',
    training: 'Strength workout + group strength workout',
    trainingType: 'double',
    food: '1.5 sourdough slices + third cottage, 100g sirloin + sweet potato, yogurt + banana + 2 tbsp granola, protein shake 25g, 200g sirloin + 1.5 potatoes, 3 apples, 30 cashews',
    calories: { min: 2050, max: 2200 },
    protein: { min: 130, max: 145 },
    carbs: { min: 240, max: 260 },
    fat: { min: 50, max: 60 },
    deficit: 'light',
    score: 9.3,
  },
  {
    date: '01/05',
    isoDate: '2025-05-01',
    training: '2 workouts',
    trainingType: 'double',
    food: '2 sourdough slices + half cottage, 2 bananas, 200g chicken breast + 200g rice + 2 tbsp tahini + third pita, protein shake 25g, protein bar 10g, slice homemade Nutella cake, large tuna salad, chicken salad 100g chicken + sauce',
    calories: { min: 2200, max: 2400 },
    protein: { min: 135, max: 150 },
    carbs: { min: 260, max: 280 },
    fat: { min: 55, max: 65 },
    deficit: 'light',
    score: 9,
  },
  {
    date: '02/05',
    isoDate: '2025-05-02',
    training: 'Rest',
    trainingType: 'rest',
    food: 'Half small bun + 1 egg omelet + third cottage, 60g protein cornflakes + 140ml milk, protein shake 25g with sugar, 200g yogurt + peach + 2 tbsp granola, 200g sirloin + medium sweet potato, 4 cashews',
    calories: { min: 1540, max: 1740 },
    protein: { min: 114, max: 128 },
    carbs: { min: 145, max: 165 },
    fat: { min: 35, max: 46 },
    deficit: { min: 400, max: 600 },
    score: 8.5,
  },
  {
    date: '03/05',
    isoDate: '2025-05-03',
    training: 'Workout',
    trainingType: 'strength',
    food: 'Protein shake 25g, 200g chicken breast + half pita + hummus + tahini, yogurt + banana + granola, 120–150g chicken breast + vegetables + rice, apple, yogurt',
    calories: { min: 1500, max: 1700 },
    protein: { min: 120, max: 140 },
    carbs: { min: 130, max: 160 },
    fat: 'medium',
    deficit: { min: 400, max: 600 },
    score: 9.2,
  },
  {
    date: '04/05',
    isoDate: '2025-05-04',
    training: 'Workout',
    trainingType: 'strength',
    food: 'Yogurt 150–200g + 2 tbsp granola, protein shake 25g, 3 sourdough slices + cottage, 150g sirloin + half sweet potato + half pita, 4 small peaches + banana + watermelon, yogurt + 1 tbsp granola',
    calories: { min: 1700, max: 2000 },
    protein: { min: 100, max: 120 },
    carbs: { min: 180, max: 230 },
    fat: 'low',
    deficit: { min: 300, max: 500 },
    score: 9.2,
  },
  {
    date: '05/05',
    isoDate: '2025-05-05',
    training: 'Boxing',
    trainingType: 'boxing',
    food: 'Protein drink 33g, 100g turkey shawarma + quarter pita + 150g rice + salad + cabbage + 2 tbsp tahini + hummus, banana, half large chocolate chip cookie, 75% protein drink + banana, 200g rice + 200g sirloin',
    calories: { min: 1900, max: 2200 },
    protein: { min: 125, max: 140 },
    carbs: { min: 180, max: 230 },
    fat: 'medium',
    deficit: 'light-medium',
    score: 9.3,
  },
  {
    date: '06/05',
    isoDate: '2025-05-06',
    training: 'Not clearly logged',
    trainingType: 'other',
    food: 'Protein drink 33g, thick sourdough sandwich with egg salad, protein shake + yogurt with milk and fruit, 5–7 candies, 2 pastry triangles with pargit, Belgian waffle with chocolate',
    calories: { min: 2000, max: 2600 },
    protein: { min: 100, max: 120 },
    carbs: 'high',
    fat: 'medium-high',
    deficit: 'unknown',
    score: 7.8,
  },
]

export const snapshots: BodySnapshot[] = [
  {
    date: '26/04',
    weight: 72.6,
    waist: 84,
    neck: 39,
    chest: 97,
    thigh: 55.5,
    arm: 33,
  },
  {
    date: '06/05',
    weight: 71.7,
    waist: 83,
    neck: 39,
    chest: 92,
    thigh: 55,
    arm: 32,
    forearm: 29,
  },
]

export const targetWeight = { min: 70, max: 71 }
export const targetWaist = 82
export const periodStart = '17/04'
export const periodEnd = '06/05'
