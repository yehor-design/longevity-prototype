import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useNotificationStore, SAMPLE_NOTIFICATIONS } from "@/stores/notificationStore";
import { PROTOTYPE_MODE, prototypeConfig } from "@/lib/prototype";
import { ROLE_HOME } from "@/lib/constants";
import { Sun, Moon, X } from "lucide-react";
import type { UserRole } from "@/types";

/**
 * Unified prototype FAB (bottom-left).
 * Combines PrototypeBadge, DevToolbar, and Quick Login into one panel.
 */
export function PrototypeFab() {
  const [open, setOpen] = useState(false);
  const { user, quickLogin, logout } = useAuthStore();
  const { toggleTheme, resolvedTheme } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!PROTOTYPE_MODE) return null;

  const roles: UserRole[] = ["patient", "doctor", "admin"];

  const handleRoleSwitch = (role: UserRole) => {
    quickLogin(role);
    navigate(ROLE_HOME[role]);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {open && (
        <div className="bg-popover border rounded-xl shadow-xl p-4 w-80 text-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Prototype Settings</div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Current Session */}
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
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
              <div className="text-muted-foreground text-xs">Not logged in</div>
            )}
          </div>

          {/* Quick Login */}
          {prototypeConfig.quickLoginEnabled && (
            <div>
              <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Quick Login
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize ${
                      user?.role === role
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Route Info */}
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Current Route
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
              {location.pathname}
            </code>
          </div>

          {/* Theme Toggle */}
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Theme
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted hover:bg-muted/80 transition-colors text-xs"
            >
              {resolvedTheme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
              {resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>

          {/* Sample Toasts */}
          <div>
            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Sample Toasts
            </div>
            <div className="flex flex-col gap-1">
              {SAMPLE_NOTIFICATIONS.map((n, i) => (
                <button
                  key={i}
                  onClick={() => addNotification(n)}
                  className="text-left px-2.5 py-1 rounded bg-muted hover:bg-muted/80 transition-colors truncate text-xs"
                >
                  {n.variant === "success" ? "✅" : n.variant === "error" ? "❌" : n.variant === "warning" ? "⚠️" : "ℹ️"} {n.title}
                </button>
              ))}
            </div>
          </div>

          {/* Prototype Info */}
          <div className="pt-1 border-t">
            <div className="text-[10px] text-muted-foreground">
              All inputs accept any value. Validation is bypassed in prototype mode.
            </div>
          </div>

          {/* Session Reset */}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/welcome");
                setOpen(false);
              }}
              className="w-full px-2.5 py-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium text-xs"
            >
              Reset session (log out)
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-10 h-10 bg-amber-500/90 hover:bg-amber-500 text-white text-lg rounded-full shadow-lg transition-all backdrop-blur-sm select-none"
        aria-label="Prototype settings"
      >
        ⚙️
      </button>
    </div>
  );
}
