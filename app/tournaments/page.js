'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useTranslation } from '@/hooks/useTranslation'

export default function TournamentsPage() {
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState('active')

  const tournaments = [
    {
      id: 1,
      name: 'Mega Slots Tournament',
      game: 'Slots',
      prizePool: 50000,
      players: 1247,
      maxPlayers: 5000,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      status: 'active',
      entryFee: 0,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Live Casino Championship',
      game: 'Live Casino',
      prizePool: 75000,
      players: 892,
      maxPlayers: 2000,
      startDate: '2024-01-20',
      endDate: '2024-01-27',
      status: 'upcoming',
      entryFee: 100,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Sports Betting Masters',
      game: 'Sports',
      prizePool: 100000,
      players: 2156,
      maxPlayers: 10000,
      startDate: '2024-01-10',
      endDate: '2024-01-17',
      status: 'active',
      entryFee: 0,
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Crash Game Challenge',
      game: 'Crash',
      prizePool: 30000,
      players: 3456,
      maxPlayers: 10000,
      startDate: '2024-01-25',
      endDate: '2024-02-01',
      status: 'upcoming',
      entryFee: 50,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Weekly Slots Showdown',
      game: 'Slots',
      prizePool: 25000,
      players: 5678,
      maxPlayers: 10000,
      startDate: '2024-01-08',
      endDate: '2024-01-15',
      status: 'finished',
      entryFee: 0,
      image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=300&h=400&fit=crop'
    },
  ]

  const filters = ['all', 'active', 'upcoming', 'finished']

  const filteredTournaments = selectedFilter === 'all'
    ? tournaments
    : tournaments.filter(t => t.status === selectedFilter)

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400'
      case 'finished':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'upcoming':
        return 'Upcoming'
      case 'finished':
        return 'Finished'
      default:
        return status
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-dark">
      <Navbar />
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                {t('common.tournaments')}
              </h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-primary text-background-dark'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {filter === 'all' ? t('common.all') : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={tournament.image}
                      alt={tournament.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(tournament.status)}`}>
                        {getStatusText(tournament.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-2">{tournament.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Game:</span>
                        <span className="text-white font-medium">{tournament.game}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Prize Pool:</span>
                        <span className="text-primary font-bold text-lg">₺{tournament.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Players:</span>
                        <span className="text-white font-medium">
                          {tournament.players.toLocaleString()} / {tournament.maxPlayers.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(tournament.players / tournament.maxPlayers) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Entry Fee:</span>
                        <span className="text-white font-medium">
                          {tournament.entryFee === 0 ? 'Free' : `₺${tournament.entryFee}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Start: {new Date(tournament.startDate).toLocaleDateString()}</span>
                        <span>End: {new Date(tournament.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-colors ${
                        tournament.status === 'active'
                          ? 'bg-primary text-background-dark hover:bg-yellow-400'
                          : tournament.status === 'upcoming'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-600 text-white cursor-not-allowed'
                      }`}
                      disabled={tournament.status === 'finished'}
                    >
                      {tournament.status === 'active' ? 'Join Tournament' : tournament.status === 'upcoming' ? 'Register' : 'Finished'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 bg-zinc-900 rounded-xl">
              <h2 className="text-white text-xl font-bold mb-4">About Tournaments</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Compete against other players in exciting tournaments across different game categories. 
                Climb the leaderboard, win amazing prizes, and prove you&apos;re the best!
              </p>
              <ul className="list-disc list-inside text-white/70 text-sm space-y-2">
                <li>Free and paid entry tournaments available</li>
                <li>Real-time leaderboards</li>
                <li>Multiple prize tiers</li>
                <li>Regular tournaments throughout the week</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


