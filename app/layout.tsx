import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'


export const metadata: Metadata = {
title: 'TherapyTracker',
description: 'Mental Health Dashboard',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div className="min-h-screen grid grid-cols-[260px_1fr]">
<Sidebar />
<main className="bg-gray-50">{children}</main>
</div>
</body>
</html>
)
}