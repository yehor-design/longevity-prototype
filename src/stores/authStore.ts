import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AppUser, UserRole } from "@/types";
import { MOCK_PATIENT, MOCK_DOCTOR, MOCK_ADMIN } from "@/services/mockData/users";

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  loginMethod: "email" | "google" | null;
  sessionStartedAt: string | null;

  /** Quick-login as any role (prototype bypass) */
  quickLogin: (role: UserRole) => void;
  /** Alias for quickLogin — switches the active mock user role */
  switchRole: (role: UserRole) => void;
  /** Full mock login */
  login: (user: AppUser, method: "email" | "google") => void;
  /** Clear session */
  logout: () => void;
  /** Update user fields */
  updateUser: (patch: Partial<AppUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loginMethod: null,
        sessionStartedAt: null,

        quickLogin: (role) => {
          const mockMap: Record<UserRole, AppUser> = {
            patient: MOCK_PATIENT,
            doctor: MOCK_DOCTOR,
            admin: MOCK_ADMIN,
          };
          set(
            {
              user: mockMap[role],
              isAuthenticated: true,
              loginMethod: "email",
              sessionStartedAt: new Date().toISOString(),
            },
            false,
            "auth/quickLogin"
          );
        },

        switchRole: (role) => {
          get().quickLogin(role);
        },

        login: (user, method) => {
          set(
            {
              user,
              isAuthenticated: true,
              loginMethod: method,
              sessionStartedAt: new Date().toISOString(),
            },
            false,
            "auth/login"
          );
        },

        logout: () => {
          set(
            {
              user: null,
              isAuthenticated: false,
              loginMethod: null,
              sessionStartedAt: null,
            },
            false,
            "auth/logout"
          );
        },

        updateUser: (patch) => {
          set(
            (state) =>
              state.user
                ? { user: { ...state.user, ...patch } as AppUser }
                : {},
            false,
            "auth/updateUser"
          );
        },
      }),
      {
        name: "dt-health-auth",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          loginMethod: state.loginMethod,
          sessionStartedAt: state.sessionStartedAt,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

/** Typed selectors */
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectUserRole = (s: AuthState) => s.user?.role ?? null;
