import { NextResponse } from 'next/server'


// Placeholder route. In production, forward to your FastAPI server.
// Example FastAPI URL (set in .env as FASTAPI_URL="https://your-fastapi.app")
// This route currently returns a mock response to keep the UI functional on Vercel.


export async function POST(req: Request) {
const { message } = await req.json()


// If you want to proxy to FastAPI, uncomment below and deploy with FASTAPI_URL
// const url = `${process.env.FASTAPI_URL}/chat` // e.g., POST expects {message}
// const fastapi = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
// const data = await fastapi.json()
// return NextResponse.json(data)


// Mock fallback
return NextResponse.json({ reply: `You said: "${message}". (This is a placeholder—wire me to FastAPI in app/api/chat/route.ts)` })
}