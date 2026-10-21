import { NextResponse } from "next/server";

type Payload = { name?: unknown; email?: unknown; company?: unknown; topic?: unknown; message?: unknown; website?: unknown };

const limits = { name: 120, email: 200, company: 160, topic: 40, message: 4000 };
const topics = new Set(["Enterprise", "Partnership", "Bug report", "Press", "Other"]);
const recent = new Map<string, number[]>();

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const entry = {
    name: clean(body.name, limits.name),
    email: clean(body.email, limits.email),
    company: clean(body.company, limits.company),
    topic: topics.has(clean(body.topic, limits.topic)) ? clean(body.topic, limits.topic) : "Other",
    message: clean(body.message, limits.message),
  };

  if (!entry.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) || entry.message.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const text = `New ${entry.topic} enquiry from ${entry.name} <${entry.email}>${entry.company ? ` at ${entry.company}` : ""}\n\n${entry.message}`;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, ...entry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
