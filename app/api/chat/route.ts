// app/api/chat/route.ts
// Proxies your Next.js app to the FastAPI endpoint at /agents/chat
// FastAPI contract: { question: string } -> { response: string, handoff?: string }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function safePick<T = any>(v: T, ...keys: string[]) {
  const obj = v as any;
  for (const k of keys) {
    if (obj && typeof obj === 'object' && k in obj && obj[k] != null) return obj[k];
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    // Ensure we send exactly what FastAPI expects: { question: string }
    const question =
      typeof body?.question === 'string'
        ? body.question
        : typeof body?.message === 'string'
        ? body.message
        : '';

    const payload = { question };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    const base = process.env.FASTAPI_BASE_URL ?? 'https://therapy-api-446856640264.asia-northeast1.run.app';
    const url = `${base.replace(/\/$/, '')}/agents/chat`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return new Response(
        JSON.stringify({
          error: 'FastAPI upstream error',
          status: upstream.status,
          details: text,
        }),
        { status: 502, headers: { 'content-type': 'application/json' } }
      );
    }

    const data = (await upstream.json().catch(() => ({}))) as {
        response?: string;
        handoff?: string | null;
        [k: string]: any;
    };

    const reply =
        safePick(data, 'response') ??
        safePick(data, 'reply', 'message', 'output', 'text') ??
        '' as string;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Proxy failed',
        details: String(err?.message ?? err),
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
}
