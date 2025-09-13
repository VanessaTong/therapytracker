import PatientCard from '@/components/PatientCard'
import { patients } from '@/lib/data'


export default function PatientsPage() {
return (
<div className="container py-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-xl font-semibold">Patients</h1>
<p className="text-sm text-gray-600">Manage and track your patients' wellbeing</p>
</div>
<button className="btn">Add Patient</button>
</div>


<div className="mt-4 flex items-center gap-2">
<div className="relative flex-1">
<input className="input" placeholder="Search patients..." />
</div>
<button className="badge bg-gray-100 text-gray-700">All</button>
<button className="badge bg-green-100 text-green-700">Active</button>
<button className="badge bg-gray-100 text-gray-700">Inactive</button>
<button className="badge bg-gray-100 text-gray-700">Archived</button>
</div>


<div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
{patients.map(p => (
<PatientCard key={p.id} p={{
...p,
initials: p.name.split(' ').map(s=>s[0]).slice(0,2).join('')
}} />
))}
</div>
</div>
)
}