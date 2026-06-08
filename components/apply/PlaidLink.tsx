"use client";

/**
 * Plaid Link button — connect a bank read-only instead of uploading statements.
 * Loads the Plaid script on demand (no npm dependency). If Plaid isn't configured
 * server-side, it hides itself so the file-upload fallback stands alone.
 */

import { useState } from "react";

type PlaidHandler = { open: () => void };
type PlaidFactory = { create: (config: Record<string, unknown>) => PlaidHandler };

declare global {
  interface Window {
    Plaid?: PlaidFactory;
  }
}

function loadPlaid(): Promise<PlaidFactory> {
  return new Promise((resolve, reject) => {
    if (window.Plaid) return resolve(window.Plaid);
    const s = document.createElement("script");
    s.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    s.onload = () => (window.Plaid ? resolve(window.Plaid) : reject(new Error("plaid_unavailable")));
    s.onerror = () => reject(new Error("plaid_script_error"));
    document.body.appendChild(s);
  });
}

export function PlaidLink({
  applicationId,
  onConnected,
}: {
  applicationId?: string;
  onConnected: (itemId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/application/plaid/link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = (await res.json()) as { configured?: boolean; link_token?: string };
      if (!data.configured || !data.link_token) {
        setHidden(true);
        return;
      }
      const Plaid = await loadPlaid();
      const handler = Plaid.create({
        token: data.link_token,
        onSuccess: async (publicToken: string) => {
          const ex = await fetch("/api/application/plaid/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token: publicToken, applicationId }),
          });
          const exData = (await ex.json()) as { ok?: boolean; itemId?: string };
          if (exData.ok) onConnected(exData.itemId || "connected");
        },
        onExit: () => setLoading(false),
      });
      handler.open();
    } catch {
      setHidden(true);
    } finally {
      setLoading(false);
    }
  }

  if (hidden) return null;
  return (
    <button type="button" onClick={open} disabled={loading} className="btn-primary w-full">
      {loading ? "Opening your bank…" : "Connect your bank (read-only)"}
    </button>
  );
}
