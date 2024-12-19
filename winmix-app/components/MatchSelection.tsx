'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TEAMS } from '@/lib/constants'

export default function MatchSelection() {
  const { selectedMatches, setSelectedMatches } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [leagueFilter, setLeagueFilter] = useState('')

  const handleTeamSelect = (index: number, position: 'homeTeam' | 'awayTeam', teamId: string) => {
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

  const filteredTeams = TEAMS.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (leagueFilter === '' || team.league === leagueFilter)
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#CCFF00]">Mérkőzések kiválasztása</h2>
      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-[#141414] border border-[#CCFF00]/20 rounded-md text-white"
        />
        <Select value={leagueFilter} onValueChange={setLeagueFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose a league" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Minden liga</SelectItem>
            <SelectItem value="premier-league">Premier League</SelectItem>
            <SelectItem value="la-liga">La Liga</SelectItem>
            <SelectItem value="bundesliga">Bundesliga</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {selectedMatches.map((match, index) => (
          <Card key={index} className="bg-white/5">
            <CardHeader>
              <CardTitle className="text-sm">Match {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Select
                  value={match.homeTeam?.id || ''}
                  onValueChange={(value) => handleTeamSelect(index, 'homeTeam', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {match.homeTeam && (
                  <Image
                    src={match.homeTeam.logoUrl}
                    alt={match.homeTeam.name}
                    width={32}
                    height={32}
                    className="mx-auto"
                  />
                )}
                <Select
                  value={match.awayTeam?.id || ''}
                  onValueChange={(value) => handleTeamSelect(index, 'awayTeam', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {match.awayTeam && (
                  <Image
                    src={match.awayTeam.logoUrl}
                    alt={match.awayTeam.name}
                    width={32}
                    height={32}
                    className="mx-auto"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

