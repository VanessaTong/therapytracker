import clsx from 'clsx'
export default function Badge({ children, tone = 'gray' }: { children: React.ReactNode; tone?: 'gray' | 'green' | 'red' }) {
const map = {
gray: 'bg-gray-100 text-gray-700',
green: 'bg-green-100 text-green-700',
red: 'bg-red-100 text-red-700',
} as const
return <span className={clsx('badge', map[tone])}>{children}</span>
}