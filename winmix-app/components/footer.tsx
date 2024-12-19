'use client'

import Link from 'next/link'
import { useAppContext } from '@/contexts/AppContext'

export default function Footer() {
  const { favoritePredictions } = useAppContext()

  return (
    <footer className="bg-[#0A0A0A]/80 backdrop-blur-md border-t border-[#CCFF00]/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <nav className="flex justify-around md:justify-start space-x-4 mb-4 md:mb-0">
            <Link href="/" className="flex flex-col items-center text-[#CCFF00]">
              <i className="ri-home-line text-2xl mb-1"></i>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/statistics" className="flex flex-col items-center text-white/70 hover:text-[#CCFF00] transition-colors">
              <i className="ri-bar-chart-line text-2xl mb-1"></i>
              <span className="text-xs">Statistics</span>
            </Link>
            <Link href="/favorited-statistics" className="flex flex-col items-center text-white/70 hover:text-[#CCFF00] transition-colors">
              <i className="ri-star-line text-2xl mb-1"></i>
              <span className="text-xs">Favorited Stats</span>
            </Link>
            <Link href="/recent" className="flex flex-col items-center text-white/70 hover:text-[#CCFF00] transition-colors">
              <i className="ri-history-line text-2xl mb-1"></i>
              <span className="text-xs">Recent</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center text-white/70 hover:text-[#CCFF00] transition-colors">
              <i className="ri-settings-line text-2xl mb-1"></i>
              <span className="text-xs">Settings</span>
            </Link>
          </nav>
          <div className="text-[#CCFF00]">
            <span className="text-sm">
              {favoritePredictions.length > 0
                ? `Kedvencek száma: ${favoritePredictions.length}`
                : 'Nincs kiválasztott kedvenc mérkőzés'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

