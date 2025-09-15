'use client';
import * as React from 'react';

type Role = 'therapist' | 'agent';

type ChatMessage = {
  role: Role;
  content: string;
  handoff?: string | null;
};

export default function AssistantPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'agent',
      content:
        "Hello! I'm your AI agent. Ask me anything about patients, scheduling, or clinical workflows.",
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: 'therapist', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(
          `Upstream error (${res.status}) ${errText ? `- ${errText}` : ''}`.trim()
        );
      }

      const data: { reply?: string; handoff?: string | null } = await res.json();

      setMessages((m) => [
        ...m,
        { role: 'agent', content: data.reply ?? '(no response)', handoff: data.handoff ?? null },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          role: 'agent',
          content:
            'Sorry — I had trouble contacting the server. Please check the FastAPI service and try again.',
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Therapist Assistant</h1>
        </header>

        <div className="border rounded-2xl p-4 h-[70vh] overflow-y-auto flex flex-col gap-3">
          {messages.map((m, i) => {
            const isAgent = m.role === 'agent';
            return (
              <div
                key={i}
                className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isAgent
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div>{m.content}</div>
                  {isAgent && m.handoff ? (
                    <div className="mt-2 text-[11px] opacity-70">
                      handoff: <code>{m.handoff}</code>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-gray-100 text-gray-500 rounded-2xl px-4 py-2 text-xs">
                Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='e.g., Give me a summary of my patients'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button
            className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-60"
            onClick={send}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
