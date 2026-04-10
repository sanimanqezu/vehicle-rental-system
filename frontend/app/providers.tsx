"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-surface-elevated)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
          },
        }}
      />
      <HotToaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--color-surface-elevated)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </SessionProvider>
  );
}
