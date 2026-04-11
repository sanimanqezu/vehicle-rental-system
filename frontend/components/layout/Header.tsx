"use client";

import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocket";
import { NotificationEvent } from "@/types";
import { formatDate } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const typeLabel: Record<NotificationEvent["type"], { label: string; color: string }> = {
  RESERVATION_CREATED: { label: "Created",  color: "var(--color-success)" },
  RESERVATION_UPDATED: { label: "Updated",  color: "var(--color-warning)" },
  RESERVATION_DELETED: { label: "Deleted",  color: "var(--color-error)"   },
};

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.accessToken) {
      connectWebSocket(session.accessToken, (event) => {
        setNotifications(prev => [event, ...prev.slice(0, 19)]);
        setUnread(n => n + 1);
      }).catch(() => {});
    }
    return () => { disconnectWebSocket(); };
  }, [session?.accessToken]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = session?.user?.name?.slice(0, 2).toUpperCase() ?? "—";

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 60,
        padding: "0 32px",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* Title */}
      <div className="flex flex-col justify-center" style={{ gap: 1 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.01em",
            lineHeight: 1.1,
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.02em" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center" style={{ gap: 8 }}>
        {actions}

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setUnread(0); }}
            className="relative flex items-center justify-center rounded-[var(--radius-sm)] transition-colors"
            style={{
              width: 32, height: 32,
              color: "var(--color-text-secondary)",
              background: notifOpen ? "var(--color-surface-3)" : undefined,
              border: "1px solid transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={e => {
              if (!notifOpen) (e.currentTarget as HTMLButtonElement).style.background = "";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            }}
          >
            <Bell size={15} strokeWidth={1.8} />
            {unread > 0 && (
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  top: 5, right: 5,
                  width: 7, height: 7,
                  background: "var(--color-accent)",
                  border: "1.5px solid var(--color-surface)",
                }}
              />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 overflow-hidden"
                style={{
                  top: "calc(100% + 8px)",
                  width: 320,
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border-strong)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xl)",
                  zIndex: 50,
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                    Live Feed
                  </span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 7px",
                      borderRadius: 99,
                      background: "var(--color-accent-muted)",
                      color: "var(--color-accent-bright)",
                      border: "1px solid var(--color-accent-border)",
                    }}
                  >
                    WebSocket
                  </span>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center" style={{ padding: "32px 16px" }}>
                      <Bell size={20} style={{ color: "var(--color-text-tertiary)", marginBottom: 8 }} />
                      <p style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>No events yet</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => {
                      const meta = typeLabel[n.type];
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3"
                          style={{
                            padding: "12px 16px",
                            borderBottom: i < notifications.length - 1 ? "1px solid var(--color-border)" : undefined,
                          }}
                        >
                          <div
                            className="flex-shrink-0 rounded-full"
                            style={{ width: 7, height: 7, background: meta.color, marginTop: 5 }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2" style={{ marginBottom: 3 }}>
                              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: meta.color }}>
                                {meta.label}
                              </span>
                              <span style={{ fontSize: 10.5, color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                                #{n.reservationId}
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                              {n.message}
                            </p>
                            <p style={{ fontSize: 10.5, color: "var(--color-text-tertiary)", marginTop: 3 }}>
                              {formatDate(n.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: "var(--color-border)" }} />

        {/* User */}
        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 30, height: 30,
              borderRadius: "50%",
              background: "var(--color-accent-muted)",
              border: "1.5px solid var(--color-accent-border)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--color-accent-bright)",
              }}
            >
              {initials}
            </span>
          </div>
          <div className="hidden sm:flex flex-col" style={{ gap: 1 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1 }}>
              {session?.user?.name ?? "User"}
            </span>
            <span style={{ fontSize: 10.5, color: "var(--color-text-tertiary)", lineHeight: 1 }}>
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
