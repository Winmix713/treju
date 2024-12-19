'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { LineChart, BarChart } from './charts'

interface StatisticsData {
  winRate: number
  totalPredictions: number
  averageOdds: number
  profitLoss: number
  monthlyData: {
    labels: string[]
    winRates: number[]
    profitLoss: number[]
  }
  leaguePerformance: {
    labels: string[]
    winRates: number[]
  }
  teamPerformance: {
    team: string
    matches: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
  }[]
}

export default function Statistics() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/statistics?timeRange=${timeRange}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast({
        title: "Hiba",
        description: `Nem sikerült betölteni a statisztikákat: ${error instanceof Error ? error.message : 'Ismeretlen hiba történt'}`,
        variant: "destructive",
      })
      setError(error instanceof Error ? error.message : 'Ismeretlen hiba történt')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange])

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Hiba történt: {error}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 px-4 py-2 bg-[#CCFF00] text-black rounded hover:bg-[#CCFF00]/80"
        >
          Újrapróbálkozás
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CCFF00]"></div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center text-gray-400">Nincs elérhető adat.</div>
  }

  const monthlyChartData = {
    labels: data.monthlyData.labels,
    datasets: [
      {
        label: 'Nyerési arány',
        data: data.monthlyData.winRates,
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsl(var(--chart-1) / 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Profit/Veszteség',
        data: data.monthlyData.profitLoss,
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.1)',
        yAxisID: 'y1',
      },
    ],
  }

  const leaguePerformanceData = {
    labels: data.leaguePerformance.labels,
    datasets: [
      {
        label: 'Nyerési arány ligánként',
        data: data.leaguePerformance.winRates,
        backgroundColor: 'hsl(var(--chart-1))',
      },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#CCFF00]">Statisztikák</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Válassz időtartamot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Utolsó 7 nap</SelectItem>
            <SelectItem value="30">Utolsó 30 nap</SelectItem>
            <SelectItem value="90">Utolsó 90 nap</SelectItem>
            <SelectItem value="365">Utolsó 365 nap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Nyerési arány</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#CCFF00]">{data.winRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Összes predikció</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalPredictions}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Átlagos odds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.averageOdds.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Profit/Veszteség</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.profitLoss >= 0 ? 'text-[#CCFF00]' : 'text-red-500'}`}>
              {data.profitLoss.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Havi teljesítmény</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={monthlyChartData} />
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Liga teljesítmény</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={leaguePerformanceData} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/30 border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white">Csapat teljesítmény</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeam || ''} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[200px] mb-4">
              <SelectValue placeholder="Válassz csapatot" />
            </SelectTrigger>
            <SelectContent>
              {data.teamPerformance.map((team) => (
                <SelectItem key={team.team} value={team.team}>{team.team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTeam && (
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Mérkőzések</th>
                  <th scope="col" className="px-6 py-3">Győzelmek</th>
                  <th scope="col" className="px-6 py-3">Döntetlenek</th>
                  <th scope="col" className="px-6 py-3">Vereségek</th>
                  <th scope="col" className="px-6 py-3">Rúgott gólok</th>
                  <th scope="col" className="px-6 py-3">Kapott gólok</th>
                </tr>
              </thead>
              <tbody>
                {data.teamPerformance
                  .filter((team) => team.team === selectedTeam)
                  .map((team) => (
                    <tr key={team.team} className="border-b bg-gray-800 border-gray-700">
                      <td className="px-6 py-4">{team.matches}</td>
                      <td className="px-6 py-4">{team.wins}</td>
                      <td className="px-6 py-4">{team.draws}</td>
                      <td className="px-6 py-4">{team.losses}</td>
                      <td className="px-6 py-4">{team.goalsFor}</td>
                      <td className="px-6 py-4">{team.goalsAgainst}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

