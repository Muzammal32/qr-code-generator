"use client";

import { useEffect } from "react";

type ErrorPayload = {
  type: "error" | "unhandledrejection";
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
};

async function sendError(payload: ErrorPayload) {
  try {
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/client-errors", blob);
      return;
    }

    await fetch("/api/client-errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // fail silently in client
  }
}

export default function ClientErrorTracker() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      void sendError({
        type: "error",
        message: event.message || "Unknown runtime error",
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    }

    function onRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      void sendError({
        type: "unhandledrejection",
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
