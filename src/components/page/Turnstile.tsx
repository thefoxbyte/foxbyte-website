"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const scriptSrc = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
      script.onerror = () => {
        loading = null;
        reject(new Error("turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

export function Turnstile({ siteKey }: { siteKey: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: string | undefined;
    let gone = false;
    loadTurnstile()
      .then((api) => {
        if (gone || !box.current) return;
        id = api.render(box.current, { sitekey: siteKey, theme: "auto", size: "flexible", "response-field-name": "cf-turnstile-response" });
      })
      .catch(() => {});
    return () => {
      gone = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [siteKey]);

  return <div ref={box} />;
}
