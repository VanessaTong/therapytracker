'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Badge from '@/components/Badge'
import TrendSparkline from '@/components/TrendSparkline'
import { findPatient, notesById, overviewTrend, surveyById } from '@/lib/data'
import { ChevronLeft, Mail, Phone, CalendarDays, Edit3 } from 'lucide-react'

type PageProps = {
  params: { id: string }
}

function TabNav({
  current,
  baseHref,
}: {
  current: string
  baseHref: string
}) {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'surveys', label: 'Surveys' },
    { key: 'trends', label: 'Trends' },
  ] as const

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-2 rounded-xl bg-gray-100 p-1 text-sm">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`${baseHref}?tab=${t.key}`}
            className={
              'text-center rounded-lg py-2 ' +
              (current === t.key ? 'bg-white shadow-sm font-medium' : 'text-gray-600')
            }
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function PatientDetails({ params }: PageProps) {
  const router = useRouter()
  const sp = useSearchParams()
  const tab = (sp.get('tab') ?? 'overview').toLowerCase()
  const p = findPatient(params.id)

  // If an invalid id is visited, send them back to /patients
  useEffect(() => {
    if (!p) router.push('/patients')
  }, [p, router])

  if (!p) {
    // lightweight fallback during redirect
    return (
      <div className="container py-6">
        <button
          onClick={() => router.push('/patients')}
          className="link-muted inline-flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Back
        </button>
      </div>
    )
  }

  const notes = notesById[p.id] ?? []
  const surveys = surveyById[p.id] ?? []
  const baseHref = `/patients/${p.id}`

  return (
    <div className="container py-6 space-y-4">
      {/* Top bar with back + edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/patients')}
          className="link-muted inline-flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button className="btn">
          <Edit3 size={16} /> Edit Patient
        </button>
      </div>

      {/* Header card */}
      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {p.name
                .split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="text-lg font-semibold">{p.name}</div>
              <Badge tone={p.active ? 'green' : 'gray'}>
                {p.active ? 'active' : 'inactive'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={16} /> {p.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} /> {p.phone}
            </div>
          </div>

          <div className="flex items-center justify-end text-sm text-gray-600">
            <CalendarDays size={16} className="mr-2" /> DOB: {p.dob}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabNav current={tab} baseHref={baseHref} />

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Recent Wellbeing Trends</h3>
            <TrendSparkline data={overviewTrend} />
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Recent Session Notes</h3>
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      📅 {n.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Mood:</span>
                      <span className="font-semibold">{n.mood}/10</span>
                      <Badge
                        tone={
                          n.tag === 'improving' ? 'green' : n.tag === 'declining' ? 'red' : 'gray'
                        }
                      >
                        {n.tag}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{n.text}</p>
                  {n.next && (
                    <div className="mt-2 text-xs text-gray-500">Next session: {n.next}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SESSIONS TAB */}
      {tab === 'sessions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Session History</h3>
            <button className="btn">Add Session</button>
          </div>

          {notes.map((n, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 flex items-center gap-2">📅 {n.date}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Mood:</span>
                  <span className="font-semibold">{n.mood}/10</span>
                  <Badge
                    tone={
                      n.tag === 'improving' ? 'green' : n.tag === 'declining' ? 'red' : 'gray'
                    }
                  >
                    {n.tag}
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{n.text}</p>
              {n.next && (
                <div className="mt-2 text-xs text-gray-500">Next session: {n.next}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SURVEYS TAB */}
      {tab === 'surveys' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Survey Responses</h3>
            <button className="btn">New Survey</button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {(surveyById[p.id] ?? []).map((s, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.title}</div>
                  <Badge>Survey</Badge>
                </div>

                <div className="mt-3 space-y-3 text-sm">
                  {s.fields.map((f, k) => (
                    <div key={k} className="grid grid-cols-[1.4fr_1fr] gap-2">
                      <div className="text-gray-500">{f.q}</div>
                      <div className="text-gray-800">{f.a}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs text-gray-500">Completed: {s.completed}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRENDS TAB */}
      {tab === 'trends' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Long-term Wellbeing Analysis</h3>
            <TrendSparkline data={overviewTrend} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Overall Score', value: '6.2' },
              { label: 'Anxiety Improvement', value: '-2.1' },
              { label: 'Depression Reduction', value: '-1.8' },
              { label: 'Stress Decrease', value: '-2.5' },
            ].map((m, i) => (
              <div key={i} className="card p-4">
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
