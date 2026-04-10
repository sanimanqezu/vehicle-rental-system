"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, style, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label && <label className="field-label">{label}</label>}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {leftAddon && (
            <span style={{
              position: "absolute", left: 11,
              color: "var(--color-text-tertiary)",
              display: "flex", alignItems: "center",
              pointerEvents: "none",
            }}>
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            className="field-input"
            style={{
              paddingLeft: leftAddon ? 34 : 12,
              paddingRight: rightAddon ? 34 : 12,
              borderColor: error ? "var(--color-error)" : undefined,
              ...style,
            }}
            onFocus={e => {
              if (error) {
                e.currentTarget.style.borderColor = "var(--color-error)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-error-muted)";
              }
            }}
            {...props}
          />
          {rightAddon && (
            <span style={{
              position: "absolute", right: 11,
              color: "var(--color-text-tertiary)",
              display: "flex", alignItems: "center",
              pointerEvents: "none",
            }}>
              {rightAddon}
            </span>
          )}
        </div>
        {error && <p className="field-error">{error}</p>}
        {hint && !error && (
          <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", marginTop: 5 }}>{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, style, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label && <label className="field-label">{label}</label>}
        <select
          ref={ref}
          className="field-input"
          style={{
            borderColor: error ? "var(--color-error)" : undefined,
            cursor: "pointer",
            ...style,
          }}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--color-surface-2)" }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="field-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
