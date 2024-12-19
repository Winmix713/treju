'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TEAMS } from '@/lib/constants'
import { useAppContext } from '@/contexts/AppContext'

interface MatchSelectionProps {
  onPredictionsGenerated: (data: any) => void
}

export default function MatchSelection({ onPredictionsGenerated }: MatchSelectionProps) {
  const { selectedMatches, setSelectedMatches, timeLeft, runPredictions } = useAppContext()
  const [leagues, setLeagues] = useState<string[]>([])
  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeagues()
  }, [])

  const fetchLeagues = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetch('/api/leagues').then(res => res.json())
      setLeagues(data.leagues)
    } catch (error) {
      console.error('Error fetching leagues:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      toast({
        title: "Error",
        description: `Failed to load leagues: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMatchSelection = (index: number, position: 'home' | 'away', teamId: string) => {
    const team = TEAMS.find(t => t.id === teamId)
    setSelectedMatches(prev => {
      const newMatches = [...prev]
      newMatches[index] = {
        ...newMatches[index],
        [position]: team || null
      }
      return newMatches
    })
  }

  const handleRunPredictions = async () => {
    setIsGenerating(true)
    try {
      await runPredictions()
      toast({
        title: "Success",
        description: "Predictions have been successfully generated!",
      })
      onPredictionsGenerated({ predictions: selectedMatches })
    } catch (error) {
      console.error('Error generating predictions:', error)
      toast({
        title: "Error",
        description: "An error occurred while generating predictions. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        <p>An error occurred: {error}</p>
        <Button 
          onClick={fetchLeagues} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Select Matches</h2>
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All leagues</SelectItem>
            {leagues.map(league => (
              <SelectItem key={league} value={league}>{league}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedMatches.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Match {index + 1}</CardTitle>
                <Checkbox
                  checked={!!(match.homeTeam && match.awayTeam)}
                  onCheckedChange={() => {/* Handle match selection */}}
                />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Select value={match.homeTeam?.id || ''} onValueChange={(value) => handleMatchSelection(index, 'home', value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Home team" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAMS.filter(team => selectedLeague === 'all' || team.league === selectedLeague)
                        .map(team => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <span>vs</span>
                  <Select value={match.awayTeam?.id || ''} onValueChange={(value) => handleMatchSelection(index, 'away', value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Away team" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAMS.filter(team => selectedLeague === 'all' || team.league === selectedLeague)
                        .map(team => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                {match.homeTeam && match.awayTeam && (
                  <div className="flex justify-between items-center">
                    <Image
                      src={match.homeTeam.logoUrl}
                      alt={match.homeTeam.name}
                      width={32}
                      height={32}
                      className="mr-2"
                    />
                    <Image
                      src={match.awayTeam.logoUrl}
                      alt={match.awayTeam.name}
                      width={32}
                      height={32}
                      className="ml-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleRunPredictions}
          disabled={isGenerating || selectedMatches.every(match => !match.homeTeam || !match.awayTeam)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? 'Generating...' : `Generate Predictions (${selectedMatches.filter(match => match.homeTeam && match.awayTeam).length} selected)`}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
    </motion.div>
  )
}

