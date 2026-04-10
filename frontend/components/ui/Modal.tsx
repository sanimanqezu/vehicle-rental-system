"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const widths = { sm: 420, md: 560, lg: 720, xl: 960 };

export function Modal({ isOpen, onClose, title, description, children, size = "md", footer }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(6,7,8,0.75)", backdropFilter: "blur(4px)" }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: widths[size],
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "88vh",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              padding: "22px 28px 18px",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18, fontWeight: 800,
                  letterSpacing: "0.01em",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.1,
                }}>
                  {title}
                </h2>
                {description && (
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 5, lineHeight: 1.4 }}>
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28, marginLeft: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent", border: "none",
                  color: "var(--color-text-tertiary)",
                  cursor: "pointer", flexShrink: 0,
                  transition: "all 120ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)";
                }}
              >
                <X size={15} strokeWidth={1.8} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
                padding: "16px 28px",
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-surface-2)",
                flexShrink: 0,
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete", isLoading }: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}
