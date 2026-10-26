"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Arrow } from "@/components/ui/icons";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

const messages: Record<"error" | "unavailable", string> = {
  error: "That didn’t go through. Check the fields and try again in a moment.",
  unavailable: "We couldn’t take your message right now. Please email info@thefoxbyte.com instead.",
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus(res.status === 503 ? "unavailable" : "error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate={false}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label className={styles.field}>
          <span>Work email</span>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Company</span>
          <input id="contact-company" name="company" type="text" autoComplete="organization" maxLength={160} />
        </label>
        <label className={styles.field}>
          <span>About</span>
          <select id="contact-topic" name="topic" defaultValue="Enterprise">
            <option>Enterprise</option>
            <option>Partnership</option>
            <option>Bug report</option>
            <option>Press</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>What would you like FoxByte to do for you?</span>
        <textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={4000} />
      </label>
      <label className={styles.trap} aria-hidden="true">
        <span>Website</span>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className={styles.actions}>
        <button type="submit" className="btn primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          <Arrow />
        </button>
        <AnimatePresence mode="wait">
          {status === "sent" && (
            <m.p key="sent" className={styles.ok} role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ Sent. We’ll reply to your email within 24 hours.
            </m.p>
          )}
          {(status === "error" || status === "unavailable") && (
            <m.p key={status} className={styles.bad} role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {messages[status]}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
