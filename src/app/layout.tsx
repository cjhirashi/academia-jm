import type { Metadata } from 'next'
import { Geist, Geist_Mono, Dancing_Script } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const dancingScript = Dancing_Script({ variable: '--font-script', subsets: ['latin'], weight: ['700'] })

export const metadata: Metadata = {
  title: 'Academia JM — Salsa, Cumbia, Zumba, Jumping y Yoga',
  description: 'Academia dedicada al aprendizaje físico, artístico y espiritual en Cuajimalpa de Morelos, CDMX.',
  keywords: ['academia de baile', 'salsa', 'cumbia', 'zumba', 'jumping', 'yoga', 'cuajimalpa', 'cdmx'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
