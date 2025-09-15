'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const active = pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={clsx(
        'block w-full rounded-xl px-3 py-2 text-base md:text-sm',
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {label}
    </Link>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <div className="h-9 w-9 rounded-lg bg-blue-600" />
      <div>
        <div className="text-sm font-semibold">TherapyTracker</div>
        <div className="text-[11px] text-gray-500">Mental Health Dashboard</div>
      </div>
    </div>
  )
}

function SidebarContent() {
  return (
    <>
      <Brand />
      <nav className="mt-4 space-y-1">
        <NavLink href="/patients" label="Patients" />
        <NavLink href="/calendar" label="Calendar" />
        <NavLink href="/assistant" label="AI Assistant" />
      </nav>
    </>
  )
}

/**
 * App shell with responsive sidebar
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  // Close the drawer on route change (so it doesn’t stay open after nav)
  const pathname = usePathname()
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      {/* Top bar (mobile only) */}
      <header className="md:hidden sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="rounded-lg border border-gray-200 p-2 text-gray-700"
          >
            {/* simple hamburger */}
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </header>

      {/* Sidebar (desktop static) */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 bg-white p-4 sticky top-0 h-[100dvh]">
        <SidebarContent />
      </aside>

      {/* Off-canvas sidebar (mobile) */}
      <div
        className={clsx(
          'md:hidden fixed inset-0 z-50',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={clsx(
            'absolute inset-0 bg-black/30 transition-opacity',
            open ? 'opacity-100' : 'opacity-0'
          )}
        />
        {/* Panel */}
        <aside
          className={clsx(
            'absolute left-0 top-0 h-[100dvh] w-72 border-r border-gray-200 bg-white p-4 transition-transform',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <Brand />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-200 p-2 text-gray-700"
            >
              {/* X icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="mt-4 space-y-1">
            <NavLink href="/patients" label="Patients" />
            <NavLink href="/assistant" label="AI Assistant" />
          </nav>
        </aside>
      </div>

      {/* Layout: sidebar + content */}
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        {/* spacer for desktop sidebar (already rendered above) */}
        <div className="hidden md:block" />
        <main className="min-h-[100dvh]">{children}</main>
      </div>
    </div>
  )
}
