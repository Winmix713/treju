'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock authentication - in a real app, this would call your auth API
      if (email === 'takosadam@gmail.com' && password === 'takosadam') {
        onLogin('takosadam')
        toast({
          title: "Sikeres bejelentkezés",
          description: "Üdvözöljük a Winmix rendszerben!",
        })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        title: "Hiba",
        description: "Hibás email vagy jelszó",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#141414] border-[#CCFF00]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#CCFF00]">Bejelentkezés</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email cím</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/30 border-white/10 focus:border-[#CCFF00]/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Jelszó</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/30 border-white/10 focus:border-[#CCFF00]/50"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#CCFF00] to-[#9EFF00] text-black font-medium"
          >
            {isLoading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Nincs még fiókod?{' '}
          <a href="/register" className="text-[#CCFF00] hover:underline">
            Regisztráció
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}

