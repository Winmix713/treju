'use client'

import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/LoginModal"

export default function Header() {
  const { userSettings } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<{ username: string } | null>(null)

  const handleLogin = (username: string) => {
    setLoggedInUser({ username })
    setIsLoginModalOpen(false)
  }

  const handleLogout = () => {
    setLoggedInUser(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#CCFF00]/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          winmix<span className="text-[#CCFF00]">.hu</span>
        </div>
        <div className="flex items-center gap-2">
          {loggedInUser ? (
            <>
              <span>{loggedInUser.username}</span>
              <Button onClick={handleLogout}>Kijelentkezés</Button>
            </>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)}>Bejelentkezés</Button>
          )}
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />
    </header>
  )
}

