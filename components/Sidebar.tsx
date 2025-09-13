'use client'
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
        'rounded-xl px-3 py-2 text-sm',
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {label}
    </Link>
  )
}

export default function Sidebar() {
  return (
    <>
      {/* Mobile: horizontal top bar */}
      <header className="md:hidden sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            <div>
              <div className="text-sm font-semibold leading-tight">TherapyTracker</div>
              <div className="text-[11px] text-gray-500">Mental Health Dashboard</div>
            </div>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          <NavLink href="/patients" label="Patients" />
          <NavLink href="/assistant" label="AI Assistant" />
        </nav>
      </header>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden md:block border-r border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600" />
          <div>
            <div className="text-sm font-semibold">TherapyTracker</div>
            <div className="text-[11px] text-gray-500">Mental Health Dashboard</div>
          </div>
        </div>
        <nav className="mt-4 space-y-1">
          <NavLink href="/patients" label="Patients" />
          <NavLink href="/assistant" label="AI Assistant" />
        </nav>
      </aside>
    </>
  )
}
