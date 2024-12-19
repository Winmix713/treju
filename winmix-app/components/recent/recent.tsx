'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Prediction {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  predictedResult: string
  actualResult: string
  odds: number
  date: string
  league: string
  homeWinPercentage: number
  drawPercentage: number
  awayWinPercentage: number
  predictionScore: number
  homeTeamLogo: string
  awayTeamLogo: string
}

export default function Recent() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPredictions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/predictions?page=${currentPage}`)
      if (!response.ok) throw new Error('Failed to fetch predictions')
      const data = await response.json()
      setPredictions(data.predictions)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching predictions:', error)
      toast({
        title: "Hiba",
        description: "Nem sikerült betölteni a legutóbbi predikciókat.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPredictions()
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CCFF00]"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-[#CCFF00] mb-6">Legutóbbi predikciók</h2>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Összes</TabsTrigger>
          <TabsTrigger value="won">Nyert</TabsTrigger>
          <TabsTrigger value="lost">Vesztett</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PredictionList predictions={predictions} />
        </TabsContent>
        <TabsContent value="won">
          <PredictionList predictions={predictions.filter(p => p.predictedResult === p.actualResult)} />
        </TabsContent>
        <TabsContent value="lost">
          <PredictionList predictions={predictions.filter(p => p.predictedResult !== p.actualResult)} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-6 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          Előző
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Következő
        </Button>
      </div>
    </motion.div>
  )
}

function PredictionList({ predictions }: { predictions: Prediction[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction) => (
        <Card key={prediction.id} className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src={prediction.homeTeamLogo}
                  alt={prediction.homeTeam}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span>{prediction.homeTeam}</span>
              </div>
              <span>vs</span>
              <div className="flex items-center">
                <span>{prediction.awayTeam}</span>
                <Image
                  src={prediction.awayTeamLogo}
                  alt={prediction.awayTeam}
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
              <span className="text-gray-400">Predikció: </span>
              <span className="font-medium">{prediction.predictedResult}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">Eredmény: </span>
              <span className={`font-medium ${prediction.predictedResult === prediction.actualResult ? 'text-[#CCFF00]' : 'text-red-500'}`}>
                {prediction.actualResult}
              </span>
            </p>
            <p className="text-sm mt-2">
              <span className="text-gray-400">Odds: </span>
              <span className="font-medium">{prediction.odds.toFixed(2)}</span>
            </p>
            <div className="mt-2 text-sm">
              <p className="text-gray-400">Várható győzelmi esélyek:</p>
              <p>A {prediction.homeTeam} esélyei: {prediction.homeWinPercentage.toFixed(2)}%</p>
              <p>Döntetlen esélye: {prediction.drawPercentage.toFixed(2)}%</p>
              <p>A {prediction.awayTeam} esélyei: {prediction.awayWinPercentage.toFixed(2)}%</p>
            </div>
            <p className="text-sm text-gray-300 mt-2">Predikciós pontszám: <span className="font-medium text-[#CCFF00]">{prediction.predictionScore.toFixed(2)}</span></p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

