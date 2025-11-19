// app/layout.tsx
// @ts-ignore: allow importing global CSS without type declarations
import './globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'AI Political Spending Tracker',
  description: 'Real-time transparency into OpenAI + a16z and Meta Super PAC spending',
}




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}