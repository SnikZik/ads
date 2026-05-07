import type { Metadata } from 'next'
import { Archivo, Archivo_Black, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const archivoBlack = Archivo_Black({
  weight: '400',
  variable: '--font-archivo-black',
  subsets: ['latin'],
})

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SNIR. BODY LOG',
  description: 'Cut evidence. Training, food, measurements, progress.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${archivo.variable} ${jetbrains.variable}`}
    >
      <body className="font-body bg-paper text-ink antialiased">{children}</body>
    </html>
  )
}
