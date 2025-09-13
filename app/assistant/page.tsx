'use client'
import * as React from 'react'


export default function AssistantPage() {
const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string }[]>([
{ role: 'assistant', content: "Hello! I'm your AI assistant here to help with patient care questions, therapy techniques, or any other professional support you need. How can I assist you today?" }
])
const [input, setInput] = React.useState('')
const [loading, setLoading] = React.useState(false)


async function send() {
const text = input.trim()
if (!text) return
setInput('')
setMessages(m => [...m, { role: 'user', content: text }])
setLoading(true)


try {
// Placeholder: calls Next API route which you can wire to FastAPI
const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: text }) })
const data = await res.json()
setMessages(m => [...m, { role: 'assistant', content: data.reply }])
} catch (e) {
setMessages(m => [...m, { role: 'assistant', content: 'Sorry, the assistant is unavailable right now.' }])
} finally {
setLoading(false)
}
}


return (
<div className="container py-6 h-[calc(100vh-24px)] flex flex-col">
<h1 className="text-xl font-semibold">AI Assistant</h1>
<p className="text-sm text-gray-600">Get professional support and guidance for patient care</p>


<div className="mt-4 card flex-1 p-4 flex flex-col">
<div className="flex-1 overflow-y-auto space-y-3">
{messages.map((m, i) => (
<div key={i} className={m.role === 'assistant' ? 'self-start max-w-[80%]' : 'self-end max-w-[80%]'}>
<div className={m.role === 'assistant' ? 'bg-gray-100 rounded-2xl px-4 py-3 text-sm' : 'bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm'}>
{m.content}
</div>
</div>
))}
{loading && <div className="text-xs text-gray-500">Thinking…</div>}
</div>
<div className="mt-3 flex items-center gap-2">
<input
className="input"
placeholder="Ask me about therapy techniques, patient care, or any professional questions…"
value={input}
onChange={(e) => setInput(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && send()}
/>
<button className="btn" onClick={send} disabled={loading}>Send</button>
</div>
</div>
</div>
)
}