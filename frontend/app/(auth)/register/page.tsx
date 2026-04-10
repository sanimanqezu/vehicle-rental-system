"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, UserCheck, Clock, Lock } from "lucide-react";
import { toast } from "sonner";
import { registerSchema, RegisterFormValues } from "@/schemas";
import { usersApi } from "@/lib/api";

const STEPS = [
  {
    icon: UserCheck,
    title: "Create your profile",
    desc: "Fill in your personal details and choose a secure username",
  },
  {
    icon: Clock,
    title: "Instant access",
    desc: "Your account is active immediately — no approval wait",
  },
  {
    icon: Lock,
    title: "Enterprise security",
    desc: "OAuth2 + JWT keeps every session cryptographically signed",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const passwordVal = watch("password", "");
  const strength = !passwordVal ? 0
    : passwordVal.length >= 12 && /[A-Z]/.test(passwordVal) && /[0-9]/.test(passwordVal) && /[^A-Za-z0-9]/.test(passwordVal) ? 4
    : passwordVal.length >= 10 && /[A-Z]/.test(passwordVal) && /[0-9]/.test(passwordVal) ? 3
    : passwordVal.length >= 8 && (/[A-Z]/.test(passwordVal) || /[0-9]/.test(passwordVal)) ? 2
    : 1;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#E53935", "#F59E0B", "#1DB954", "#1DB954"];

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await usersApi.create({
        firstName:   data.firstName,
        lastName:    data.lastName,
        username:    data.username,
        password:    data.password,
        dateOfBirth: data.dateOfBirth,
        rsaId:       data.rsaId,
      });
      toast.success("Account created — please sign in");
      router.push("/login");
    } catch {
      toast.error("Registration failed. Username may already exist.");
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
          background: "radial-gradient(circle, rgba(29,185,84,0.06) 0%, transparent 65%)",
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
          {/* Illustrated dashboard preview */}
          <div style={{ marginBottom: 36 }}>
            <svg viewBox="0 0 460 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", opacity: 0.88 }}>
              {/* Dashboard card backgrounds */}
              <rect x="8"  y="8"  width="130" height="68" rx="8" fill="#111318" stroke="rgba(212,147,10,0.25)" strokeWidth="1"/>
              <rect x="150" y="8"  width="130" height="68" rx="8" fill="#111318" stroke="rgba(41,121,255,0.2)"  strokeWidth="1"/>
              <rect x="292" y="8"  width="160" height="68" rx="8" fill="#111318" stroke="rgba(29,185,84,0.2)"   strokeWidth="1"/>

              {/* Stat card 1 — Cars */}
              <text x="20" y="28" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" letterSpacing="1" style={{textTransform:"uppercase"}}>FLEET SIZE</text>
              <text x="20" y="52" fill="#F0AA14" fontSize="26" fontWeight="800">247</text>
              <text x="20" y="66" fill="rgba(255,255,255,0.3)" fontSize="7">vehicles registered</text>
              <circle cx="120" cy="32" r="10" fill="rgba(212,147,10,0.12)" stroke="rgba(212,147,10,0.3)" strokeWidth="1"/>
              <path d="M115 33 C115 33 116 30 120 30 C124 30 125 33 125 33" stroke="#D4930A" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="117.5" cy="33.5" r="1.2" fill="#D4930A"/>
              <circle cx="122.5" cy="33.5" r="1.2" fill="#D4930A"/>

              {/* Stat card 2 — Reservations */}
              <text x="162" y="28" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" letterSpacing="1">ACTIVE BOOKINGS</text>
              <text x="162" y="52" fill="#2979FF" fontSize="26" fontWeight="800">83</text>
              <text x="162" y="66" fill="rgba(255,255,255,0.3)" fontSize="7">reservations today</text>
              <circle cx="262" cy="32" r="10" fill="rgba(41,121,255,0.1)" stroke="rgba(41,121,255,0.3)" strokeWidth="1"/>
              <path d="M258 32 L261 29 L264 32 L261 35 Z" stroke="#2979FF" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>

              {/* Stat card 3 — Revenue */}
              <text x="304" y="28" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" letterSpacing="1">MONTHLY REVENUE</text>
              <text x="304" y="52" fill="#1DB954" fontSize="20" fontWeight="800">R 148,200</text>
              <text x="304" y="66" fill="rgba(255,255,255,0.3)" fontSize="7">+12% from last month</text>

              {/* Chart area */}
              <rect x="8" y="90" width="290" height="100" rx="8" fill="#111318" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <text x="20" y="108" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" letterSpacing="1">RESERVATIONS OVER TIME</text>

              {/* Chart bars */}
              {[
                [32, 145, 12, 45],
                [52, 138, 12, 52],
                [72, 130, 12, 60],
                [92, 135, 12, 55],
                [112, 120, 12, 70],
                [132, 115, 12, 75],
                [152, 108, 12, 82],
                [172, 112, 12, 78],
                [192, 104, 12, 86],
                [212, 118, 12, 72],
                [232, 110, 12, 80],
                [252, 100, 12, 90],
              ].map(([x, y, w, _h], i) => (
                <rect key={i} x={x} y={y} width={w} height={190 - (y as number)} rx="3"
                  fill={i === 11 ? "rgba(212,147,10,0.8)" : "rgba(212,147,10,0.25)"}
                />
              ))}

              {/* Trend line */}
              <polyline points="38,150 58,143 78,135 98,140 118,125 138,120 158,112 178,117 198,109 218,123 238,115 258,105"
                stroke="rgba(212,147,10,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Sidebar mini */}
              <rect x="310" y="90" width="142" height="100" rx="8" fill="#111318" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <text x="322" y="108" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" letterSpacing="1">FLEET BY MAKE</text>

              {[
                ["Toyota",  92, 39, "rgba(212,147,10,0.8)"],
                ["BMW",     75, 28, "rgba(41,121,255,0.7)"],
                ["Ford",    60, 20, "rgba(29,185,84,0.7)"],
                ["VW",      50, 15, "rgba(245,158,11,0.6)"],
                ["Hyundai", 42, 11, "rgba(41,121,255,0.4)"],
              ].map(([label, x, w, color], i) => (
                <g key={i}>
                  <text x="322" y={123 + (i as number) * 15} fill="rgba(255,255,255,0.45)" fontSize="7.5">{label as string}</text>
                  <rect x={360} y={116 + (i as number) * 15} width={w as number} height="7" rx="2" fill={color as string}/>
                </g>
              ))}
            </svg>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--color-text-primary)",
            marginBottom: 10,
          }}>
            Set up your account.<br />
            <span style={{ color: "var(--color-accent-bright)" }}>Be operational</span><br />
            in minutes.
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: 340 }}>
            One account. Full access to fleet management, live bookings, and analytics.
          </p>
        </div>

        {/* Step list */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-accent-muted)",
                  border: "1px solid var(--color-accent-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} strokeWidth={1.8} style={{ color: "var(--color-accent-bright)" }} />
                </div>
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  width: 14, height: 14,
                  background: "var(--color-surface-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 7.5, fontWeight: 700, color: "var(--color-text-tertiary)",
                  fontFamily: "var(--font-mono)",
                }}>
                  {i + 1}
                </span>
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
        padding: "40px 24px",
        position: "relative",
        background: "var(--color-bg)",
        overflowY: "auto",
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
          style={{ width: "100%", maxWidth: 480 }}
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
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 30, fontWeight: 800,
              letterSpacing: "-0.01em", lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}>
              Create account
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
              Fill in your details to register for access
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
              style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="field-label">First Name</label>
                  <input
                    {...register("firstName")}
                    autoComplete="given-name"
                    placeholder="John"
                    className="field-input"
                    style={{ borderColor: errors.firstName ? "var(--color-error)" : undefined }}
                  />
                  {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="field-label">Last Name</label>
                  <input
                    {...register("lastName")}
                    autoComplete="family-name"
                    placeholder="Smith"
                    className="field-input"
                    style={{ borderColor: errors.lastName ? "var(--color-error)" : undefined }}
                  />
                  {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="field-label">Username</label>
                <input
                  {...register("username")}
                  autoComplete="username"
                  placeholder="john_smith"
                  className="field-input"
                  style={{ borderColor: errors.username ? "var(--color-error)" : undefined }}
                />
                {errors.username && <p className="field-error">{errors.username.message}</p>}
              </div>

              {/* DOB + RSA ID row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="field-label">Date of Birth</label>
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="field-input"
                    style={{
                      colorScheme: "dark",
                      borderColor: errors.dateOfBirth ? "var(--color-error)" : undefined,
                    }}
                  />
                  {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className="field-label">RSA ID Number</label>
                  <input
                    {...register("rsaId")}
                    placeholder="0000000000000"
                    maxLength={13}
                    className="field-input"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.08em",
                      borderColor: errors.rsaId ? "var(--color-error)" : undefined,
                    }}
                  />
                  {errors.rsaId && <p className="field-error">{errors.rsaId.message}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                  {strength > 0 && (
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: strengthColor[strength], letterSpacing: "0.04em" }}>
                      {strengthLabel[strength]}
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    {...register("password")}
                    type={showPwd ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className="field-input"
                    style={{
                      paddingRight: 40,
                      borderColor: errors.password ? "var(--color-error)" : undefined,
                    }}
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
                {/* Strength meter */}
                {strength > 0 && (
                  <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: i <= strength ? strengthColor[strength] : "var(--color-surface-3)",
                        transition: "background 200ms",
                      }} />
                    ))}
                  </div>
                )}
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="field-label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className="field-input"
                    style={{
                      paddingRight: 40,
                      borderColor: errors.confirmPassword ? "var(--color-error)" : undefined,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{
                      position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", padding: 4,
                      color: "var(--color-text-tertiary)", cursor: "pointer", borderRadius: 4,
                      display: "flex", alignItems: "center",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
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
                  <>Create account <ArrowRight size={15} strokeWidth={2} /></>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div style={{
              padding: "16px 32px",
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Already have an account?</span>
              <Link
                href="/login"
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: "var(--color-accent-bright)",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                Sign in <ArrowRight size={12} />
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
