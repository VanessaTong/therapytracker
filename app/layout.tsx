// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
// Rename for clarity — the default export is an AppShell that expects children
import AppShell from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'TherapyTracker',
  description: 'Mental Health Dashboard',
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* AppShell (exported from components/Sidebar.tsx) needs children */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
