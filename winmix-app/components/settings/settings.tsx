'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useUser } from '@/lib/useUser'

interface WeightSettings {
  recentForm: number
  headToHead: number
  leaguePosition: number
  goalScoring: number
  defensiveRecord: number
  homeAdvantage: number
}

interface UserSettings {
  weights: WeightSettings
  defaultLeague: string
  notifications: boolean
  darkMode: boolean
}

const defaultSettings: UserSettings = {
  weights: {
    recentForm: 0.2,
    headToHead: 0.15,
    leaguePosition: 0.15,
    goalScoring: 0.2,
    defensiveRecord: 0.15,
    homeAdvantage: 0.15
  },
  defaultLeague: 'all',
  notifications: true,
  darkMode: false
}

export default function Settings() {
  const { user } = useUser()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const response = await fetch('/api/settings')
          if (!response.ok) throw new Error('Failed to fetch settings')
          const data = await response.json()
          setSettings(data)
        } catch (error) {
          console.error('Error fetching settings:', error)
          toast({
            title: "Hiba",
            description: "Nem sikerült betölteni a beállításokat.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [user])

  const handleWeightChange = (key: keyof WeightSettings, value: number[]) => {
    setSettings(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: value[0]
      }
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
        body: JSON.stringify(settings),
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
        <p className="text-xl text-gray-400 mb-4">Jelentkezz be a beállítások módosításához!</p>
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
      <h1 className="text-3xl font-bold text-[#CCFF00] mb-6">Beállítások</h1>

      <Card className="bg-black/30 border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#CCFF00]">Predikciós súlyozások</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Forma (utolsó 5 mérkőzés)</label>
              <Slider
                value={[settings.weights.recentForm]}
                onValueChange={(value) => handleWeightChange('recentForm', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(settings.weights.recentForm * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Egymás elleni eredmények</label>
              <Slider
                value={[settings.weights.headToHead]}
                onValueChange={(value) => handleWeightChange('headToHead', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(settings.weights.headToHead * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Tabella pozíció</label>
              <Slider
                value={[settings.weights.leaguePosition]}
                onValueChange={(value) => handleWeightChange('leaguePosition', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(settings.weights.leaguePosition * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Gólszerzési mutató</label>
              <Slider
                value={[settings.weights.goalScoring]}
                onValueChange={(value) => handleWeightChange('goalScoring', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(settings.weights.goalScoring * 100).toFixed(0)}%</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Védekezési mutató</label>
              <Slider
                value={[settings.weights.defensiveRecord]}
                onValueChange={(value) => handleWeightChange('defensiveRecord', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{(settings.weights.

