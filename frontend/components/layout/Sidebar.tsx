"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Car, Users, CalendarDays,
  LogOut, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",    label: "Overview",      icon: LayoutDashboard },
  { href: "/cars",         label: "Fleet",         icon: Car },
  { href: "/users",        label: "Clients",       icon: Users },
  { href: "/reservations", label: "Reservations",  icon: CalendarDays },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* ── Brand ─────────────────────────────── */}
      <div
        className="flex items-center gap-3 flex-shrink-0 overflow-hidden"
        style={{
          height: 60,
          padding: collapsed ? "0 14px" : "0 20px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Logo mark */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 28, height: 28,
            background: "var(--color-accent)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 10 C2 10 3 5 7 5 C11 5 12 10 12 10" stroke="#060708" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="4" cy="10.5" r="1.5" fill="#060708"/>
            <circle cx="10" cy="10.5" r="1.5" fill="#060708"/>
          </svg>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "var(--color-text-primary)",
                }}
              >
                VRS
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-tertiary)",
                  marginTop: -1,
                }}
              >
                Rental System
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ────────────────────────── */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: "12px 8px" }}>
        {!collapsed && (
          <p
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
              padding: "4px 12px 10px",
            }}
          >
            Navigation
          </p>
        )}

        <div className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} className="block">
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-[var(--radius-md)] transition-all duration-100 group",
                    collapsed ? "justify-center" : "",
                    active
                      ? "text-[var(--color-accent-bright)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                  style={{
                    height: 38,
                    padding: collapsed ? "0" : "0 12px",
                    background: active
                      ? "var(--color-accent-muted)"
                      : undefined,
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface-3)";
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLDivElement).style.background = "";
                  }}
                >
                  {/* Active pill */}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute left-0 top-2 bottom-2 rounded-full"
                      style={{ width: 3, background: "var(--color-accent)" }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}

                  <Icon
                    size={15}
                    strokeWidth={active ? 2.2 : 1.8}
                    className="flex-shrink-0"
                  />

                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          fontSize: 13,
                          fontWeight: active ? 600 : 450,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip */}
                  {collapsed && (
                    <div
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-[var(--radius-sm)] whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        background: "var(--color-surface-3)",
                        border: "1px solid var(--color-border-strong)",
                        color: "var(--color-text-primary)",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      {label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom ────────────────────────────── */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-[var(--radius-md)] transition-colors duration-100 group"
          style={{
            height: 36,
            padding: collapsed ? "0" : "0 12px",
            justifyContent: collapsed ? "center" : undefined,
            color: "var(--color-text-secondary)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-error-muted)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.background = "";
          }}
        >
          <LogOut size={14} strokeWidth={1.8} className="flex-shrink-0" />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 13, fontWeight: 450, whiteSpace: "nowrap" }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center rounded-[var(--radius-md)] transition-colors"
          style={{
            height: 30,
            marginTop: 2,
            color: "var(--color-text-tertiary)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)";
            (e.currentTarget as HTMLButtonElement).style.background = "";
          }}
        >
          {collapsed
            ? <PanelLeftOpen size={13} strokeWidth={1.8} />
            : <PanelLeftClose size={13} strokeWidth={1.8} />
          }
        </button>
      </div>
    </motion.aside>
  );
}
