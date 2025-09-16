// app/page.tsx
'use client';
import * as React from 'react';

type Role = 'therapist' | 'agent';
type ChatMessage = { role: Role; content: string; handoff?: string | null };

type Patient = {
  name: string;
  last_session_highlights: string;
  todays_survey_checkin: string;
  alerts: string;
  suggested_session_focus: string;
  homework: string;
};

type Guideline = {
  summary?: string;
  recommended_interventions?: string[];
  sources?: string | string[];
};

type AgentJSON =
  | { patients: Patient[] }
  | Guideline
  | Record<string, unknown>;

/** If the reply is double-escaped (\" and \\n), unescape it once. */
function maybeUnescapeOnce(s: string): string {
  const looksEscaped = /\\n|\\t|\\"|\\`/.test(s) && !/\n/.test(s);
  if (!looksEscaped) return s;
  return s
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\`/g, '`')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

/** Extract JSON object from messy text or fenced blocks. */
function extractJSON(text: string): AgentJSON | null {
  if (!text) return null;

  let s = maybeUnescapeOnce(text.trim());

  // Prefer fenced content if present
  const fence = s.match(/```(?:json|javascript)?\s*([\s\S]*?)\s*```/i);
  if (fence) s = fence[1].trim();

  // Remove a leading literal word "json"
  s = s.replace(/^\s*json\b/i, '').trim();

  // Slice to outermost JSON ({...} or [...])
  const firstObj = s.indexOf('{');
  const firstArr = s.indexOf('[');
  let first = -1;
  if (firstObj !== -1 && firstArr !== -1) first = Math.min(firstObj, firstArr);
  else first = Math.max(firstObj, firstArr);
  const last = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
  if (first !== -1 && last !== -1 && last > first) {
    s = s.slice(first, last + 1).trim();
  }

  const tryParse = (x: string) => {
    try {
      return JSON.parse(x);
    } catch {
      return null;
    }
  };

  let parsed = tryParse(s);
  if (parsed) return parsed as AgentJSON;

  // Lenient pass: normalize smart quotes + strip trailing commas
  const normalized = s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .trim();

  parsed = tryParse(normalized);
  return (parsed as AgentJSON) ?? null;
}

/** Linkify http(s) and www. in plain strings (useful for "Sources"). */
function Linkify({ text }: { text: string }) {
  const urlRe = /(https?:\/\/[^\s)]+)|((?:www\.)[^\s)]+)/gi;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(text))) {
    const [url] = m;
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = url.startsWith('http') ? url : `https://${url}`;
    parts.push(
      <a key={m.index} href={href} target="_blank" rel="noreferrer" className="underline text-blue-600">
        {url}
      </a>
    );
    last = m.index + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** ---- UI helpers (patients card kept for completeness) ---- */

function alertTone(alerts: string) {
  const s = alerts?.toLowerCase?.() ?? '';
  if (/critical|suicid|danger|severe/.test(s)) return 'critical';
  if (/distress|panic|phq-9|moderate|tough|tolerated/.test(s)) return 'warning';
  return 'ok';
}

function AlertBadge({ text }: { text: string }) {
  const tone = alertTone(text);
  const cls =
    tone === 'critical'
      ? 'bg-red-100 text-red-800 ring-red-200'
      : tone === 'warning'
      ? 'bg-amber-100 text-amber-900 ring-amber-200'
      : 'bg-emerald-100 text-emerald-900 ring-emerald-200';
  const emoji = tone === 'critical' ? '⛔' : tone === 'warning' ? '⚠️' : '✅';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ring-1 ${cls}`}>
      <span>{emoji}</span>
      <span className="font-medium">Alerts</span>
    </span>
  );
}

function PatientCard({ p }: { p: Patient }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="text-xs text-gray-500">Last session highlights</p>
        </div>
        <AlertBadge text={p.alerts} />
      </div>

      <p className="mt-2 text-sm text-gray-800">{p.last_session_highlights}</p>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs font-semibold text-gray-600">Today’s check-in</div>
          <div className="text-sm text-gray-900">{p.todays_survey_checkin}</div>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs font-semibold text-gray-600">Suggested focus</div>
          <div className="text-sm text-gray-900">{p.suggested_session_focus}</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-indigo-50 p-3">
        <div className="text-xs font-semibold text-indigo-800">Homework</div>
        <div className="text-sm text-indigo-900">{p.homework}</div>
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <span className="font-medium">Alert details:</span> {p.alerts}
      </div>
    </div>
  );
}

function PatientsView({ patients }: { patients: Patient[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Patient rundown</h2>
        <span className="text-xs text-gray-500">{patients.length} patients</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {patients.map((p) => (
          <PatientCard key={p.name} p={p} />
        ))}
      </div>
    </div>
  );
}

/** Renders your OCD guideline response */
function GuidelineCard({ data }: { data: Guideline }) {
  const { summary, recommended_interventions, sources } = data;
  const srcs = Array.isArray(sources) ? sources : sources ? [sources] : [];
  if (!summary && !recommended_interventions?.length && !srcs.length) return null;

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      {summary && (
        <>
          <h3 className="text-lg font-semibold">Guideline summary</h3>
          <p className="mt-1 text-sm text-gray-800">{summary}</p>
        </>
      )}

      {!!recommended_interventions?.length && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-gray-600 mb-1">Recommended interventions</div>
          <ul className="list-disc pl-5 text-sm text-gray-900 space-y-1">
            {recommended_interventions.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      )}

      {!!srcs.length && (
        <div className="mt-3 text-xs text-gray-600">
          <span className="font-semibold">Sources: </span>
          {srcs.map((s, i) => (
            <span key={i} className="mr-2"><Linkify text={String(s)} /></span>
          ))}
        </div>
      )}
    </div>
  );
}

function PrettyJSON({ value }: { value: unknown }) {
  return (
    <pre className="rounded-xl bg-gray-50 p-3 text-xs whitespace-pre-wrap break-words">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function AgentBubble({ content, handoff }: { content: string; handoff?: string | null }) {
  // First parse the top-level string (often a fenced JSON string)
  let parsed = React.useMemo(() => extractJSON(content), [content]);

  // If the parsed result is an object with a nested "response" string (like your example wrapper),
  // parse that inner string too.
  if (parsed && typeof parsed === 'object' && 'response' in parsed && typeof (parsed as any).response === 'string') {
    const inner = extractJSON((parsed as any).response as string);
    if (inner) parsed = inner;
  }

  const patients =
    parsed && typeof parsed === 'object' && 'patients' in parsed && Array.isArray((parsed as any).patients)
      ? ((parsed as any).patients as Patient[])
      : null;

  const looksLikeGuideline =
    parsed &&
    typeof parsed === 'object' &&
    ('summary' in parsed || 'recommended_interventions' in parsed || 'sources' in parsed);

  return (
    <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-gray-100 text-gray-900">
      {patients ? (
        <PatientsView patients={patients} />
      ) : looksLikeGuideline ? (
        <GuidelineCard data={parsed as Guideline} />
      ) : parsed ? (
        <PrettyJSON value={parsed} />
      ) : (
        <div>{content}</div>
      )}

      {handoff ? (
        <div className="mt-2 text-[11px] opacity-70">
          handoff: <code>{handoff}</code>
        </div>
      ) : null}
    </div>
  );
}

export default function AssistantPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'agent', content: "Hello! I'm your AI agent. Ask me anything about patients, scheduling, or clinical workflows." },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // --- Auto-scroll ---
  const endRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, loading]);
  // --------------------

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
        throw new Error(`Upstream error (${res.status}) ${errText ? `- ${errText}` : ''}`.trim());
      }

      const data: { reply?: string; handoff?: string | null } = await res.json();
      setMessages((m) => [
        ...m,
        { role: 'agent', content: data.reply ?? '(no response)', handoff: data.handoff ?? null },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: 'agent', content: 'Sorry — I had trouble contacting the server. Please check the FastAPI service and try again.' },
      ]);
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
              <div key={i} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                {isAgent ? (
                  <AgentBubble content={m.content} handoff={m.handoff} />
                ) : (
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-blue-600 text-white">
                    {m.content}
                  </div>
                )}
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
          {/* Scroll sentinel */}
          <div ref={endRef} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., What are standard OCD treatments?"
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
