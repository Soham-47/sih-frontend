export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const body = await req.json();
    const { prompt, provider = 'openai', model } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt. Please provide a valid prompt string.' }), { status: 400 });
    }

    const baseURL = provider === 'openrouter'
      ? 'https://openrouter.ai/api/v1'
      : 'https://api.openai.com/v1';

    const resolvedModel = model || (provider === 'openrouter' ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

    // Access environment variables - works in both dev (Vite) and production (Edge Runtime)
    const apiKey = provider === 'openrouter'
      ? (globalThis as any).process?.env?.OPENROUTER_API_KEY || (globalThis as any).process?.env?.VERCEL_OIDC_TOKEN
      : (globalThis as any).process?.env?.OPENAI_API_KEY;

    if (!apiKey) {
      const errorMsg = provider === 'openrouter' 
        ? 'Server: Missing API key. Set OPENROUTER_API_KEY or VERCEL_OIDC_TOKEN in your environment variables.'
        : 'Server: Missing API key. Set OPENAI_API_KEY in your environment variables.';
      return new Response(JSON.stringify({ error: errorMsg }), { status: 500 });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'http://localhost:5173';
      headers['X-Title'] = 'KisanAI';
    }

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: resolvedModel,
        messages: [
          { role: 'system', content: 'You are an AI assistant for agriculture. Always reply in concise JSON if asked.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ content }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), { status: 500 });
  }
}
