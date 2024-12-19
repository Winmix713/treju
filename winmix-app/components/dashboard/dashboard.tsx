'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface WeightSettings {
  recentForm: number
  headToHead: number
  leaguePosition: number
  goalScoring: number
  defensiveRecord: number
  homeAdvantage: number
}

export default function Dashboard() {
  const [weights, setWeights] = useState<WeightSettings>({
    recentForm: 0.2,
    headToHead: 0.15,
    leaguePosition: 0.15,
    goalScoring: 0.2,
    defensiveRecord: 0.15,
    homeAdvantage: 0.15
  })

  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  const handleWeightChange = (key: keyof WeightSettings, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [key]: value[0]
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weights, selectedLeague }),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      toast({
        title: "Siker",
        description: "A beállítások sikeresen mentve!",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni a beállításokat.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-[#CCFF00] mb-6">Irányítópult</h1>

      <Card className="bg-black/30 border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#CCFF00]">Predikciós súlyozások</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Forma (utolsó 5 mérkőzés)</label>
              <Slider
                value={[weights.recentForm]}
                onValueChange={(value) => handleWeightChange('recentForm', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.recentForm * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Egymás elleni eredmények</label>
              <Slider
                value={[weights.headToHead]}
                onValueChange={(value) => handleWeightChange('headToHead', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.headToHead * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Tabella pozíció</label>
              <Slider
                value={[weights.leaguePosition]}
                onValueChange={(value) => handleWeightChange('leaguePosition', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.leaguePosition * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Gólszerzési mutató</label>
              <Slider
                value={[weights.goalScoring]}
                onValueChange={(value) => handleWeightChange('goalScoring', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.goalScoring * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Védekezési mutató</label>
              <Slider
                value={[weights.defensiveRecord]}
                onValueChange={(value) => handleWeightChange('defensiveRecord', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.defensiveRecord * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Hazai pálya előny</label>
              <Slider
                value={[weights.homeAdvantage]}
                onValueChange={(value) => handleWeightChange('homeAdvantage', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(weights.homeAdvantage * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Liga kiválasztása</label>
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Válassz ligát" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes liga</SelectItem>
                <SelectItem value="premier-league">Premier League</SelectItem>
                <SelectItem value="la-liga">La Liga</SelectItem>
                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                <SelectItem value="serie-a">Serie A</SelectItem>
                <SelectItem value="ligue-1">Ligue 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
          >
            {isLoading ? 'Mentés...' : 'Beállítások mentése'}
          </Button>
        </CardContent>
      </Card>

      {/* Add more dashboard components here, such as recent predictions, performance overview, etc. */}
    </motion.div>
  )
}

