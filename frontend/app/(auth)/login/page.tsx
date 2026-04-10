"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, LoginFormValues } from "@/schemas";

const FEATURES = [
  { icon: Shield,    title: "Secure Access",       desc: "OAuth2 + JWT authentication with token refresh" },
  { icon: Zap,       title: "Real-time Updates",   desc: "Live reservation events via WebSocket" },
  { icon: BarChart3, title: "Fleet Analytics",     desc: "Revenue, mileage and availability at a glance" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading]  = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", { ...data, redirect: false });
      if (res?.ok) {
        toast.success("Welcome back");
        router.push("/dashboard");
      } else {
        toast.error("Invalid username or password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* ── Left panel ──────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 520,
          flexShrink: 0,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Radial glow top-right */}
        <div style={{
          position: "absolute", top: -120, right: -80,
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(212,147,10,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Radial glow bottom-left */}
        <div style={{
          position: "absolute", bottom: -80, left: -60,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(41,121,255,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              background: "var(--color-accent)",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 32px var(--color-accent-glow)",
            }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path d="M1.5 10C1.5 10 2.5 4.5 7 4.5C11.5 4.5 12.5 10 12.5 10" stroke="#060708" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="4" cy="10.5" r="1.8" fill="#060708"/>
                <circle cx="10" cy="10.5" r="1.8" fill="#060708"/>
                <line x1="4" y1="7" x2="10" y2="7" stroke="#060708" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1, color: "var(--color-text-primary)" }}>
                VRS
              </p>
              <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginTop: 1 }}>
                Vehicle Rental System
              </p>
            </div>
          </div>
        </div>

        {/* Center hero */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Large car SVG illustration */}
          <div style={{ marginBottom: 40 }}>
            <svg viewBox="0 0 460 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", opacity: 0.9 }}>
              {/* Road */}
              <rect x="0" y="170" width="460" height="3" fill="rgba(255,255,255,0.06)" rx="1.5"/>
              <rect x="100" y="172" width="60" height="2" fill="rgba(212,147,10,0.3)" rx="1"/>
              <rect x="200" y="172" width="60" height="2" fill="rgba(212,147,10,0.3)" rx="1"/>
              <rect x="300" y="172" width="60" height="2" fill="rgba(212,147,10,0.3)" rx="1"/>

              {/* Car body */}
              <path d="M60 140 L60 110 L100 75 L160 62 L300 62 L360 80 L400 110 L400 140 Z"
                fill="#14151A" stroke="rgba(212,147,10,0.5)" strokeWidth="1.5"/>

              {/* Roof */}
              <path d="M140 110 L175 75 L285 75 L330 110 Z"
                fill="#111318" stroke="rgba(212,147,10,0.3)" strokeWidth="1"/>

              {/* Windows */}
              <path d="M155 108 L180 79 L245 79 L245 108 Z" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"/>
              <path d="M250 108 L250 79 L285 79 L320 108 Z" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1"/>

              {/* Front lights */}
              <ellipse cx="395" cy="108" rx="8" ry="5" fill="rgba(212,147,10,0.8)"/>
              <ellipse cx="395" cy="108" rx="14" ry="8" fill="rgba(212,147,10,0.15)"/>

              {/* Rear lights */}
              <ellipse cx="65" cy="115" rx="6" ry="4" fill="rgba(229,57,53,0.7)"/>
              <ellipse cx="65" cy="115" rx="12" ry="7" fill="rgba(229,57,53,0.12)"/>

              {/* Wheels */}
              <circle cx="150" cy="148" r="28" fill="#0C0D10" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
              <circle cx="150" cy="148" r="18" fill="#111318" stroke="rgba(212,147,10,0.4)" strokeWidth="1.5"/>
              <circle cx="150" cy="148" r="6"  fill="rgba(212,147,10,0.6)"/>

              <circle cx="320" cy="148" r="28" fill="#0C0D10" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
              <circle cx="320" cy="148" r="18" fill="#111318" stroke="rgba(212,147,10,0.4)" strokeWidth="1.5"/>
              <circle cx="320" cy="148" r="6"  fill="rgba(212,147,10,0.6)"/>

              {/* Door line */}
              <line x1="230" y1="80" x2="230" y2="138" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

              {/* Speed lines */}
              <line x1="0" y1="120" x2="40" y2="120" stroke="rgba(212,147,10,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="128" x2="30" y2="128" stroke="rgba(212,147,10,0.15)" strokeWidth="1" strokeLinecap="round"/>
              <line x1="0" y1="136" x2="20" y2="136" stroke="rgba(212,147,10,0.10)" strokeWidth="1" strokeLinecap="round"/>

              {/* Glow under car */}
              <ellipse cx="230" cy="172" rx="160" ry="12" fill="rgba(212,147,10,0.04)"/>
            </svg>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            color: "var(--color-text-primary)",
            marginBottom: 12,
          }}>
            Manage your<br />
            <span style={{ color: "var(--color-accent-bright)" }}>entire fleet</span><br />
            from one place.
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: 340 }}>
            Track vehicles, clients and reservations in real time. Built for modern rental operations.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                borderRadius: "var(--radius-sm)",
                background: "var(--color-accent-muted)",
                border: "1px solid var(--color-accent-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={14} strokeWidth={1.8} style={{ color: "var(--color-accent-bright)" }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2, marginBottom: 3 }}>
                  {title}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        position: "relative",
        background: "var(--color-bg)",
      }}>
        {/* Subtle top accent */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,147,10,0.3), transparent)",
        }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3" style={{ marginBottom: 36 }}>
            <div style={{
              width: 34, height: 34, background: "var(--color-accent)",
              borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 10C2 10 3 5 7 5C11 5 12 10 12 10" stroke="#060708" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="4" cy="10.5" r="1.5" fill="#060708"/>
                <circle cx="10" cy="10.5" r="1.5" fill="#060708"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, letterSpacing: "0.05em" }}>VRS</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30, fontWeight: 800,
              letterSpacing: "-0.01em", lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
          }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Username */}
              <div>
                <label className="field-label">Username</label>
                <input
                  {...register("username")}
                  autoComplete="username"
                  placeholder="your_username"
                  className="field-input"
                />
                {errors.username && <p className="field-error">{errors.username.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    {...register("password")}
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="field-input"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{
                      position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", padding: 4,
                      color: "var(--color-text-tertiary)", cursor: "pointer", borderRadius: 4,
                      display: "flex", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                style={{
                  height: 42, width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: loading ? "rgba(212,147,10,0.55)" : "var(--color-accent)",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  color: "#060708",
                  fontFamily: "var(--font-body)",
                  fontSize: 14, fontWeight: 600,
                  letterSpacing: "0.01em",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 4,
                  boxShadow: loading ? "none" : "0 0 0 1px rgba(212,147,10,0.4), 0 4px 20px rgba(212,147,10,0.25)",
                  transition: "background 150ms, box-shadow 150ms",
                }}
              >
                {loading ? (
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#060708",
                    borderRadius: "50%", animation: "spin 0.65s linear infinite",
                    display: "inline-block",
                  }} />
                ) : (
                  <>Sign in <ArrowRight size={15} strokeWidth={2} /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "0 32px 24px",
            }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                or
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </div>

            {/* Register link */}
            <div style={{
              padding: "16px 32px",
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Don't have an account?</span>
              <Link
                href="/register"
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: "var(--color-accent-bright)",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                Create account <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            Protected by Spring OAuth2 Authorization Server
          </p>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
