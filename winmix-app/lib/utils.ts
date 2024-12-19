import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculatePredictionScore(data: any) {
  const weights = {
    headToHead: 0.25,
    form: 0.20,
    expectedGoals: 0.20,
    modelPredictions: 0.35
  }

  let score = 0

  // Head-to-head
  const homeWinPercentage = data.team_analysis.head_to_head_stats.home_win_percentage || 0
  const headToHeadScore = homeWinPercentage / 100
  score += headToHeadScore * weights.headToHead

  // Form
  const homeFormIndex = data.team_analysis.home_form_index || 0
  const awayFormIndex = data.team_analysis.away_form_index || 0
  const formDifference = (homeFormIndex - awayFormIndex) / 100
  const formScore = (formDifference + 1) / 2
  score += formScore * weights.form

  // Expected goals
  const homeExpectedGoals = data.prediction.homeExpectedGoals || 0
  const awayExpectedGoals = data.prediction.awayExpectedGoals || 0
  const expectedGoalsDifference = homeExpectedGoals - awayExpectedGoals
  const expectedGoalsScore = (expectedGoalsDifference + 4) / 8
  score += expectedGoalsScore * weights.expectedGoals

  // Model predictions
  let modelScore = 0
  if (data.prediction.modelPredictions.randomForest === "home_win") modelScore += 1
  if (data.prediction.modelPredictions.poisson.homeGoals > data.prediction.modelPredictions.poisson.awayGoals) modelScore += 1
  modelScore += data.prediction.modelPredictions.elo.homeWinProb
  modelScore /= 3
  score += modelScore * weights.modelPredictions

  return score * 10
}

