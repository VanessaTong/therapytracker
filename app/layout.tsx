import type { Metadata, Viewport } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'TherapyTracker',
  description: 'Mental Health Dashboard',
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Stacks on mobile, sidebar+content grid on md+ */}
        <div className="min-h-screen flex flex-col md:grid md:grid-cols-[260px_1fr]">
          <Sidebar children={undefined}/>
          <main className="bg-gray-50 flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
