'use client'
import Link from 'next/link'
import Badge from './Badge'


export default function PatientCard({ p }: { p: any }) {
return (
<Link href={`/patients/${p.id}`} className="card block p-4 hover:shadow-md transition-shadow">
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
{p.initials}
</div>
<div className="flex-1">
<div className="font-semibold">{p.name}</div>
<div className="text-xs text-gray-500">{p.email}</div>
<div className="mt-1 text-xs text-gray-500">{p.phone} • Last session: {p.lastSession}</div>
</div>
<div className="flex flex-col items-end gap-2">
<Badge tone={p.active ? 'green' : 'gray'}>{p.active ? 'active' : 'inactive'}</Badge>
<div className="text-xs text-gray-500">Score: <span className="font-medium text-gray-700">{p.score}/10</span></div>
</div>
</div>
</Link>
)
}