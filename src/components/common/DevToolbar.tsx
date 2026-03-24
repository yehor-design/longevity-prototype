import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useNotificationStore, SAMPLE_NOTIFICATIONS } from "@/stores/notificationStore";
import { PROTOTYPE_MODE, prototypeConfig } from "@/lib/prototype";
import { ROLE_HOME } from "@/lib/constants";
import { useLocation } from "react-router";
import { Sun, Moon, ChevronUp, ChevronDown } from "lucide-react";
import type { UserRole } from "@/types";

/**
 * Floating collapsible developer toolbar (dev mode only).
 * Allows quick role switching, theme toggling, toast triggering, and session reset.
 */
export function DevToolbar() {
  const [open, setOpen] = useState(false);
  const { switchRole, logout, user } = useAuthStore();
  const { toggleTheme, resolvedTheme } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!PROTOTYPE_MODE || !prototypeConfig.showDevToolbar) return null;

  const roles: UserRole[] = ["patient", "doctor", "admin"];

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    navigate(ROLE_HOME[role]);
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-popover border rounded-xl shadow-xl p-3 w-64 text-xs space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {/* Route info */}
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground">Route: </span>
            <code className="font-mono">{location.pathname}</code>
          </div>

          {/* Role switcher */}
          <div>
            <div className="font-medium mb-1.5 text-muted-foreground">Switch Role</div>
            <div className="flex gap-1.5">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                    user?.role === role
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Theme toggle */}
          <div>
            <div className="font-medium mb-1.5 text-muted-foreground">Theme</div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              {resolvedTheme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
              {resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>

          {/* Trigger toasts */}
          <div>
            <div className="font-medium mb-1.5 text-muted-foreground">Sample Toasts</div>
            <div className="flex flex-col gap-1">
              {SAMPLE_NOTIFICATIONS.map((n, i) => (
                <button
                  key={i}
                  onClick={() => addNotification(n)}
                  className="text-left px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors truncate"
                >
                  {n.variant === "success" ? "✅" : n.variant === "error" ? "❌" : n.variant === "warning" ? "⚠️" : "ℹ️"} {n.title}
                </button>
              ))}
            </div>
          </div>

          {/* Session reset */}
          <button
            onClick={() => {
              logout();
              navigate("/welcome");
            }}
            className="w-full px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium"
          >
            Reset session (log out)
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-zinc-800 dark:bg-zinc-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
      >
        <span>🛠 Dev</span>
        {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>
    </div>
  );
}
