import { useState } from "react";
import { useAuthStore } from "@/stores";
import { PROTOTYPE_MODE, prototypeConfig } from "@/lib/prototype";
import { useLocation } from "react-router";
import type { UserRole } from "@/types";

/**
 * Floating badge (bottom-left) reminding testers this is a prototype.
 * Click to expand a dev panel with role-switching and route info.
 */
export function PrototypeBadge() {
  const [expanded, setExpanded] = useState(false);
  const { user, quickLogin, logout } = useAuthStore();
  const location = useLocation();

  if (!PROTOTYPE_MODE || !prototypeConfig.showPrototypeBadge) return null;

  const roles: UserRole[] = ["patient", "doctor", "admin"];

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {expanded && (
        <div className="bg-popover border rounded-xl shadow-xl p-4 w-72 text-sm space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Current Session
            </div>
            {user ? (
              <div className="space-y-0.5">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
                <div className="text-xs">
                  Role: <span className="font-mono bg-muted px-1 rounded">{user.role}</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Not logged in</div>
            )}
          </div>

          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Quick Login
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => quickLogin(role)}
                  className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs hover:bg-primary/20 capitalize font-medium transition-colors"
                >
                  {role}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => logout()}
                  className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 font-medium transition-colors"
                >
                  Log out
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Current Route
            </div>
            <code className="text-xs bg-muted px-2 py-0.5 rounded block truncate">
              {location.pathname}
            </code>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-1.5 bg-amber-500/90 hover:bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md transition-all backdrop-blur-sm select-none"
      >
        <span>🧪</span>
        <span>PROTOTYPE — all inputs accept any value</span>
      </button>
    </div>
  );
}
