'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PredictionResults() {
  const { predictions, handleFavoriteToggle } = useAppContext()
  const [sortBy, setSortBy] = useState('predictionScore')

  const sortedPredictions = [...predictions].sort((a, b) => {
    if (sortBy === 'matchName') {
      const nameA = `${a.match.homeTeam?.name} vs ${a.match.awayTeam?.name}`.toLowerCase()
      const nameB = `${b.match.homeTeam?.name} vs ${b.match.awayTeam?.name}`.toLowerCase()
      return nameA.localeCompare(nameB)
    }
    if (sortBy === 'predictionScore') {
      return (b.teamAnalysis.predictionScore || 0) - (a.teamAnalysis.predictionScore || 0)
    }
    if (sortBy === 'averageGoals') {
      return (b.teamAnalysis.average_goals.average_total_goals || 0) - (a.teamAnalysis.average_goals.average_total_goals || 0)
    }
    if (sortBy === 'btts') {
      return (b.teamAnalysis.both_teams_scored_percentage || 0) - (a.teamAnalysis.both_teams_scored_percentage || 0)
    }
    return 0
  })

  if (predictions.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#CCFF00]">Predikciók eredménye</h2>
      <div className="mb-4 flex justify-between items-center">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="predictionScore">Predikciós pontszám</SelectItem>
            <SelectItem value="averageGoals">Átlagos gólszám</SelectItem>
            <SelectItem value="btts">Mindkét csapat gólját</SelectItem>
            <SelectItem value="matchName">Mérkőzés neve</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedPredictions.map((prediction, index) => (
          <Card key={index} className="bg-[#1A1A1A]/50 backdrop-blur-md border border-[#CCFF00]/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Premier League Head-to-Head</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFavoriteToggle(prediction)}
                >
                  <i className={`ri-star-${prediction.isFavorite ? 'fill' : 'line'}`}></i>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <Image
                    src={prediction.match.homeTeam?.logoUrl || ''}
                    alt={prediction.match.homeTeam?.name || ''}
                    width={60}
                    height={60}
                    className="mx-auto mb-2"
                  />
                  <span className="text-sm">{prediction.match.homeTeam?.name}</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#CCFF00]">{prediction.teamAnalysis.matches_count}</div>
                  <div className="text-xs">Matches</div>
                </div>
                <div className="text-center">
                  <Image
                    src={prediction.match.awayTeam?.logoUrl || ''}
                    alt={prediction.match.awayTeam?.name || ''}
                    width={60}
                    height={60}
                    className="mx-auto mb-2"
                  />
                  <span className="text-sm">{prediction.match.awayTeam?.name}</span>
                </div>
              </div>
              {/* Add more prediction details here */}
              <div className="mt-4 text-center">
                <div className="text-sm text-[#CCFF00]">
                  Prediction Score: <span className="font-bold text-base">{prediction.teamAnalysis.predictionScore?.toFixed(2) ?? 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

