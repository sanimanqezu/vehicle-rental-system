"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, Users } from "lucide-react";
import { User } from "@/types";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { getInitials, formatDate } from "@/lib/utils";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, isLoading, onEdit, onDelete }: UsersTableProps) {
  if (isLoading) return <SkeletonTable rows={6} />;

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: "64px 24px", gap: 12 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Users size={18} style={{ color: "var(--color-text-tertiary)" }} />
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No clients registered</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table className="data-table" style={{ minWidth: 720 }}>
        <thead>
          <tr>
            <th>Client</th>
            <th>Username</th>
            <th>RSA ID</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const age = user.dateOfBirth
              ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
              : null;

            return (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                {/* Client */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, flexShrink: 0,
                      borderRadius: "50%",
                      background: "var(--color-accent-muted)",
                      border: "1px solid var(--color-accent-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--color-accent-bright)" }}>
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 1 }}>
                        ID #{user.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Username */}
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "var(--color-text-secondary)",
                  }}>
                    @{user.username}
                  </span>
                </td>

                {/* RSA ID */}
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11.5,
                    color: "var(--color-accent-bright)",
                    background: "var(--color-accent-muted)",
                    border: "1px solid var(--color-accent-border)",
                    padding: "2px 7px", borderRadius: "var(--radius-xs)",
                    letterSpacing: "0.04em",
                  }}>
                    {user.rsaId}
                  </span>
                </td>

                {/* DOB */}
                <td style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {user.dateOfBirth ? formatDate(user.dateOfBirth) : "—"}
                </td>

                {/* Age */}
                <td>
                  {age !== null ? (
                    <span style={{
                      display: "inline-block",
                      fontSize: 10.5, fontWeight: 600,
                      letterSpacing: "0.06em",
                      padding: "3px 8px", borderRadius: 99,
                      background: "var(--color-surface-3)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border-strong)",
                    }}>
                      {age} yrs
                    </span>
                  ) : "—"}
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    <button
                      onClick={() => onEdit(user)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", transition: "all 120ms" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)"; }}
                    >
                      <Edit2 size={13} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", transition: "all 120ms" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-error-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)"; }}
                    >
                      <Trash2 size={13} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
