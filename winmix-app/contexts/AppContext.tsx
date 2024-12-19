'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { TEAMS, MATCH_SLOTS, TIMER_DURATION } from '@/lib/constants'
import { fetchApi } from '@/lib/api'
import { calculatePredictionScore } from '@/lib/utils'

interface Team {
  id: string
  name: string
  logoUrl: string
  weight?: number
  league: string
}

interface Match {
  homeTeam: Team | null
  awayTeam: Team | null
}

interface Prediction {
  match: Match
  teamAnalysis: any // Replace with a more specific type if possible
}

interface AppContextType {
  selectedMatches: Match[]
  setSelectedMatches: React.Dispatch<React.SetStateAction<Match[]>>
  predictions: Prediction[]
  setPredictions: React.Dispatch<React.SetStateAction<Prediction[]>>
  favoritePredictions: Prediction[]
  setFavoritePredictions: React.Dispatch<React.SetStateAction<Prediction[]>>
  recentPredictions: Prediction[]
  setRecentPredictions: React.Dispatch<React.SetStateAction<Prediction[]>>
  timeLeft: number
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  runPredictions: () => Promise<void>
  handleFavoriteToggle: (prediction: Prediction) => void
  userSettings: {
    darkMode: boolean
    language: string
    notificationsEnabled: boolean
  }
  setUserSettings: React.Dispatch<React.SetStateAction<{
    darkMode: boolean
    language: string
    notificationsEnabled: boolean
  }>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedMatches, setSelectedMatches] = useState<Match[]>(
    Array(MATCH_SLOTS).fill({ homeTeam: null, awayTeam: null })
  )
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [favoritePredictions, setFavoritePredictions] = useState<Prediction[]>([])
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([])
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [userSettings, setUserSettings] = useState({
    darkMode: false,
    language: 'hu',
    notificationsEnabled: true
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoritePredictions')
    if (savedFavorites) {
      setFavoritePredictions(JSON.parse(savedFavorites))
    }

    const savedRecent = localStorage.getItem('recentPredictions')
    if (savedRecent) {
      setRecentPredictions(JSON.parse(savedRecent))
    }

    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings))
    }
  }, [])

  const runPredictions = async () => {
    const validMatches = selectedMatches.filter((match) => match.homeTeam && match.awayTeam)

    if (validMatches.length === 0) {
      throw new Error('Please select at least one complete match')
    }

    const fetchPromises = validMatches.map((match) => {
      return fetchApi('/api/predict', {
        method: 'POST',
        body: JSON.stringify({ homeTeam: match.homeTeam?.id, awayTeam: match.awayTeam?.id }),
      })
    })

    try {
      const results = await Promise.all(fetchPromises)
      const newPredictions = results.map((data, index) => ({
        match: validMatches[index],
        teamAnalysis: {
          ...data.team_analysis,
          predictionScore: calculatePredictionScore(data),
        },
      }))

      setPredictions(newPredictions)
      setRecentPredictions((prev) => [...newPredictions, ...prev].slice(0, 5))
      localStorage.setItem('recentPredictions', JSON.stringify(recentPredictions))
    } catch (error) {
      console.error('Error in runPredictions:', error)
      throw error
    }
  }

  const handleFavoriteToggle = (prediction: Prediction) => {
    setFavoritePredictions((prev) => {
      const index = prev.findIndex(
        (fav) =>
          fav.match.homeTeam?.id === prediction.match.homeTeam?.id &&
          fav.match.awayTeam?.id === prediction.match.awayTeam?.id
      )

      let newFavorites
      if (index === -1) {
        newFavorites = [...prev, prediction]
      } else {
        newFavorites = prev.filter((_, i) => i !== index)
      }

      localStorage.setItem('favoritePredictions', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  return (
    <AppContext.Provider
      value={{
        selectedMatches,
        setSelectedMatches,
        predictions,
        setPredictions,
        favoritePredictions,
        setFavoritePredictions,
        recentPredictions,
        setRecentPredictions,
        timeLeft,
        setTimeLeft,
        runPredictions,
        handleFavoriteToggle,
        userSettings,
        setUserSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

