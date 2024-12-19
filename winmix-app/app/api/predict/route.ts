import { NextResponse } from 'next/server'
import { TEAMS } from '@/lib/constants'

export async function POST(request: Request) {
  const { homeTeam, awayTeam } = await request.json()

  // This is a mock prediction. In a real application, you'd call your backend API here.
  const mockPrediction = {
    team_analysis: {
      matches_count: Math.floor(Math.random() * 20) + 10,
      head_to_head_stats: {
        home_wins: Math.floor(Math.random() * 10),
        draws: Math.floor(Math.random() * 5),
        away_wins: Math.floor(Math.random() * 10),
      },
      average_goals: {
        average_home_goals: (Math.random() * 2 + 1).toFixed(2),
        average_away_goals: (Math.random() * 2 + 1).toFixed(2),
        average_total_goals: (Math.random() * 4 + 2).toFixed(2),
      },
      both_teams_scored_percentage: Math.floor(Math.random() * 100),
      home_form_index: Math.floor(Math.random() * 100),
      away_form_index: Math.floor(Math.random() * 100),
    },
    prediction: {
      homeExpectedGoals: (Math.random() * 3).toFixed(2),
      awayExpectedGoals: (Math.random() * 3).toFixed(2),
      modelPredictions: {
        randomForest: Math.random() > 0.5 ? "home_win" : "away_win",
        poisson: {
          homeGoals: Math.floor(Math.random() * 4),
          awayGoals: Math.floor(Math.random() * 4),
        },
        elo: {
          homeWinProb: Math.random(),
        },
      },
    },
  }

  return NextResponse.json(mockPrediction)
}

