'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import MatchSelection from '@/components/MatchSelection'
import PredictionResults from '@/components/PredictionResults'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { runPredictions, timeLeft } = useAppContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleRunPredictions = async () => {
    setIsGenerating(true)
    try {
      await runPredictions()
      toast({
        title: "Success",
        description: "Predictions have been successfully generated!",
      })
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

  return (
    <div className="space-y-8">
      <MatchSelection />
      <div className="flex justify-center">
        <Button
          onClick={handleRunPredictions}
          disabled={isGenerating || timeLeft <= 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? 'Generating...' : 'Generate Predictions'}
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <PredictionResults />
    </div>
  )
}

