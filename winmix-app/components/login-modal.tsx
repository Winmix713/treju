'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from '@/lib/useUser'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useUser()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      login(data.user)
      onClose()
      toast({
        title: "Sikeres bejelentkezés",
        description: "Üdvözöljük a Winmix rendszerben!",
      })
    } catch (error) {
      setError('Hibás email vagy jelszó')
      toast({
        title: "Hiba",
        description: "Sikertelen bejelentkezés. Kérjük, ellenőrizze az adatait.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/80 rounded-2xl p-8 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </Button>

            <h2 className="text-2xl font-bold mb-6 text-[#CCFF00]">Bejelentkezés</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email cím
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 focus:border-[#CCFF00]/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Jelszó
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 rounded-xl border border-white/10 focus:border-[#CCFF00]/50 focus:outline-none transition-colors"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-gradient-to-r from-[#CCFF00] to-[#9EFF00] text-black font-medium rounded-xl hover:opacity-90 transition-opacity ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">
              Nincs még fiókod?{' '}
              <a href="/register" className="text-[#CCFF00] hover:underline">
                Regisztráció
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

