import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AuraFlow - 东方灵韵系水晶手串',
  description: '根据生辰八字和个人偏好，为您定制专属东方灵韵水晶手串',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="max-w-lg mx-auto min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}