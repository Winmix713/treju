import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from '@/contexts/AppContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WinMix - Sportfogadási predikciók',
  description: 'Professzionális sportfogadási predikciók és elemzések',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        <AppProvider>
          <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}

