'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'


const NavLink = ({ href, label }: { href: string; label: string }) => {
const pathname = usePathname()
const active = pathname.startsWith(href)
return (
<Link href={href} className={clsx('flex items-center gap-3 rounded-xl px-3 py-2 text-sm', active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100')}>{label}</Link>
)
}


export default function Sidebar() {
return (
<aside className="border-r border-gray-200 bg-white p-4">
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
)
}