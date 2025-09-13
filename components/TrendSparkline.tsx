'use client'
import {
LineChart,
Line,
ResponsiveContainer,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
} from 'recharts'


export type TrendPoint = { date: string; mood: number; anxiety: number; stress: number }


export default function TrendSparkline({ data }: { data: TrendPoint[] }) {
return (
<div className="w-full h-[320px]">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
<CartesianGrid stroke="#eee" vertical={false} />
<XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
<YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
<Tooltip cursor={{ stroke: '#E5E7EB' }} />
<Line type="monotone" dataKey="mood" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
<Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
<Line type="monotone" dataKey="stress" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
</LineChart>
</ResponsiveContainer>
</div>
)
}