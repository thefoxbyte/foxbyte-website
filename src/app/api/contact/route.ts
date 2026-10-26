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

  const delivered = process.env.RESEND_API_KEY ? await sendWithResend(entry) : await sendToWebhook(entry);
  if (delivered === "not_configured") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  if (delivered !== "ok") return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

type Entry = { name: string; email: string; company: string; topic: string; message: string };

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function sendWithResend(entry: Entry): Promise<"ok" | "failed"> {
  const to = (process.env.CONTACT_TO || "info@thefoxbyte.com").split(",").map((a) => a.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM || "FoxByte <hello@contact.thefoxbyte.com>";
  const who = `${oneLine(entry.name)}${entry.company ? `, ${oneLine(entry.company)}` : ""}`;
  const text = `${entry.topic} enquiry from ${who} <${entry.email}>\n\n${entry.message}\n\nReply to this email to answer them directly.`;
  const html = `<p><strong>${escapeHtml(entry.topic)}</strong> enquiry from ${escapeHtml(who)} &lt;<a href="mailto:${escapeHtml(entry.email)}">${escapeHtml(entry.email)}</a>&gt;</p><p style="white-space:pre-wrap">${escapeHtml(entry.message)}</p><p style="color:#5d6676">Reply to this email to answer them directly.</p>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: entry.email, subject: oneLine(`[FoxByte] ${entry.topic}: ${who}`).slice(0, 200), text, html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("contact: Resend refused the message", res.status, (await res.text()).slice(0, 300));
      return "failed";
    }
    return "ok";
  } catch (error) {
    console.error("contact: Resend did not answer", error);
    return "failed";
  }
}

async function sendToWebhook(entry: Entry): Promise<"ok" | "failed" | "not_configured"> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return "not_configured";
  const text = `New ${entry.topic} enquiry from ${entry.name} <${entry.email}>${entry.company ? ` at ${entry.company}` : ""}\n\n${entry.message}`;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, ...entry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? "ok" : "failed";
  } catch {
    return "failed";
  }
}
