'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppContext } from '@/contexts/AppContext'

export default function PredictionResults() {
  const { predictions, handleFavoriteToggle } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const totalPages = Math.ceil(predictions.length / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const paginatedPredictions = predictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-[#CCFF00] mb-6">Prediction Results</h2>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PredictionList predictions={paginatedPredictions} onFavoriteToggle={handleFavoriteToggle} />
        </TabsContent>
        <TabsContent value="favorites">
          <PredictionList 
            predictions={paginatedPredictions.filter(p => p.isFavorite)} 
            onFavoriteToggle={handleFavoriteToggle} 
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-6 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </motion.div>
  )
}

function PredictionList({ predictions, onFavoriteToggle }: { predictions: any[], onFavoriteToggle: (prediction: any) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction) => (
        <Card key={`${prediction.match.homeTeam.id}-${prediction.match.awayTeam.id}`} className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src={prediction.match.homeTeam.logoUrl}
                  alt={prediction.match.homeTeam.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span>{prediction.match.homeTeam.name}</span>
              </div>
              <span>vs</span>
              <div className="flex items-center">
                <span>{prediction.match.awayTeam.name}</span>
                <Image
                  src={prediction.match.awayTeam.logoUrl}
                  alt={prediction.match.awayTeam.name}
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-2">{prediction.league} - {new Date(prediction.date).toLocaleDateString()}</p>
            <p className="text-xl font-bold mb-2">{prediction.homeScore} - {prediction.awayScore}</p>
            <p className="text-sm">
              <span className="text-gray-400">Prediction: </span>
              <span className="font-medium">{prediction.predictedResult}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Result: </span>
              <span className={`font-medium ${prediction.predictedResult === prediction.actualResult ? 'text-[#CCFF00]' : 'text-red-500'}`}>
                {prediction.actualResult}
              </span>
            </p>
            <p className="text-sm mt-2">
              <span className="text-gray-400">Odds: </span>
              <span className="font-medium">{prediction.odds.toFixed(2)}</span>
            </p>
            <div className="mt-2 text-sm">
              <p className="text-gray-400">Expected win probabilities:</p>
              <p>Home team: {prediction.homeWinPercentage.toFixed(2)}%</p>
              <p>Draw: {prediction.drawPercentage.toFixed(2)}%</p>
              <p>Away team: {prediction.awayWinPercentage.toFixed(2)}%</p>
            </div>
            <p className="text-sm text-gray-300 mt-2">Prediction Score: <span className="font-medium text-[#CCFF00]">{prediction.teamAnalysis.predictionScore.toFixed(2)}</span></p>
            <Button 
              onClick={() => onFavoriteToggle(prediction)} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              {prediction.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

