'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useUser } from '@/lib/useUser'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Prediction {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  drawPercentage: number
  awayWinPercentage: number
  homeWinPercentage: number
  tip: string
  lastUpdated: string
  homeTeamLogo: string
  awayTeamLogo: string
}

export default function Favorites() {
  const { user } = useUser()
  const [favorites, setFavorites] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const response = await fetch('/api/favorites')
          if (!response.ok) throw new Error('Failed to fetch favorites')
          const data = await response.json()
          setFavorites(data)
        } catch (error) {
          console.error('Error fetching favorites:', error)
          toast({
            title: "Hiba",
            description: "Nem sikerült betölteni a kedvenceket.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const toggleFavorite = async (predictionId: string) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId }),
      })
      if (!response.ok) throw new Error('Failed to toggle favorite')
      setFavorites(prev => prev.filter(fav => fav.id !== predictionId))
      toast({
        title: "Siker",
        description: "A kedvenc sikeresen eltávolítva.",
      })
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Hiba",
        description: "Nem sikerült eltávolítani a kedvencet.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CCFF00]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
      >
        <p className="text-xl text-gray-400 mb-4">Jelentkezz be a kedvencek használatához!</p>
        <Button variant="outline">Bejelentkezés</Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-[#CCFF00] mb-6">Kedvencek</h2>
      {favorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((prediction) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-black/30 border-white/10 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Image src={prediction.homeTeamLogo} alt={prediction.homeTeam} width={32} height={32} />
                      <Image src={prediction.awayTeamLogo} alt={prediction.awayTeam} width={32} height={32} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(prediction.id)}
                      className="text-[#CCFF00] hover:text-[#CCFF00]/80"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-400">{prediction.homeTeam} vs {prediction.awayTeam}</p>
                    <p className="text-xl font-bold mt-1">{prediction.homeScore} : {prediction.awayScore}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-gray-400">Hazai</p>
                      <p className="font-bold">{prediction.homeWinPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Döntetlen</p>
                      <p className="font-bold">{prediction.drawPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Vendég</p>
                      <p className="font-bold">{prediction.awayWinPercentage}%</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">{prediction.tip}</p>
                  <p className="mt-2 text-xs text-gray-400">Utolsó frissítés: {prediction.lastUpdated}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center

